
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Logo } from '../components/UIComponents';
import { 
  ArrowRight, Shield, Zap, CheckCircle2, Globe, 
  BarChart2, Workflow, Lock, Bot, Search, ChevronRight,
  Menu, X, Check, Server, Users, CreditCard
} from 'lucide-react';

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
    <div className="min-h-screen bg-dark-950 text-slate-200 font-sans selection:bg-brand-500/30 scroll-smooth">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-dark-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="block hover:opacity-90 transition-opacity">
             <Logo />
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
             <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
             <button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors">Security</button>
             <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
             <Link to="/login">
                <Button variant="ghost" className="text-sm">Sign In</Button>
             </Link>
             <Link to="/signup">
                <Button variant="primary" className="shadow-lg shadow-brand-500/20">Get Started</Button>
             </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400 hover:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
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
         {/* Background Blobs */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>
         </div>

         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-300 mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
               </span>
               Agreemetrix AI 2.0 is now live
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight animate-in slide-in-from-bottom-8 fade-in duration-1000">
               Contract Management <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-purple-400">Reimagined by AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
               Accelerate deals, automate workflows, and uncover risks with the world's first AI-native CLM platform designed for modern legal teams.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
               <Link to="/signup" className="w-full md:w-auto">
                  <Button variant="primary" className="h-14 px-8 text-lg w-full md:w-auto shadow-[0_0_40px_rgba(var(--color-brand-500),0.3)]">
                     Start Free Trial <ArrowRight className="ml-2" />
                  </Button>
               </Link>
               <Link to="/login" className="w-full md:w-auto">
                  <Button variant="secondary" className="h-14 px-8 text-lg w-full md:w-auto bg-dark-800/50 border-dark-700 hover:bg-dark-800">
                     View Demo
                  </Button>
               </Link>
            </div>

            {/* Hero Image / UI Mockup */}
            <div className="mt-20 relative max-w-5xl mx-auto animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-500">
               <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl opacity-30 blur-lg"></div>
               <div className="relative rounded-xl border border-white/10 bg-dark-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-dark-950/50">
                     <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                     </div>
                     <div className="flex-1 text-center">
                        <div className="inline-block px-3 py-1 rounded-md bg-dark-800 text-[10px] text-slate-500 font-mono border border-dark-700">
                           app.agreemetrix.ai/dashboard
                        </div>
                     </div>
                  </div>
                  <div className="aspect-[16/9] bg-dark-950 relative overflow-hidden group">
                     {/* Abstract UI Representation */}
                     <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px]"></div>
                     
                     {/* Floating Elements */}
                     <div className="absolute top-12 left-12 right-12 flex gap-6">
                        <div className="w-64 h-full space-y-4 hidden md:block">
                           <div className="h-8 w-32 bg-dark-800 rounded-lg"></div>
                           <div className="h-4 w-24 bg-dark-800/50 rounded-lg"></div>
                           <div className="h-4 w-20 bg-dark-800/50 rounded-lg"></div>
                        </div>
                        <div className="flex-1 space-y-6">
                           <div className="flex gap-4">
                              <div className="flex-1 h-32 bg-dark-800/50 rounded-xl border border-white/5 relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
                              </div>
                              <div className="flex-1 h-32 bg-dark-800/50 rounded-xl border border-white/5 relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                              </div>
                              <div className="flex-1 h-32 bg-dark-800/50 rounded-xl border border-white/5 relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                              </div>
                           </div>
                           <div className="h-64 bg-dark-800/30 rounded-xl border border-white/5"></div>
                        </div>
                     </div>

                     {/* AI Overlay */}
                     <div className="absolute bottom-8 right-8 bg-dark-900/90 backdrop-blur-md p-4 rounded-xl border border-brand-500/30 shadow-2xl max-w-xs animate-bounce-subtle">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-1.5 bg-brand-500/20 rounded text-brand-400"><Bot size={16}/></div>
                           <span className="text-xs font-bold text-white">AI Risk Alert</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                           I've detected a missing <strong>Indemnity Cap</strong> in the latest Vendor Agreement draft.
                        </p>
                        <div className="mt-3 flex gap-2">
                           <button className="flex-1 py-1.5 bg-brand-600 text-white text-[10px] font-bold rounded hover:bg-brand-500">Auto-Fix</button>
                           <button className="flex-1 py-1.5 bg-white/5 text-slate-400 text-[10px] font-bold rounded hover:bg-white/10">Ignore</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Logos */}
      <section className="py-10 border-y border-white/5 bg-dark-900/50">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Trusted by modern legal teams</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="text-xl font-bold text-white flex items-center gap-2"><Globe size={24}/> ACME Corp</div>
               <div className="text-xl font-bold text-white flex items-center gap-2"><Zap size={24}/> TechFlow</div>
               <div className="text-xl font-bold text-white flex items-center gap-2"><Shield size={24}/> SecureNet</div>
               <div className="text-xl font-bold text-white flex items-center gap-2"><BoxIcon /> Stratos</div>
               <div className="text-xl font-bold text-white flex items-center gap-2"><Globe size={24}/> Global Inc</div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to manage contracts</h2>
               <p className="text-slate-400 max-w-2xl mx-auto">From generation to negotiation to signature, Agreemetrix unifies your entire legal workflow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Feature 1 */}
               <div className="p-8 rounded-2xl bg-dark-900 border border-dark-800 hover:border-brand-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-400 mb-6 group-hover:scale-110 transition-transform">
                     <Bot size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">AI Risk Detection</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Automatically scan third-party paper for deviations from your playbook. Identify risky clauses in seconds.
                  </p>
               </div>

               {/* Feature 2 */}
               <div className="p-8 rounded-2xl bg-dark-900 border border-dark-800 hover:border-purple-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                     <Workflow size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Visual Workflow Builder</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Design complex approval routing with a drag-and-drop interface. Automate handoffs between Legal, Sales, and Finance.
                  </p>
               </div>

               {/* Feature 3 */}
               <div className="p-8 rounded-2xl bg-dark-900 border border-dark-800 hover:border-blue-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                     <BarChart2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Intelligence & Analytics</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Turn static documents into structured data. Track renewal dates, obligations, and cycle times in real-time.
                  </p>
               </div>
               
                {/* Feature 4 */}
               <div className="p-8 rounded-2xl bg-dark-900 border border-dark-800 hover:border-yellow-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                     <Search size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Smart Repository</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Find any contract instantly with semantic search. Filter by counterparty, value, region, or clause type.
                  </p>
               </div>

               {/* Feature 5 */}
               <div className="p-8 rounded-2xl bg-dark-900 border border-dark-800 hover:border-green-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform">
                     <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Compliance Tracking</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Stay compliant with GDPR, CCPA, and other regulations. Track obligations and receive alerts before breaches occur.
                  </p>
               </div>

               {/* Feature 6 */}
               <div className="p-8 rounded-2xl bg-dark-900 border border-dark-800 hover:border-red-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform">
                     <Lock size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Enterprise Security</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Bank-grade encryption, SSO, and granular role-based access control (RBAC) to keep your sensitive data safe.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-dark-900/30 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row gap-16 items-center">
                  <div className="flex-1">
                      <Badge color="green" className="mb-4">Enterprise Grade</Badge>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Uncompromising Security & Compliance</h2>
                      <p className="text-slate-400 text-lg leading-relaxed mb-8">
                          Your data is protected by state-of-the-art encryption and strict access controls. We meet the highest standards for data privacy and sovereignty.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0"><Server size={16}/></div>
                              <div>
                                  <h4 className="font-bold text-white">SOC 2 Type II</h4>
                                  <p className="text-sm text-slate-500">Certified compliant</p>
                              </div>
                          </div>
                          <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0"><Lock size={16}/></div>
                              <div>
                                  <h4 className="font-bold text-white">AES-256 Encryption</h4>
                                  <p className="text-sm text-slate-500">At rest and in transit</p>
                              </div>
                          </div>
                          <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0"><Globe size={16}/></div>
                              <div>
                                  <h4 className="font-bold text-white">Data Sovereignty</h4>
                                  <p className="text-sm text-slate-500">US & EU Hosting</p>
                              </div>
                          </div>
                          <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0"><Users size={16}/></div>
                              <div>
                                  <h4 className="font-bold text-white">SSO & RBAC</h4>
                                  <p className="text-sm text-slate-500">Granular controls</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="flex-1 relative">
                      <div className="absolute -inset-4 bg-brand-500/10 rounded-full blur-3xl"></div>
                      <div className="relative bg-dark-950 border border-dark-700 rounded-2xl p-8 shadow-2xl">
                          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                              <span className="text-white font-bold flex items-center gap-2"><Shield size={18} className="text-green-500"/> Security Audit Log</span>
                              <span className="text-xs text-slate-500">Live Monitor</span>
                          </div>
                          <div className="space-y-4 font-mono text-xs">
                              <div className="flex justify-between items-center text-green-400">
                                  <span>[10:42:15] Encryption Handshake</span>
                                  <span>SUCCESS</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-400">
                                  <span>[10:42:18] User Login (SSO)</span>
                                  <span>VERIFIED</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-400">
                                  <span>[10:42:22] Document Access Request</span>
                                  <span>GRANTED</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-400">
                                  <span>[10:43:05] Backup Sync</span>
                                  <span>COMPLETE</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
               <p className="text-slate-400 max-w-2xl mx-auto">Start for free, scale as you grow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Starter */}
                <div className="p-8 rounded-2xl bg-dark-900 border border-dark-700 hover:border-dark-600 transition-all flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2">Starter</h3>
                    <div className="text-3xl font-bold text-white mb-6">$0 <span className="text-sm text-slate-500 font-normal">/ mo</span></div>
                    <p className="text-slate-400 text-sm mb-8">Perfect for small teams getting organized.</p>
                    <ul className="space-y-4 mb-8 flex-1">
                        {['Up to 50 Contracts', 'Basic Search', '1 Workflow Template', 'Email Support'].map((item,i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <Check size={16} className="text-slate-500" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/signup">
                        <Button variant="secondary" className="w-full">Get Started</Button>
                    </Link>
                </div>

                {/* Pro */}
                <div className="p-8 rounded-2xl bg-dark-900 border border-brand-500 relative flex flex-col shadow-[0_0_30px_rgba(var(--color-brand-500),0.15)]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
                    <h3 className="text-lg font-bold text-white mb-2">Growth</h3>
                    <div className="text-3xl font-bold text-white mb-6">$49 <span className="text-sm text-slate-500 font-normal">/ user / mo</span></div>
                    <p className="text-slate-400 text-sm mb-8">For growing legal teams needing automation.</p>
                    <ul className="space-y-4 mb-8 flex-1">
                        {['Unlimited Contracts', 'AI Risk Analysis', '5 Workflow Templates', 'Integrations (Slack/Salesforce)', 'Priority Support'].map((item,i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-white">
                                <Check size={16} className="text-brand-400" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/signup">
                        <Button variant="primary" className="w-full shadow-lg shadow-brand-500/20">Start Free Trial</Button>
                    </Link>
                </div>

                {/* Enterprise */}
                <div className="p-8 rounded-2xl bg-dark-900 border border-dark-700 hover:border-dark-600 transition-all flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2">Enterprise</h3>
                    <div className="text-3xl font-bold text-white mb-6">Custom</div>
                    <p className="text-slate-400 text-sm mb-8">For large organizations requiring control.</p>
                    <ul className="space-y-4 mb-8 flex-1">
                        {['Unlimited Everything', 'SSO & RBAC', 'Custom AI Models', 'Dedicated Success Manager', 'SLA Guarantees'].map((item,i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <Check size={16} className="text-purple-400" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Button variant="secondary" className="w-full">Contact Sales</Button>
                </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
         <div className="max-w-5xl mx-auto px-6">
            <div className="relative rounded-3xl bg-brand-600 overflow-hidden px-6 py-16 md:px-16 text-center shadow-2xl shadow-brand-500/20">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
               <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/20 rounded-full blur-3xl"></div>
               
               <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to modernize your legal ops?</h2>
                  <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
                     Join 500+ legal teams automating their contracts with Agreemetrix AI. Start your free 14-day trial today.
                  </p>
                  <Link to="/signup">
                     <button className="bg-white text-brand-600 font-bold py-4 px-10 rounded-xl hover:bg-brand-50 transition-colors shadow-xl">
                        Get Started for Free
                     </button>
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-900 pt-16 pb-8">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
               <Link to="/" className="mb-4 block hover:opacity-80">
                  <Logo />
               </Link>
               <p className="text-slate-500 text-sm mb-6">
                  The AI-native Contract Lifecycle Management platform for high-velocity teams.
               </p>
               <div className="flex gap-4">
                  <div className="w-8 h-8 bg-dark-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors"><Globe size={16}/></div>
                  <div className="w-8 h-8 bg-dark-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors"><Zap size={16}/></div>
               </div>
            </div>
            
            <div>
               <h4 className="text-white font-bold mb-4">Product</h4>
               <ul className="space-y-2 text-sm text-slate-400">
                  <li className="hover:text-brand-400 cursor-pointer">Features</li>
                  <li className="hover:text-brand-400 cursor-pointer">Integrations</li>
                  <li className="hover:text-brand-400 cursor-pointer">Security</li>
                  <li className="hover:text-brand-400 cursor-pointer">Roadmap</li>
               </ul>
            </div>

            <div>
               <h4 className="text-white font-bold mb-4">Company</h4>
               <ul className="space-y-2 text-sm text-slate-400">
                  <li className="hover:text-brand-400 cursor-pointer">About Us</li>
                  <li className="hover:text-brand-400 cursor-pointer">Careers</li>
                  <li className="hover:text-brand-400 cursor-pointer">Blog</li>
                  <li className="hover:text-brand-400 cursor-pointer">Contact</li>
               </ul>
            </div>

            <div>
               <h4 className="text-white font-bold mb-4">Legal</h4>
               <ul className="space-y-2 text-sm text-slate-400">
                  <li className="hover:text-brand-400 cursor-pointer">Privacy Policy</li>
                  <li className="hover:text-brand-400 cursor-pointer">Terms of Service</li>
                  <li className="hover:text-brand-400 cursor-pointer">Cookie Policy</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
            &copy; 2024 Agreemetrix AI Inc. All rights reserved.
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