
import React, { useState } from 'react';
import { Card, Button, Input, Badge, Select, Switch } from '../components/UIComponents';
import { MOCK_INTEGRATIONS, MOCK_SYNC_LOGS } from '../mock/data';
import { IntegrationApp, SyncLog } from '../types';
import { 
  Search, CheckCircle, Plus, Zap, Box, Bot, ArrowRight, MonitorPlay, Settings, 
  ArrowLeftRight, ArrowLeft, RefreshCw, Activity, Server, Key, 
  Trash2, ShieldCheck, Webhook, FileJson, Check, X, Layers, Cpu,
  Download
} from 'lucide-react';

// --- BRAND LOGOS ---
const SalesforceLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16.1 5.6C15.6 3.5 13.7 2 11.5 2 8.5 2 6 4.5 6 7.5c0 .3 0 .5.1.8C3.6 8.9 2 11.7 2 15c0 3.9 3.1 7 7 7h8c3.3 0 6-2.7 6-6 0-3.1-2.4-5.7-5.4-6-.1-2.4-1.5-4.4-1.5-4.4z" fill="#00A1E0"/>
  </svg>
);

const SlackLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5.5 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="#E01E5A"/>
    <path d="M5.5 12.5h-3a2.5 2.5 0 1 0 0 5h3v-5z" fill="#E01E5A"/>
    <path d="M10.5 5.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" fill="#2EB67D"/>
    <path d="M12.5 5.5v3a2.5 2.5 0 1 0 5 0v-3h-5z" fill="#2EB67D"/>
    <path d="M18.5 13.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" fill="#ECB22E"/>
    <path d="M18.5 11.5h3a2.5 2.5 0 1 0 0-5h-3v5z" fill="#ECB22E"/>
    <path d="M13.5 18.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" fill="#36C5F0"/>
    <path d="M11.5 18.5v-3a2.5 2.5 0 1 0-5 0v3h5z" fill="#36C5F0"/>
  </svg>
);

const AppLogo: React.FC<{ id: string; className?: string; fallbackText?: string }> = ({ id, className = '', fallbackText }) => {
  if (id === 'sf') return <SalesforceLogo className={className} />;
  if (id === 'slack') return <SlackLogo className={className} />;
  return <div className={`font-bold flex items-center justify-center w-full h-full bg-dark-800 rounded-lg text-slate-400 ${className}`}>{fallbackText || 'APP'}</div>;
};

// --- SUB-COMPONENTS ---

const LogDetailPanel: React.FC<{ log: SyncLog | null; onClose: () => void }> = ({ log, onClose }) => {
    if (!log) return null;
    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex justify-end animate-in fade-in">
            <div className="w-[600px] bg-dark-950 border-l border-dark-700 h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileJson size={18} className="text-brand-400"/> Transaction Details
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-1">{log.id}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-dark-900 rounded border border-dark-800">
                            <label className="text-[10px] text-slate-500 uppercase font-bold">Status</label>
                            <Badge color={log.status === 'Success' ? 'green' : log.status === 'Warning' ? 'yellow' : 'red'} className="mt-1">{log.status}</Badge>
                        </div>
                        <div className="p-3 bg-dark-900 rounded border border-dark-800">
                            <label className="text-[10px] text-slate-500 uppercase font-bold">Timestamp</label>
                            <div className="text-sm text-white font-mono mt-1">{log.timestamp}</div>
                        </div>
                        <div className="p-3 bg-dark-900 rounded border border-dark-800">
                            <label className="text-[10px] text-slate-500 uppercase font-bold">Direction</label>
                            <div className="text-sm text-white mt-1 flex items-center gap-2">
                                {log.direction === 'Inbound' ? <ArrowRight size={14}/> : <ArrowLeft size={14}/>} {log.direction}
                            </div>
                        </div>
                        <div className="p-3 bg-dark-900 rounded border border-dark-800">
                            <label className="text-[10px] text-slate-500 uppercase font-bold">Records</label>
                            <div className="text-sm text-white mt-1">{log.records} items</div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Request Payload</label>
                        <div className="bg-dark-900 border border-dark-800 rounded-lg p-4 font-mono text-xs text-blue-300 overflow-x-auto">
{`{
  "source": "Salesforce",
  "object": "Opportunity",
  "id": "0065e00000F4xyz",
  "fields": {
    "Amount": 150000,
    "StageName": "Closed Won",
    "CloseDate": "2024-03-15"
  }
}`}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Response / Error</label>
                        <div className="bg-dark-900 border border-dark-800 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
{`{
  "status": 200,
  "message": "Sync successful",
  "internal_id": "CTR-2024-992"
}`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'installed' | 'builder'>('market');
  
  // Marketplace State
  const [marketFilter, setMarketFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Builder State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [builtApp, setBuiltApp] = useState<any>(null);
  
  // Config Workspace State
  const [configuringApp, setConfiguringApp] = useState<IntegrationApp | null>(null);
  const [configTab, setConfigTab] = useState<'connection' | 'webhooks' | 'mapping' | 'monitor'>('connection');
  const [selectedLog, setSelectedLog] = useState<SyncLog | null>(null);

  // Mock Categories
  const CATEGORIES = ['All', 'CRM', 'ERP', 'Communication', 'Signature', 'Storage', 'AI Model'];

  const handleBuild = () => {
    if(!aiPrompt) return;
    setIsBuilding(true);
    setTimeout(() => {
       setIsBuilding(false);
       setBuiltApp({
          name: 'Custom Integration',
          description: 'Generated from: ' + aiPrompt,
          auth: 'OAuth 2.0',
          endpoints: ['GET /contracts', 'POST /webhooks'],
          triggers: ['On Status Change', 'On Document Signed']
       });
    }, 2500);
  };

  // --- APP CONFIGURATION WORKSPACE ---
  if (configuringApp) {
    return (
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
         {/* Config Header */}
         <div className="bg-dark-900 border-b border-dark-700 p-6 flex justify-between items-start shrink-0">
            <div className="flex items-center gap-4">
               <button onClick={() => setConfiguringApp(null)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
               </button>
               <div className="w-12 h-12 rounded-xl bg-dark-800 p-2 border border-dark-600 flex items-center justify-center shadow-lg">
                  <AppLogo id={configuringApp.id} className="w-full h-full" fallbackText={configuringApp.icon} />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                     {configuringApp.name} 
                     <Badge color="green">v2.4.0</Badge>
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                     <span className="flex items-center gap-1"><Box size={12}/> Production Env</span>
                     <span className="flex items-center gap-1"><ShieldCheck size={12}/> Verified</span>
                  </div>
               </div>
            </div>
            <div className="flex gap-2">
               <Button variant="secondary" className="text-xs"><FileJson size={14} className="mr-2"/> Docs</Button>
               <Button variant="danger" className="text-xs"><Trash2 size={14} className="mr-2"/> Uninstall</Button>
            </div>
         </div>

         {/* Config Tabs */}
         <div className="flex border-b border-white/10 bg-dark-900 px-6 gap-6">
           {[
             { id: 'connection', icon: Zap, label: 'Connection' },
             { id: 'webhooks', icon: Webhook, label: 'Webhooks & API' },
             { id: 'mapping', icon: ArrowLeftRight, label: 'Field Mapping' },
             { id: 'monitor', icon: Activity, label: 'Activity Monitor' },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setConfigTab(tab.id as any)}
               className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${configTab === tab.id ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-white'}`}
             >
               <tab.icon size={16}/> {tab.label}
             </button>
           ))}
         </div>

         {/* Config Body */}
         <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-dark-950 relative">
            
            {/* 1. Connection Status */}
            {configTab === 'connection' && (
               <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-right-2">
                  <Card title="Health Status">
                     <div className="flex items-center gap-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border-4 border-dark-900 shadow-xl text-green-500">
                           <CheckCircle size={32} />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-lg font-bold text-white">System Operational</h4>
                           <p className="text-sm text-slate-400">Securely connected to <strong>{configuringApp.name}</strong> via OAuth 2.0.</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-slate-500 uppercase font-bold">Last Sync</p>
                           <p className="text-sm text-white font-mono">2 mins ago</p>
                        </div>
                     </div>
                  </Card>

                  <Card title="Sync Settings">
                     <div className="space-y-6">
                        <div className="flex items-center justify-between p-3 bg-dark-900 rounded-lg border border-dark-700">
                           <div>
                              <p className="text-sm font-bold text-white">Auto-Sync Frequency</p>
                              <p className="text-xs text-slate-500">How often data is pulled from source.</p>
                           </div>
                           <Select className="w-40 h-9 text-xs" options={[{label: 'Real-time', value: 'realtime'}, {label: 'Every 5m', value: '5m'}, {label: 'Hourly', value: '1h'}]} />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-dark-900 rounded-lg border border-dark-700">
                           <div>
                              <p className="text-sm font-bold text-white">Conflict Resolution</p>
                              <p className="text-xs text-slate-500">Strategy when data changes in both systems.</p>
                           </div>
                           <Select className="w-40 h-9 text-xs" options={[{label: 'Agreemetrix Wins', value: 'local'}, {label: 'Source Wins', value: 'remote'}, {label: 'Manual Merge', value: 'manual'}]} />
                        </div>
                        <div className="border-t border-dark-700 pt-4 flex justify-end">
                           <Button variant="primary" className="shadow-lg shadow-brand-500/20"><RefreshCw size={16} className="mr-2"/> Trigger Manual Sync</Button>
                        </div>
                     </div>
                  </Card>
               </div>
            )}

            {/* 2. Webhooks & API */}
            {configTab === 'webhooks' && (
               <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-right-2">
                  <Card title="Incoming Webhook Configuration">
                     <div className="space-y-4">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3">
                           <Server size={20} className="text-blue-400 shrink-0 mt-1"/>
                           <div>
                              <h5 className="text-sm font-bold text-blue-100">Endpoint Active</h5>
                              <p className="text-xs text-blue-200/70">
                                 Configure {configuringApp.name} to send events to this URL. We will automatically verify signatures using the secret below.
                              </p>
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase">Callback URL</label>
                           <div className="flex gap-2 mt-1">
                              <Input value={`https://api.agreemetrix.ai/v1/hooks/${configuringApp.id}/listener`} disabled className="font-mono text-xs bg-dark-900 text-slate-300"/>
                              <Button variant="secondary" className="px-3"><Settings size={14}/></Button>
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase">Signing Secret</label>
                           <div className="flex gap-2 mt-1">
                              <Input value="whsec_83924823948239048239048" type="password" disabled className="font-mono text-xs bg-dark-900 text-slate-300"/>
                              <Button variant="secondary" className="px-3"><Key size={14}/></Button>
                           </div>
                        </div>
                     </div>
                  </Card>

                  <Card title="Event Subscriptions">
                     <div className="space-y-2">
                        {['opportunity.closed_won', 'contract.signed', 'account.updated', 'user.provisioned'].map((event, i) => (
                           <div key={i} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg border border-dark-700">
                              <div className="flex items-center gap-3">
                                 <Webhook size={16} className="text-purple-400"/>
                                 <span className="text-sm font-mono text-slate-300">{event}</span>
                              </div>
                              <Switch checked={i < 2} onChange={()=>{}} />
                           </div>
                        ))}
                     </div>
                  </Card>
               </div>
            )}

            {/* 3. Field Mapping */}
            {configTab === 'mapping' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                  <div className="flex justify-between items-center bg-dark-900/50 p-4 rounded-xl border border-white/5">
                     <p className="text-sm text-slate-400">Map fields between <strong>{configuringApp.name}</strong> and Agreemetrix. Transformations allow you to format data on the fly.</p>
                     <Button variant="primary" className="h-8 text-xs"><Plus size={14} className="mr-2"/> Add Mapping</Button>
                  </div>

                  <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
                     <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-dark-950 text-xs uppercase font-bold text-slate-500">
                           <tr>
                              <th className="px-6 py-3">External Field</th>
                              <th className="px-6 py-3 text-center">Sync</th>
                              <th className="px-6 py-3">Internal Variable</th>
                              <th className="px-6 py-3">Transformation</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-800">
                           {(configuringApp.mappings || []).map((m, i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors group">
                                 <td className="px-6 py-4 font-mono text-white">{m.externalField}</td>
                                 <td className="px-6 py-4 text-center">
                                    <Badge color="blue" className="inline-flex gap-1 items-center font-mono">
                                       {m.direction === 'import' && <ArrowRight size={10}/>}
                                       {m.direction === 'export' && <ArrowLeft size={10}/>}
                                       {m.direction === 'bidirectional' && <ArrowLeftRight size={10}/>}
                                       {m.direction}
                                    </Badge>
                                 </td>
                                 <td className="px-6 py-4 font-mono text-brand-400">{m.internalVariable}</td>
                                 <td className="px-6 py-4">
                                    {i === 0 ? (
                                       <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-mono">
                                          <Cpu size={10}/> TO_UPPERCASE
                                       </div>
                                    ) : (
                                       <span className="text-xs text-slate-600">-</span>
                                    )}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <Button variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-white"><Settings size={14}/></Button>
                                       <Button variant="ghost" className="h-6 w-6 p-0 text-red-400 hover:text-red-300"><Trash2 size={14}/></Button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* 4. Activity Monitor */}
            {configTab === 'monitor' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                  <div className="flex justify-between items-center">
                     <div className="flex gap-2">
                        <div className="relative">
                           <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                           <Input placeholder="Search logs..." className="bg-dark-900 border-dark-700 h-9 text-xs w-64 pl-8" />
                        </div>
                        <Select className="h-9 text-xs w-32 bg-dark-900 border-dark-700" options={[{label:'All Status',value:'all'}, {label:'Errors',value:'error'}]} />
                     </div>
                     <Button variant="secondary" className="h-9 text-xs"><Download size={14} className="mr-2"/> Export CSV</Button>
                  </div>

                  <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
                     <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-dark-950 text-xs uppercase font-bold text-slate-500">
                           <tr>
                              <th className="px-6 py-3">Time</th>
                              <th className="px-6 py-3">Direction</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3">Message</th>
                              <th className="px-6 py-3 text-right">Details</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-800">
                           {MOCK_SYNC_LOGS.map(log => (
                              <tr key={log.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedLog(log)}>
                                 <td className="px-6 py-4 font-mono text-xs">{log.timestamp}</td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       {log.direction === 'Inbound' ? <ArrowRight size={14} className="text-blue-400"/> : <ArrowLeft size={14} className="text-purple-400"/>}
                                       {log.direction}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <Badge color={log.status === 'Success' ? 'green' : log.status === 'Warning' ? 'yellow' : 'red'}>{log.status}</Badge>
                                 </td>
                                 <td className="px-6 py-4 text-slate-300">{log.message}</td>
                                 <td className="px-6 py-4 text-right">
                                    <FileJson size={16} className="ml-auto text-slate-500 group-hover:text-brand-400 transition-colors"/>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  
                  <LogDetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />
               </div>
            )}
         </div>
      </div>
    );
  }

  // --- MAIN INTEGRATION HUB ---
  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-6 shrink-0">
         <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Integration Hub</h2>
            <p className="text-slate-400">Connect tools, automate data flow, and build custom API solutions.</p>
         </div>
         
         <div className="flex items-center border-b border-white/10">
            <button 
               onClick={() => setActiveTab('market')}
               className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'market' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
               Marketplace
            </button>
            <button 
               onClick={() => setActiveTab('installed')}
               className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'installed' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
               Installed Apps
            </button>
            <button 
               onClick={() => setActiveTab('builder')}
               className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'builder' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
               <Bot size={16} /> AI App Builder
            </button>
         </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
         
         {/* MARKETPLACE TAB */}
         {activeTab === 'market' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
               <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-700 overflow-x-auto max-w-full">
                     {CATEGORIES.map(cat => (
                        <button 
                           key={cat}
                           onClick={() => setMarketFilter(cat)}
                           className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${marketFilter === cat ? 'bg-dark-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>
                  <div className="relative w-full md:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                     <Input 
                        placeholder="Search apps..." 
                        className="pl-10 bg-dark-900 border-dark-700" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {MOCK_INTEGRATIONS.filter(app => (marketFilter === 'All' || app.category === marketFilter) && app.name.toLowerCase().includes(searchQuery.toLowerCase())).map(app => (
                     <Card key={app.id} className="hover:border-brand-500/30 transition-all hover:-translate-y-1 duration-300 group flex flex-col h-full" noPadding>
                        <div className="p-6 flex-1 flex flex-col">
                           <div className="flex justify-between items-start mb-4">
                              <div className="w-14 h-14 rounded-xl bg-dark-900 p-2 border border-dark-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                 <AppLogo id={app.id} className="w-full h-full" fallbackText={app.icon} />
                              </div>
                              <Badge color="gray">{app.category}</Badge>
                           </div>
                           <h3 className="font-bold text-white text-lg group-hover:text-brand-400 transition-colors">{app.name}</h3>
                           <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3 flex-1">{app.description}</p>
                        </div>
                        <div className="p-4 border-t border-white/5 bg-dark-900/30">
                           {app.installed ? (
                              <Button variant="secondary" className="w-full text-xs" onClick={() => setConfiguringApp(app)}>
                                 <Settings size={14} className="mr-2" /> Configure
                              </Button>
                           ) : (
                              <Button variant="primary" className="w-full text-xs shadow-lg shadow-brand-500/10">Install Connector</Button>
                           )}
                        </div>
                     </Card>
                  ))}
               </div>
            </div>
         )}

         {/* INSTALLED TAB */}
         {activeTab === 'installed' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
               {MOCK_INTEGRATIONS.filter(i => i.installed).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-5 bg-dark-900/50 border border-white/5 rounded-xl backdrop-blur-sm hover:bg-dark-900 hover:border-brand-500/20 transition-all group">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-dark-800 p-2 border border-dark-700 flex items-center justify-center">
                           <AppLogo id={app.id} className="w-full h-full" fallbackText={app.icon} />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-200 text-lg group-hover:text-white transition-colors">{app.name}</h4>
                           <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span className={`flex items-center gap-1.5 ${app.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                                 <span className={`w-2 h-2 rounded-full ${app.status === 'active' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                                 {app.status === 'active' ? 'Connected' : 'Syncing'}
                              </span>
                              <span>•</span>
                              <span>Last sync: 10 mins ago</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" className="text-xs h-9" onClick={() => setConfiguringApp(app)}>
                           <Settings size={14} className="mr-2"/> Settings
                        </Button>
                        <Button variant="ghost" className="text-xs h-9 text-slate-400 hover:text-white"><Activity size={16}/></Button>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* BUILDER TAB */}
         {activeTab === 'builder' && (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                  {/* Left: AI Chat */}
                  <div className="flex flex-col bg-dark-900 border border-dark-700 rounded-xl overflow-hidden h-[600px]">
                     <div className="p-4 border-b border-dark-700 bg-purple-500/10 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-purple-300">
                           <Bot size={20} />
                           <span className="font-bold text-sm uppercase tracking-wider">AI Architect</span>
                        </div>
                        <Badge color="purple">GPT-4o</Badge>
                     </div>
                     
                     <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                        <div className="flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0"><Bot size={16}/></div>
                           <div className="bg-dark-800 p-3 rounded-xl rounded-tl-none border border-dark-700 text-sm text-slate-300">
                              Describe the integration you need. I'll generate the authentication flow, API endpoints, and trigger logic automatically.
                           </div>
                        </div>
                        {isBuilding && (
                           <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0"><Bot size={16}/></div>
                              <div className="bg-dark-800 p-3 rounded-xl rounded-tl-none border border-dark-700 text-sm text-slate-300 flex items-center gap-2">
                                 <RefreshCw size={14} className="animate-spin"/> Generating connector schema...
                              </div>
                           </div>
                        )}
                     </div>

                     <div className="p-4 border-t border-dark-700 bg-dark-950">
                        <div className="relative">
                           <textarea 
                              className="w-full h-24 bg-dark-900 border border-dark-700 rounded-xl p-4 pr-12 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                              placeholder="e.g. Build a connector for Jira that creates a ticket when a contract is signed..."
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                           ></textarea>
                           <button 
                              onClick={handleBuild}
                              disabled={isBuilding || !aiPrompt}
                              className="absolute right-3 bottom-3 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              <ArrowRight size={16}/>
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Right: Preview Canvas */}
                  <div className="bg-dark-950 rounded-xl border border-dark-800 p-8 flex flex-col relative overflow-hidden h-[600px]">
                     <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                     
                     {!builtApp ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
                           <div className="w-24 h-24 bg-dark-900 rounded-3xl flex items-center justify-center border border-dark-700 mb-6 shadow-2xl">
                              <Layers size={40} className="text-slate-600" />
                           </div>
                           <h3 className="text-slate-400 font-medium text-lg">Connector Skeleton</h3>
                           <p className="text-sm text-slate-600 mt-2 max-w-xs">The generated infrastructure will appear here for review.</p>
                        </div>
                     ) : (
                        <div className="flex-1 z-10 animate-in fade-in zoom-in duration-500 flex flex-col">
                           <div className="bg-dark-900 border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl shadow-purple-900/20 flex-1 flex flex-col">
                              <div className="p-4 bg-purple-900/20 border-b border-purple-500/20 flex justify-between items-center">
                                 <span className="font-bold text-purple-100 flex items-center gap-2"><Zap size={16} className="text-yellow-400"/> {builtApp.name}</span>
                                 <div className="flex gap-2">
                                    <Badge color="gray">v0.1-alpha</Badge>
                                    <Badge color="purple">Generated</Badge>
                                 </div>
                              </div>
                              
                              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                 {/* Auth Section */}
                                 <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Key size={12}/> Authentication</h5>
                                    <div className="p-3 bg-dark-950 border border-dark-800 rounded text-xs font-mono text-green-400">
                                       {builtApp.auth} Flow Configured
                                    </div>
                                 </div>

                                 {/* Endpoints */}
                                 <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Server size={12}/> API Endpoints</h5>
                                    {builtApp.endpoints.map((ep: string, i: number) => (
                                       <div key={i} className="p-2 bg-dark-950 border border-dark-800 rounded text-xs font-mono text-blue-300 flex justify-between">
                                          {ep} <Check size={12} className="text-green-500"/>
                                       </div>
                                    ))}
                                 </div>

                                 {/* Triggers */}
                                 <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Zap size={12}/> Workflow Triggers</h5>
                                    {builtApp.triggers.map((tr: string, i: number) => (
                                       <div key={i} className="p-2 bg-dark-950 border border-dark-800 rounded text-xs font-mono text-yellow-300 flex justify-between">
                                          {tr} <MonitorPlay size={12} className="text-slate-500"/>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="p-4 border-t border-white/5 bg-dark-950/50 flex justify-end gap-3">
                                 <Button variant="ghost" onClick={() => setBuiltApp(null)}>Discard</Button>
                                 <Button variant="primary" className="bg-purple-600 hover:bg-purple-500 border-none">Deploy to Sandbox</Button>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default Integrations;
