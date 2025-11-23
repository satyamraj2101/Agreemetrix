
import React, { useState } from 'react';
import { Card, Button, Select, Badge } from '../components/UIComponents';
import { 
  BarChart3, TrendingUp, Activity, Bot, Sparkles, ArrowRight, 
  Download, Share2, AlertTriangle, Clock, DollarSign, 
  Layers, ChevronDown, X, Maximize2, RefreshCw, 
  TrendingDown, Users, Briefcase, CheckCircle2, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, AreaChart, Area, LineChart, 
  Line, Pie, PieChart, Cell, Legend 
} from 'recharts';

// --- Mock Data ---

const LIFECYCLE_DATA = [
  { stage: 'Draft', days: 2.5, benchmark: 3 },
  { stage: 'Review', days: 5.2, benchmark: 4 },
  { stage: 'Negotiation', days: 8.5, benchmark: 6 },
  { stage: 'Approval', days: 1.8, benchmark: 2 },
  { stage: 'Signature', days: 1.2, benchmark: 1.5 },
];

const PIPELINE_DATA = [
  { month: 'Jan', created: 45, completed: 38, value: 1200000 },
  { month: 'Feb', created: 52, completed: 45, value: 1450000 },
  { month: 'Mar', created: 48, completed: 50, value: 1600000 },
  { month: 'Apr', created: 61, completed: 55, value: 1900000 },
  { month: 'May', created: 55, completed: 58, value: 1750000 },
  { month: 'Jun', created: 72, completed: 65, value: 2200000 },
];

const RISK_DISTRIBUTION = [
  { name: 'Low Risk', value: 65, color: '#10b981' },
  { name: 'Medium Risk', value: 25, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#ef4444' },
];

const CLAUSE_DEVIATION = [
  { clause: 'Liability Cap', standard: 85, modified: 15 },
  { clause: 'Indemnification', standard: 92, modified: 8 },
  { clause: 'Termination', standard: 78, modified: 22 },
  { clause: 'Payment Terms', standard: 95, modified: 5 },
  { clause: 'Governing Law', standard: 98, modified: 2 },
];

const REVENUE_DATA = [
  { region: 'North America', retained: 4500, leakage: 120 },
  { region: 'EMEA', retained: 3200, leakage: 450 },
  { region: 'APAC', retained: 2100, leakage: 80 },
  { region: 'LATAM', retained: 900, leakage: 150 },
];

const WORKLOAD_DATA = [
  { user: 'Legal Team A', reviews: 45, drafting: 12, sla: 95 },
  { user: 'Legal Team B', reviews: 32, drafting: 28, sla: 88 },
  { user: 'Ext Counsel', reviews: 15, drafting: 5, sla: 98 },
  { user: 'Procurement', reviews: 55, drafting: 8, sla: 82 },
];

const ALERTS = [
  { id: 1, type: 'critical', msg: "Vendor 'TechFlow' missed 3 critical obligations this quarter." },
  { id: 2, type: 'warning', msg: "Average review time for 'NDA' increased by 25% this week." },
  { id: 3, type: 'info', msg: "12 High-value contracts expiring in next 30 days." },
];

// --- Sub-Components ---

const ReportCard: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  className?: string; 
  onDrillDown?: () => void;
}> = ({ title, children, className = '', onDrillDown }) => (
  <div className={`bg-dark-900/60 border border-dark-700 rounded-2xl backdrop-blur-md overflow-hidden flex flex-col shadow-lg hover:border-brand-500/30 transition-all duration-300 group ${className}`}>
    <div className="p-5 border-b border-white/5 flex justify-between items-center bg-dark-950/30">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        {title}
      </h3>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors" title="Export Data">
           <Download size={14}/>
        </button>
        <button onClick={onDrillDown} className="p-1.5 hover:bg-brand-500/20 rounded text-slate-400 hover:text-brand-400 transition-colors" title="Drill Down">
           <Maximize2 size={14}/>
        </button>
      </div>
    </div>
    <div className="p-5 flex-1 min-h-0 relative">
      {children}
    </div>
  </div>
);

const AnomalyTicker = () => (
  <div className="w-full bg-dark-950/80 border-y border-brand-500/20 overflow-hidden h-10 flex items-center relative">
    <div className="absolute left-0 bg-dark-950 px-4 z-10 h-full flex items-center border-r border-brand-500/20">
       <span className="text-xs font-bold text-brand-400 flex items-center gap-2 uppercase tracking-wider">
          <Sparkles size={12} className="animate-pulse"/> Live AI Signals
       </span>
    </div>
    <div className="flex items-center animate-marquee whitespace-nowrap pl-40 hover:animation-pause">
       {ALERTS.map(alert => (
          <div key={alert.id} className="flex items-center gap-2 mx-8 text-xs">
             {alert.type === 'critical' ? <AlertTriangle size={12} className="text-red-500"/> : 
              alert.type === 'warning' ? <Activity size={12} className="text-yellow-500"/> : 
              <Bot size={12} className="text-blue-500"/>}
             <span className={`font-medium ${alert.type === 'critical' ? 'text-red-300' : 'text-slate-300'}`}>
                {alert.msg}
             </span>
          </div>
       ))}
    </div>
  </div>
);

// --- Main Page ---

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'executive' | 'risk' | 'financial' | 'ops'>('executive');
  const [timeRange, setTimeRange] = useState('This Quarter');
  const [aiQuery, setAiQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiSearch = () => {
     if(!aiQuery) return;
     setIsGenerating(true);
     setTimeout(() => {
        setIsGenerating(false);
        setAiQuery('');
     }, 1500);
  };

  return (
    <div className="pb-10 space-y-6 relative">
      {/* Anomaly Ticker */}
      <div className="-mx-6 -mt-6 mb-6">
         <AnomalyTicker />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
         <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Intelligence Hub</h1>
            <p className="text-slate-400">Comprehensive analytics for contract lifecycle, risk, and performance.</p>
         </div>
         <div className="flex gap-3">
            <Select 
               options={['Last 30 Days', 'This Quarter', 'Year to Date', 'Last Year'].map(t => ({label: t, value: t}))}
               value={timeRange}
               onChange={(e) => setTimeRange(e.target.value)}
               className="w-40 bg-dark-900 border-dark-700"
            />
            <Button variant="primary" className="shadow-lg shadow-brand-500/20">
               <Download size={16} className="mr-2"/> Export
            </Button>
         </div>
      </div>

      {/* AI Conversational Interface */}
      <div className="relative max-w-3xl mx-auto mb-12 group">
         <div className={`absolute -inset-1 bg-gradient-to-r from-brand-500 via-purple-500 to-blue-500 rounded-2xl opacity-30 blur transition-opacity duration-500 ${isGenerating ? 'opacity-60 animate-pulse' : 'group-hover:opacity-50'}`}></div>
         <div className="relative bg-dark-900 border border-white/10 rounded-2xl p-1 flex items-center shadow-2xl">
            <div className="p-3 text-brand-400">
               {isGenerating ? <RefreshCw size={20} className="animate-spin"/> : <Bot size={20}/>}
            </div>
            <input 
               type="text"
               placeholder="Ask Agreemetrix (e.g., 'Show me revenue leakage by region' or 'Identify negotiation bottlenecks')"
               className="flex-1 bg-transparent border-none text-white px-2 py-3 focus:ring-0 placeholder-slate-500 outline-none font-medium"
               value={aiQuery}
               onChange={(e) => setAiQuery(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            />
            <button onClick={handleAiSearch} className="p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors shadow-lg m-1">
               <ArrowRight size={18}/>
            </button>
         </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="flex border-b border-white/5 overflow-x-auto">
         {[
            {id: 'executive', label: 'Executive Overview', icon: Layers},
            {id: 'risk', label: 'Risk & Compliance', icon: AlertTriangle},
            {id: 'financial', label: 'Financial Performance', icon: DollarSign},
            {id: 'ops', label: 'Operational Efficiency', icon: Clock},
         ].map(tab => (
            <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-6 py-4 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-brand-500 text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
               <tab.icon size={16}/>
               {tab.label}
            </button>
         ))}
      </div>

      {/* --- DASHBOARD CONTENT --- */}
      
      {/* 1. EXECUTIVE TAB */}
      {activeTab === 'executive' && (
         <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {[
                  { label: 'Pipeline Value', val: '$14.2M', change: '+12%', color: 'text-green-400' },
                  { label: 'Avg Cycle Time', val: '14.5 Days', change: '-2.1 Days', color: 'text-blue-400' },
                  { label: 'Active Contracts', val: '1,248', change: '+45', color: 'text-white' },
                  { label: 'Critical Risks', val: '12', change: '+2', color: 'text-red-400' },
               ].map((kpi, i) => (
                  <div key={i} className="bg-dark-900/50 border border-dark-700 p-5 rounded-2xl backdrop-blur-sm hover:border-brand-500/30 transition-colors">
                     <p className="text-xs text-slate-500 font-bold uppercase mb-1">{kpi.label}</p>
                     <h3 className={`text-3xl font-bold ${kpi.color} mb-2`}>{kpi.val}</h3>
                     <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-xs font-medium text-slate-300 border border-white/5">
                        <TrendingUp size={12}/> {kpi.change}
                     </div>
                  </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Pipeline Trend */}
               <ReportCard title="Contract Velocity & Volume" className="lg:col-span-2 h-96">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={PIPELINE_DATA}>
                        <defs>
                           <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`}/>
                        <Tooltip 
                           contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px'}}
                           itemStyle={{fontSize: '12px'}}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="value" name="Pipeline Value ($)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        <Line type="monotone" dataKey="created" name="New Contracts" stroke="#2dd4bf" strokeWidth={2} dot={false} />
                     </AreaChart>
                  </ResponsiveContainer>
               </ReportCard>

               {/* Stage Breakdown */}
               <ReportCard title="Lifecycle Stage Analysis" className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={LIFECYCLE_DATA} layout="vertical" margin={{left: 20}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" fontSize={12} hide/>
                        <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={11} width={70} axisLine={false} tickLine={false}/>
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                        <Bar dataKey="days" name="Avg Days" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20}>
                           {LIFECYCLE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 2 ? '#f59e0b' : '#8b5cf6'} />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center text-xs text-slate-500">
                     <span className="text-yellow-500 font-bold">Negotiation</span> is taking 40% longer than benchmark.
                  </div>
               </ReportCard>
            </div>
         </div>
      )}

      {/* 2. RISK TAB */}
      {activeTab === 'risk' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <ReportCard title="Risk Distribution" className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={RISK_DISTRIBUTION}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {RISK_DISTRIBUTION.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                     <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                     <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
               </ResponsiveContainer>
            </ReportCard>

            <ReportCard title="Clause Deviation Hotspots" className="lg:col-span-2 h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CLAUSE_DEVIATION} margin={{top: 20}}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis dataKey="clause" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false}/>
                     <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                     <Legend />
                     <Bar dataKey="standard" name="Standard Terms" stackId="a" fill="#10b981" barSize={40} />
                     <Bar dataKey="modified" name="Modified Terms" stackId="a" fill="#ef4444" barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </ReportCard>
         </div>
      )}

      {/* 3. FINANCIAL TAB */}
      {activeTab === 'financial' && (
         <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-dark-900 border border-dark-700 p-5 rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Revenue Leakage</p>
                  <h3 className="text-2xl font-bold text-red-400">$820k</h3>
                  <p className="text-xs text-slate-400 mt-1">Missed renewals & penalties</p>
               </div>
               <div className="bg-dark-900 border border-dark-700 p-5 rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Cost Savings</p>
                  <h3 className="text-2xl font-bold text-green-400">$1.2M</h3>
                  <p className="text-xs text-slate-400 mt-1">Through consolidation</p>
               </div>
               <div className="bg-dark-900 border border-dark-700 p-5 rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Obligation Value</p>
                  <h3 className="text-2xl font-bold text-blue-400">$15.8M</h3>
                  <p className="text-xs text-slate-400 mt-1">Total committed spend</p>
               </div>
            </div>

            <ReportCard title="Regional Revenue Analysis" className="h-96">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis dataKey="region" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false}/>
                     <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false}/>
                     <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} 
                        formatter={(value: number) => [`$${value}k`, '']}
                     />
                     <Legend />
                     <Bar dataKey="retained" name="Retained Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                     <Bar dataKey="leakage" name="Leakage / Missed" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </ReportCard>
         </div>
      )}

      {/* 4. OPS TAB */}
      {activeTab === 'ops' && (
         <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ReportCard title="Team Workload & Performance" className="h-96">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WORKLOAD_DATA} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                     <XAxis type="number" stroke="#64748b" fontSize={12}/>
                     <YAxis dataKey="user" type="category" stroke="#94a3b8" fontSize={11} width={100} axisLine={false} tickLine={false}/>
                     <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                     <Legend />
                     <Bar dataKey="reviews" name="Contracts Reviewed" stackId="a" fill="#8b5cf6" barSize={20} />
                     <Bar dataKey="drafting" name="Contracts Drafted" stackId="a" fill="#06b6d4" barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </ReportCard>
         </div>
      )}
    </div>
  );
};

export default Reports;
