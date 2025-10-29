import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { NetworkStatus } from "@/components/NetworkStatus";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyResumes = lazy(() => import("./pages/MyResumes"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const Templates = lazy(() => import("./pages/Templates"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const ResumePreview = lazy(() => import("./pages/ResumePreview"));
const ResumeExport = lazy(() => import("./pages/ResumeExport"));
const InstallPWA = lazy(() => import("./pages/InstallPWA"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <NetworkStatus />
        <PWAInstallPrompt />
        <BrowserRouter>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/install" element={<InstallPWA />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-resumes"
                element={
                  <ProtectedRoute>
                    <MyResumes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />
              <Route path="/templates" element={<Templates />} />
              <Route
                path="/resume/create"
                element={
                  <ProtectedRoute>
                    <ResumeBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/preview"
                element={
                  <ProtectedRoute>
                    <ResumePreview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/export"
                element={
                  <ProtectedRoute>
                    <ResumeExport />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
