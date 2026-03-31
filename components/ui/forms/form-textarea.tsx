"use client";

import { forwardRef } from "react";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          className={`rounded-xl border px-3 py-2 text-sm transition-colors placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-500 resize-none ${
            error ? "border-red-500" : "border-slate-200"
          } ${className}`}
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
