import React, { ForwardedRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input = React.forwardRef(
  (
    { label, error, className = "", ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className='space-y-1'>
        {label && <label className='block text-sm font-medium'>{label}</label>}
        <input
          ref={ref}
          className={`
          block w-full rounded-md border-secondary-300 shadow-sm
          focus:border-primary-500 focus:ring-primary-500
          text-black
          disabled:cursor-not-allowed disabled:bg-secondary-50 disabled:text-secondary-500
          ${error ? "border-red-500" : ""}
          ${className}
        `}
          {...props}
        />
        {error && <p className='text-sm text-red-600'>{error}</p>}
      </div>
    );
  }
);
