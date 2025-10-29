import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export const NetworkStatus = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 px-4 flex items-center justify-center gap-2 text-sm">
      <WifiOff className="h-4 w-4" />
      <span>You are offline. Changes will sync when connection is restored.</span>
    </div>
  );
};