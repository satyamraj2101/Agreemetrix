
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Logo } from '../components/UIComponents';
import { 
  ArrowRight, Shield, Zap, CheckCircle2, Globe, 
  BarChart2, Workflow, Lock, Bot, Search, ChevronRight,
  Menu, X, Check, Server, Users, CreditCard, Sparkles,
  Cpu, FileText, LayoutTemplate, Share2, MousePointer2,
  Play, GitBranch, Activity, Box, AlertTriangle
} from 'lucide-react';

// --- VISUAL COMPONENTS ---

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
  </div>
);

const GlowingOrb = ({ color = "brand", size = "large", position = "top-left", delay = 0 }: { color?: string, size?: string, position?: string, delay?: number }) => {
    const colorMap: Record<string, string> = {
        brand: "bg-brand-500",
        purple: "bg-purple-500",
        blue: "bg-blue-500",
    };
    const sizeMap: Record<string, string> = {
        small: "w-64 h-64 blur-[80px]",
        medium: "w-96 h-96 blur-[100px]",
        large: "w-[500px] h-[500px] blur-[120px]",
    };
    const posMap: Record<string, string> = {
        "top-left": "top-[-10%] left-[-10%]",
        "top-right": "top-[-10%] right-[-10%]",
        "bottom-left": "bottom-[-10%] left-[-10%]",
        "bottom-right": "bottom-[-10%] right-[-10%]",
        "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    };

    return (
        <div 
            className={`absolute ${posMap[position]} ${sizeMap[size]} ${colorMap[color]} rounded-full opacity-20 animate-blob mix-blend-screen pointer-events-none`}
            style={{ animationDelay: `${delay}s` }}
        ></div>
    );
};

// Enhanced Hero Graphic with 3D Tilt
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
      className="relative w-full max-w-7xl mx-auto perspective-1000 py-20 group"
      style={{ perspective: '2000px' }}
    >
      <div 
        className="relative transition-transform duration-100 ease-out will-change-transform transform-gpu"
        style={{
          transform: `rotateY(${mousePosition.x * 2}deg) rotateX(${mousePosition.y * -2}deg)`
        }}
      >
        {/* Glow Effect behind the board */}
        <div className="absolute -inset-2 bg-gradient-to-r from-brand-500 via-blue-500 to-purple-600 rounded-2xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
        
        {/* Main Dashboard Mockup */}
        <div className="relative bg-[#0B0E14] border border-white/10 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/5">
          {/* Mockup Header */}
          <div className="h-12 border-b border-white/5 bg-white/[0.02] backdrop-blur flex items-center px-4 justify-between">
             <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
             </div>
             <div className="flex-1 flex justify-center">
                <div className="bg-black/40 px-4 py-1.5 rounded-md border border-white/5 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <Lock size={10} /> app.agreemetrix.ai
                </div>
             </div>
             <div className="flex gap-3">
                <div className="w-20 h-2 bg-white/5 rounded-full"></div>
             </div>
          </div>

          {/* Mockup Body */}
          <div className="p-8 grid grid-cols-12 gap-8 bg-dark-950 relative min-h-[500px]">
             {/* Grid Pattern Overlay */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
             
             {/* Sidebar Mock */}
             <div className="col-span-2 hidden md:flex flex-col gap-4 border-r border-white/5 pr-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                        <LayoutTemplate size={16} className="text-brand-400"/>
                    </div>
                    <div className="h-3 w-20 bg-white/10 rounded"></div>
                </div>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                        <div className="w-4 h-4 rounded bg-white/10"></div>
                        <div className="h-2 w-16 bg-white/10 rounded"></div>
                    </div>
                ))}
             </div>

             {/* Content Mock */}
             <div className="col-span-12 md:col-span-10 flex flex-col gap-8">
                
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <div className="h-8 w-48 bg-white/10 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 w-32 bg-white/5 rounded"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-8 w-24 bg-brand-500/20 border border-brand-500/30 rounded"></div>
                        <div className="h-8 w-8 bg-white/5 border border-white/10 rounded"></div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                   {[
                       { color: 'brand', val: '$1.2M', label: 'Pipeline' },
                       { color: 'purple', val: '14', label: 'Pending Review' },
                       { color: 'blue', val: '98%', label: 'Compliance' }
                   ].map((stat, i) => (
                       <div key={i} className={`h-28 bg-white/[0.02] border border-white/5 rounded-xl p-5 relative overflow-hidden group/card hover:border-white/10 transition-colors`}>
                          <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-500/5 rounded-full blur-xl -mr-5 -mt-5 transition-all group-hover/card:bg-${stat.color}-500/10`}></div>
                          <div className="relative z-10">
                              <div className="text-xs text-slate-500 font-bold uppercase mb-2">{stat.label}</div>
                              <div className="text-2xl font-bold text-white">{stat.val}</div>
                              <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className={`h-full w-2/3 bg-${stat.color}-500/50 rounded-full`}></div>
                              </div>
                          </div>
                       </div>
                   ))}
                </div>

                {/* Main Workspace / Graph */}
                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-1 relative overflow-hidden flex flex-col">
                   <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                   
                   <div className="flex-1 relative p-6">
                       {/* Fake Graph Lines */}
                       <div className="absolute inset-0 flex items-end justify-between px-8 pb-0 pt-16 gap-4 opacity-50">
                          {[30, 50, 45, 60, 80, 70, 90, 65, 85, 95].map((h, i) => (
                             <div 
                                key={i} 
                                className="w-full bg-gradient-to-t from-brand-500/10 to-brand-500/40 rounded-t-sm transition-all duration-1000 ease-in-out hover:to-brand-400"
                                style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}
                             ></div>
                          ))}
                       </div>
                       
                       {/* Floating UI Elements */}
                       <div className="absolute top-8 right-8 bg-dark-900/90 backdrop-blur border border-brand-500/30 p-4 rounded-lg shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300 z-20">
                           <div className="flex items-center gap-3 mb-2">
                               <Bot size={16} className="text-brand-400"/>
                               <span className="text-xs font-bold text-white">AI Risk Alert</span>
                           </div>
                           <div className="h-1 w-full bg-brand-500/20 rounded mb-2"></div>
                           <div className="h-1 w-2/3 bg-brand-500/20 rounded"></div>
                       </div>

                       <div className="absolute bottom-8 left-8 bg-dark-900/90 backdrop-blur border border-white/10 p-3 rounded-lg shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300 z-20 flex gap-3 items-center">
                           <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                               <Zap size={14}/>
                           </div>
                           <div>
                               <div className="h-2 w-20 bg-white/20 rounded mb-1"></div>
                               <div className="h-2 w-12 bg-white/10 rounded"></div>
                           </div>
                       </div>
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
      
      <GridBackground />
      <GlowingOrb color="purple" size="large" position="top-right" />
      <GlowingOrb color="brand" size="medium" position="bottom-left" delay={2} />

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
         <div className="flex gap-16 animate-marquee whitespace-nowrap min-w-full items-center opacity-50 hover:opacity-80 transition-opacity duration-500">
            {[...Array(2)].map((_, i) => (
               <React.Fragment key={i}>
                  <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Globe size={24} className="text-brand-500"/> Global Inc</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Zap size={24} className="text-yellow-500"/> TechFlow</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Shield size={24} className="text-green-500"/> SecureNet</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Box size={24} className="text-purple-500"/> Stratos</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><CreditCard size={24} className="text-blue-500"/> FinCorp</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Users size={24} className="text-pink-500"/> TeamWorks</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Server size={24} className="text-orange-500"/> CloudSys</div>
               </React.Fragment>
            ))}
         </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-32 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
               <Badge color="brand" className="mb-4">Powerhouse Features</Badge>
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Intelligent Contract Operations</h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                  A complete suite of tools designed to replace fragmentation with flow.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Large Feature 1 */}
               <div className="md:col-span-2 p-8 rounded-3xl bg-dark-900/50 border border-white/10 hover:border-brand-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="mb-8">
                        <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4 text-brand-400">
                           <Bot size={24}/>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">AI Risk Agent</h3>
                        <p className="text-slate-400">Instantly scans third-party paper against your playbook. Detects deviations in liability caps, indemnity, and governing law with 99% accuracy.</p>
                     </div>
                     <div className="bg-dark-950/50 rounded-xl p-4 border border-white/5 backdrop-blur-sm transform group-hover:scale-[1.02] transition-transform duration-500">
                        <div className="flex items-center gap-3 text-sm text-slate-300 mb-2">
                           <AlertTriangle size={14} className="text-red-400"/>
                           <span>Risk Detected: <strong>Unlimited Liability</strong></span>
                        </div>
                        <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                           <div className="h-full bg-red-500 w-[85%] animate-pulse"></div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Feature 2 */}
               <div className="p-8 rounded-3xl bg-dark-900/50 border border-white/10 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                     <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-400">
                        <Workflow size={24}/>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Visual Workflows</h3>
                     <p className="text-slate-400 text-sm">Drag-and-drop builder for complex approvals. Route based on value, region, or risk score.</p>
                  </div>
               </div>

               {/* Feature 3 */}
               <div className="p-8 rounded-3xl bg-dark-900/50 border border-white/10 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                     <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-400">
                        <BarChart2 size={24}/>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Deep Analytics</h3>
                     <p className="text-slate-400 text-sm">Uncover bottlenecks and revenue leakage. Track cycle times and obligation fulfillment rates.</p>
                  </div>
               </div>

               {/* Large Feature 4 */}
               <div className="md:col-span-2 p-8 rounded-3xl bg-dark-900/50 border border-white/10 hover:border-green-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                     <div className="flex-1">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 text-green-400">
                           <CheckCircle2 size={24}/>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Smart Compliance</h3>
                        <p className="text-slate-400">Never miss a renewal or obligation. The system auto-extracts dates and deliverables, notifying owners before it's too late.</p>
                     </div>
                     <div className="w-full md:w-64 bg-dark-950/50 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                        {[1,2,3].map(i => (
                           <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                              <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[10px]">
                                 <Check size={10}/>
                              </div>
                              <div className="h-2 w-32 bg-white/10 rounded"></div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
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

export default Landing;
