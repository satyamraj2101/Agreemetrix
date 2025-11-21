
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Badge, Select, Avatar } from '../components/UIComponents';
import { 
  Bot, Search, PieChart, TrendingUp, AlertTriangle, Download, 
  Calendar, ArrowRight, FileText, BarChart2, Activity, 
  DollarSign, Zap, Clock, Sparkles, Send, CheckCircle2, Filter,
  Scale, Globe, Target, Layers, BrainCircuit, RefreshCw, ArrowUpRight,
  Users, Shield, X, ChevronDown, ChevronRight, Mail, MessageSquare, 
  Save, Share2, Sliders, ExternalLink, Briefcase
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Cell, Pie, PieChart as RechartsPieChart, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Line, ReferenceLine
} from 'recharts';

// --- TYPES ---

type RoleType = 'Executive' | 'Legal' | 'Procurement' | 'Sales';
type DrilldownType = 'risk' | 'revenue' | 'cycle_time' | 'vendor_score' | null;

interface SimulationParams {
  paymentTermShift: number; // 0 to 100%
  penaltyEnforcement: number; // 0 to 100%
  renewalRetention: number; // 0 to 100%
}

// --- MOCK DATA ---

const CONTRACT_LIST_MOCK = [
  { id: 'CTR-2024-001', name: 'TechFlow MSA', vendor: 'TechFlow Inc', value: 150000, risk: 85, issue: 'Liability Cap > 3x', owner: 'Mike Ross' },
  { id: 'CTR-2024-042', name: 'Acme Supply Agmt', vendor: 'Acme Corp', value: 42000, risk: 72, issue: 'Missing GDPR Addendum', owner: 'Harvey Specter' },
  { id: 'CTR-2024-089', name: 'Stratos Consulting SOW', vendor: 'Stratos', value: 210000, risk: 65, issue: 'Auto-Renewal < 30 Days', owner: 'Jessica Pearson' },
  { id: 'CTR-2024-112', name: 'Global Logistics NDA', vendor: 'Global Log', value: 0, risk: 45, issue: 'Unilateral Terms', owner: 'Mike Ross' },
];

const SCENARIO_BASE_DATA = [
  { month: 'Jan', revenue: 120000, cashflow: 90000 },
  { month: 'Feb', revenue: 135000, cashflow: 95000 },
  { month: 'Mar', revenue: 150000, cashflow: 110000 },
  { month: 'Apr', revenue: 140000, cashflow: 105000 },
  { month: 'May', revenue: 180000, cashflow: 130000 },
  { month: 'Jun', revenue: 210000, cashflow: 160000 },
];

// --- SUB-COMPONENTS ---

// 1. Drilldown Pane
const DrilldownPane: React.FC<{ 
  type: DrilldownType; 
  onClose: () => void; 
  onAction: (action: string, item: any) => void; 
}> = ({ type, onClose, onAction }) => {
  if (!type) return null;

  const getTitle = () => {
    switch(type) {
      case 'risk': return 'High Risk Contracts Breakdown';
      case 'revenue': return 'Revenue Leakage Sources';
      case 'cycle_time': return 'Cycle Time Bottlenecks';
      default: return 'Details';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[500px] bg-dark-950 border-l border-dark-700 shadow-2xl z-50 transform transition-transform duration-300 animate-in slide-in-from-right flex flex-col">
      <div className="p-6 border-b border-dark-700 bg-dark-900/50 backdrop-blur-md">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider">
            <Activity size={14}/> Deep Dive
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
        </div>
        <h3 className="text-xl font-bold text-white">{getTitle()}</h3>
        <p className="text-slate-400 text-sm mt-1">Filtering active contracts by {type} factors.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {CONTRACT_LIST_MOCK.map((contract, idx) => (
          <div key={contract.id} className="p-4 bg-dark-900 border border-dark-700 rounded-xl hover:border-brand-500/30 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-white text-sm">{contract.name}</h4>
                <p className="text-xs text-slate-500">{contract.vendor} • {contract.owner}</p>
              </div>
              <Badge color={contract.risk > 80 ? 'red' : 'yellow'}>{contract.risk} Risk</Badge>
            </div>
            
            <div className="p-2 bg-dark-950 rounded border border-dark-800 mb-3">
              <div className="flex items-center gap-2 text-xs text-red-300">
                <AlertTriangle size={12} />
                <span className="font-mono">Issue: {contract.issue}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
              <Button variant="secondary" className="flex-1 h-8 text-xs" onClick={() => onAction('view', contract)}>View</Button>
              <Button variant="primary" className="flex-1 h-8 text-xs shadow-lg shadow-brand-500/10" onClick={() => onAction('remediate', contract)}>Remediate</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-dark-700 bg-dark-900/50 flex justify-between items-center">
        <span className="text-xs text-slate-500">4 records found</span>
        <Button variant="ghost" className="text-xs flex items-center gap-2"><Download size={14}/> Export List</Button>
      </div>
    </div>
  );
};

// 2. Action Modal (Draft Breach / Email)
const ActionModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  type: 'breach' | 'renegotiate' | null;
  contextData?: any; 
}> = ({ isOpen, onClose, type, contextData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-dark-900 w-full max-w-2xl rounded-2xl border border-dark-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        <div className="p-6 border-b border-dark-700 bg-dark-950/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {type === 'breach' ? <Shield size={20} className="text-red-400"/> : <Zap size={20} className="text-yellow-400"/>}
            {type === 'breach' ? 'Draft Notice of Breach' : 'Initiate Renegotiation'}
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-500 hover:text-white"/></button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          {/* Context Block */}
          <div className="p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl flex gap-3">
            <Bot size={20} className="text-brand-400 shrink-0 mt-1"/>
            <div>
              <p className="text-sm text-brand-100 font-bold mb-1">AI Context Auto-Fill</p>
              <p className="text-xs text-brand-200/70">
                I've pre-populated this notice based on <strong>Clause 4.2 (SLA Performance)</strong> of the <strong>{contextData?.name || 'Master Services Agreement'}</strong>.
                Detected failure: <span className="text-white">Uptime below 99.9% for 3 consecutive months.</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="To" value={contextData?.vendor ? `legal@${contextData.vendor.toLowerCase().replace(/ /g,'')}.com` : 'vendor@example.com'} />
              <Input label="CC" value="internal.counsel@agreemetrix.ai" />
            </div>
            <Input label="Subject" value={`NOTICE OF BREACH - ${contextData?.name || 'Contract Ref'}`} />
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Message Body</label>
              <textarea 
                className="w-full h-64 bg-dark-950 border border-dark-700 rounded-xl p-4 text-sm text-slate-300 focus:border-brand-500 outline-none resize-none font-serif leading-relaxed"
                defaultValue={`Dear ${contextData?.vendor || 'Vendor'},\n\nPursuant to Section 4.2 of the Master Services Agreement dated January 15, 2023, we are writing to provide formal notice of breach.\n\nOur records indicate that Service Level availability has fallen below the agreed threshold of 99.9% for the months of October, November, and December.\n\nAccordingly, we are exercising our right to claim Service Credits in the amount of $15,000 as stipulated in Exhibit B.\n\nPlease confirm receipt of this notice and provide a remediation plan within five (5) business days.\n\nSincerely,\nLegal Team`}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-dark-700 bg-dark-950/30 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 size={14} className="text-green-500"/> Saved to Drafts
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" className="px-6 flex items-center gap-2"><Send size={16}/> Send Notice</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const BusinessIntelligence: React.FC = () => {
  // State
  const [activeRole, setActiveRole] = useState<RoleType>('Executive');
  const [drilldown, setDrilldown] = useState<DrilldownType>(null);
  const [actionModal, setActionModal] = useState<{open: boolean, type: 'breach' | 'renegotiate' | null, data?: any}>({ open: false, type: null });
  
  // AI State
  const [aiQuery, setAiQuery] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [showReasoning, setShowReasoning] = useState(false);

  // Simulation State
  const [simParams, setSimParams] = useState<SimulationParams>({
    paymentTermShift: 0,
    penaltyEnforcement: 0,
    renewalRetention: 90
  });

  // --- EFFECTS & LOGIC ---

  // Simulate AI Processing
  const handleAskAI = () => {
    if (!aiQuery) return;
    setAiThinking(true);
    setAiResult(null);
    
    setTimeout(() => {
      setAiThinking(false);
      setAiResult({
        summary: `I analyzed 1,240 active contracts. Currently, there is $145,000 in revenue at risk due to missed renewal notifications and uncollected penalties from 3 key vendors.`,
        data: { risk: 145000, contracts: 12 },
        provenance: [
          { source: 'ERP Sync', detail: 'Invoices vs. Rate Cards', timestamp: '2m ago' },
          { source: 'NLP Engine', detail: 'Extracted "Penalty" Clauses', timestamp: 'Just now' },
          { source: 'Vendor History', detail: 'Past 12 months performance', timestamp: '5m ago' }
        ],
        actions: [
          { label: 'Draft Breach Notice', type: 'breach' },
          { label: 'View Contracts', type: 'view_list' }
        ]
      });
    }, 1500);
  };

  // Calculate Scenario Data based on sliders
  const scenarioData = useMemo(() => {
    return SCENARIO_BASE_DATA.map(d => {
      const termImpact = d.cashflow * (simParams.paymentTermShift / 100 * 0.15); // Mock math
      const penaltyRecovery = d.revenue * (simParams.penaltyEnforcement / 100 * 0.05);
      return {
        ...d,
        projectedCashflow: d.cashflow + termImpact + penaltyRecovery
      };
    });
  }, [simParams]);

  // --- RENDER HELPERS ---

  const renderRoleSelector = () => (
    <div className="flex items-center gap-2 bg-dark-900 p-1.5 rounded-xl border border-dark-700 w-fit">
       {['Executive', 'Legal', 'Procurement', 'Sales'].map(role => (
          <button
            key={role}
            onClick={() => setActiveRole(role as RoleType)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeRole === role ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
             {role === 'Executive' && <Target size={14}/>}
             {role === 'Legal' && <Scale size={14}/>}
             {role === 'Procurement' && <Briefcase size={14}/>}
             {role === 'Sales' && <TrendingUp size={14}/>}
             {role}
          </button>
       ))}
    </div>
  );

  const renderAICommandCenter = () => (
    <div className="relative rounded-3xl overflow-hidden border border-brand-500/30 shadow-2xl bg-dark-950 mb-8 transition-all duration-500">
       {/* Dynamic Background */}
       <div className="absolute inset-0 bg-gradient-to-r from-brand-900/20 via-purple-900/20 to-dark-950 opacity-50"></div>
       <div className={`absolute top-0 right-0 p-32 bg-brand-500/10 blur-[120px] rounded-full transition-all duration-1000 ${aiThinking ? 'scale-125 opacity-80' : 'scale-100 opacity-50'}`}></div>
       
       <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
             <div className="flex flex-col items-center text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(20,184,166,0.3)] animate-pulse-slow">
                   <BrainCircuit size={14} /> Agreemetrix Neural Engine
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                   Talk to your contracts. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Predict the future.</span>
                </h1>
             </div>
             
             {/* Search Bar */}
             <div className="relative group max-w-2xl mx-auto mb-8">
                <div className={`absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl opacity-20 blur transition-opacity ${aiThinking ? 'animate-pulse opacity-60' : 'group-hover:opacity-40'}`}></div>
                <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center p-2 shadow-2xl">
                   <Bot className={`ml-3 transition-colors ${aiThinking ? 'text-brand-400 animate-bounce' : 'text-slate-400'}`} size={24}/>
                   <input 
                      type="text" 
                      placeholder="Ask a strategic question (e.g., 'Identify high-risk renewals in Q4')"
                      className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder-slate-500 outline-none"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                   />
                   <button 
                      onClick={handleAskAI}
                      className="bg-brand-600 hover:bg-brand-500 text-white p-3 rounded-lg transition-all shadow-lg flex items-center justify-center min-w-[48px]"
                   >
                      {aiThinking ? <RefreshCw className="animate-spin" size={20}/> : <Send size={20}/>}
                   </button>
                </div>
             </div>

             {/* AI Result Card */}
             {aiResult && (
                <div className="max-w-3xl mx-auto bg-dark-900/90 backdrop-blur-xl border border-brand-500/30 rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 shadow-2xl">
                   <div className="p-6">
                      <div className="flex items-start gap-4">
                         <div className="p-3 bg-brand-500/20 rounded-xl text-brand-400 shrink-0 shadow-lg shadow-brand-500/10">
                            <Sparkles size={24} />
                         </div>
                         <div className="flex-1 space-y-4">
                            <div>
                               <h4 className="text-lg font-bold text-white mb-1">Insight Generated</h4>
                               <p className="text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: aiResult.summary}}></p>
                            </div>
                            
                            {/* Data Viz Box */}
                            <div className="bg-dark-950 rounded-xl border border-white/5 p-4 flex gap-8 items-center">
                               <div className="space-y-1">
                                  <p className="text-[10px] uppercase text-slate-500 font-bold">At Risk Value</p>
                                  <p className="text-2xl font-bold text-red-400">${(aiResult.data.risk/1000).toFixed(0)}k</p>
                               </div>
                               <div className="h-8 w-px bg-dark-700"></div>
                               <div className="space-y-1 cursor-pointer hover:opacity-80" onClick={() => setDrilldown('risk')}>
                                  <p className="text-[10px] uppercase text-slate-500 font-bold flex items-center gap-1">Contracts <ArrowUpRight size={10}/></p>
                                  <p className="text-2xl font-bold text-white">{aiResult.data.contracts}</p>
                               </div>
                               <div className="flex-1 flex justify-end gap-3">
                                  <Button variant="secondary" className="text-xs" onClick={() => setDrilldown('risk')}>Drill Down</Button>
                                  <Button 
                                    variant="primary" 
                                    className="text-xs bg-red-600 hover:bg-red-500 border-none shadow-lg shadow-red-500/20"
                                    onClick={() => setActionModal({open: true, type: 'breach', data: {name: 'TechFlow MSA', vendor: 'TechFlow'}})}
                                  >
                                    Draft Breach Notice
                                  </Button>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   {/* Provenance & Reasoning Footer */}
                   <div className="bg-dark-950/80 border-t border-white/5">
                      <button 
                        onClick={() => setShowReasoning(!showReasoning)}
                        className="w-full px-6 py-3 flex justify-between items-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
                      >
                         <div className="flex items-center gap-2">
                            <BrainCircuit size={14} /> 
                            AI Reasoning & Data Provenance
                         </div>
                         {showReasoning ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                      </button>
                      
                      {showReasoning && (
                         <div className="px-6 pb-6 pt-2 border-t border-dark-800 animate-in slide-in-from-top-2">
                            <h5 className="text-[10px] font-bold text-brand-400 uppercase mb-2">Data Sources Scanned</h5>
                            <div className="space-y-2">
                               {aiResult.provenance.map((src: any, i: number) => (
                                  <div key={i} className="flex items-center justify-between text-xs">
                                     <span className="text-slate-300 flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> {src.source}</span>
                                     <span className="text-slate-500">{src.detail}</span>
                                  </div>
                               ))}
                            </div>
                            <div className="mt-4 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300 leading-relaxed">
                               <strong>Logic:</strong> The AI correlated payment milestones from the ERP integration with obligation clauses extracted from the contract PDFs. Discrepancies > 10% were flagged as risk.
                            </div>
                         </div>
                      )}
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );

  const renderWhatIfSimulator = () => (
    <Card title="What-If Scenario Engine" className="col-span-12 lg:col-span-8 overflow-hidden">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-6 p-4 bg-dark-950 rounded-xl border border-dark-700">
             <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sliders size={14}/> Simulation Parameters
             </div>
             
             <div>
                <div className="flex justify-between text-sm mb-2">
                   <span className="text-slate-300">Shift Payment Terms</span>
                   <span className="text-brand-400 font-mono">+{simParams.paymentTermShift}%</span>
                </div>
                <input 
                   type="range" min="0" max="50" step="5"
                   value={simParams.paymentTermShift}
                   onChange={(e) => setSimParams({...simParams, paymentTermShift: parseInt(e.target.value)})}
                   className="w-full accent-brand-500 bg-dark-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1">Model impact of moving Net-30 to Net-45/60.</p>
             </div>

             <div>
                <div className="flex justify-between text-sm mb-2">
                   <span className="text-slate-300">Enforce Penalties</span>
                   <span className="text-red-400 font-mono">{simParams.penaltyEnforcement}%</span>
                </div>
                <input 
                   type="range" min="0" max="100" step="10"
                   value={simParams.penaltyEnforcement}
                   onChange={(e) => setSimParams({...simParams, penaltyEnforcement: parseInt(e.target.value)})}
                   className="w-full accent-red-500 bg-dark-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1">Projected recovery from missed SLA obligations.</p>
             </div>

             <div className="pt-4 border-t border-dark-800">
                <Button variant="secondary" className="w-full text-xs" onClick={() => setSimParams({paymentTermShift: 0, penaltyEnforcement: 0, renewalRetention: 90})}>Reset Model</Button>
             </div>
          </div>

          {/* Chart */}
          <div className="col-span-2 h-80">
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={scenarioData}>
                   <CartesianGrid stroke="#1e293b" vertical={false} strokeDasharray="3 3" />
                   <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false}/>
                   <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`}/>
                   <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px'}}
                      itemStyle={{fontSize: '12px'}}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                   />
                   <Legend wrapperStyle={{fontSize: '12px'}}/>
                   <Area type="monotone" dataKey="revenue" name="Baseline Revenue" fill="#3b82f6" stroke="none" fillOpacity={0.1} />
                   <Line type="monotone" dataKey="cashflow" name="Current Cashflow" stroke="#64748b" strokeWidth={2} dot={false} />
                   <Line type="monotone" dataKey="projectedCashflow" name="Projected Impact" stroke="#2dd4bf" strokeWidth={3} dot={{r: 4}} strokeDasharray="5 5" />
                </ComposedChart>
             </ResponsiveContainer>
          </div>
       </div>
    </Card>
  );

  const renderRoleSpecificKPIs = () => {
     // Different Cards based on activeRole
     const colors = activeRole === 'Legal' ? 'blue' : activeRole === 'Sales' ? 'green' : activeRole === 'Procurement' ? 'orange' : 'purple';
     
     return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {[
              { label: 'KPI 1', val: 'High', sub: 'Trend Up' },
              { label: 'KPI 2', val: '12', sub: 'Actions' },
              { label: 'KPI 3', val: '$1.2M', sub: 'Value' },
              { label: 'KPI 4', val: '98%', sub: 'Score' }
           ].map((kpi, i) => (
              <div key={i} onClick={() => setDrilldown('risk')} className={`bg-dark-900 border border-dark-700 p-5 rounded-xl hover:border-${colors}-500/50 transition-all cursor-pointer hover:-translate-y-1 shadow-lg group`}>
                 <div className="flex justify-between items-start">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{activeRole} Metric {i+1}</p>
                    <div className={`p-1.5 rounded bg-${colors}-500/10 text-${colors}-400 group-hover:bg-${colors}-500 group-hover:text-white transition-colors`}>
                       <Activity size={14}/>
                    </div>
                 </div>
                 <h3 className="text-2xl font-bold text-white mt-2">{kpi.val}</h3>
                 <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <TrendingUp size={12} className={`text-${colors}-400`}/> {kpi.sub}
                 </div>
              </div>
           ))}
        </div>
     )
  };

  return (
    <div className="pb-20">
      {/* Header & Tools */}
      <div className="flex flex-col lg:flex-row justify-between items-end mb-8 gap-4">
         <div className="space-y-4 w-full lg:w-auto">
            <h1 className="text-2xl font-bold text-white">Business Intelligence</h1>
            {renderRoleSelector()}
         </div>
         <div className="flex gap-3">
            <Button variant="secondary" className="text-xs"><Save size={14} className="mr-2"/> Save View</Button>
            <Button variant="secondary" className="text-xs"><Share2 size={14} className="mr-2"/> Schedule Report</Button>
         </div>
      </div>

      {/* 1. AI Hero */}
      {renderAICommandCenter()}

      {/* 2. Role Context KPIs */}
      <div className="animate-in slide-in-from-bottom-8 duration-700">
         <div className="flex items-center gap-2 mb-4">
            <Layers size={16} className="text-slate-500"/>
            <span className="text-sm font-bold text-slate-300">{activeRole} Overview</span>
         </div>
         {renderRoleSpecificKPIs()}
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-bottom-10 duration-700 delay-100">
         
         {/* Scenario Engine */}
         {renderWhatIfSimulator()}

         {/* Quick Actions / Alerts Feed */}
         <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card title="Action Feed" className="h-full">
               <div className="space-y-3">
                  {[
                     { type: 'Critical', title: 'Revenue Risk', desc: 'TechFlow missed 3 SLA milestones.', action: 'Draft Breach' },
                     { type: 'Warning', title: 'Renewal Gap', desc: 'Acme Corp auto-renews in 45 days.', action: 'Renegotiate' },
                     { type: 'Info', title: 'Compliance', desc: 'GDPR Addendum missing for 5 vendors.', action: 'Batch Update' }
                  ].map((alert, i) => (
                     <div key={i} className="p-3 bg-dark-950 rounded-xl border border-dark-700 hover:border-brand-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-1">
                           <Badge color={alert.type === 'Critical' ? 'red' : alert.type === 'Warning' ? 'yellow' : 'blue'}>{alert.type}</Badge>
                           <span className="text-[10px] text-slate-500">2h ago</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{alert.title}</h4>
                        <p className="text-xs text-slate-400 mb-3">{alert.desc}</p>
                        <Button 
                           variant="secondary" 
                           className="w-full h-7 text-xs"
                           onClick={() => setActionModal({open: true, type: alert.action.includes('Breach') ? 'breach' : 'renegotiate', data: {name: 'TechFlow MSA', vendor: 'TechFlow'}})}
                        >
                           {alert.action} <ArrowRight size={12} className="ml-2"/>
                        </Button>
                     </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>

      {/* --- OVERLAYS --- */}
      
      {/* Drilldown Pane */}
      {drilldown && (
         <>
            <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-in fade-in" onClick={() => setDrilldown(null)}></div>
            <DrilldownPane 
               type={drilldown} 
               onClose={() => setDrilldown(null)}
               onAction={(action, item) => {
                  if (action === 'remediate') setActionModal({open: true, type: 'breach', data: item});
               }}
            />
         </>
      )}

      {/* Action Modal */}
      <ActionModal 
         isOpen={actionModal.open} 
         onClose={() => setActionModal({...actionModal, open: false})}
         type={actionModal.type}
         contextData={actionModal.data}
      />

    </div>
  );
};

export default BusinessIntelligence;
