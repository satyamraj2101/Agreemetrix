
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Logo } from '../components/UIComponents';
import { ArrowLeft, Check, Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, Zap, Users, HelpCircle, ChevronRight } from 'lucide-react';

interface AuthProps {
  mode: 'login' | 'signup';
}

const Auth: React.FC<AuthProps> = ({ mode: initialMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const navigate = useNavigate();

  const features = [
    { 
      icon: ShieldCheck, 
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      title: "Bank-Grade Security", 
      desc: "SOC2 Type II Certified protection with end-to-end encryption for all your legal documents." 
    },
    { 
      icon: Zap, 
      color: 'text-brand-400',
      bg: 'bg-brand-500/10',
      title: "AI-Powered Analysis", 
      desc: "Instant risk detection, clause extraction, and automated redlining suggestions." 
    },
    { 
      icon: Users, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      title: "Collaborative Workflows", 
      desc: "Streamlined approval chains and real-time negotiation tools for your entire team." 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen w-full bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-brand-500/30 text-slate-200">
      
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
      </div>

      {/* Navigation Back - Enhanced */}
      <Link to="/" className="absolute top-6 left-6 z-30 flex items-center gap-2 px-5 py-2.5 rounded-full bg-dark-900/50 hover:bg-dark-800 border border-white/5 hover:border-brand-500/30 text-slate-400 hover:text-white transition-all duration-300 group backdrop-blur-md shadow-lg">
         <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-brand-400" /> 
         <span className="text-xs font-bold uppercase tracking-wide">Back to Home</span>
      </Link>

      {/* Help Button */}
      <button className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-dark-900/50 hover:bg-dark-800 border border-white/5 hover:border-brand-500/30 text-slate-400 hover:text-white transition-all backdrop-blur-md group" title="Need Help?">
        <HelpCircle size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Auth Card / Dialog */}
      <div className="relative z-10 w-full max-w-6xl h-[700px] bg-dark-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex overflow-hidden animate-in zoom-in-95 fade-in duration-500">
         
         {/* Left Panel: Interactive Feature Showcase */}
         <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-dark-900 via-dark-950 to-black relative flex-col p-12 justify-between border-r border-white/5 overflow-hidden">
            {/* Logo Area */}
            <div className="relative z-10">
               <Logo />
            </div>

            {/* Rotating Feature Carousel */}
            <div className="relative z-10 flex-1 flex flex-col justify-center">
               <div className="relative h-64">
                  {features.map((feat, idx) => (
                     <div 
                        key={idx}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col gap-6 ${idx === activeFeature ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
                     >
                        <div className={`w-16 h-16 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center shadow-xl ring-1 ring-white/10`}>
                           <feat.icon size={32} />
                        </div>
                        <div>
                           <h2 className="text-3xl font-bold text-white mb-3 leading-tight">{feat.title}</h2>
                           <p className="text-slate-400 text-lg leading-relaxed">{feat.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
               
               {/* Carousel Indicators */}
               <div className="flex gap-2 mt-8">
                  {features.map((_, idx) => (
                     <button 
                        key={idx}
                        onClick={() => setActiveFeature(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeFeature ? 'w-8 bg-brand-500' : 'w-2 bg-dark-700 hover:bg-dark-600'}`}
                     />
                  ))}
               </div>
            </div>

            {/* Footer/Trust */}
            <div className="relative z-10 pt-8 border-t border-white/5">
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Trusted by legal teams at</p>
               <div className="flex gap-6 opacity-40 grayscale">
                  <div className="h-6 w-20 bg-white/20 rounded"></div>
                  <div className="h-6 w-20 bg-white/20 rounded"></div>
                  <div className="h-6 w-20 bg-white/20 rounded"></div>
               </div>
            </div>
            
            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
         </div>

         {/* Right Panel: Form */}
         <div className="w-full lg:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-dark-950/60 relative">
            
            {/* Mobile Logo (visible only on small screens) */}
            <div className="lg:hidden absolute top-8 left-8">
               <Logo />
            </div>

            <div className="max-w-md mx-auto w-full">
               <div className="mb-10">
                  <h3 className="text-3xl font-bold text-white mb-3">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h3>
                  <p className="text-slate-400">
                     {mode === 'login' ? "Enter your details to access your workspace." : "Start your 14-day free trial. No credit card required."}
                  </p>
               </div>

               {/* Form */}
               <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === 'signup' && (
                     <div className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-300">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                           <input 
                              type="text" 
                              placeholder="e.g. Harvey Specter" 
                              className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-600 hover:border-dark-600"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                           />
                        </div>
                     </div>
                  )}
                  
                  <div className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-300 delay-75">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Work Email</label>
                     <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                        <input 
                           type="email" 
                           placeholder="name@company.com" 
                           className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-600 hover:border-dark-600"
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-300 delay-100">
                     <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                        {mode === 'login' && (
                           <a href="#" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</a>
                        )}
                     </div>
                     <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
                        <input 
                           type="password" 
                           placeholder="••••••••" 
                           className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-600 hover:border-dark-600"
                           required
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="pt-4 animate-in slide-in-from-bottom-2 duration-300 delay-150">
                     <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-full py-4 rounded-xl text-base font-bold shadow-lg shadow-brand-500/20 flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        disabled={isLoading}
                     >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        {!isLoading && <ArrowRight size={18} />}
                     </Button>
                  </div>
               </form>
               
               <div className="mt-8 relative">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                     <span className="bg-dark-950/50 px-4 text-slate-500 backdrop-blur-xl">Or continue with</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mt-8">
                  <button className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-dark-900 border border-dark-700 hover:bg-dark-800 hover:border-dark-600 text-white transition-all group">
                     <GoogleIcon /> 
                     <span className="text-sm font-medium group-hover:text-white">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-dark-900 border border-dark-700 hover:bg-dark-800 hover:border-dark-600 text-white transition-all group">
                     <MicrosoftIcon /> 
                     <span className="text-sm font-medium group-hover:text-white">Microsoft</span>
                  </button>
               </div>

               <div className="mt-10 text-center">
                  <p className="text-slate-400 text-sm">
                     {mode === 'login' ? "New to Agreemetrix?" : "Already have an account?"} 
                     <button 
                        onClick={toggleMode} 
                        className="text-brand-400 font-bold ml-2 hover:text-brand-300 hover:underline focus:outline-none transition-colors"
                     >
                        {mode === 'login' ? 'Create an account' : 'Sign in'}
                     </button>
                  </p>
               </div>
            </div>
         </div>
      </div>
      
      {/* Footer Links */}
      <div className="absolute bottom-6 left-0 w-full text-center">
         <div className="flex justify-center gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact Support</a>
         </div>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f35325" d="M1 1h10v10H1z"/>
    <path fill="#81bc06" d="M12 1h10v10H12z"/>
    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
    <path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
);

export default Auth;