import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Your changes will now sync.', {
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Changes will sync when connection is restored.', {
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
};