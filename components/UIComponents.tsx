import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'neon' }> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center relative overflow-hidden group";
  const variants = {
    primary: "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:to-brand-500 hover:shadow-[0_0_20px_rgba(var(--color-brand-500),0.4)] border border-transparent shadow-lg",
    secondary: "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm hover:shadow-md",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    ghost: "text-slate-400 hover:bg-white/5 hover:text-white",
    neon: "bg-transparent border border-brand-400 text-brand-400 hover:bg-brand-500/10 hover:shadow-[0_0_15px_rgba(var(--color-brand-500),0.5),inset_0_0_5px_rgba(var(--color-brand-500),0.2)] text-shadow-sm font-bold tracking-wide"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
      {/* Shine effect on hover for primary */}
      {variant === 'primary' && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode; noPadding?: boolean }> = ({ children, className = '', title, action, noPadding = false }) => (
  <div className={`bg-dark-900/60 border border-dark-700 rounded-xl shadow-xl backdrop-blur-md flex flex-col transition-all duration-300 hover:border-brand-500/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 ${className}`}>
    {(title || action) && (
      <div className="px-5 py-4 border-b border-dark-700 flex justify-between items-center shrink-0 bg-white/[0.02]">
        {title && <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase flex items-center gap-2">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className={`flex-1 ${noPadding ? '' : 'p-5'}`}>{children}</div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'green' | 'red' | 'yellow' | 'orange' | 'gray' | 'brand'; className?: string }> = ({ children, color = 'gray', className = '' }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
    green: 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
    red: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
    yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]',
    gray: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20 shadow-[0_0_10px_rgba(var(--color-brand-500),0.1)]',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full group">
    {label && <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider group-focus-within:text-brand-400 transition-colors">{label}</label>}
    <input
      className={`w-full rounded-lg bg-dark-950/50 border border-dark-700 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all hover:border-dark-600 shadow-inner ${className}`}
      {...props}
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: {label: string, value: string, disabled?: boolean}[] }> = ({ label, options, className = '', ...props }) => (
  <div className="w-full group">
    {label && <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider group-focus-within:text-brand-400 transition-colors">{label}</label>}
    <select
      className={`w-full rounded-lg bg-dark-950/50 border border-dark-700 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all hover:border-dark-600 shadow-inner appearance-none ${className}`}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-dark-900 text-slate-200">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);