import React, { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Composant Tooltip simple pour afficher des informations contextuelles
 */
interface TooltipProps {
  children: React.ReactNode;
  className?: string;
}

interface TooltipContentProps {
  children: React.ReactNode;
  className?: string;
}

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const Tooltip: React.FC<TooltipProps> = ({ children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { isVisible });
        }
        return child;
      })}
    </div>
  );
};

const TooltipTrigger: React.FC<TooltipTriggerProps & { isVisible?: boolean }> = ({ 
  children, 
  asChild = false, 
  className,
  isVisible 
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(children.props.className, className)
    });
  }
  
  return (
    <div className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
};

const TooltipContent: React.FC<TooltipContentProps & { isVisible?: boolean }> = ({ 
  children, 
  className,
  isVisible 
}) => {
  if (!isVisible) return null;
  
  return (
    <div className={cn(
      "absolute z-50 px-3 py-1.5 text-sm text-white bg-gray-900 rounded-md shadow-lg",
      "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
      "before:content-[''] before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2",
      "before:border-4 before:border-transparent before:border-t-gray-900",
      "whitespace-nowrap",
      className
    )}>
      {children}
    </div>
  );
};

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };