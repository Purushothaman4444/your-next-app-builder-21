import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Check, Smartphone, Zap, Wifi } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setIsInstalling(false);
  };

  const features = [
    {
      icon: Wifi,
      title: "Offline Access",
      description: "Create and edit resumes even without internet connection"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant loading and smooth performance on any device"
    },
    {
      icon: Smartphone,
      title: "Native Experience",
      description: "Works like a native app on your phone or tablet"
    }
  ];

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Install Resume Generator</h1>
          <p className="text-xl text-muted-foreground">
            Get the full app experience with offline access and faster loading
          </p>
        </div>

        {isInstalled ? (
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>App Already Installed!</CardTitle>
              <CardDescription>
                You can now use Resume Generator from your home screen
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Ready to Install</CardTitle>
                <CardDescription>
                  Add Resume Generator to your home screen for quick access
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {deferredPrompt ? (
                  <Button 
                    size="lg" 
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="px-8"
                  >
                    {isInstalling ? "Installing..." : "Install Now"}
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Installation prompt not available. Try these steps:
                    </p>
                    <div className="text-left space-y-2 text-sm">
                      <p><strong>On Chrome (Android):</strong> Tap the menu (⋮) → "Install app"</p>
                      <p><strong>On Safari (iOS):</strong> Tap Share (↗️) → "Add to Home Screen"</p>
                      <p><strong>On Desktop:</strong> Click the install icon in the address bar</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="mb-2 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default InstallPWA;