import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured. Please add it in Supabase Edge Function secrets.");
    }

    const resend = new Resend(RESEND_API_KEY);
    const { to, subject, resumeData, pdfUrl } = await req.json();

    if (!to || !subject || !resumeData) {
      throw new Error("Missing required fields: to, subject, or resumeData");
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1E40AF; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .resume-preview { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; }
            .button { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Resume from ${resumeData.name}</h1>
            </div>
            <div class="content">
              <p>Dear Hiring Manager,</p>
              <p>Please find my resume attached. I am excited about the opportunity to contribute to your team.</p>
              
              <div class="resume-preview">
                <h2 style="margin-top: 0;">${resumeData.name}</h2>
                <p style="margin: 5px 0;">${resumeData.email} | ${resumeData.phone}</p>
                ${resumeData.summary ? `<p style="margin-top: 15px;">${resumeData.summary}</p>` : ''}
              </div>

              ${pdfUrl ? `<a href="${pdfUrl}" class="button">Download Full Resume (PDF)</a>` : ''}

              <p style="margin-top: 20px;">I look forward to discussing how my skills and experience align with your needs.</p>
              <p>Best regards,<br>${resumeData.name}</p>
            </div>
            <div class="footer">
              <p>This email was sent via Resume Generator</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log(`Sending email to: ${to}`);

    const emailResponse = await resend.emails.send({
      from: "Resume Generator <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse.data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-resume-email:", error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
