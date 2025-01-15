import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className='flex items-start'>
        <div className='flex h-5 items-center'>
          <input
            type='checkbox'
            ref={ref}
            className={`
            h-4 w-4 rounded border-secondary-300
            text-primary-600 focus:ring-primary-500
            disabled:cursor-not-allowed
            ${error ? "border-red-500" : ""}
            ${className}
          `}
            {...props}
          />
        </div>
        {label && (
          <div className='ml-3 text-sm'>
            <label className='font-medium text-secondary-700'>{label}</label>
          </div>
        )}
        {error && <p className='ml-3 text-sm text-red-600'>{error}</p>}
      </div>
    );
  }
);
