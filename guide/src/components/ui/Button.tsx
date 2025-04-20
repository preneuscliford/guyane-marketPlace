import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  asChild = false,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-teal-500 hover:bg-teal-600 text-white',
    outline: 'bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-50'
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg'
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // If asChild is true, clone the first child instead of rendering a button
  if (asChild && React.Children.count(children) === 1) {
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, {
      className: `${child.props.className || ''} ${buttonClasses}`,
      ...props
    });
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};