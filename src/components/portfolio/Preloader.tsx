import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-500',
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-2 border-foreground/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="font-display text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
