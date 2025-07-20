'use client';

import { memo, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = memo(forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helpText,
    leftIcon,
    rightIcon,
    containerClassName,
    className,
    id,
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const baseInputStyles = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500';
  const errorInputStyles = error ? 'border-red-300 focus:border-red-500' : '';
  const paddingStyles = leftIcon && rightIcon ? 'pl-10 pr-10' : leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
  
  return (
    <div className={clsx('space-y-1', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{leftIcon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            baseInputStyles,
            errorInputStyles,
            paddingStyles,
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}));

export default Input;