
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Logo } from '../components/UIComponents';
import { 
  ArrowRight, Shield, Zap, CheckCircle2, Globe, 
  BarChart2, Workflow, Lock, Bot, Search, ChevronRight,
  Menu, X, Check, Server, Users, CreditCard, Sparkles,
  Cpu, FileText, LayoutTemplate, Share2
} from 'lucide-react';

// --- HERO GRAPHIC COMPONENT ---
const HeroGraphic = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      className="relative w-full max-w-6xl mx-auto perspective-1000 py-20"
      style={{ perspective: '1000px' }}
    >
      <div 
        className="relative transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg) scale(1.02)`
        }}
      >
        {/* Glow Effect behind the board */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl opacity-20 blur-2xl animate-pulse-slow"></div>
        
        {/* Main Dashboard Mockup */}
        <div className="relative bg-dark-950 border border-dark-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Mockup Header */}
          <div className="h-10 border-b border-dark-800 bg-dark-900/90 backdrop-blur flex items-center px-4 justify-between">
             <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
             </div>
             <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                <Lock size={10} /> agreemetrix.ai
             </div>
          </div>

          {/* Mockup Body */}
          <div className="p-6 grid grid-cols-12 gap-6 bg-dark-950/80 backdrop-blur-sm relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
             
             {/* Sidebar Mock */}
             <div className="col-span-2 hidden md:flex flex-col gap-3 border-r border-dark-800 pr-6">
                <div className="h-8 w-full bg-dark-800 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-dark-800/50 rounded"></div>
                <div className="h-4 w-1/2 bg-dark-800/50 rounded"></div>
                <div className="h-4 w-2/3 bg-dark-800/50 rounded"></div>
             </div>

             {/* Content Mock */}
             <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
                {/* Stats Row */}
                <div className="flex gap-4">
                   <div className="flex-1 h-24 bg-dark-800/30 border border-dark-700 rounded-xl p-4 relative overflow-hidden group hover:border-brand-500/30 transition-colors">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/10 rounded-full blur-xl -mr-8 -mt-8"></div>
                      <div className="w-8 h-8 bg-brand-500/20 rounded mb-2"></div>
                      <div className="h-4 w-12 bg-dark-700 rounded mb-1"></div>
                      <div className="h-6 w-20 bg-white/10 rounded"></div>
                   </div>
                   <div className="flex-1 h-24 bg-dark-800/30 border border-dark-700 rounded-xl p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl -mr-8 -mt-8"></div>
                      <div className="w-8 h-8 bg-purple-500/20 rounded mb-2"></div>
                      <div className="h-4 w-12 bg-dark-700 rounded mb-1"></div>
                      <div className="h-6 w-20 bg-white/10 rounded"></div>
                   </div>
                   <div className="flex-1 h-24 bg-dark-800/30 border border-dark-700 rounded-xl p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl -mr-8 -mt-8"></div>
                      <div className="w-8 h-8 bg-blue-500/20 rounded mb-2"></div>
                      <div className="h-4 w-12 bg-dark-700 rounded mb-1"></div>
                      <div className="h-6 w-20 bg-white/10 rounded"></div>
                   </div>
                </div>

                {/* Main Chart Area */}
                <div className="h-64 bg-dark-800/20 border border-dark-700 rounded-xl p-4 relative overflow-hidden">
                   <div className="absolute inset-0 flex items-end justify-around px-6 pb-0 pt-10 gap-2">
                      {[40, 60, 45, 70, 50, 80, 65, 90, 75].map((h, i) => (
                         <div 
                            key={i} 
                            className="w-full bg-gradient-to-t from-brand-500/20 to-brand-500/50 rounded-t-md transition-all duration-1000 ease-in-out"
                            style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                         ></div>
                      ))}
                   </div>
                   {/* Scan Line */}
                   <div className="absolute top-0 bottom-0 w-px bg-brand-400/50 shadow-[0_0_10px_rgba(45,212,191,0.5)] animate-scan-line opacity-50"></div>
                </div>
             </div>
          </div>

          {/* AI Notification Pop-up */}
          <div className="absolute bottom-8 right-8 max-w-xs w-full bg-dark-900/90 backdrop-blur-xl border border-dark-600 shadow-2xl rounded-xl p-4 animate-bounce-subtle z-20">
             <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-500/20 rounded-lg text-brand-400 shrink-0">
                   <Sparkles size={16} />
                </div>
                <div>
                   <h4 className="text-xs font-bold text-white mb-1">Risk Detected</h4>
                   <p className="text-[10px] text-slate-300 leading-relaxed">
                      The "Indemnity" clause in <strong>TechFlow MSA</strong> exceeds your standard risk threshold.
                   </p>
                   <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-bold rounded transition-colors">Auto-Remediate</button>
                      <button className="px-3 py-1 bg-dark-800 hover:bg-dark-700 text-slate-400 text-[10px] font-bold rounded transition-colors">Ignore</button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- LANDING PAGE ---

const Landing: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* Global Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-dark-950/70 backdrop-blur-lg border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="block hover:opacity-90 transition-opacity relative group">
             <div className="absolute -inset-2 bg-brand-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative">
                <Logo />
             </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
             <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors hover:shadow-[0_1px_0_0_rgba(45,212,191,1)]">Features</button>
             <button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors hover:shadow-[0_1px_0_0_rgba(45,212,191,1)]">Security</button>
             <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors hover:shadow-[0_1px_0_0_rgba(45,212,191,1)]">Pricing</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <Link to="/login">
                <Button variant="ghost" className="text-sm hover:bg-white/5">Sign In</Button>
             </Link>
             <Link to="/signup">
                <Button variant="primary" className="shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-shadow">
                   Get Started
                </Button>
             </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400 hover:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-dark-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-5">
            <div className="flex flex-col gap-4 text-lg font-medium text-slate-300">
               <button onClick={() => scrollToSection('features')} className="text-left hover:text-brand-400">Features</button>
               <button onClick={() => scrollToSection('security')} className="text-left hover:text-brand-400">Security</button>
               <button onClick={() => scrollToSection('pricing')} className="text-left hover:text-brand-400">Pricing</button>
            </div>
            <div className="h-px bg-white/10"></div>
            <div className="flex flex-col gap-3">
               <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center">Sign In</Button>
               </Link>
               <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">Get Started</Button>
               </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
         {/* Dynamic Blobs */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen"></div>
            <div className="absolute top-[40%] left-[10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen"></div>
         </div>

         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-300 mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700 hover:bg-white/10 transition-colors cursor-default shadow-[0_0_15px_rgba(45,212,191,0.1)]">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
               </span>
               Agreemetrix AI 2.0 is live
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1] animate-in slide-in-from-bottom-8 fade-in duration-1000 drop-shadow-2xl">
               Contract Management <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-purple-400 animate-shimmer bg-[length:200%_100%]">Reimagined by AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
               Accelerate deals, automate workflows, and uncover risks with the world's first AI-native CLM platform designed for modern legal teams.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
               <Link to="/signup" className="w-full md:w-auto">
                  <Button variant="primary" className="h-14 px-8 text-lg w-full md:w-auto shadow-[0_0_40px_rgba(var(--color-brand-500),0.4)] hover:shadow-[0_0_60px_rgba(var(--color-brand-500),0.6)] hover:scale-105 transition-all duration-300">
                     Start Free Trial <ArrowRight className="ml-2" />
                  </Button>
               </Link>
               <Link to="/login" className="w-full md:w-auto">
                  <Button variant="secondary" className="h-14 px-8 text-lg w-full md:w-auto bg-dark-800/50 border-dark-700 hover:bg-dark-800 hover:border-brand-500/30 transition-all">
                     View Interactive Demo
                  </Button>
               </Link>
            </div>

            {/* 3D Interactive Hero Graphic */}
            <div className="mt-20 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-500">
               <HeroGraphic />
            </div>
         </div>
      </section>

      {/* Infinite Logos */}
      <section className="py-10 border-y border-white/5 bg-dark-900/30 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617] z-10 pointer-events-none"></div>
         <div className="flex gap-12 animate-marquee whitespace-nowrap min-w-full items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {[...Array(2)].map((_, i) => (
               <React.Fragment key={i}>
                  <div className="flex items-center gap-2 text-xl font-bold text-white"><Globe size={24}/> Global Inc</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-white"><Zap size={24}/> TechFlow</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-white"><Shield size={24}/> SecureNet</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-white"><BoxIcon /> Stratos</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-white"><CreditCard size={24}/> FinCorp</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-white"><Users size={24}/> TeamWorks</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-white"><Server size={24}/> CloudSys</div>
               </React.Fragment>
            ))}
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
               <Badge color="brand" className="mb-4">Capabilities</Badge>
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need to manage contracts</h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg">From generation to negotiation to signature, Agreemetrix unifies your entire legal workflow into one intelligent platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { 
                     icon: Bot, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'hover:border-brand-500/50',
                     title: 'AI Risk Detection', desc: 'Automatically scan third-party paper for deviations from your playbook. Identify risky clauses in seconds.'
                  },
                  { 
                     icon: Workflow, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/50',
                     title: 'Visual Workflow Builder', desc: 'Design complex approval routing with a drag-and-drop interface. Automate handoffs between Legal, Sales, and Finance.'
                  },
                  { 
                     icon: BarChart2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/50',
                     title: 'Intelligence & Analytics', desc: 'Turn static documents into structured data. Track renewal dates, obligations, and cycle times in real-time.'
                  },
                  { 
                     icon: Search, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'hover:border-yellow-500/50',
                     title: 'Smart Repository', desc: 'Find any contract instantly with semantic search. Filter by counterparty, value, region, or clause type.'
                  },
                  { 
                     icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'hover:border-green-500/50',
                     title: 'Compliance Tracking', desc: 'Stay compliant with GDPR, CCPA, and other regulations. Track obligations and receive alerts before breaches occur.'
                  },
                  { 
                     icon: Lock, color: 'text-red-400', bg: 'bg-red-500/10', border: 'hover:border-red-500/50',
                     title: 'Enterprise Security', desc: 'Bank-grade encryption, SSO, and granular role-based access control (RBAC) to keep your sensitive data safe.'
                  }
               ].map((feat, i) => (
                  <div key={i} className={`p-8 rounded-2xl bg-dark-900/50 border border-dark-800 ${feat.border} transition-all duration-300 group hover:bg-dark-900 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden`}>
                     <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${feat.color.replace('text', 'from')} to-transparent transition-opacity duration-500`}></div>
                     <div className={`w-14 h-14 ${feat.bg} rounded-2xl flex items-center justify-center ${feat.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                        <feat.icon size={28} />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">{feat.title}</h3>
                     <p className="text-slate-400 text-sm leading-relaxed">
                        {feat.desc}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-32 bg-dark-900/30 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:2rem_2rem]"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="flex flex-col lg:flex-row gap-20 items-center">
                  <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-6">
                         <Shield size={14}/> Enterprise Grade
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Uncompromising Security & Compliance</h2>
                      <p className="text-slate-400 text-lg leading-relaxed mb-10">
                          Your data is protected by state-of-the-art encryption and strict access controls. We meet the highest standards for data privacy and sovereignty.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {[
                             { icon: Server, label: 'SOC 2 Type II', sub: 'Certified compliant' },
                             { icon: Lock, label: 'AES-256', sub: 'Encryption at rest' },
                             { icon: Globe, label: 'Data Sovereignty', sub: 'US & EU Hosting' },
                             { icon: Users, label: 'SSO & RBAC', sub: 'Granular controls' }
                          ].map((item, i) => (
                             <div key={i} className="flex gap-4 items-center p-4 bg-dark-950/50 rounded-xl border border-dark-800 hover:border-green-500/30 transition-colors group">
                                 <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <item.icon size={20}/>
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-white">{item.label}</h4>
                                     <p className="text-xs text-slate-500">{item.sub}</p>
                                 </div>
                             </div>
                          ))}
                      </div>
                  </div>
                  
                  {/* Interactive Security Visual */}
                  <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                      <div className="absolute -inset-10 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                      <div className="relative bg-dark-950 border border-dark-700 rounded-2xl p-8 shadow-2xl overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-scan-line"></div>
                          
                          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                              <span className="text-white font-bold flex items-center gap-3 text-lg">
                                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                 Security Audit Log
                              </span>
                              <span className="text-xs font-mono text-slate-500 bg-dark-900 px-2 py-1 rounded">LIVE</span>
                          </div>
                          
                          <div className="space-y-6 font-mono text-xs">
                              {[
                                 { time: '10:42:15', event: 'Encryption Handshake', status: 'SUCCESS', color: 'text-green-400' },
                                 { time: '10:42:18', event: 'User Login (SSO)', status: 'VERIFIED', color: 'text-blue-400' },
                                 { time: '10:42:22', event: 'Doc Access Request', status: 'GRANTED', color: 'text-purple-400' },
                                 { time: '10:43:05', event: 'Backup Sync', status: 'COMPLETE', color: 'text-green-400' }
                              ].map((log, i) => (
                                 <div key={i} className="flex justify-between items-center animate-in slide-in-from-left-4 fade-in duration-500" style={{ animationDelay: `${i * 200}ms` }}>
                                     <div className="flex items-center gap-4">
                                        <span className="text-slate-600">[{log.time}]</span>
                                        <span className="text-slate-300">{log.event}</span>
                                     </div>
                                     <span className={`font-bold ${log.color} bg-white/5 px-2 py-0.5 rounded`}>{log.status}</span>
                                 </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple, transparent pricing</h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg">Start for free, scale as you grow. No hidden fees.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                {/* Starter */}
                <div className="p-8 rounded-3xl bg-dark-900/50 border border-dark-700 hover:border-dark-600 transition-all flex flex-col relative group">
                    <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                    <div className="text-4xl font-bold text-white mb-6">$0 <span className="text-sm text-slate-500 font-normal text-base">/ mo</span></div>
                    <p className="text-slate-400 text-sm mb-8 h-10">Perfect for small teams getting organized.</p>
                    <ul className="space-y-4 mb-8 flex-1">
                        {['Up to 50 Contracts', 'Basic Search', '1 Workflow Template', 'Email Support'].map((item,i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-dark-800 flex items-center justify-center shrink-0"><Check size={12} className="text-slate-400" /></div> {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/signup">
                        <Button variant="secondary" className="w-full h-12 text-base bg-dark-800 hover:bg-dark-700 border-dark-700">Get Started</Button>
                    </Link>
                </div>

                {/* Pro */}
                <div className="p-10 rounded-3xl bg-dark-900 border border-brand-500/50 relative flex flex-col shadow-2xl shadow-brand-500/10 transform md:-translate-y-4 z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg">Most Popular</div>
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent rounded-3xl pointer-events-none"></div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
                    <div className="text-5xl font-bold text-white mb-6">$49 <span className="text-sm text-slate-500 font-normal text-base">/ user / mo</span></div>
                    <p className="text-slate-400 text-sm mb-10 h-10">For growing legal teams needing automation.</p>
                    <ul className="space-y-5 mb-10 flex-1">
                        {['Unlimited Contracts', 'AI Risk Analysis', '5 Workflow Templates', 'Integrations (Slack/Salesforce)', 'Priority Support'].map((item,i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                                <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0 text-dark-950"><Check size={12} strokeWidth={3} /></div> {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/signup">
                        <Button variant="primary" className="w-full h-14 text-base font-bold shadow-xl shadow-brand-500/20 hover:scale-[1.02] transition-transform">Start Free Trial</Button>
                    </Link>
                </div>

                {/* Enterprise */}
                <div className="p-8 rounded-3xl bg-dark-900/50 border border-dark-700 hover:border-dark-600 transition-all flex flex-col relative group">
                    <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                    <div className="text-4xl font-bold text-white mb-6">Custom</div>
                    <p className="text-slate-400 text-sm mb-8 h-10">For large organizations requiring control.</p>
                    <ul className="space-y-4 mb-8 flex-1">
                        {['Unlimited Everything', 'SSO & RBAC', 'Custom AI Models', 'Dedicated Success Manager', 'SLA Guarantees'].map((item,i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0"><Check size={12} className="text-purple-400" /></div> {item}
                            </li>
                        ))}
                    </ul>
                    <Button variant="secondary" className="w-full h-12 text-base bg-dark-800 hover:bg-dark-700 border-dark-700">Contact Sales</Button>
                </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
         <div className="max-w-5xl mx-auto px-6">
            <div className="relative rounded-[2.5rem] bg-gradient-to-r from-brand-600 to-brand-700 overflow-hidden px-6 py-20 md:px-20 text-center shadow-2xl shadow-brand-500/20 group">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
               <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
               <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
               
               <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Ready to modernize your legal ops?</h2>
                  <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                     Join 500+ legal teams automating their contracts with Agreemetrix AI. Start your free 14-day trial today.
                  </p>
                  <Link to="/signup">
                     <button className="bg-white text-brand-900 font-bold py-4 px-12 rounded-xl hover:bg-slate-100 hover:scale-105 transition-all shadow-xl text-lg">
                        Get Started for Free
                     </button>
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-950 pt-20 pb-10">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
               <Link to="/" className="mb-6 block hover:opacity-80">
                  <Logo />
               </Link>
               <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  The AI-native Contract Lifecycle Management platform for high-velocity teams. Automate, analyze, and accelerate.
               </p>
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-dark-900 border border-dark-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-dark-800 hover:border-dark-700 cursor-pointer transition-all"><Globe size={18}/></div>
                  <div className="w-10 h-10 bg-dark-900 border border-dark-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-dark-800 hover:border-dark-700 cursor-pointer transition-all"><Zap size={18}/></div>
                  <div className="w-10 h-10 bg-dark-900 border border-dark-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-dark-800 hover:border-dark-700 cursor-pointer transition-all"><Share2 size={18}/></div>
               </div>
            </div>
            
            <div>
               <h4 className="text-white font-bold mb-6">Product</h4>
               <ul className="space-y-3 text-sm text-slate-400">
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Features</li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Integrations</li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Security</li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Roadmap</li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Changelog</li>
               </ul>
            </div>

            <div>
               <h4 className="text-white font-bold mb-6">Company</h4>
               <ul className="space-y-3 text-sm text-slate-400">
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">About Us</li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Careers <Badge color="brand" className="ml-2 text-[9px] py-0">Hiring</Badge></li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Blog</li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Contact</li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Partners</li>
               </ul>
            </div>

            <div>
               <h4 className="text-white font-bold mb-6">Legal</h4>
               <ul className="space-y-3 text-sm text-slate-400">
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">Cookie Policy</li>
                  <li className="hover:text-brand-400 cursor-pointer transition-colors">DPA</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-xs">
            <p>&copy; 2024 Agreemetrix AI Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span>Systems Operational</span>
            </div>
         </div>
      </footer>

    </div>
  );
};

const BoxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

export default Landing;
