
import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

// --- COLLAPSIBLE SECTION ---

export const CollapsibleSection: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    defaultOpen?: boolean; 
    icon?: React.ElementType;
    rightElement?: React.ReactNode;
    className?: string;
}> = ({ title, children, defaultOpen = true, icon: Icon, rightElement, className = '' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className={`border-b border-dark-800/50 last:border-0 ${className}`}>
            <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors group select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase group-hover:text-slate-300 transition-colors">
                    {Icon && <Icon size={14} className="text-brand-400"/>}
                    {title}
                </div>
                <div className="flex items-center gap-3">
                    {rightElement}
                    <ChevronDown size={14} className={`text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pb-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- BUTTONS ---

export const RibbonButton = ({ icon: Icon, label, active, onClick, disabled, badge, color, className = '', subLabel, type = 'button' }: any) => (
    <button 
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center justify-center px-2 py-1.5 h-full min-w-[50px] rounded-lg transition-all group relative 
        ${active ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'} 
        ${className}`}
        title={label}
    >
        <Icon size={18} className={`mb-1 ${active ? 'text-brand-400' : color ? color : disabled ? 'text-slate-600' : 'text-slate-400 group-hover:text-white'}`} />
        <span className="text-[9px] font-medium leading-none text-center whitespace-nowrap max-w-[60px] overflow-hidden text-ellipsis">{label}</span>
        {subLabel && <span className="text-[8px] text-slate-500 leading-none mt-0.5">{subLabel}</span>}
        {badge && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-dark-900 ring-1 ring-dark-950"></span>}
    </button>
);

export const RibbonIconButton = ({ icon: Icon, onClick, active, disabled, title, color }: any) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded-md transition-all flex items-center justify-center
        ${active ? 'bg-brand-500/20 text-brand-400' : 'hover:bg-white/10 text-slate-400 hover:text-white'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
        <Icon size={16} className={color} />
    </button>
);

// --- GROUPS & LAYOUT ---

export const RibbonDivider = () => <div className="w-px h-8 bg-dark-700/50 mx-1 self-center shrink-0"></div>;

export const RibbonGroup = ({ label, children }: { label: string, children?: React.ReactNode }) => (
    <div className="flex flex-col h-full px-2 relative group/ribbon border-r border-dark-800/50 last:border-r-0">
        <div className="flex items-center gap-1 h-full pb-4">
            {children}
        </div>
        <div className="absolute bottom-1 left-0 w-full text-center text-[8px] text-slate-600 font-bold uppercase tracking-wider pointer-events-none select-none group-hover/ribbon:text-slate-500 transition-colors">
            {label}
        </div>
    </div>
);

export const RibbonActionGroup = ({ children }: { children?: React.ReactNode }) => (
    <div className="flex flex-wrap gap-0.5 max-w-[80px] justify-center content-center">
        {children}
    </div>
);

// --- INPUTS ---

export const RibbonSelect = ({ value, onChange, options, icon: Icon, className = '', width = 'w-24' }: any) => (
    <div className={`relative flex items-center bg-dark-950 border border-dark-700 rounded-md hover:border-dark-500 transition-colors ${width} ${className}`}>
        {Icon && <div className="pl-2 text-slate-500"><Icon size={12}/></div>}
        <select 
            value={value} 
            onChange={onChange}
            className="w-full bg-transparent text-[10px] font-medium text-slate-300 px-2 py-1 appearance-none focus:outline-none cursor-pointer"
        >
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value} className="bg-dark-900 text-slate-300">{opt.label}</option>
            ))}
        </select>
        <div className="absolute right-2 pointer-events-none text-slate-500">
            <ChevronDown size={10} />
        </div>
    </div>
);

export const RibbonColorPicker = ({ color, onChange, icon: Icon }: any) => (
    <div className="flex flex-col items-center gap-0.5 cursor-pointer group">
        <button className="p-1 hover:bg-white/10 rounded">
            <Icon size={16} className="text-slate-300 group-hover:text-white" />
        </button>
        <div className="w-4 h-1 rounded-full" style={{ backgroundColor: color }}></div>
        {/* In a real app, this would trigger a popover color picker */}
    </div>
);

// --- MODALS ---

export const LayoutSettingsModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    title: string;
    children?: React.ReactNode;
    onApply: () => void;
}> = ({ isOpen, onClose, title, children, onApply }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-dark-900 w-full max-w-md rounded-xl border border-dark-700 shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
                    <button onClick={onClose}><X size={16} className="text-slate-500 hover:text-white"/></button>
                </div>
                <div className="p-6 space-y-4">
                    {children}
                </div>
                <div className="p-4 border-t border-dark-700 bg-dark-900/30 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose} className="text-xs h-8">Cancel</Button>
                    <Button variant="primary" onClick={onApply} className="text-xs h-8">Apply</Button>
                </div>
            </div>
        </div>
    );
};

// Re-export basic components used in other files if needed
export const Button = ({ variant = 'primary', className = '', children, ...props }: any) => {
    const baseStyle = "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
    const variants: any = {
        primary: "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-[0_0_15px_rgba(var(--color-brand-500),0.4)] border border-transparent",
        secondary: "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10",
        ghost: "text-slate-400 hover:bg-white/5 hover:text-white",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
    };
    return <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

export const Input = ({ label, className = '', ...props }: any) => (
    <div className="w-full group">
        {label && <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-brand-400 transition-colors">{label}</label>}
        <input className={`w-full rounded-lg bg-dark-950 border border-dark-700 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all ${className}`} {...props} />
    </div>
);

export const Select = ({ label, options, className = '', ...props }: any) => (
    <div className="w-full group">
        {label && <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-brand-400 transition-colors">{label}</label>}
        <div className="relative">
            <select className={`w-full rounded-lg bg-dark-950 border border-dark-700 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none appearance-none cursor-pointer ${className}`} {...props}>
                {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><ChevronDown size={12}/></div>
        </div>
    </div>
);
