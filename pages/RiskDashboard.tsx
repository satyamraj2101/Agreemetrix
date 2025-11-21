
import React, { useState } from 'react';
import { Card, Badge, Button, Select, Input } from '../components/UIComponents';
import { MOCK_RISKS, MOCK_CONTRACTS } from '../mock/data';
import { 
  ShieldAlert, Calendar, CheckSquare, AlertTriangle, ArrowUpRight, 
  Activity, Zap, Eye, Filter, Download, RefreshCw, BrainCircuit,
  Siren, TrendingUp, Lock, Globe, CheckCircle2, XOctagon, Clock,
  Shield, Search, FileText, Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, Tooltip, AreaChart, Area, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend 
} from 'recharts';

const RiskDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Q3 2024');
  const [scanning, setScanning] = useState(false);

  // --- MOCK DATA FOR VISUALIZATIONS ---

  const RADAR_DATA = [
    { subject: 'Financial', A: 120, B: 110, fullMark: 150 },
    { subject: 'Legal', A: 98, B: 130, fullMark: 150 },
    { subject: 'Operational', A: 86, B: 130, fullMark: 150 },
    { subject: 'Security', A: 99, B: 100, fullMark: 150 },
    { subject: 'Reputation', A: 85, B: 90, fullMark: 150 },
    { subject: 'Compliance', A: 65, B: 85, fullMark: 150 },
  ];

  const TREND_DATA = [
    { name: 'Week 1', risk: 45 },
    { name: 'Week 2', risk: 52 },
    { name: 'Week 3', risk: 48 },
    { name: 'Week 4', risk: 61 },
    { name: 'Week 5', risk: 55 },
    { name: 'Week 6', risk: 67 },
  ];

  const COMPLIANCE_DATA = [
    { name: 'Compliant', value: 85, color: '#10b981' },
    { name: 'At Risk', value: 10, color: '#f59e0b' },
    { name: 'Non-Compliant', value: 5, color: '#ef4444' },
  ];

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h2 className="text-2xl font-bold text-white tracking-wide">Risk & Obligations Command</h2>
             <Badge color="red" className="animate-pulse">Live Monitoring</Badge>
          </div>
          <p className="text-sm text-slate-400">Real-time analysis of contractual exposure and compliance gaps.</p>
        </div>
        <div className="flex gap-3">
           <Select 
              options={[{label: 'Global Portfolio', value: 'global'}, {label: 'North America', value: 'na'}, {label: 'EMEA', value: 'emea'}]} 
              className="w-40 bg-dark-900 border-dark-700"
           />
           <Button variant="secondary" onClick={handleScan} disabled={scanning} className="min-w-[140px]">
              {scanning ? <RefreshCw size={16} className="animate-spin mr-2"/> : <BrainCircuit size={16} className="mr-2"/>}
              {scanning ? 'Scanning...' : 'AI Risk Scan'}
           </Button>
           <Button variant="primary" className="shadow-lg shadow-red-500/20 bg-gradient-to-r from-red-600 to-orange-600 border-none hover:from-red-500 hover:to-orange-500">
              <ShieldAlert size={16} className="mr-2"/> Generate Report
           </Button>
        </div>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Global Risk Score */}
         <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-dark-900 to-dark-950 p-6 shadow-[0_0_40px_rgba(239,68,68,0.1)] group">
            <div className="absolute top-0 right-0 p-24 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-red-500/20 transition-colors duration-1000"></div>
            <div className="relative z-10 flex justify-between items-start">
               <div>
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                     <Activity size={14} className="animate-pulse"/> Global Risk Index
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                     <span className="text-5xl font-black text-white tracking-tight">67</span>
                     <span className="text-lg font-medium text-slate-400">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 max-w-xs">
                     Score elevated due to 3 new high-risk agreements detected in the last 24h.
                  </p>
               </div>
               <div className="h-24 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={TREND_DATA}>
                        <defs>
                           <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} fill="url(#colorRisk)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Critical Alerts */}
         <Card noPadding className="bg-dark-900/80 border-l-4 border-l-red-500 flex flex-col justify-center p-6">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                  <Siren size={24} />
               </div>
               <Badge color="red">+2 Today</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">12</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Critical Breaches</p>
         </Card>

         {/* Compliance Rate */}
         <Card noPadding className="bg-dark-900/80 border-l-4 border-l-green-500 flex flex-col justify-center p-6">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-green-500/10 rounded-xl text-green-500 border border-green-500/20">
                  <Shield size={24} />
               </div>
               <Badge color="green">Stable</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">94.2%</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Compliance Rate</p>
         </Card>
      </div>

      {/* Main Viz Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Left: Risk Radar */}
         <Card title="Risk Exposure Radar" className="lg:col-span-1 h-[400px]">
            <div className="h-full -ml-6">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                     <PolarGrid stroke="#334155" strokeDasharray="3 3"/>
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                     <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                     <Radar name="Current Portfolio" dataKey="A" stroke="#06b6d4" strokeWidth={2} fill="#06b6d4" fillOpacity={0.3} />
                     <Radar name="Industry Benchmark" dataKey="B" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                     <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}}/>
                     <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px'}} />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Center: Matrix & Timeline */}
         <div className="lg:col-span-2 space-y-6">
            {/* Risk Heatmap Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Risk Matrix" className="h-[400px]">
                   <div className="h-full flex flex-col pb-4">
                      <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-1 p-2">
                         {/* Row 1: High Impact */}
                         <div className="bg-yellow-500/20 border border-yellow-500/30 rounded flex items-center justify-center relative group hover:bg-yellow-500/40 transition-colors cursor-pointer">
                            <span className="text-yellow-200 font-bold text-lg">14</span>
                            <span className="absolute bottom-1 right-2 text-[8px] text-yellow-200/60 uppercase">Med/High</span>
                         </div>
                         <div className="bg-orange-500/20 border border-orange-500/30 rounded flex items-center justify-center relative group hover:bg-orange-500/40 transition-colors cursor-pointer">
                            <span className="text-orange-200 font-bold text-lg">8</span>
                            <span className="absolute bottom-1 right-2 text-[8px] text-orange-200/60 uppercase">High/High</span>
                         </div>
                         <div className="bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center relative group hover:bg-red-500/40 transition-colors cursor-pointer">
                            <span className="text-red-200 font-bold text-lg">3</span>
                            <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                            <span className="absolute bottom-1 right-2 text-[8px] text-red-200/60 uppercase">Crit/High</span>
                         </div>

                         {/* Row 2: Med Impact */}
                         <div className="bg-green-500/10 border border-green-500/20 rounded flex items-center justify-center relative group hover:bg-green-500/30 transition-colors">
                            <span className="text-green-200 font-bold text-lg">45</span>
                         </div>
                         <div className="bg-yellow-500/20 border border-yellow-500/30 rounded flex items-center justify-center relative group hover:bg-yellow-500/40 transition-colors">
                            <span className="text-yellow-200 font-bold text-lg">22</span>
                         </div>
                         <div className="bg-orange-500/20 border border-orange-500/30 rounded flex items-center justify-center relative group hover:bg-orange-500/40 transition-colors">
                            <span className="text-orange-200 font-bold text-lg">6</span>
                         </div>

                         {/* Row 3: Low Impact */}
                         <div className="bg-green-500/10 border border-green-500/20 rounded flex items-center justify-center relative group hover:bg-green-500/30 transition-colors">
                            <span className="text-green-200 font-bold text-lg">112</span>
                         </div>
                         <div className="bg-green-500/10 border border-green-500/20 rounded flex items-center justify-center relative group hover:bg-green-500/30 transition-colors">
                            <span className="text-green-200 font-bold text-lg">38</span>
                         </div>
                         <div className="bg-yellow-500/20 border border-yellow-500/30 rounded flex items-center justify-center relative group hover:bg-yellow-500/40 transition-colors">
                            <span className="text-yellow-200 font-bold text-lg">12</span>
                         </div>
                      </div>
                      
                      {/* Axis Labels */}
                      <div className="flex justify-between px-4 text-[10px] text-slate-500 font-bold uppercase mt-2">
                         <span>Low Prob</span>
                         <span>High Prob</span>
                      </div>
                      <div className="absolute left-0 top-1/2 -translate-x-[40%] -rotate-90 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                         Impact Severity
                      </div>
                   </div>
                </Card>

                {/* Geo / Category List */}
                <Card title="Top Risk Categories" className="h-[400px] overflow-hidden">
                   <div className="space-y-4 pr-2">
                      {[
                         { name: 'Indemnification', score: 88, count: 12, trend: 'up' },
                         { name: 'Limitation of Liability', score: 76, count: 8, trend: 'up' },
                         { name: 'Data Privacy (GDPR)', score: 65, count: 15, trend: 'down' },
                         { name: 'Payment Terms', score: 45, count: 24, trend: 'flat' },
                         { name: 'Termination Rights', score: 42, count: 6, trend: 'down' },
                      ].map((cat, i) => (
                         <div key={i} className="p-3 bg-dark-950 border border-dark-700 rounded-xl hover:border-brand-500/30 transition-all group cursor-pointer">
                            <div className="flex justify-between items-center mb-2">
                               <span className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">{cat.name}</span>
                               <Badge color={cat.score > 75 ? 'red' : cat.score > 50 ? 'yellow' : 'green'}>{cat.score} Risk</Badge>
                            </div>
                            <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden mb-2">
                               <div 
                                  className={`h-full rounded-full ${cat.score > 75 ? 'bg-red-500' : cat.score > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                  style={{width: `${cat.score}%`}}
                               ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500">
                               <span>{cat.count} Contracts Affected</span>
                               <span className="flex items-center gap-1 uppercase">
                                  {cat.trend === 'up' ? <TrendingUp size={10} className="text-red-400"/> : cat.trend === 'down' ? <TrendingUp size={10} className="text-green-400 rotate-180"/> : <div className="w-2 h-0.5 bg-slate-500"></div>}
                                  {cat.trend}
                               </span>
                            </div>
                         </div>
                      ))}
                   </div>
                </Card>
            </div>
         </div>
      </div>

      {/* Active Alerts Table */}
      <Card title="Active Risk Alerts & Remediation" noPadding className="overflow-hidden">
         {/* Filter Toolbar */}
         <div className="p-4 bg-dark-900/50 border-b border-dark-800 flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
               <Input placeholder="Search alerts by contract or ID..." className="pl-9 h-9 text-xs bg-dark-950 border-dark-700" />
            </div>
            <div className="flex gap-2">
               <Badge color="red" className="cursor-pointer hover:bg-red-500/20">Critical (12)</Badge>
               <Badge color="yellow" className="cursor-pointer hover:bg-yellow-500/20">High (25)</Badge>
               <Badge color="blue" className="cursor-pointer hover:bg-blue-500/20">Medium (45)</Badge>
            </div>
            <div className="flex-1"></div>
            <Button variant="ghost" className="h-8 text-xs"><Filter size={14} className="mr-2"/> Filter</Button>
            <Button variant="ghost" className="h-8 text-xs"><Download size={14} className="mr-2"/> Export</Button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
               <thead className="bg-dark-950 text-xs uppercase font-bold text-slate-500">
                  <tr>
                     <th className="px-6 py-3">Alert Description</th>
                     <th className="px-6 py-3">Contract Reference</th>
                     <th className="px-6 py-3">Severity</th>
                     <th className="px-6 py-3">Detected</th>
                     <th className="px-6 py-3">AI Suggestion</th>
                     <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-dark-800">
                  {MOCK_RISKS.map((risk, i) => (
                     <tr key={risk.id} className="hover:bg-white/5 group transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${risk.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : risk.severity === 'High' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                 {risk.severity === 'Critical' ? <Siren size={16}/> : <AlertTriangle size={16}/>}
                              </div>
                              <div>
                                 <p className="font-bold text-slate-200">{risk.description}</p>
                                 <p className="text-xs text-slate-500">ID: {risk.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <FileText size={14} className="text-slate-500"/>
                              <span className="text-brand-400 font-mono text-xs">{risk.contractId}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <Badge color={risk.severity === 'Critical' ? 'red' : risk.severity === 'High' ? 'yellow' : 'blue'}>
                              {risk.severity}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono">
                           2 hours ago
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 text-xs text-slate-300 bg-brand-500/5 px-2 py-1 rounded border border-brand-500/10 w-fit">
                              <Sparkles size={12} className="text-brand-400"/>
                              {risk.severity === 'Critical' ? 'Draft Breach Notice' : 'Review Clause 4.2'}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="secondary" className="h-7 text-xs px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              Resolve <ArrowUpRight size={12} className="ml-1"/>
                           </Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

export default RiskDashboard;
