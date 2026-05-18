import React from 'react'

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
    <button className={`inline-flex items-center justify-center gap-2 rounded-full border border-violet-300/35 bg-linear-to-r from-violet-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(124,58,237,0.45)] transition-all hover:from-violet-400 hover:to-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080f] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`} {...props} >
        {children}
    </button>
);

export const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
    <button className={`inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#14141d]/90 px-4 py-2 text-sm font-medium text-zinc-200 shadow-[0_6px_16px_rgba(0,0,0,0.3)] transition hover:border-violet-400/55 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080f] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`} {...props} >
        {children}
    </button>
);
