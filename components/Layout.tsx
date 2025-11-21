
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Users, Settings, GitBranch, ShieldAlert, 
  Database, Network, Bot, Bell, Search, TableProperties, Palette, 
  Copy, X, UploadCloud, DollarSign, Calendar, CheckCircle2, ArrowRight, Clock,
  PieChart, ChevronLeft, ChevronRight, Menu, AlertTriangle, Info, CheckSquare,
  ArchiveRestore, LogOut, Key, Plus, Zap, BrainCircuit, BookOpen, Layers,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Button, Input, Select, Badge, Logo, Avatar } from './UIComponents';

// --- Navigation Configuration ---

type NavGroup = {
  title: string;
  roleReq?: string[]; // 'All' or specific roles
  items: {
    to: string;
    icon: React.ElementType;
    label: string;
    badge?: string;
    badgeColor?: 'red' | 'blue' | 'green' | 'brand';
  }[];
};

const NAV_SECTIONS: NavGroup[] = [
  {
    title: 'Intelligence',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Command Center' },
      { to: '/bi', icon: PieChart, label: 'Business Intelligence' },
      { to: '/risks', icon: ShieldAlert, label: 'Risk & Obligations', badge: '3 Alerts', badgeColor: 'red' }
    ]
  },
  {
    title: 'Contracts',
    items: [
      { to: '/repository', icon: FileText, label: 'Repository' },
      { to: '/templates', icon: Copy, label: 'Drafting & Templates' }
    ]
  },
  {
    title: 'Workflows',
    roleReq: ['Admin', 'Legal'],
    items: [
      { to: '/workflow-ai', icon: Bot, label: 'Workflow Builder' }
    ]
  },
  {
    title: 'Legal Ops',
    roleReq: ['Admin', 'Legal'],
    items: [
      { to: '/clauses', icon: BookOpen, label: 'Clause Library' },
      { to: '/parties', icon: Users, label: 'Counterparties' },
      { to: '/legacy-migration', icon: ArchiveRestore, label: 'Legacy Migration' }
    ]
  },
  {
    title: 'Master Data',
    roleReq: ['Admin', 'Legal'],
    items: [
      { to: '/masters', icon: GitBranch, label: 'Master Records' },
      { to: '/fields', icon: TableProperties, label: 'Field Database' }
    ]
  },
  {
    title: 'Integrations',
    roleReq: ['Admin', 'IT'],
    items: [
      { to: '/integrations', icon: Network, label: 'Connectors & API' }
    ]
  },
  {
    title: 'System',
    roleReq: ['Admin'],
    items: [
      { to: '/users', icon: Key, label: 'Users & Security' },
      { to: '/settings', icon: Settings, label: 'Settings' }
    ]
  }
];

// --- Components ---

const NavItem: React.FC<{ to: string; icon: React.ElementType; label: string; collapsed?: boolean; badge?: string; badgeColor?: string }> = ({ to, icon: Icon, label, collapsed, badge, badgeColor = 'brand' }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden mb-1 ${
          isActive
            ? 'bg-brand-500/10 text-white shadow-[inset_4px_0_0_0_rgba(var(--color-brand-500),1)]'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        } ${collapsed ? 'justify-center' : ''}`
      }
      title={collapsed ? label : ''}
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className={`transition-transform duration-300 flex-shrink-0 ${isActive ? 'text-brand-400' : 'group-hover:text-slate-200'}`} />
          {!collapsed && (
             <div className="flex-1 flex justify-between items-center overflow-hidden">
                <span className="truncate relative z-10">{label}</span>
                {badge && (
                   <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase animate-pulse ${
                      badgeColor === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-brand-500/20 text-brand-400'
                   }`}>
                      {badge}
                   </span>
                )}
             </div>
          )}
          {isActive && <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent pointer-events-none"></div>}
        </>
      )}
    </NavLink>
  );
};

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

// --- Main Layout ---

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = location.pathname.split('/')[1] || 'Dashboard';
  
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // User Role Simulation
  const [userRole, setUserRole] = useState<'Admin' | 'Sales'>('Admin');

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Contract Request', message: 'Sales team submitted NDA for Acme Corp', time: '2m ago', unread: true, type: 'info', icon: FileText },
    { id: 2, title: 'Approval Required', message: 'MSA for TechFlow needs your review', time: '1h ago', unread: true, type: 'warning', icon: CheckSquare },
    { id: 3, title: 'Risk Detected', message: 'High liability cap in Vendor Agreement', time: '3h ago', unread: false, type: 'alert', icon: ShieldAlert },
  ]);
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    document.body.className = currentTheme === 'default' ? '' : currentTheme;
  }, [currentTheme]);

  const handleLogout = () => navigate('/');

  const handleQuickAction = (action: string) => {
    setShowQuickActions(false);
    if (action === 'request') setShowRequestModal(true);
    if (action === 'draft') navigate('/templates');
    if (action === 'upload') navigate('/legacy-migration');
    if (action === 'ai') navigate('/bi');
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-200 relative transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500 rounded-full blur-[120px] animate-blob opacity-20 mix-blend-screen"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-purple rounded-full blur-[120px] animate-blob animation-delay-2000 opacity-20 mix-blend-screen"></div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`bg-dark-950/95 border-r border-dark-700 flex flex-col z-20 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}
      >
        <div className={`p-6 flex items-center justify-center border-b border-dark-700 ${isSidebarCollapsed ? 'px-2' : ''}`}>
           <Link to="/dashboard" className="block hover:opacity-90 transition-opacity">
              <Logo collapsed={isSidebarCollapsed} />
           </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar overflow-x-hidden">
          {NAV_SECTIONS.map((section, i) => {
             // Role Filter
             if (section.roleReq && !section.roleReq.includes(userRole) && userRole !== 'Admin') return null;

             return (
               <div key={i} className="animate-in fade-in duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                  {!isSidebarCollapsed && (
                     <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        {section.title}
                     </p>
                  )}
                  <div className="space-y-0.5">
                     {section.items.map((item, j) => (
                        <NavItem 
                           key={j} 
                           to={item.to} 
                           icon={item.icon} 
                           label={item.label} 
                           collapsed={isSidebarCollapsed}
                           badge={item.badge}
                           badgeColor={item.badgeColor}
                        />
                     ))}
                  </div>
                  {!isSidebarCollapsed && i < NAV_SECTIONS.length - 1 && (
                     <div className="mx-3 my-4 h-px bg-white/5"></div>
                  )}
               </div>
             )
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-dark-700 bg-dark-900/30 backdrop-blur-sm">
          <div className={`flex items-center justify-between ${isSidebarCollapsed ? 'flex-col gap-3' : ''}`}>
             
             {/* User Profile */}
             <div className="flex items-center gap-3 relative group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="relative">
                   <Avatar name="Harvey Specter" size={isSidebarCollapsed ? 'sm' : 'md'} />
                   <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-dark-900 rounded-full"></span>
                </div>
                
                {!isSidebarCollapsed && (
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">Harvey Specter</p>
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                         {userRole} <ChevronDown size={10}/>
                      </p>
                   </div>
                )}

                {/* Role Switcher Popover (Demo Only) */}
                {!isSidebarCollapsed && (
                   <div className="absolute bottom-full left-0 w-full bg-dark-900 border border-dark-700 rounded-xl shadow-xl mb-2 p-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                      <p className="text-[10px] uppercase text-slate-500 font-bold px-2 py-1">Simulate Role</p>
                      <button 
                         onClick={() => setUserRole('Admin')} 
                         className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-white/5 ${userRole === 'Admin' ? 'text-brand-400 font-bold' : 'text-slate-400'}`}
                      >
                         Admin (Legal)
                      </button>
                      <button 
                         onClick={() => setUserRole('Sales')} 
                         className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-white/5 ${userRole === 'Sales' ? 'text-brand-400 font-bold' : 'text-slate-400'}`}
                      >
                         Sales User
                      </button>
                   </div>
                )}
             </div>

             <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5" title="Sign Out">
                <LogOut size={18} />
             </button>
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
             
             {/* Breadcrumb / Page Title */}
             <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide drop-shadow-sm">
                  {pageTitle.replace('-', ' ')}
                </h2>
                {pageTitle === 'dashboard' && (
                   <Badge color="brand" className="ml-2">Live</Badge>
                )}
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={16} />
               <input 
                  type="text" 
                  placeholder="Search contracts, clauses..." 
                  className="bg-dark-900/50 border border-dark-700 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 w-64 transition-all placeholder:text-slate-600"
               />
             </div>
             
             {/* Notification Center */}
             <div className="relative">
               <button 
                 onClick={() => setShowNotifications(!showNotifications)}
                 className={`relative p-2 transition-colors hover:bg-white/5 rounded-full ${showNotifications ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white'}`}
               >
                 {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444] animate-pulse"></span>
                 )}
                 <Bell size={20} />
               </button>

               {showNotifications && (
                 <div className="absolute right-0 top-full mt-2 w-80 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200 backdrop-blur-2xl overflow-hidden">
                    <div className="p-3 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
                       <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                         Notifications {unreadCount > 0 && <span className="px-1.5 py-0.5 rounded bg-brand-500 text-[10px] text-white">{unreadCount}</span>}
                       </h3>
                       <button className="text-[10px] text-brand-400 hover:text-brand-300 transition-colors">Mark all read</button>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                       {notifications.map((notif) => (
                         <div key={notif.id} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group relative">
                            {notif.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500"></div>}
                            <div className="flex gap-3">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                 notif.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 
                                 notif.type === 'alert' ? 'bg-red-500/10 text-red-500' : 
                                 'bg-brand-500/10 text-brand-500'
                               }`}>
                                  <notif.icon size={16} />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start mb-1">
                                     <h4 className={`text-sm font-medium truncate ${notif.unread ? 'text-white' : 'text-slate-400'}`}>{notif.title}</h4>
                                     <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">{notif.time}</span>
                                  </div>
                                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 group-hover:text-slate-300 transition-colors">{notif.message}</p>
                                </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
               {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>}
             </div>

             <div className="h-6 w-px bg-dark-700 mx-1"></div>

             {/* Quick Actions Dropdown */}
             <div className="relative">
                <Button 
                   variant="neon" 
                   className="text-xs h-9 px-4 shadow-[0_0_15px_rgba(var(--color-brand-500),0.15)] gap-2 flex items-center"
                   onClick={() => setShowQuickActions(!showQuickActions)}
                >
                   <Plus size={14}/> Quick Actions {showQuickActions ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                </Button>

                {showQuickActions && (
                   <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowQuickActions(false)}></div>
                      <div className="absolute right-0 top-full mt-2 w-56 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2 overflow-hidden">
                         <div className="p-1 space-y-0.5">
                            <button onClick={() => handleQuickAction('request')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group">
                               <div className="p-1.5 bg-brand-500/10 rounded text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors"><FileText size={14}/></div>
                               New Request
                            </button>
                            <button onClick={() => handleQuickAction('draft')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group">
                               <div className="p-1.5 bg-purple-500/10 rounded text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors"><Copy size={14}/></div>
                               Start Draft
                            </button>
                            <button onClick={() => handleQuickAction('upload')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group">
                               <div className="p-1.5 bg-blue-500/10 rounded text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors"><UploadCloud size={14}/></div>
                               Upload Legacy
                            </button>
                            <div className="h-px bg-dark-700 my-1 mx-2"></div>
                            <button onClick={() => handleQuickAction('ai')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group">
                               <div className="p-1.5 bg-yellow-500/10 rounded text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-colors"><BrainCircuit size={14}/></div>
                               Ask AI Assistant
                            </button>
                         </div>
                      </div>
                   </>
                )}
             </div>
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
