
import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'neon' }> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center relative overflow-hidden group";
  const variants = {
    primary: "bg-gradient-to-r from-brand-500 to-brand-600 text-real-white hover:to-brand-500 hover:shadow-[0_0_20px_rgba(var(--color-brand-500),0.4)] border border-transparent shadow-lg",
    secondary: "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm hover:shadow-md",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    ghost: "text-slate-400 hover:bg-white/5 hover:text-white",
    neon: "bg-transparent border border-brand-400 text-brand-400 hover:bg-brand-500/10 hover:shadow-[0_0_15px_rgba(var(--color-brand-500),0.5),inset_0_0_5px_rgba(var(--color-brand-500),0.2)] text-shadow-sm font-bold tracking-wide"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
      {variant === 'primary' && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode; noPadding?: boolean } & React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', title, action, noPadding = false, ...props }) => (
  <div className={`bg-dark-900/60 border border-dark-700 rounded-xl shadow-xl backdrop-blur-md flex flex-col transition-all duration-300 hover:border-brand-500/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 ${className}`} {...props}>
    {(title || action) && (
      <div className="px-5 py-4 border-b border-dark-700 flex justify-between items-center shrink-0 bg-white/[0.02]">
        {title && <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase flex items-center gap-2">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className={`flex-1 ${noPadding ? '' : 'p-5'}`}>{children}</div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'green' | 'red' | 'yellow' | 'orange' | 'gray' | 'brand' | 'purple'; className?: string }> = ({ children, color = 'gray', className = '' }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
    green: 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
    red: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
    yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]',
    gray: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20 shadow-[0_0_10px_rgba(var(--color-brand-500),0.1)]',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full group">
    {label && <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-brand-400 transition-colors">{label}</label>}
    <input
      className={`w-full rounded-lg bg-dark-950 border border-dark-700 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all hover:border-dark-600 shadow-inner ${className}`}
      {...props}
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: {label: string, value: string, disabled?: boolean}[] }> = ({ label, options, className = '', ...props }) => (
  <div className="w-full group">
    {label && <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-brand-400 transition-colors">{label}</label>}
    <div className="relative">
        <select
          className={`w-full rounded-lg bg-dark-950 border border-dark-700 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all hover:border-dark-600 shadow-inner appearance-none cursor-pointer ${className}`}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-dark-900 text-white py-2">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
        </div>
    </div>
  </div>
);

export const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; className?: string }> = ({ checked, onChange, className = '' }) => (
  <button 
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-dark-900 ${checked ? 'bg-brand-500' : 'bg-dark-700'} ${className}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

export const Avatar: React.FC<{ name: string; src?: string; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ name, src, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl'
    };
    
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    
    if (src) {
        return <img src={src} alt={name} className={`rounded-full object-cover border-2 border-dark-700 ${sizeClasses[size]} ${className}`} />;
    }

    return (
        <div className={`rounded-full bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 flex items-center justify-center font-bold text-slate-300 ${sizeClasses[size]} ${className}`}>
            {initials}
        </div>
    );
};

export const Logo: React.FC<{ collapsed?: boolean; className?: string }> = ({ collapsed, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-9 w-9 flex items-center justify-center flex-shrink-0">
         {/* Outer Glow */}
         <div className="absolute inset-0 bg-brand-500/30 rounded-xl blur-lg animate-pulse-slow"></div>
         
         {/* Main Shape Container */}
         <div className="relative h-9 w-9 bg-gradient-to-br from-dark-800 to-dark-950 rounded-xl border border-brand-500/30 flex items-center justify-center shadow-xl overflow-hidden group">
            
            {/* Animated Circuit Background */}
            <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 40 40">
                   <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" className="text-brand-500" strokeWidth="0.5"/>
                   </pattern>
                   <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* The "A" Logo Mark */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 text-brand-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
               <path d="M12 2L2 22H6L8 18H16L18 22H22L12 2Z" fill="currentColor" fillOpacity="0.2"/>
               <path d="M12 2L2 22H6L8 18H16L18 22H22L12 2ZM12 6L15 15H9L12 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
               <circle cx="12" cy="8" r="1.5" className="fill-white animate-ping" style={{animationDuration: '3s'}}/>
            </svg>
         </div>
      </div>
      
      {!collapsed && (
        <div className="flex flex-col overflow-hidden whitespace-nowrap">
           <span className="font-bold text-white leading-none tracking-tight text-base logo-scan-text">AGREEMETRIX</span>
           <span className="text-[9px] text-brand-500 font-bold tracking-[0.3em] uppercase mt-0.5 flex items-center gap-1">
              Intelligence <span className="w-1 h-1 rounded-full bg-brand-400 animate-pulse"></span>
           </span>
        </div>
      )}
    </div>
  );
};

export const SimpleTooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  return (
    <div className="relative group/tooltip">
      {children}
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-48 p-2 bg-dark-900 border border-dark-700 rounded-lg shadow-xl text-xs text-slate-300 z-50 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
        {content}
      </div>
    </div>
  );
};
