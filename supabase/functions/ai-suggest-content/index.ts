import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    // Different prompts based on the type of content needed
    switch (type) {
      case 'professional_summary':
        systemPrompt = "You are a professional resume writer. Create compelling professional summaries that highlight key achievements and skills.";
        userPrompt = `Based on the following information, write a professional summary (3-4 sentences):
Job Title: ${context.jobTitle || 'N/A'}
Years of Experience: ${context.experience || 'N/A'}
Key Skills: ${context.skills?.join(', ') || 'N/A'}
Industry: ${context.industry || 'N/A'}`;
        break;

      case 'job_description':
        systemPrompt = "You are a resume expert. Improve job descriptions to be more impactful and ATS-friendly using action verbs and quantifiable achievements.";
        userPrompt = `Improve this job description to be more impactful and ATS-friendly. Keep it concise (3-5 bullet points):
Job Title: ${context.jobTitle}
Company: ${context.company}
Current Description: ${context.description}`;
        break;

      case 'skill_suggestions':
        systemPrompt = "You are a career advisor. Suggest relevant skills based on job roles and industry trends.";
        userPrompt = `Suggest 8-10 relevant skills for someone with this background:
Job Title: ${context.jobTitle || 'N/A'}
Industry: ${context.industry || 'N/A'}
Current Skills: ${context.existingSkills?.join(', ') || 'None listed'}
Return only the skill names as a comma-separated list.`;
        break;

      case 'optimize_resume':
        systemPrompt = "You are an ATS optimization expert. Provide specific recommendations to improve resume ATS compatibility and overall impact.";
        userPrompt = `Review this resume section and provide 3-5 specific improvement suggestions:
${JSON.stringify(context, null, 2)}`;
        break;

      default:
        throw new Error('Invalid suggestion type');
    }

    console.log('Making AI request:', { type, systemPrompt, userPrompt });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway returned ${response.status}`);
    }

    const data = await response.json();
    const suggestion = data.choices[0]?.message?.content;

    console.log('AI suggestion generated successfully');

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-suggest-content:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
