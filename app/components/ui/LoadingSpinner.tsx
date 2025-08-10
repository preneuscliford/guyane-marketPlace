'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

/**
 * Composant de spinner de chargement
 */
export function LoadingSpinner({ 
  className, 
  size = 'md', 
  text = 'Chargement...' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 
        className={cn(
          'animate-spin text-blue-600',
          sizeClasses[size],
          className
        )} 
      />
      {text && (
        <p className="mt-4 text-gray-600 text-sm">
          {text}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;