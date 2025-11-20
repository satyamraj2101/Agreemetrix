
import React, { useState } from 'react';
import { Card, Button, Input, Badge, Select } from '../components/UIComponents';
import { MOCK_INTEGRATIONS, MOCK_SYNC_LOGS } from '../mock/data';
import { IntegrationApp, FieldMapping } from '../types';
import { Search, CheckCircle, Plus, Zap, Box, Code, Bot, ArrowRight, MonitorPlay, Settings, ArrowLeftRight, ArrowRightLeft, ArrowLeft, Database, RefreshCw, Activity, AlertTriangle, Terminal, Copy, Server, Globe, Key } from 'lucide-react';

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

const HubSpotLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM4 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM20 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#FF7A59"/>
    <path d="M12 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="#FF7A59"/>
    <path d="M12 6v6M6 11h12" stroke="#FF7A59" strokeWidth="2"/>
  </svg>
);

const JiraLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M11.5 2H6.6c-2.2 0-4 1.8-4 4v5.5h4.9c2.2 0 4-1.8 4-4V2z" fill="#2684FF"/>
    <path d="M17.5 2h-4v5.5c0 2.2 1.8 4 4 4h4v-5.5c0-2.2-1.8-4-4-4z" fill="#0052CC"/>
    <path d="M13.5 12.5H8.6c-2.2 0-4 1.8-4 4V22h4.9c2.2 0 4-1.8 4-4v-5.5z" fill="#0052CC"/>
  </svg>
);

const DocuSignLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 18h18v2H3v-2zm0-5h18v2H3v-2zm0-5h12v2H3V8z" fill="#FFC423"/>
    <path d="M19.5 4l-2.5 5h5l-2.5-5z" fill="#000"/>
  </svg>
);

const SAPLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10h-4c0-3.31-2.69-6-6-6S6 8.69 6 12s2.69 6 6 6v4c-5.52 0-10-4.48-10-10z" fill="#008FD3"/>
    <path d="M18 16h4c0 3.04-1.38 5.77-3.55 7.57L16.2 20.2A6.01 6.01 0 0 0 18 16z" fill="#008FD3"/>
  </svg>
);

const GoogleDriveLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8.3 5l-5.4 9.3L9 22h10.7l5.4-9.3L19.1 5H8.3z" fill="none"/>
    <path d="M19.1 5H8.3l5.4 9.3H25L19.1 5z" fill="#FFC107"/>
    <path d="M13.7 14.3L8.3 5H2.5l5.4 9.3 5.8 0z" fill="#00A85D"/>
    <path d="M8.3 23h10.8l5.4-9.3-2.9-5.4L2.5 23h5.8z" fill="#2962FF"/>
  </svg>
);

const OneDriveLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14.5 8.5a4.5 4.5 0 0 0-4.4 3.6 3.5 3.5 0 0 0-5.6 3.4A3.5 3.5 0 0 0 8 19h11.5a4.5 4.5 0 0 0 0-9 4.5 4.5 0 0 0-5-1.5z" fill="#0078D4"/>
  </svg>
);

const AppLogo: React.FC<{ id: string; className?: string; fallbackText?: string }> = ({ id, className = '', fallbackText }) => {
  switch (id) {
    case 'sf': return <SalesforceLogo className={className} />;
    case 'slack': return <SlackLogo className={className} />;
    case 'hubspot': return <HubSpotLogo className={className} />;
    case 'jira': return <JiraLogo className={className} />;
    case 'docusign': return <DocuSignLogo className={className} />;
    case 'sap': return <SAPLogo className={className} />;
    case 'drive': return <GoogleDriveLogo className={className} />;
    case 'onedrive': return <OneDriveLogo className={className} />;
    default: return <div className={`font-bold flex items-center justify-center w-full h-full bg-dark-800 rounded-lg text-slate-400 ${className}`}>{fallbackText || 'APP'}</div>;
  }
};

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'installed' | 'builder'>('market');
  const [builderMode, setBuilderMode] = useState<'ai' | 'cli'>('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [builtApp, setBuiltApp] = useState<any>(null);
  
  // Configuration State
  const [configuringApp, setConfiguringApp] = useState<IntegrationApp | null>(null);
  const [configTab, setConfigTab] = useState<'mapping' | 'monitor'>('mapping');

  const handleBuild = () => {
    if(!aiPrompt) return;
    setIsBuilding(true);
    setTimeout(() => {
       setIsBuilding(false);
       setBuiltApp({
          name: 'Custom Connector',
          description: 'Generated from: ' + aiPrompt,
          steps: ['Auth Trigger', 'Fetch Data', 'Map Fields', 'Post to API']
       });
    }, 2000);
  };

  const handleConfigure = (app: IntegrationApp) => {
    setConfiguringApp(app);
    setConfigTab('mapping');
  };

  const handleBackToHub = () => {
    setConfiguringApp(null);
  };

  if (configuringApp) {
    return (
      <div className="space-y-6 h-full flex flex-col">
         <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" onClick={handleBackToHub} className="p-2"><ArrowLeft size={20} /></Button>
            <div>
               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8">
                    <AppLogo id={configuringApp.id} className="w-full h-full" fallbackText={configuringApp.icon} />
                  </div>
                  {configuringApp.name} 
                  <span className="text-slate-400 font-normal text-lg">Configuration</span>
               </h2>
               <p className="text-sm text-slate-400">Manage data synchronization and field mapping.</p>
            </div>
         </div>

         <div className="flex border-b border-white/10 mb-4">
           <button 
             onClick={() => setConfigTab('mapping')}
             className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${configTab === 'mapping' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-white'}`}
           >
             <Database size={16}/> Field Mapping
           </button>
           <button 
             onClick={() => setConfigTab('monitor')}
             className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${configTab === 'monitor' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-white'}`}
           >
             <Activity size={16}/> Activity Monitor
           </button>
         </div>

         <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
            <div className="col-span-12 lg:col-span-4 space-y-6">
               <Card title="Connection Status">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-white">Connected</h4>
                        <p className="text-xs text-slate-500">Last sync: 2 mins ago</p>
                     </div>
                  </div>
                  <Button variant="secondary" className="w-full text-xs flex justify-center items-center gap-2">
                     <RefreshCw size={14} /> Force Sync Now
                  </Button>
               </Card>

               <Card title="Webhooks & API">
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs text-slate-500 uppercase font-bold">Callback URL</label>
                        <div className="flex gap-2 mt-1">
                           <Input value={`https://api.agreemetrix.ai/hooks/v1/${configuringApp.id}/callback`} disabled className="text-xs font-mono text-slate-400" />
                           <Button variant="secondary" className="px-3">Copy</Button>
                        </div>
                     </div>
                     <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex gap-2 text-blue-400 items-start">
                           <Bot size={16} className="mt-0.5" />
                           <p className="text-xs">
                              <strong>AI Tip:</strong> Enable "Real-time Events" in {configuringApp.name} to trigger workflows instantly when data changes.
                           </p>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>

            <div className="col-span-12 lg:col-span-8 flex flex-col h-full overflow-hidden">
               {configTab === 'mapping' && (
                 <Card className="flex-1 flex flex-col overflow-hidden" title="Field Mapping Database" noPadding>
                    <div className="p-4 bg-dark-900/50 border-b border-white/5">
                       <p className="text-sm text-slate-400">
                          Map external fields from <strong>{configuringApp.name}</strong> to internal Agreemetrix variables. 
                          These variables can be used in the <strong>Workflow Builder</strong> logic.
                       </p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-0">
                       <table className="w-full text-left text-sm text-slate-400">
                          <thead className="text-xs uppercase bg-dark-950 text-slate-500 font-semibold sticky top-0">
                             <tr>
                                <th className="px-6 py-3">External Field (API)</th>
                                <th className="px-6 py-3 text-center">Sync Direction</th>
                                <th className="px-6 py-3">Internal Variable</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-right">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-dark-800">
                             {(configuringApp.mappings || []).map((mapping) => (
                                <tr key={mapping.id} className="hover:bg-white/5 transition-colors group">
                                   <td className="px-6 py-4 font-mono text-white">
                                      {mapping.externalField}
                                   </td>
                                   <td className="px-6 py-4 text-center">
                                      <Badge color="blue" className="inline-flex gap-1 items-center">
                                         {mapping.direction === 'import' && <ArrowRight size={12} />}
                                         {mapping.direction === 'export' && <ArrowLeft size={12} />}
                                         {mapping.direction === 'bidirectional' && <ArrowLeftRight size={12} />}
                                         {mapping.direction}
                                      </Badge>
                                   </td>
                                   <td className="px-6 py-4 font-mono text-brand-400">
                                      {mapping.internalVariable}
                                   </td>
                                   <td className="px-6 py-4 text-xs">
                                      {mapping.dataType}
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                      <Button variant="ghost" className="text-xs h-8 text-red-400 hover:text-red-300">Remove</Button>
                                   </td>
                                </tr>
                             ))}
                             {(!configuringApp.mappings || configuringApp.mappings.length === 0) && (
                                <tr>
                                   <td colSpan={5} className="text-center py-8 text-slate-500">
                                      No mappings configured. Add one below.
                                   </td>
                                </tr>
                             )}
                          </tbody>
                       </table>
                    </div>

                    <div className="p-4 border-t border-white/5 bg-dark-900/30 flex gap-3 items-end">
                       <div className="flex-1">
                          <Input label="External Field API Name" placeholder="e.g. CloseDate" />
                       </div>
                       <div className="w-32">
                          <Select label="Direction" options={[
                             {label: 'Import ->', value: 'import'},
                             {label: '<- Export', value: 'export'},
                             {label: '<-> Sync', value: 'bidirectional'}
                          ]} />
                       </div>
                       <div className="flex-1">
                          <Select label="Internal Variable" options={[
                             {label: 'Contract Value', value: 'system.value'},
                             {label: 'Start Date', value: 'contract.startDate'},
                             {label: 'Risk Score', value: 'system.risk'},
                             {label: 'Counterparty Region', value: 'system.region'}
                          ]} />
                       </div>
                       <Button variant="primary" className="mb-0.5"><Plus size={16} /> Add Mapping</Button>
                    </div>
                 </Card>
               )}

               {configTab === 'monitor' && (
                  <Card className="flex-1 flex flex-col overflow-hidden" title="Activity Logs" noPadding>
                     <div className="flex-1 overflow-y-auto p-0">
                        <table className="w-full text-left text-sm text-slate-400">
                           <thead className="text-xs uppercase bg-dark-950 text-slate-500 font-semibold sticky top-0">
                              <tr>
                                 <th className="px-6 py-3">Timestamp</th>
                                 <th className="px-6 py-3">Direction</th>
                                 <th className="px-6 py-3">Status</th>
                                 <th className="px-6 py-3">Records</th>
                                 <th className="px-6 py-3">Details</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-dark-800">
                              {MOCK_SYNC_LOGS.filter(log => log.integrationId === configuringApp.id).map(log => (
                                 <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.timestamp}</td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-2">
                                          {log.direction === 'Inbound' ? <ArrowRight size={14} className="text-blue-400"/> : <ArrowLeft size={14} className="text-purple-400"/>}
                                          {log.direction}
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <Badge color={log.status === 'Success' ? 'green' : log.status === 'Warning' ? 'yellow' : 'red'}>
                                          {log.status}
                                       </Badge>
                                    </td>
                                    <td className="px-6 py-4">{log.records}</td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-2">
                                          {log.status === 'Failed' && <AlertTriangle size={14} className="text-red-400"/>}
                                          {log.message}
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                              {MOCK_SYNC_LOGS.filter(log => log.integrationId === configuringApp.id).length === 0 && (
                                 <tr>
                                    <td colSpan={5} className="text-center py-8 text-slate-500">No activity recorded yet.</td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </Card>
               )}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-6">
         <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Integration Hub</h2>
            <p className="text-slate-400">Connect your favorite tools or build custom apps with AI.</p>
         </div>
         
         <div className="flex items-center border-b border-white/10">
            <button 
               onClick={() => setActiveTab('market')}
               className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'market' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
               App Marketplace
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
               <Bot size={16} /> App Builder
            </button>
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
         
         {/* Marketplace Tab */}
         {activeTab === 'market' && (
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="relative flex-1 max-w-md">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                     <Input placeholder="Search apps (e.g. Salesforce, Slack)..." className="pl-10 bg-dark-900" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {MOCK_INTEGRATIONS.map(app => (
                     <Card key={app.id} className="hover:border-brand-500/30 transition-colors flex flex-col group" noPadding>
                        <div className="p-5 flex-1">
                           <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 rounded-xl bg-dark-900 p-1 border border-dark-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                 <AppLogo id={app.id} className="w-full h-full" fallbackText={app.icon} />
                              </div>
                              <Badge color="gray">{app.category}</Badge>
                           </div>
                           <h3 className="font-bold text-white text-lg group-hover:text-brand-400 transition-colors">{app.name}</h3>
                           <p className="text-xs text-slate-400 mt-2 leading-relaxed h-10 line-clamp-2">{app.description}</p>
                        </div>
                        <div className="p-4 border-t border-white/5 bg-dark-900/30">
                           {app.installed ? (
                              <Button variant="secondary" className="w-full text-xs" onClick={() => handleConfigure(app)}>
                                 <Settings size={14} className="mr-2" /> Configure
                              </Button>
                           ) : (
                              <Button variant="primary" className="w-full text-xs">Install App</Button>
                           )}
                        </div>
                     </Card>
                  ))}
               </div>
            </div>
         )}

         {/* Installed Tab */}
         {activeTab === 'installed' && (
            <div className="space-y-4">
               {MOCK_INTEGRATIONS.filter(i => i.installed).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-dark-900/50 border border-white/5 rounded-xl backdrop-blur-sm hover:bg-dark-900 hover:border-brand-500/20 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-dark-800 p-1 border border-dark-700 flex items-center justify-center">
                           <AppLogo id={app.id} className="w-full h-full" fallbackText={app.icon} />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-200 text-lg">{app.name}</h4>
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className={`w-2 h-2 rounded-full ${app.status === 'active' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                              {app.status === 'active' ? 'Connected & Syncing' : 'Sync in progress...'}
                              {app.mappings && app.mappings.length > 0 && (
                                 <Badge color="blue">{app.mappings.length} Active Mappings</Badge>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="secondary" className="text-xs flex items-center gap-2" onClick={() => handleConfigure(app)}>
                           <Database size={14} /> Mapping DB
                        </Button>
                        <Button variant="ghost" className="text-xs text-red-400 hover:text-red-300">Disconnect</Button>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Builder Tab */}
         {activeTab === 'builder' && (
            <div className="h-full flex flex-col">
               {/* Mode Switcher */}
               <div className="flex gap-4 mb-6 p-1 bg-dark-900 rounded-lg border border-dark-700 w-fit">
                  <button 
                     onClick={() => setBuilderMode('ai')} 
                     className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${builderMode === 'ai' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                     <Bot size={16} /> AI Generator
                  </button>
                  <button 
                     onClick={() => setBuilderMode('cli')} 
                     className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${builderMode === 'cli' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                     <Terminal size={16} /> Custom App (CLI)
                  </button>
               </div>

               {builderMode === 'ai' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                     {/* Input Side */}
                     <Card className="flex flex-col" title="Create Custom App">
                        <div className="flex-1 space-y-6">
                           <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                              <div className="flex items-center gap-3 text-purple-400 mb-2">
                                 <Bot size={20} />
                                 <span className="font-bold text-sm uppercase tracking-wider">AI Assistant</span>
                              </div>
                              <p className="text-xs text-purple-200/70">Describe the integration you need. I can build connectors for REST APIs, Webhooks, or database syncs automatically.</p>
                           </div>

                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">What should this app do?</label>
                              <textarea 
                                 className="w-full h-32 bg-dark-950 border border-dark-700 rounded-xl p-4 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                                 placeholder="e.g. When a new contract is signed in Agreemetrix, create a folder in SharePoint and email the finance team..."
                                 value={aiPrompt}
                                 onChange={(e) => setAiPrompt(e.target.value)}
                              ></textarea>
                           </div>

                           <div className="flex gap-4">
                              <Button variant="primary" onClick={handleBuild} disabled={isBuilding || !aiPrompt} className="bg-purple-600 hover:bg-purple-700 w-full flex justify-center gap-2">
                                 {isBuilding ? <Zap className="animate-spin" size={16}/> : <Zap size={16}/>}
                                 {isBuilding ? 'Generating Logic...' : 'Build App'}
                              </Button>
                              <Button variant="secondary" className="w-full flex justify-center gap-2">
                                 <Code size={16} /> Manual Code
                              </Button>
                           </div>
                        </div>
                     </Card>

                     {/* Output Side */}
                     <div className="bg-dark-950 rounded-xl border border-dark-800 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                        
                        {!builtApp && !isBuilding && (
                           <div className="text-center z-10">
                              <div className="w-20 h-20 bg-dark-900 rounded-2xl flex items-center justify-center border border-dark-700 mx-auto mb-4 shadow-xl">
                                 <Box size={40} className="text-slate-600" />
                              </div>
                              <h3 className="text-slate-500 font-medium">Preview Canvas</h3>
                              <p className="text-xs text-slate-600 mt-2">Your generated app structure will appear here.</p>
                           </div>
                        )}

                        {isBuilding && (
                           <div className="flex flex-col items-center z-10">
                              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                              <p className="text-purple-400 text-sm font-mono animate-pulse">Analyzing intent...</p>
                           </div>
                        )}

                        {builtApp && (
                           <div className="w-full max-w-sm z-10 animate-in fade-in zoom-in duration-300">
                              <div className="bg-dark-900 border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl shadow-purple-900/20">
                                 <div className="p-4 bg-purple-900/20 border-b border-purple-500/20 flex justify-between items-center">
                                    <span className="font-bold text-purple-100 flex items-center gap-2"><Zap size={14} className="text-yellow-400"/> {builtApp.name}</span>
                                    <Badge color="green">Draft</Badge>
                                 </div>
                                 <div className="p-6 space-y-4">
                                    {builtApp.steps.map((step: string, i: number) => (
                                       <div key={i} className="flex items-center gap-3">
                                          <div className="w-6 h-6 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">{i+1}</div>
                                          <div className="flex-1 p-3 bg-dark-950 rounded border border-dark-700 text-xs text-slate-300 flex justify-between items-center">
                                             {step}
                                             <MonitorPlay size={12} className="text-slate-600"/>
                                          </div>
                                       </div>
                                    ))}
                                    <div className="pt-4 mt-4 border-t border-white/5">
                                       <Button className="w-full text-xs bg-purple-600 hover:bg-purple-700">Deploy to Production</Button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               ) : (
                  /* Custom App CLI Mode */
                  <div className="grid grid-cols-12 gap-8 h-full">
                     {/* Left: Quick Start & Instructions */}
                     <div className="col-span-12 lg:col-span-7 space-y-6">
                        <Card title="Develop Local Node.js App">
                           <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-800 mb-4">
                              <p className="text-sm text-slate-300 leading-relaxed">
                                 Build robust integrations using our <strong>Node.js SDK</strong>. Develop on your local machine, test with live data, and push to the Agreemetrix cloud when ready.
                              </p>
                           </div>

                           <div className="space-y-6">
                              <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><Terminal size={14} /> 1. Install CLI Tool</h4>
                                 <div className="bg-dark-950 border border-dark-800 rounded-lg p-3 font-mono text-xs text-slate-300 flex justify-between items-center group">
                                    <span className="text-green-400">$ npm install -g @agreemetrix/cli</span>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-slate-400"><Copy size={14}/></button>
                                 </div>
                              </div>

                              <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><Box size={14} /> 2. Initialize Project</h4>
                                 <div className="bg-dark-950 border border-dark-800 rounded-lg p-3 font-mono text-xs text-slate-300 flex justify-between items-center group">
                                    <span className="text-blue-400">$ agmt init my-custom-integration</span>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-slate-400"><Copy size={14}/></button>
                                 </div>
                              </div>

                              <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><Server size={14} /> 3. Deploy App</h4>
                                 <div className="bg-dark-950 border border-dark-800 rounded-lg p-3 font-mono text-xs text-slate-300 flex justify-between items-center group">
                                    <span className="text-yellow-400">$ agmt deploy --prod</span>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-slate-400"><Copy size={14}/></button>
                                 </div>
                              </div>
                           </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                           <a href="#" className="p-4 bg-dark-900 border border-dark-700 rounded-xl hover:border-brand-500/50 transition-colors flex items-center gap-3">
                              <div className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-slate-400"><Code size={20}/></div>
                              <div>
                                 <h5 className="font-bold text-white text-sm">SDK Documentation</h5>
                                 <p className="text-xs text-slate-500">View API Reference</p>
                              </div>
                           </a>
                           <a href="#" className="p-4 bg-dark-900 border border-dark-700 rounded-xl hover:border-brand-500/50 transition-colors flex items-center gap-3">
                              <div className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-slate-400"><Globe size={20}/></div>
                              <div>
                                 <h5 className="font-bold text-white text-sm">Community Samples</h5>
                                 <p className="text-xs text-slate-500">GitHub Repository</p>
                              </div>
                           </a>
                        </div>
                     </div>

                     {/* Right: Credentials & Status */}
                     <div className="col-span-12 lg:col-span-5 space-y-6">
                        <Card title="App Credentials">
                           <div className="space-y-4">
                              <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">Client ID</label>
                                 <div className="flex gap-2 mt-1">
                                    <Input value="85739205823" disabled className="font-mono text-xs bg-dark-950" />
                                    <Button variant="secondary" className="px-3"><Copy size={14}/></Button>
                                 </div>
                              </div>
                              <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">Client Secret</label>
                                 <div className="flex gap-2 mt-1">
                                    <Input value="sk_live_99283492834..." type="password" disabled className="font-mono text-xs bg-dark-950" />
                                    <Button variant="secondary" className="px-3"><Key size={14}/></Button>
                                 </div>
                              </div>
                              <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">Signing Secret</label>
                                 <div className="flex gap-2 mt-1">
                                    <Input value="whsec_8723487234" type="password" disabled className="font-mono text-xs bg-dark-950" />
                                    <Button variant="secondary" className="px-3"><Key size={14}/></Button>
                                 </div>
                              </div>
                              <Button variant="primary" className="w-full mt-2 text-xs">Regenerate Tokens</Button>
                           </div>
                        </Card>

                        <Card title="Your Deployments" noPadding>
                           <div className="divide-y divide-dark-800">
                              <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                 <div>
                                    <h5 className="text-sm font-bold text-white flex items-center gap-2"><Box size={14} className="text-blue-400"/> Payroll Sync v1</h5>
                                    <p className="text-xs text-slate-500">Updated 2 hours ago</p>
                                 </div>
                                 <Badge color="green">Live</Badge>
                              </div>
                              <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                 <div>
                                    <h5 className="text-sm font-bold text-white flex items-center gap-2"><Box size={14} className="text-slate-400"/> Inventory Check v0.2</h5>
                                    <p className="text-xs text-slate-500">Updated yesterday</p>
                                 </div>
                                 <Badge color="yellow">Dev</Badge>
                              </div>
                           </div>
                           <div className="p-4 border-t border-dark-800 bg-dark-950/30">
                              <Button variant="ghost" className="w-full text-xs text-slate-500">View All Deployments</Button>
                           </div>
                        </Card>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
};

export default Integrations;
