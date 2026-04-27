import React from 'react'

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
    <button className={`inline-flex items-center justify-center gap-2 rounded-full border border-sky-300/60 bg-linear-to-b from-sky-100 to-sky-200 px-5 py-2 text-sm font-semibold text-sky-950 shadow-[0_10px_24px_rgba(14,165,233,0.2)] transition-all hover:from-sky-200 hover:to-sky-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`} {...props} >
        {children}
    </button>
);

export const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
    <button className={`inline-flex items-center gap-2 rounded-full border border-gray-900/12 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-[0_6px_16px_rgba(15,23,42,0.06)] transition hover:border-sky-300/50 hover:text-sky-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`} {...props} >
        {children}
    </button>
);
