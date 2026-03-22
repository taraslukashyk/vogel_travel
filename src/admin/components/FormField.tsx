import { Info } from 'lucide-react';
import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  tooltip?: string;
}

export default function FormField({ label, children, required, tooltip }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {tooltip && (
          <div className="group relative flex items-center">
            <Info size={16} className="text-gray-400 hover:text-teal-500 cursor-help transition-colors" />
            <div className="absolute bottom-full left-0 -ml-2 mb-2 w-max max-w-[260px] p-2.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none text-balance">
              {tooltip}
              <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

export const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow';
export const btnPrimary = 'px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50';
export const btnSecondary = 'px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors';
export const btnDanger = 'px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors';
