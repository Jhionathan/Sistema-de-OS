"use client";

import { forwardRef } from "react";

interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            {...props}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-slate-700 cursor-pointer">
              {label}
            </label>
          )}
        </div>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

FormCheckbox.displayName = "FormCheckbox";
