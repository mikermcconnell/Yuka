'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, ReactNode } from 'react';

// Shared styles for input elements
const baseInputStyles = `
  w-full px-4 py-2 border rounded-lg
  text-gray-900 placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
  disabled:bg-gray-100 disabled:cursor-not-allowed
`;

// Shared wrapper for form fields
function FieldWrapper({
  id, label, error, helperText, children
}: {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    return (
      <FieldWrapper id={inputId} label={label} error={error} helperText={helperText}>
        <input
          ref={ref}
          id={inputId}
          className={`${baseInputStyles} ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

Input.displayName = 'Input';

export default Input;

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    return (
      <FieldWrapper id={inputId} label={label} error={error} helperText={helperText}>
        <textarea
          ref={ref}
          id={inputId}
          className={`${baseInputStyles} resize-none ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

TextArea.displayName = 'TextArea';
