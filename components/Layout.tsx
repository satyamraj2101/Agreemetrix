import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Users, Settings, GitBranch, ShieldAlert, 
  Database, Network, Bot, Bell, Search, TableProperties, Palette, 
  Copy, X, UploadCloud, DollarSign, Calendar, CheckCircle2, ArrowRight, Clock,
  PieChart, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { Button, Input, Select, Badge } from './UIComponents';

const NavItem: React.FC<{ to: string; icon: React.ElementType; label: string; collapsed?: boolean }> = ({ to, icon: Icon, label, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
          isActive
            ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(var(--color-brand-500),0.4)]'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
        } ${collapsed ? 'justify-center' : ''}`
      }
      title={collapsed ? label : ''}
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className={`transition-transform duration-300 flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
          {!collapsed && <span className="relative z-10 whitespace-nowrap opacity-100 transition-opacity duration-300">{label}</span>}
          {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>}
        </>
      )}
    </NavLink>
  );
};

const themes = [
  { id: 'default', label: 'Dark', color: '#0f172a' },
  { id: 'theme-light', label: 'Light', color: '#f8fafc' },
  { id: 'theme-blue', label: 'Blue', color: '#1e3a8a' },
  { id: 'theme-pink', label: 'Pink', color: '#831843' },
  { id: 'theme-white', label: 'White', color: '#ffffff' },
];

const NewRequestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
          setIsSubmitting(false);
          setIsSuccess(true);
          setTimeout(() => {
              onClose();
          }, 2000);
      }, 1500);
  }

  if (isSuccess) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-dark-900 border border-brand-500/30 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(var(--color-brand-500),0.2)] p-8 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 ring-1 ring-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">Your request has been successfully queued and routed to the <span className="text-brand-400 font-medium">Legal Intake Team</span>. You can track its status in your dashboard.</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-dark-950 px-4 py-2 rounded-lg border border-dark-800 mb-2">
                  <span>REQ ID:</span>
                  <span className="text-slate-300 font-bold">#REQ-{Math.floor(Math.random() * 10000)}</span>
              </div>
           </div>
        </div>
      )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-dark-900 border border-dark-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            New Legal Request
                        </h2>
                        <p className="text-sm text-slate-400">Submit a contract request, review, or legal query.</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                
                {/* Progress / Steps Indicator (Visual only for MVP) */}
                <div className="flex items-center justify-between px-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-dark-900">1</div>
                        <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Details</span>
                    </div>
                    <div className="flex-1 h-px bg-dark-700 mx-4"></div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-dark-800 text-slate-400 border border-dark-600 flex items-center justify-center text-xs font-bold">2</div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commercials</span>
                    </div>
                    <div className="flex-1 h-px bg-dark-700 mx-4"></div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-dark-800 text-slate-400 border border-dark-600 flex items-center justify-center text-xs font-bold">3</div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Review</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2"><FileText size={14}/> Request Information</h3>
                            <Select label="Request Type" options={[
                                {label: 'NDA (Non-Disclosure Agreement)', value: 'nda'},
                                {label: 'MSA (Master Services Agreement)', value: 'msa'},
                                {label: 'SOW (Statement of Work)', value: 'sow'},
                                {label: 'Vendor Agreement', value: 'vendor'},
                                {label: 'Software License', value: 'license'},
                                {label: 'General Legal Advice', value: 'advice'}
                            ]} />
                            <Input label="Counterparty Name" placeholder="e.g. Acme Corp, TechFlow Inc" />
                            <Input label="Counterparty Contact Email" placeholder="legal@counterparty.com" />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2"><DollarSign size={14}/> Commercial Terms</h3>
                            <div className="relative">
                               <span className="absolute left-3 top-[33px] text-slate-500 font-sans text-sm">$</span>
                               <Input label="Contract Value (USD)" placeholder="0.00" className="pl-7 font-mono" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Start Date" type="date" />
                                <Input label="End Date" type="date" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-6">
                         <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2"><Clock size={14}/> Priority & SLA</h3>
                            <Select label="Priority Level" options={[
                                {label: 'Standard (5-7 Days)', value: 'standard'},
                                {label: 'High (2-3 Days)', value: 'high'},
                                {label: 'Urgent (24 Hours)', value: 'urgent'}
                            ]} />
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Description & Notes</label>
                                <textarea className="w-full rounded-lg bg-dark-950/50 border border-dark-700 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all h-32 resize-none" placeholder="Please describe the scope of work, key deliverables, or specific legal concerns..."></textarea>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2"><UploadCloud size={14}/> Attachments</h3>
                            <div className="border-2 border-dashed border-dark-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all cursor-pointer group">
                                <div className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center mb-2 group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-colors">
                                    <UploadCloud size={20}/>
                                </div>
                                <p className="text-sm font-medium text-slate-300">Click to upload files</p>
                                <p className="text-xs opacity-60 mt-1">Drafts, Third-party paper, Email threads</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-dark-700 bg-dark-950/50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-slate-500 px-3 py-1.5 bg-brand-500/5 rounded-full border border-brand-500/10">
                    <Bot size={14} className="text-brand-400"/>
                    <span className="text-brand-100">AI Agent will auto-triage this based on value & risk.</span>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting} className="min-w-[140px] flex justify-center">
                        {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Submit Request'}
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const pageTitle = location.pathname.split('/')[1] || 'Dashboard';
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Apply theme to body
    document.body.className = currentTheme === 'default' ? '' : currentTheme;
  }, [currentTheme]);

  return (
    <div className="flex h-screen overflow-hidden text-slate-200 relative transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500 rounded-full blur-[120px] animate-blob opacity-20 mix-blend-screen"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-purple rounded-full blur-[120px] animate-blob animation-delay-2000 opacity-20 mix-blend-screen"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-accent-cyan rounded-full blur-[120px] animate-blob animation-delay-4000 opacity-20 mix-blend-screen"></div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`bg-dark-950/95 border-r border-dark-700 flex flex-col z-20 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`p-6 flex items-center gap-3 border-b border-dark-700 ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}>
          <div className="h-9 w-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 transform hover:rotate-12 transition-transform cursor-pointer flex-shrink-0">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {!isSidebarCollapsed && (
            <div className="animate-in fade-in duration-300 overflow-hidden">
              <h1 className="font-bold text-white leading-none tracking-tight text-lg">AGREEMETRIX</h1>
              <span className="text-[10px] text-brand-400 font-bold tracking-[0.2em] uppercase">Intelligence</span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar overflow-x-hidden">
          <div>
            {!isSidebarCollapsed && (
               <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 animate-in fade-in duration-300">
                  <span className="w-1 h-1 bg-brand-500 rounded-full"></span> Platform
               </p>
            )}
            <div className="space-y-1">
              <NavItem to="/" icon={LayoutDashboard} label="Analytics" collapsed={isSidebarCollapsed} />
              <NavItem to="/bi" icon={PieChart} label="Business Intelligence" collapsed={isSidebarCollapsed} />
              <NavItem to="/repository" icon={FileText} label="Repository" collapsed={isSidebarCollapsed} />
              <NavItem to="/workflow-ai" icon={Bot} label="Workflow Builder" collapsed={isSidebarCollapsed} />
              <NavItem to="/templates" icon={Copy} label="Doc Templates" collapsed={isSidebarCollapsed} />
              <NavItem to="/fields" icon={TableProperties} label="Field Database" collapsed={isSidebarCollapsed} />
              <NavItem to="/integrations" icon={Network} label="Integrations" collapsed={isSidebarCollapsed} />
            </div>
          </div>

          <div>
            {!isSidebarCollapsed && (
               <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 animate-in fade-in duration-300">
                  <span className="w-1 h-1 bg-accent-purple rounded-full"></span> Legal Ops
               </p>
            )}
            <div className="space-y-1">
              <NavItem to="/clauses" icon={Database} label="Clause Library" collapsed={isSidebarCollapsed} />
              <NavItem to="/parties" icon={Users} label="Counterparties" collapsed={isSidebarCollapsed} />
              <NavItem to="/risks" icon={ShieldAlert} label="Risk & Obligations" collapsed={isSidebarCollapsed} />
            </div>
          </div>

          <div>
             {!isSidebarCollapsed && (
               <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 animate-in fade-in duration-300">
                  <span className="w-1 h-1 bg-slate-500 rounded-full"></span> System
               </p>
             )}
            <div className="space-y-1">
               <NavItem to="/settings" icon={Settings} label="Settings" collapsed={isSidebarCollapsed} />
               <NavItem to="/masters" icon={GitBranch} label="Masters" collapsed={isSidebarCollapsed} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-dark-700 bg-dark-900/30 backdrop-blur-sm">
          <div className={`flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer group ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500 flex items-center justify-center text-white font-medium shadow-md group-hover:ring-2 ring-brand-500 transition-all flex-shrink-0">
              HS
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                <p className="text-sm font-medium text-white truncate group-hover:text-brand-400 transition-colors">Harvey Specter</p>
                <p className="text-xs text-slate-500 truncate">Admin Access</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-transparent">
        <header className="h-16 bg-dark-950/30 border-b border-dark-700 flex items-center justify-between px-4 md:px-8 backdrop-blur-md sticky top-0 z-30 transition-all">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
             >
                {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
             </button>
             <h2 className="text-lg font-bold text-white uppercase tracking-wide drop-shadow-sm flex items-center gap-2">
               {pageTitle.replace('-', ' ')}
             </h2>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Theme Switcher */}
             <div className="relative">
               <button 
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative"
                  title="Switch Theme"
               >
                 <Palette size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 rounded-full border border-dark-950" style={{backgroundColor: themes.find(t => t.id === currentTheme)?.color}}></span>
               </button>
               
               {showThemeMenu && (
                 <div className="absolute right-0 top-full mt-2 w-48 bg-dark-900 border border-dark-700 rounded-xl shadow-xl p-2 z-50 animate-in slide-in-from-top-2 duration-200 backdrop-blur-2xl">
                   <p className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1 mb-1">Select Theme</p>
                   {themes.map(theme => (
                     <button
                       key={theme.id}
                       onClick={() => { setCurrentTheme(theme.id); setShowThemeMenu(false); }}
                       className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${currentTheme === theme.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                     >
                       <div className="w-4 h-4 rounded-full border border-white/10 shadow-sm" style={{backgroundColor: theme.color}}></div>
                       {theme.label}
                       {currentTheme === theme.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"></div>}
                     </button>
                   ))}
                 </div>
               )}
               {showThemeMenu && <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)}></div>}
             </div>

             <div className="h-6 w-px bg-dark-700 mx-1"></div>

             <div className="relative hidden md:block group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={16} />
               <input 
                  type="text" 
                  placeholder="Search platform..." 
                  className="bg-dark-900/50 border border-dark-700 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 w-64 transition-all placeholder:text-slate-600"
               />
             </div>
             
             <button className="relative p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444] animate-pulse"></span>
               <Bell size={20} />
             </button>
             <Button 
                variant="neon" 
                className="text-xs h-9 px-4 shadow-[0_0_15px_rgba(var(--color-brand-500),0.15)]"
                onClick={() => setShowRequestModal(true)}
             >
                New Request
             </Button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </div>

        {/* Modals */}
        {showRequestModal && <NewRequestModal onClose={() => setShowRequestModal(false)} />}

      </main>
    </div>
  );
};

export default Layout;