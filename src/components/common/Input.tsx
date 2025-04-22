import * as React from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

type InputProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({
  id,
  label,
  placeholder,
  type = 'text',
  error,
  className,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        ref={ref}
        className={cn(
          'w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          disabled && 'bg-gray-100 cursor-not-allowed opacity-75',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;