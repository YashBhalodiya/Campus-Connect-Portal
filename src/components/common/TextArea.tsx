import * as React from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

type TextAreaProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  id,
  label,
  placeholder,
  error,
  className,
  rows = 3,
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
      <textarea
        id={id}
        placeholder={placeholder}
        rows={rows}
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

TextArea.displayName = 'TextArea';

export default TextArea;