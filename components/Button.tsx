import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg";
  
  const variants = {
    primary: "bg-brand-blue hover:bg-blue-500 text-white border-b-4 border-blue-700 active:border-b-0 active:translate-y-1",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border-b-4 border-slate-900 active:border-b-0 active:translate-y-1",
    danger: "bg-brand-red hover:bg-red-500 text-white border-b-4 border-red-700 active:border-b-0 active:translate-y-1",
    ghost: "bg-transparent text-slate-400 hover:text-white shadow-none",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl",
    xl: "w-full h-full text-4xl flex items-center justify-center py-8",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};