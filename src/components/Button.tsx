
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fitness-primary active:scale-95',
          
          // Variants
          {
            'bg-fitness-primary text-white hover:bg-fitness-primary/90': variant === 'default',
            'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50': variant === 'outline',
            'bg-transparent text-gray-700 hover:bg-gray-100': variant === 'ghost',
            'bg-transparent underline-offset-4 hover:underline text-fitness-primary': variant === 'link',
            'bg-gradient-to-r from-fitness-primary to-fitness-accent text-white shadow-md hover:shadow-lg': variant === 'primary',
            'bg-fitness-secondary text-fitness-dark hover:bg-fitness-secondary/90': variant === 'secondary',
          },
          
          // Sizes
          {
            'text-xs px-3 py-1': size === 'sm',
            'text-sm px-4 py-2': size === 'md',
            'text-base px-6 py-3': size === 'lg',
            'w-10 h-10 p-0': size === 'icon',
          },
          
          // Width
          {
            'w-full': fullWidth,
          },
          
          // Disabled state
          {
            'opacity-50 cursor-not-allowed': disabled || isLoading,
          },
          
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="animate-spin h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}
        
        <span className={cn('flex items-center gap-2', { 'opacity-0': isLoading })}>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
