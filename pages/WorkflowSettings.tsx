
import React, { useState } from 'react';
import { Card, Button, Input, Switch, Select, Badge } from '../components/UIComponents';
import { 
  Sliders, ShieldCheck, Bell, BrainCircuit, Clock, Mail, 
  AlertTriangle, Save, RotateCcw, Sparkles
} from 'lucide-react';

const WorkflowSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    autoRetry: true,
    retryAttempts: 3,
    globalTimeout: 72, // hours
    enableAI: true,
    aiModel: 'gpt-4o',
    notifyOnFailure: true,
    notifyOnSuccess: false,
    adminEmail: 'admin@agreemetrix.ai',
    defaultApprover: 'Legal Team',
    auditLogRetention: 90 // days
  });

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sliders size={24} className="text-brand-400"/> Workflow Engine Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure global execution policies, notifications, and AI defaults.</p>
        </div>
        <Button variant="primary" className="shadow-lg shadow-brand-500/20">
          <Save size={16} className="mr-2"/> Save Changes
        </Button>
      </div>

      {/* Execution Policy */}
      <Card title="Execution Policy" icon={Clock}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold text-white">Auto-Retry Failed Nodes</label>
              <p className="text-xs text-slate-400">Automatically retry transient errors (e.g. API timeouts).</p>
            </div>
            <Switch checked={settings.autoRetry} onChange={c => setSettings({...settings, autoRetry: c})} />
          </div>
          
          {settings.autoRetry && (
            <div className="pl-4 border-l-2 border-dark-700 ml-2 animate-in slide-in-from-top-2">
              <div className="w-48">
                <Input 
                  label="Max Retry Attempts" 
                  type="number" 
                  value={settings.retryAttempts} 
                  onChange={e => setSettings({...settings, retryAttempts: parseInt(e.target.value)})} 
                />
              </div>
            </div>
          )}

          <div className="h-px bg-dark-800"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input 
                label="Global Workflow Timeout (Hours)" 
                type="number" 
                value={settings.globalTimeout} 
                onChange={e => setSettings({...settings, globalTimeout: parseInt(e.target.value)})} 
              />
              <p className="text-[10px] text-slate-500 mt-1">Workflows running longer than this will be suspended.</p>
            </div>
            <div>
              <Input 
                label="Audit Log Retention (Days)" 
                type="number" 
                value={settings.auditLogRetention} 
                onChange={e => setSettings({...settings, auditLogRetention: parseInt(e.target.value)})} 
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card title="Notifications & Alerts" icon={Bell}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-4 bg-dark-950 border border-dark-700 rounded-xl flex items-center justify-between">
                <span className="text-sm text-slate-300">Notify Admin on Failure</span>
                <Switch checked={settings.notifyOnFailure} onChange={c => setSettings({...settings, notifyOnFailure: c})} />
             </div>
             <div className="p-4 bg-dark-950 border border-dark-700 rounded-xl flex items-center justify-between">
                <span className="text-sm text-slate-300">Notify Owner on Completion</span>
                <Switch checked={settings.notifyOnSuccess} onChange={c => setSettings({...settings, notifyOnSuccess: c})} />
             </div>
          </div>
          
          <Input 
            label="Emergency Contact Email" 
            value={settings.adminEmail} 
            onChange={e => setSettings({...settings, adminEmail: e.target.value})}
            placeholder="ops@company.com"
          />
        </div>
      </Card>

      {/* AI Configuration */}
      <Card title="AI Agent Configuration" icon={BrainCircuit}>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg"><Sparkles size={20}/></div>
               <div>
                  <h4 className="text-sm font-bold text-white">AI Decision Engine</h4>
                  <p className="text-xs text-brand-200/70">Allow AI to make routing decisions based on risk score.</p>
               </div>
            </div>
            <Switch checked={settings.enableAI} onChange={c => setSettings({...settings, enableAI: c})} />
          </div>

          <div className="grid grid-cols-2 gap-6">
             <Select 
                label="Default LLM Model" 
                options={[{label: 'GPT-4o', value: 'gpt-4o'}, {label: 'Claude 3.5 Sonnet', value: 'claude-3.5'}, {label: 'Gemini Pro 1.5', value: 'gemini-pro'}]}
                value={settings.aiModel}
                onChange={e => setSettings({...settings, aiModel: e.target.value})}
             />
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Safety Threshold</label>
                <div className="flex items-center gap-2 bg-dark-950 border border-dark-700 rounded-lg px-3 py-2">
                   <ShieldCheck size={16} className="text-green-400"/>
                   <span className="text-sm text-white">Strict</span>
                </div>
             </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="p-6 border border-red-500/30 bg-red-500/5 rounded-xl">
         <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-2"><AlertTriangle size={16}/> Danger Zone</h4>
         <div className="flex items-center justify-between">
            <p className="text-xs text-red-200/70">Reset all running workflows to their initial state. This cannot be undone.</p>
            <Button variant="danger" className="text-xs h-8">Purge Active Flows</Button>
         </div>
      </div>
    </div>
  );
};

export default WorkflowSettings;
