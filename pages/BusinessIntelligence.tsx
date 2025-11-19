
import React, { useState } from 'react';
import { Card, Button, Input, Badge, Select } from '../components/UIComponents';
import { 
  Bot, Search, PieChart, TrendingUp, AlertTriangle, Download, 
  Calendar, ArrowRight, FileText, BarChart2, Activity, 
  DollarSign, Zap, Clock, Sparkles, Send, CheckCircle2, Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Cell, Pie, PieChart as RechartsPieChart, Legend
} from 'recharts';

const PERFORMANCE_DATA = [
  { name: 'Legal Review', cycleTime: 4.5, benchmark: 3.0 },
  { name: 'Finance Approval', cycleTime: 2.1, benchmark: 2.0 },
  { name: 'Counterparty Review', cycleTime: 8.5, benchmark: 5.0 },
  { name: 'Signatures', cycleTime: 1.2, benchmark: 1.0 },
];

const RISK_DISTRIBUTION = [
  { name: 'Indemnity Gap', value: 35, color: '#ef4444' },
  { name: 'Missing Caps', value: 25, color: '#f97316' },
  { name: 'Payment Terms', value: 20, color: '#eab308' },
  { name: 'GDPR', value: 20, color: '#3b82f6' },
];

const REVENUE_OPPORTUNITY = [
  { month: 'Q1', missed: 12000, realized: 150000 },
  { month: 'Q2', missed: 8000, realized: 180000 },
  { month: 'Q3', missed: 25000, realized: 160000 },
  { month: 'Q4', missed: 15000, realized: 210000 },
];

const REPORTS = [
  { id: 1, name: 'Monthly Renewal Forecast', type: 'PDF', schedule: '1st of Month' },
  { id: 2, name: 'Supplier Risk Scorecard', type: 'Excel', schedule: 'Weekly (Mon)' },
  { id: 3, name: 'Cycle Time Analysis', type: 'PDF', schedule: 'Quarterly' },
  { id: 4, name: 'Revenue Leakage Report', type: 'Excel', schedule: 'On Demand' },
];

const BusinessIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'risk' | 'operations' | 'reports'>('insights');
  const [query, setQuery] = useState('');
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleAskAI = () => {
    if (!query) return;
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setShowAIResponse(true);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section: Stakeholder Dialogue Engine */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-dark-900 to-dark-950 border border-indigo-500/20 shadow-2xl p-8 md:p-12">
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles size={200} className="text-brand-400" />
         </div>
         
         <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <Badge color="brand" className="mb-2 bg-brand-500 text-white border-none px-3 py-1 shadow-lg shadow-brand-500/40 animate-pulse-slow">Agreemetrix Intelligence Engine</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
               Talk to your business.
            </h1>
            <p className="text-lg text-slate-300">
               Ask questions about risk, revenue, or performance. Our AI analyzes every clause and obligation to give you answers, not just data.
            </p>

            <div className="relative max-w-2xl mx-auto mt-8 group">
               <div className="absolute inset-0 bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
               <div className="relative flex items-center bg-dark-950/80 backdrop-blur-xl border border-indigo-500/30 rounded-full shadow-2xl">
                  <Bot className="ml-4 text-brand-400" size={24} />
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-none px-4 py-4 text-white placeholder-slate-500 focus:ring-0 text-base"
                    placeholder="Try asking: 'Which suppliers consistently miss delivery obligations?'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  />
                  <button 
                    onClick={handleAskAI}
                    className="mr-2 p-2 bg-brand-500 text-white rounded-full hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
                  >
                    {isTyping ? <Zap size={20} className="animate-pulse" /> : <ArrowRight size={20} />}
                  </button>
               </div>
            </div>

            {/* Suggested Queries */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
               {[
                 "Identify high-risk renewals in Q4", 
                 "Show revenue leakage by region",
                 "Analyze approval bottlenecks"
               ].map((q, i) => (
                 <button key={i} onClick={() => { setQuery(q); handleAskAI(); }} className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 transition-colors">
                    {q}
                 </button>
               ))}
            </div>
         </div>

         {/* Simulated AI Response Widget */}
         {showAIResponse && (
            <div className="mt-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-dark-900/90 backdrop-blur-md border border-brand-500/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(var(--color-brand-500),0.15)]">
                  <div className="p-4 border-b border-white/5 bg-brand-500/10 flex items-center gap-3">
                     <Bot size={18} className="text-brand-400" />
                     <span className="text-sm font-bold text-brand-100">Intelligence Analysis</span>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="md:col-span-2 space-y-4">
                        <p className="text-slate-300 leading-relaxed">
                           I analyzed <strong className="text-white">142 active vendor contracts</strong>. 
                           <br/><br/>
                           Based on performance data, <strong className="text-red-400">TechFlow Inc.</strong> and <strong className="text-red-400">Global Logistics</strong> have missed delivery obligations 
                           in <strong className="text-white">35%</strong> of their active SOWs. This has triggered potential penalty clauses worth <strong className="text-green-400">$45,000</strong> that remain uncollected.
                        </p>
                        <div className="flex gap-3 mt-4">
                           <Button variant="primary" className="text-xs">Draft Notice of Breach</Button>
                           <Button variant="secondary" className="text-xs">View Contract Clauses</Button>
                        </div>
                     </div>
                     <div className="bg-dark-950 rounded-lg p-4 border border-white/5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Obligation Failures</h4>
                        <div className="space-y-3">
                           <div>
                              <div className="flex justify-between text-xs text-slate-400 mb-1">
                                 <span>TechFlow Inc.</span>
                                 <span className="text-red-400">12 Misses</span>
                              </div>
                              <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-red-500 h-full w-[70%]"></div>
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between text-xs text-slate-400 mb-1">
                                 <span>Global Logistics</span>
                                 <span className="text-orange-400">8 Misses</span>
                              </div>
                              <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-orange-500 h-full w-[45%]"></div>
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between text-xs text-slate-400 mb-1">
                                 <span>Acme Corp</span>
                                 <span className="text-green-400">0 Misses</span>
                              </div>
                              <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-green-500 h-full w-[0%]"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>

      {/* Analytics Dashboard */}
      <div>
         {/* Tabs */}
         <div className="flex border-b border-white/10 mb-6">
            <button onClick={() => setActiveTab('insights')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'insights' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
               <Activity size={16}/> Operational Performance
            </button>
            <button onClick={() => setActiveTab('risk')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'risk' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
               <AlertTriangle size={16}/> Risk Intelligence
            </button>
            <button onClick={() => setActiveTab('reports')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'reports' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-white'}`}>
               <FileText size={16}/> Reporting Suite
            </button>
         </div>

         {activeTab === 'insights' && (
            <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2">
               {/* KPI Cards */}
               <div className="col-span-12 lg:col-span-3 space-y-4">
                  <Card noPadding className="bg-gradient-to-br from-green-900/20 to-dark-900 border-green-500/20">
                     <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                           <div className="p-2 bg-green-500/20 rounded-lg text-green-500"><DollarSign size={20}/></div>
                           <Badge color="green">+12% YoY</Badge>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase">Recovered Revenue</p>
                        <h3 className="text-2xl font-bold text-white">$1.2M</h3>
                        <p className="text-xs text-slate-500 mt-1">Via automated renewal alerts</p>
                     </div>
                  </Card>
                  <Card noPadding className="bg-gradient-to-br from-blue-900/20 to-dark-900 border-blue-500/20">
                     <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                           <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500"><Zap size={20}/></div>
                           <Badge color="blue">85%</Badge>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase">Touchless Ratio</p>
                        <h3 className="text-2xl font-bold text-white">High</h3>
                        <p className="text-xs text-slate-500 mt-1">Standard NDAs fully automated</p>
                     </div>
                  </Card>
                  <Card noPadding className="bg-gradient-to-br from-purple-900/20 to-dark-900 border-purple-500/20">
                     <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                           <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500"><Clock size={20}/></div>
                           <Badge color="green">-2 Days</Badge>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase">Avg Cycle Time</p>
                        <h3 className="text-2xl font-bold text-white">14 Days</h3>
                        <p className="text-xs text-slate-500 mt-1">Faster than industry avg</p>
                     </div>
                  </Card>
               </div>

               {/* Charts */}
               <div className="col-span-12 lg:col-span-9 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Card title="Cycle Time Breakdown (vs Benchmark)" className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={PERFORMANCE_DATA} layout="vertical" margin={{left: 40, right: 20}}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                              <XAxis type="number" stroke="#64748b" fontSize={10}/>
                              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100}/>
                              <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                              <Legend wrapperStyle={{fontSize: '12px'}} />
                              <Bar dataKey="cycleTime" name="Your Avg (Days)" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                              <Bar dataKey="benchmark" name="Industry Benchmark" fill="#475569" radius={[0, 4, 4, 0]} barSize={12} />
                           </BarChart>
                        </ResponsiveContainer>
                     </Card>
                     <Card title="Revenue Opportunity (Missed vs Realized)" className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={REVENUE_OPPORTUNITY} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                              <defs>
                                 <linearGradient id="colorRealized" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                 </linearGradient>
                                 <linearGradient id="colorMissed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <XAxis dataKey="month" stroke="#64748b" fontSize={10}/>
                              <YAxis stroke="#64748b" fontSize={10}/>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                              <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                              <Area type="monotone" dataKey="realized" stackId="1" stroke="#10b981" fill="url(#colorRealized)" />
                              <Area type="monotone" dataKey="missed" stackId="1" stroke="#ef4444" fill="url(#colorMissed)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </Card>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'risk' && (
            <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2">
               <div className="col-span-12 md:col-span-8">
                  <Card title="Automated Risk Alerts" noPadding>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                           <thead className="bg-dark-950 text-slate-500 text-xs uppercase">
                              <tr>
                                 <th className="px-6 py-3">Severity</th>
                                 <th className="px-6 py-3">Alert Trigger</th>
                                 <th className="px-6 py-3">Contract</th>
                                 <th className="px-6 py-3">Detected</th>
                                 <th className="px-6 py-3 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {[
                                 { sev: 'Critical', trigger: 'Missed Payment Penalty', contract: 'MSA - TechFlow', time: '2 hrs ago' },
                                 { sev: 'High', trigger: 'Uncapped Liability', contract: 'Vendor Agreement - Acme', time: '5 hrs ago' },
                                 { sev: 'Medium', trigger: 'Expired Insurance', contract: 'Consulting - Stratos', time: '1 day ago' },
                                 { sev: 'Low', trigger: 'Auto-Renewal Imminent', contract: 'SaaS - Slack', time: '2 days ago' },
                              ].map((alert, i) => (
                                 <tr key={i} className="hover:bg-white/5">
                                    <td className="px-6 py-4">
                                       <Badge color={alert.sev === 'Critical' ? 'red' : alert.sev === 'High' ? 'orange' : alert.sev === 'Medium' ? 'yellow' : 'blue'}>
                                          {alert.sev}
                                       </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">{alert.trigger}</td>
                                    <td className="px-6 py-4 text-xs font-mono">{alert.contract}</td>
                                    <td className="px-6 py-4 text-xs">{alert.time}</td>
                                    <td className="px-6 py-4 text-right">
                                       <Button variant="ghost" className="text-xs h-7">Investigate</Button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </Card>
               </div>
               <div className="col-span-12 md:col-span-4">
                  <Card title="Clause Deviation Heatmap" className="h-full">
                     <div className="h-64 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                           <RechartsPieChart>
                              <Pie data={RISK_DISTRIBUTION} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                 {RISK_DISTRIBUTION.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                 ))}
                              </Pie>
                              <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{fontSize: '11px'}} />
                           </RechartsPieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-xs text-red-200">
                           <AlertTriangle size={12} className="inline mr-1"/>
                           <strong>Insight:</strong> 35% of third-party paper contains indemnity clauses that deviate from your playbook.
                        </p>
                     </div>
                  </Card>
               </div>
            </div>
         )}

         {activeTab === 'reports' && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {REPORTS.map(report => (
                     <Card key={report.id} className="hover:border-brand-500/50 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 bg-brand-500/20 blur-3xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                           <div className="p-3 bg-dark-950 border border-dark-700 rounded-xl text-slate-400 group-hover:text-brand-400 group-hover:border-brand-500/30 transition-colors">
                              <FileText size={24} />
                           </div>
                           <Badge color="gray">{report.type}</Badge>
                        </div>
                        <h3 className="font-bold text-white mb-1">{report.name}</h3>
                        <p className="text-xs text-slate-500 mb-4">Schedule: {report.schedule}</p>
                        <div className="flex gap-2">
                           <Button variant="secondary" className="w-full text-xs"><Calendar size={12} className="mr-1"/> Schedule</Button>
                           <Button variant="primary" className="w-full text-xs"><Download size={12} className="mr-1"/> Export</Button>
                        </div>
                     </Card>
                  ))}
               </div>
               
               <Card title="Generated Report History" noPadding>
                  <div className="p-4 border-b border-white/5 flex gap-4 items-center">
                     <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <Input placeholder="Search reports..." className="pl-9 h-9" />
                     </div>
                     <Button variant="ghost" className="text-xs"><Filter size={14} className="mr-2"/> Filter</Button>
                  </div>
                  <table className="w-full text-left text-sm text-slate-400">
                     <thead className="bg-dark-950 text-slate-500 text-xs uppercase">
                        <tr>
                           <th className="px-6 py-3">Report Name</th>
                           <th className="px-6 py-3">Generated By</th>
                           <th className="px-6 py-3">Date</th>
                           <th className="px-6 py-3">Status</th>
                           <th className="px-6 py-3 text-right">Download</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {[1, 2, 3].map(i => (
                           <tr key={i} className="hover:bg-white/5">
                              <td className="px-6 py-4 font-medium text-slate-300">Weekly Risk Summary - Q3</td>
                              <td className="px-6 py-4">System (Auto)</td>
                              <td className="px-6 py-4 text-xs">Oct 24, 2024</td>
                              <td className="px-6 py-4"><Badge color="green">Ready</Badge></td>
                              <td className="px-6 py-4 text-right">
                                 <Button variant="ghost" className="text-xs h-8 w-8 p-0 rounded-full"><Download size={14}/></Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </Card>
            </div>
         )}
      </div>
    </div>
  );
};

export default BusinessIntelligence;
