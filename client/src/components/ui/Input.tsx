import React from 'react';
import clsx from 'clsx';

// ─────────────────────────────────────────────────────────────────────────────
// Input Component
// ─────────────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightElement,
      containerClassName,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;

    return (
      <div className={clsx('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-500 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'input-dark',
              leftIcon && 'pl-10',
              rightElement && 'pr-24',
              error && 'border-red-500/50 focus:ring-red-500/50',
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-2">{rightElement}</div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-400 flex items-center gap-1">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
