import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  message = 'Loading information...',
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Loader2 className={`${sizeMap[size]} text-teal-600 dark:text-teal-400 animate-spin mb-3`} />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse">{message}</p>
    </div>
  );
};