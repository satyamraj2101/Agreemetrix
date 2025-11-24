
import React, { useState, useEffect, useMemo } from 'react';
import { WorkflowNode, ConditionRule, WorkflowStageDefinition } from '../../types';
import { Input, Select, Button, Badge, Switch, Avatar } from '../UIComponents';
import { 
  Trash2, Plus, X, HelpCircle, AlertCircle, FileText, User, Link as LinkIcon, 
  Database, Mail, Braces, Clock, CheckSquare, BrainCircuit, Settings, GitBranch, 
  Play, Shield, Activity, History, AlertTriangle, Code, 
  Zap, Split, Filter, ListFilter, ChevronDown, ChevronRight, CheckCircle2, Terminal
} from 'lucide-react';
import { MOCK_TEMPLATES, MOCK_USERS, MOCK_ROLES, MOCK_FORMS, MOCK_EMAIL_TEMPLATES, MOCK_CLAUSES, MOCK_TABLES } from '../../mock/data';

interface PropertiesPanelProps {
  node: WorkflowNode | null;
  stages: WorkflowStageDefinition[];
  onChange: (node: WorkflowNode) => void;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
}

// --- CONSTANTS FOR LOGIC BUILDER ---

const GET_OPERATORS = (type: string = 'string') => {
    switch (type) {
        case 'number':
        case 'currency':
            return [
                { label: 'Equals (=)', value: 'eq' },
                { label: 'Not Equals (!=)', value: 'neq' },
                { label: 'Greater Than (>)', value: 'gt' },
                { label: 'Less Than (<)', value: 'lt' },
                { label: 'Greater or Equal (>=)', value: 'gte' },
                { label: 'Less or Equal (<=)', value: 'lte' },
            ];
        case 'boolean':
            return [
                { label: 'Is True', value: 'true' },
                { label: 'Is False', value: 'false' },
            ];
        case 'date':
            return [
                { label: 'Before', value: 'before' },
                { label: 'After', value: 'after' },
                { label: 'On Date', value: 'on' },
                { label: 'Is Today', value: 'is_today' },
            ];
        default: // string, select, user
            return [
                { label: 'Equals', value: 'eq' },
                { label: 'Contains', value: 'contains' },
                { label: 'Starts With', value: 'starts_with' },
                { label: 'Ends With', value: 'ends_with' },
                { label: 'Is Empty', value: 'is_empty' },
                { label: 'Matches Regex', value: 'regex' },
            ];
    }
};

// --- REUSABLE SUB-COMPONENTS ---

const SmartInput: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (val: string) => void;
    multiline?: boolean;
    placeholder?: string;
    rows?: number;
    className?: string;
    schemaTree: Record<string, {label: string, value: string, type: string}[]>;
}> = ({ label, value, onChange, multiline, placeholder, rows = 3, className = '', schemaTree }) => {
    const [showVars, setShowVars] = useState(false);
    
    const insertVar = (v: string) => {
        onChange((value || '') + v);
        setShowVars(false);
    };

    return (
        <div className={`relative group/smart ${className}`}>
            <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">{label}</label>
                <button 
                    onClick={() => setShowVars(!showVars)}
                    className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-1"
                    title="Insert Smart Variable"
                >
                    <Braces size={10}/> Insert Variable
                </button>
            </div>
            
            {showVars && (
                <div className="absolute right-0 top-6 z-50 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl p-1 max-h-40 overflow-y-auto animate-in fade-in zoom-in-95 custom-scrollbar">
                    <div className="text-[9px] text-slate-500 px-2 py-1 uppercase font-bold">Schema Variables</div>
                    {Object.entries(schemaTree).map(([category, fields]) => (
                        <div key={category}>
                            <div className="px-2 py-1 text-[9px] font-bold text-slate-600 bg-dark-900">{category}</div>
                            {(fields as {label: string, value: string, type: string}[]).map(f => (
                                <button 
                                    key={f.value}
                                    onClick={() => insertVar(`{{${f.value}}}`)}
                                    className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-brand-500 hover:text-white transition-colors truncate"
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {multiline ? (
                <textarea 
                    className="w-full bg-dark-950 border border-dark-700 rounded-lg p-3 text-xs text-slate-300 focus:border-brand-500 outline-none resize-none transition-colors"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                />
            ) : (
                <input 
                    className="w-full rounded-lg bg-dark-950 border border-dark-700 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all hover:border-dark-600 shadow-inner"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

const FieldMapper: React.FC<{
    mappings: Record<string, string>;
    onChange: (mappings: Record<string, string>) => void;
    sourceOptions: string[];
}> = ({ mappings, onChange, sourceOptions }) => {
    const addMapping = () => onChange({ ...mappings, '': '' });
    const removeMapping = (key: string) => {
        const newMap = { ...mappings };
        delete newMap[key];
        onChange(newMap);
    };
    const updateMapping = (oldKey: string, newKey: string, val: string) => {
        const newMap = { ...mappings };
        if (oldKey !== newKey) delete newMap[oldKey];
        newMap[newKey] = val;
        onChange(newMap);
    };

    return (
        <div className="space-y-2 bg-dark-950 border border-dark-700 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
                <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><LinkIcon size={12}/> Field Map</h5>
                <button onClick={() => addMapping()} className="text-[10px] text-brand-400 hover:underline">+ Add Field</button>
            </div>
            {Object.entries(mappings || {}).map(([key, val], i) => (
                <div key={i} className="flex gap-2 items-center">
                    <input 
                        className="flex-1 bg-dark-900 border border-dark-800 rounded px-2 py-1.5 text-xs text-white" 
                        placeholder="External Field"
                        value={key}
                        onChange={(e) => updateMapping(key, e.target.value, val as string)}
                    />
                    <span className="text-slate-600">→</span>
                    <select 
                        className="flex-1 bg-dark-900 border border-dark-800 rounded px-2 py-1.5 text-xs text-slate-300"
                        value={val as string}
                        onChange={(e) => updateMapping(key, key, e.target.value)}
                    >
                        <option value="">Select Var...</option>
                        {sourceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <button onClick={() => removeMapping(key)} className="text-slate-600 hover:text-red-400"><X size={12}/></button>
                </div>
            ))}
            {Object.keys(mappings || {}).length === 0 && <div className="text-center text-[10px] text-slate-600 py-2">No fields mapped.</div>}
        </div>
    );
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ node, stages, onChange, onClose, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'logic' | 'sim' | 'audit'>('config');
  const [conditionMode, setConditionMode] = useState<'visual' | 'code'>('visual');
  const [expandedSchema, setExpandedSchema] = useState<Record<string, boolean>>({ 'Contract': true });
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | null>(null);

  // Dynamic Schema Tree Generation from Mock Tables
  const schemaTree = useMemo(() => {
      const tree: Record<string, {label: string, value: string, type: string}[]> = {};
      
      MOCK_TABLES.forEach(table => {
          tree[table.name] = table.fields.map(field => ({
              label: field.name,
              value: field.key,
              type: field.type as string
          }));
      });
      
      // Add System Globals
      tree['System'] = [
          { label: 'Current Date', value: 'system.date', type: 'date' },
          { label: 'Environment', value: 'system.env', type: 'string' },
          { label: 'User Role', value: 'user.role', type: 'string' }
      ];

      return tree;
  }, []);

  // Flattened list for mappings
  const allFields = useMemo(() => {
      return (Object.values(schemaTree) as {label: string, value: string, type: string}[][]).flat().map(f => f.value);
  }, [schemaTree]);

  if (!node) return null;

  // Handlers
  const updateConfig = (key: string, value: any) => {
    onChange({
      ...node,
      config: { ...node.config, [key]: value }
    });
  };

  // Logic Rule Handlers
  const addRule = () => {
    const newRule: ConditionRule = { id: `r_${Date.now()}`, field: '', operator: 'equals', value: '', logic: 'AND' };
    updateConfig('rules', [...(node.config.rules || []), newRule]);
  };
  const updateRule = (idx: number, key: string, val: any) => {
    const rules = [...(node.config.rules || [])];
    rules[idx] = { ...rules[idx], [key]: val };
    updateConfig('rules', rules);
  };
  const removeRule = (idx: number) => {
    const rules = [...(node.config.rules || [])];
    rules.splice(idx, 1);
    updateConfig('rules', rules);
  };

  // --- DYNAMIC CONFIG RENDERERS ---

  const renderSpecificConfig = () => {
    switch (node.type) {
      // --- TRIGGERS ---
      case 'form_submission':
        return (
          <div className="space-y-4">
            <Select label="Intake Form Template" options={MOCK_FORMS.map(f => ({label: f.name, value: f.id}))} value={node.config.formId || ''} onChange={e => updateConfig('formId', e.target.value)} />
            <Switch checked={node.config.validateRules} onChange={c => updateConfig('validateRules', c)} className="mt-2" /> <span className="text-xs ml-2 text-slate-300">Validate Responses (Regex/Required)</span>
            <div className="text-xs text-slate-500 italic mt-1">Mapping configured in Integration settings.</div>
          </div>
        );
      case 'crm_opportunity':
        return (
          <div className="space-y-4">
            <Select label="CRM System" options={[{label: 'Salesforce', value: 'sf'}, {label: 'HubSpot', value: 'hs'}]} value={node.config.integrationId || 'sf'} onChange={e => updateConfig('integrationId', e.target.value)} />
            <Select label="CRM Object" options={[{label: 'Opportunity', value: 'Opportunity'}, {label: 'Quote', value: 'Quote'}, {label: 'Order', value: 'Order'}]} value={node.config.crmObject || 'Opportunity'} onChange={e => updateConfig('crmObject', e.target.value)} />
            <Input label="Match Rule (ID/Email)" placeholder="OpportunityId" value={node.config.matchRule || ''} onChange={e => updateConfig('matchRule', e.target.value)} />
            <Select label="Trigger Stage" options={[{label: 'Closed Won', value: 'Closed Won'}, {label: 'Negotiation', value: 'Negotiation'}, {label: 'Proposal', value: 'Proposal'}]} value={node.config.crmTriggerStage || 'Closed Won'} onChange={e => updateConfig('crmTriggerStage', e.target.value)} />
          </div>
        );
      case 'manual_request':
        return (
          <div className="space-y-4">
             <div className="p-3 bg-dark-950 border border-dark-700 rounded-lg">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Who can invoke?</label>
                <div className="flex flex-wrap gap-2">
                   {['Sales', 'Legal', 'All Users'].map(role => (
                      <label key={role} className="flex items-center gap-1 text-xs text-slate-300 cursor-pointer bg-dark-900 px-2 py-1 rounded border border-dark-800">
                         <input type="checkbox" className="rounded border-dark-600 bg-dark-950 text-brand-500" /> {role}
                      </label>
                   ))}
                </div>
             </div>
             <Select label="Default Start Stage" options={stages.map(s => ({label: s.name, value: s.id}))} value={node.config.stageId || ''} onChange={e => updateConfig('stageId', e.target.value)} />
          </div>
        );
      case 'webhook_in':
        return (
          <div className="space-y-4">
             <Input label="Endpoint URL" value={`https://api.agreemetrix.ai/hooks/${node.id}`} disabled className="font-mono text-slate-500 bg-dark-900"/>
             <Input label="HMAC Secret" value={node.config.webhookSecret || ''} onChange={e => updateConfig('webhookSecret', e.target.value)} type="password"/>
             <Select label="Auto-Response" options={[{label: '200 OK', value: '200'}, {label: '202 Accepted', value: '202'}]} value={node.config.responseCode || '200'} onChange={e => updateConfig('responseCode', e.target.value)} />
          </div>
        );
      case 'scheduled_run':
        return (
          <div className="space-y-4">
            <Input label="Cron Expression" value={node.config.cronExpression || '0 0 * * *'} onChange={e => updateConfig('cronExpression', e.target.value)} className="font-mono"/>
            <Select label="Timezone" options={[{label: 'UTC', value: 'UTC'}, {label: 'EST', value: 'EST'}, {label: 'PST', value: 'PST'}]} value={node.config.timezone || 'UTC'} onChange={e => updateConfig('timezone', e.target.value)} />
            <p className="text-[10px] text-slate-500 bg-dark-950 p-2 rounded border border-dark-700 font-mono">Next run: Tomorrow at 12:00 AM</p>
          </div>
        );
      case 'contract_imported':
         return (
            <div className="space-y-4">
               <Select label="Source" options={[{label: 'Any Source', value: 'any'}, {label: 'Email Ingest', value: 'email'}, {label: 'Bulk Upload', value: 'bulk'}, {label: 'API', value: 'api'}]} value={node.config.importSource || 'any'} onChange={e => updateConfig('importSource', e.target.value)} />
               <Switch checked={node.config.autoTag} onChange={c => updateConfig('autoTag', c)} /> <span className="text-xs text-slate-300 ml-2">Auto-tag based on content</span>
            </div>
         );

      // --- AI AGENTS ---
      case 'risk_scorer':
      case 'llm_flow_gen':
      case 'clause_suggestion':
        return (
          <div className="space-y-4">
            <Select 
                label="AI Model"
                options={[{label: 'GPT-4o (High Intelligence)', value: 'gpt-4o'}, {label: 'Claude 3.5 Sonnet (Reasoning)', value: 'claude-3.5'}, {label: 'Gemini Pro 1.5 (Context)', value: 'gemini-pro'}]}
                value={node.config.aiModel || 'gpt-4o'}
                onChange={(e) => updateConfig('aiModel', e.target.value)}
            />
            <SmartInput 
                label="System Prompt"
                placeholder="e.g. You are a senior legal counsel analyzing liability..."
                value={node.config.aiPrompt || ''}
                onChange={(val) => updateConfig('aiPrompt', val)}
                multiline
                rows={6}
                schemaTree={schemaTree}
            />
            {node.type === 'risk_scorer' && (
               <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 font-bold uppercase">Risk Threshold</span><span className="text-brand-400">{node.config.riskThreshold || 50}</span></div>
                  <input type="range" min="0" max="100" className="w-full accent-brand-500 bg-dark-800 h-2 rounded appearance-none" value={node.config.riskThreshold || 50} onChange={e => updateConfig('riskThreshold', parseInt(e.target.value))} />
               </div>
            )}
            <div className="flex items-center gap-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300">
               <BrainCircuit size={14}/> <span>Estimated Cost: 0.02 tokens/run</span>
            </div>
          </div>
        );
      case 'obligation_extractor':
        return (
           <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Extract & Track</label>
              {['Payment Dates', 'Renewal Notice', 'Termination Rights', 'Deliverables', 'SLA Penalties'].map(t => (
                 <label key={t} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:bg-dark-900 p-1 rounded">
                    <input type="checkbox" className="rounded bg-dark-950 border-dark-700 text-brand-500" /> {t}
                 </label>
              ))}
           </div>
        );

      // --- LOGIC ---
      case 'condition':
        return (
           <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center space-y-2">
              <GitBranch size={24} className="mx-auto text-yellow-500 mb-1"/>
              <p className="text-xs text-yellow-200 font-medium">Logic Rules Configured Above</p>
              <p className="text-[10px] text-yellow-200/60">Use the "Logic" tab to build complex condition groups.</p>
           </div>
        );
      case 'delay':
        return (
           <div className="grid grid-cols-2 gap-4">
              <Input label="Duration" type="number" value={node.config.delayDuration || 1} onChange={e => updateConfig('delayDuration', parseInt(e.target.value))} />
              <Select label="Unit" options={[{label: 'Minutes', value: 'minutes'}, {label: 'Hours', value: 'hours'}, {label: 'Days', value: 'days'}, {label: 'Weeks', value: 'weeks'}]} value={node.config.delayUnit || 'days'} onChange={e => updateConfig('delayUnit', e.target.value)} />
              <div className="col-span-2">
                 <Switch checked={node.config.interruptible} onChange={c => updateConfig('interruptible', c)} /> <span className="text-xs ml-2 text-slate-300">Allow Manual Skip</span>
              </div>
           </div>
        );
      case 'split_parallel':
         return (
            <div className="space-y-4">
               <Select label="Split Strategy" options={[{label: 'Fan-Out (Fixed Branches)', value: 'fanout'}, {label: 'Map over List (Dynamic)', value: 'map'}]} value={node.config.splitType || 'fanout'} onChange={e => updateConfig('splitType', e.target.value)} />
               <Select label="Join Behavior" options={[{label: 'Wait for All', value: 'all'}, {label: 'Wait for Any', value: 'any'}]} value={node.config.joinType || 'all'} onChange={e => updateConfig('joinType', e.target.value)} />
            </div>
         );

      // --- APPROVALS ---
      case 'internal_approval':
      case 'parallel_approval':
        return (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-2 p-1 bg-dark-950 rounded-lg border border-dark-700">
                {['Role', 'User', 'Group', 'Dynamic'].map(t => (
                    <button key={t} onClick={() => updateConfig('approverType', t.toLowerCase())} className={`px-2 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-all ${node.config.approverType === t.toLowerCase() ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>{t}</button>
                ))}
             </div>
             {node.config.approverType === 'role' && (
                <Select label="Select Role" options={MOCK_ROLES.map(r => ({label: r.name, value: r.id}))} value={node.config.approverId || ''} onChange={(e) => updateConfig('approverId', e.target.value)} />
             )}
             {node.config.approverType === 'user' && (
                <Select label="Select User" options={MOCK_USERS.map(u => ({label: u.name, value: u.id}))} value={node.config.approverId || ''} onChange={(e) => updateConfig('approverId', e.target.value)} />
             )}
             {node.type === 'parallel_approval' && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                   <label className="text-xs font-bold text-purple-300 uppercase mb-2 block">Quorum Settings</label>
                   <div className="flex items-center gap-3">
                      <Input type="number" className="w-20" value={node.config.quorum || 1} onChange={e => updateConfig('quorum', parseInt(e.target.value))} />
                      <span className="text-xs text-purple-200">approvals required</span>
                   </div>
                </div>
             )}
             <div className="flex gap-4">
                <Input label="Escalate After (Hrs)" type="number" value={node.config.escalationTime || 48} onChange={(e) => updateConfig('escalationTime', parseInt(e.target.value))} />
                <Select label="Action" options={[{label: 'Notify Manager', value: 'notify'}, {label: 'Auto-Approve', value: 'approve'}, {label: 'Auto-Reject', value: 'reject'}]} value={node.config.escalationAction || 'notify'} onChange={e => updateConfig('escalationAction', e.target.value)} />
             </div>
          </div>
        );

      // --- DOCUMENTS ---
      case 'generate_document':
        return (
           <div className="space-y-4">
              <Select label="Document Template" options={MOCK_TEMPLATES.map(t => ({label: t.name, value: t.id}))} value={node.config.templateId || ''} onChange={e => updateConfig('templateId', e.target.value)} />
              <Select label="Output Format" options={[{label: 'PDF', value: 'pdf'}, {label: 'Word (DOCX)', value: 'docx'}, {label: 'HTML', value: 'html'}]} value={node.config.outputFormat || 'pdf'} onChange={e => updateConfig('outputFormat', e.target.value)} />
              <Switch checked={node.config.includeRedlines} onChange={c => updateConfig('includeRedlines', c)} /> <span className="text-xs ml-2 text-slate-300">Include Tracked Changes</span>
           </div>
        );
      case 'insert_clause':
        return (
           <div className="space-y-4">
              <Select label="Clause to Insert" options={MOCK_CLAUSES.map(c => ({label: c.name, value: c.id}))} value={node.config.clauseId || ''} onChange={e => updateConfig('clauseId', e.target.value)} />
              <Select label="Position" options={[{label: 'Append to End', value: 'append'}, {label: 'Replace Section', value: 'replace'}, {label: 'Prepend', value: 'prepend'}]} value={node.config.position || 'append'} onChange={e => updateConfig('position', e.target.value)} />
           </div>
        );
      case 'redaction':
         return (
            <div className="space-y-4">
               <div className="p-3 bg-dark-950 border border-dark-700 rounded-lg">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Role-based Redaction</label>
                  {['External Viewer', 'Sales Rep', 'Auditor'].map(role => (
                     <div key={role} className="flex justify-between items-center mb-2 last:mb-0">
                        <span className="text-xs text-slate-300">{role}</span>
                        <Switch checked={node.config.redactionMap?.[role]} onChange={c => updateConfig('redactionMap', {...node.config.redactionMap, [role]: c})} className="scale-75"/>
                     </div>
                  ))}
               </div>
            </div>
         );

      // --- SIGNATURES ---
      case 'signature':
         return (
            <div className="space-y-4">
               <Select label="Provider" options={[{label: 'DocuSign', value: 'docusign'}, {label: 'Adobe Sign', value: 'adobe'}, {label: 'HelloSign', value: 'hellosign'}]} value={node.config.signatureProvider || 'docusign'} onChange={e => updateConfig('signatureProvider', e.target.value)} />
               <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                     <label className="text-xs font-bold text-slate-500 uppercase">Signing Order</label>
                     <button className="text-[10px] text-brand-400 hover:underline">+ Add</button>
                  </div>
                  <div className="space-y-1">
                     {[1, 2].map(i => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-dark-950 border border-dark-700 rounded">
                           <div className="w-5 h-5 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center text-[10px] text-slate-400">{i}</div>
                           <input className="flex-1 bg-transparent text-xs text-white outline-none" placeholder="Signer Email / Role" defaultValue={i === 1 ? 'Internal Signer' : 'Counterparty'} />
                           <Select className="w-20 h-6 text-[10px] py-0" options={[{label: 'Sign', value: 'sign'}, {label: 'View', value: 'view'}]} value="sign" />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         );

      // --- INTEGRATIONS ---
      case 'update_salesforce':
         return (
            <div className="space-y-4">
               <Select label="Salesforce Object" options={[{label: 'Opportunity', value: 'Opportunity'}, {label: 'Contract', value: 'Contract'}, {label: 'Account', value: 'Account'}]} value={node.config.targetObject || 'Opportunity'} onChange={e => updateConfig('targetObject', e.target.value)} />
               <FieldMapper 
                  mappings={node.config.fieldMappings || { 'StageName': 'contract.status' }} 
                  onChange={(m) => updateConfig('fieldMappings', m)}
                  sourceOptions={allFields}
               />
               <Switch checked={node.config.upsert} onChange={c => updateConfig('upsert', c)} /> <span className="text-xs ml-2 text-slate-300">Upsert (Update if exists)</span>
            </div>
         );
      case 'send_email':
         return (
            <div className="space-y-4">
               <SmartInput label="To (Recipient)" value={node.config.emailRecipient || ''} onChange={v => updateConfig('emailRecipient', v)} placeholder="{{contract.owner_email}}" schemaTree={schemaTree} />
               <SmartInput label="Subject Line" value={node.config.emailSubject || ''} onChange={v => updateConfig('emailSubject', v)} placeholder="Action Required: {{contract.title}}" schemaTree={schemaTree} />
               <Select label="Email Template" options={MOCK_EMAIL_TEMPLATES.map(t => ({label: t.name, value: t.id}))} value={node.config.emailTemplateId || ''} onChange={e => updateConfig('emailTemplateId', e.target.value)} />
            </div>
         );
      case 'slack_notify':
         return (
            <div className="space-y-4">
               <Input label="Channel / User ID" value={node.config.slackChannel || ''} onChange={e => updateConfig('slackChannel', e.target.value)} placeholder="#legal-alerts" />
               <SmartInput label="Message Body" value={node.config.description || ''} onChange={v => updateConfig('description', v)} multiline placeholder="New contract {{contract.title}} has been approved." schemaTree={schemaTree} />
               <Switch checked={node.config.slackButtons} onChange={c => updateConfig('slackButtons', c)} /> <span className="text-xs ml-2 text-slate-300">Include Action Buttons</span>
            </div>
         );
      case 'webhook_out':
         return (
            <div className="space-y-4">
               <Input label="Target URL" value={node.config.webhookUrl || ''} onChange={e => updateConfig('webhookUrl', e.target.value)} placeholder="https://api.external.com/..." />
               <div className="grid grid-cols-3 gap-2">
                  <Select label="Method" options={[{label: 'POST', value: 'POST'}, {label: 'GET', value: 'GET'}, {label: 'PUT', value: 'PUT'}]} value={node.config.method || 'POST'} onChange={e => updateConfig('method', e.target.value)} />
                  <div className="col-span-2">
                     <Select label="Auth Type" options={[{label: 'None', value: 'none'}, {label: 'Bearer Token', value: 'bearer'}, {label: 'Basic', value: 'basic'}]} value={node.config.authType || 'none'} onChange={e => updateConfig('authType', e.target.value)} />
                  </div>
               </div>
               <SmartInput label="JSON Payload" value={node.config.payload || ''} onChange={v => updateConfig('payload', v)} multiline placeholder='{"id": "{{contract.id}}"}' className="font-mono" schemaTree={schemaTree} />
            </div>
         );
      
      default:
        return <div className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-dark-700 rounded-lg">Standard configuration. See "Settings" below for more options.</div>;
    }
  };

  const renderConditionBuilder = () => {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-2 h-full flex flex-col">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between mb-2 shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase">
                    <GitBranch size={14} className="text-yellow-500"/> Branch Logic
                </div>
                <div className="flex bg-dark-950 rounded-lg p-0.5 border border-dark-700">
                    <button 
                        onClick={() => setConditionMode('visual')}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${conditionMode === 'visual' ? 'bg-dark-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Visual Builder
                    </button>
                    <button 
                        onClick={() => setConditionMode('code')}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${conditionMode === 'code' ? 'bg-dark-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Advanced Expression
                    </button>
                </div>
            </div>

            {conditionMode === 'visual' ? (
                <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Global Logic Selector */}
                    <div className="flex items-center justify-between bg-dark-950/50 p-3 rounded-lg border border-dark-800">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="text-[10px] font-bold uppercase">If</span>
                            <select 
                                className="bg-dark-900 border border-dark-700 text-[10px] rounded px-2 py-1 text-brand-400 font-bold uppercase hover:border-brand-500 cursor-pointer outline-none"
                                value={node.config.joinType || 'all'}
                                onChange={(e) => updateConfig('joinType', e.target.value)}
                            >
                                <option value="all">ALL (AND)</option>
                                <option value="any">ANY (OR)</option>
                            </select>
                            <span>conditions are met:</span>
                        </div>
                        <button onClick={addRule} className="text-[10px] bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-white px-2 py-1 rounded transition-colors flex items-center gap-1"><Plus size={10}/> Rule</button>
                    </div>

                    <div className="space-y-3">
                        {(node.config.rules || []).map((rule, i) => {
                            // Determine field type to filter operators
                            let fieldType = 'string';
                            (Object.values(schemaTree) as {label: string, value: string, type: string}[][]).forEach(group => {
                                const found = group.find(f => f.value === rule.field);
                                if (found) fieldType = found.type;
                            });

                            return (
                                <div key={i} className="relative group animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 50}ms` }}>
                                    {i > 0 && (
                                        <div className="flex justify-center mb-2 relative z-10">
                                            <div className="bg-dark-950 border border-dark-700 text-[9px] rounded px-2 py-0.5 text-slate-500 font-bold uppercase flex items-center gap-1">
                                                {node.config.joinType === 'any' ? 'OR' : 'AND'}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="p-3 bg-dark-900/50 rounded-xl border border-dark-700 shadow-sm hover:border-yellow-500/30 transition-all relative group/item">
                                        <div className="grid grid-cols-1 gap-2">
                                            {/* Field Selector with Groups */}
                                            <div className="relative">
                                                <select
                                                    className="w-full rounded-lg bg-dark-950 border border-dark-800 px-3 py-2 text-xs text-white focus:border-brand-500 outline-none appearance-none font-mono"
                                                    value={rule.field}
                                                    onChange={(e) => updateRule(i, 'field', e.target.value)}
                                                >
                                                    <option value="">Select Variable...</option>
                                                    {Object.entries(schemaTree).map(([category, fields]) => (
                                                        <optgroup key={category} label={category} className="bg-dark-950 text-slate-400">
                                                            {(fields as {label: string, value: string, type: string}[]).map(f => (
                                                                <option key={f.value} value={f.value} className="text-white">{f.label}</option>
                                                            ))}
                                                        </optgroup>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><ChevronDown size={12}/></div>
                                            </div>

                                            <div className="flex gap-2">
                                                {/* Operator Selector */}
                                                <div className="w-1/3 relative">
                                                    <select
                                                        className="w-full rounded-lg bg-dark-950 border border-dark-800 px-2 py-2 text-xs text-slate-300 focus:border-brand-500 outline-none appearance-none"
                                                        value={rule.operator}
                                                        onChange={(e) => updateRule(i, 'operator', e.target.value)}
                                                    >
                                                        {GET_OPERATORS(fieldType).map(op => (
                                                            <option key={op.value} value={op.value}>{op.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Value Input */}
                                                <div className="flex-1 relative">
                                                    <input 
                                                        placeholder="Value..." 
                                                        value={rule.value} 
                                                        onChange={(e) => updateRule(i, 'value', e.target.value)}
                                                        className="w-full rounded-lg bg-dark-950 border border-dark-800 px-3 py-2 text-xs text-white focus:border-brand-500 outline-none transition-all placeholder:text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => removeRule(i)} className="absolute -right-2 -top-2 p-1 bg-dark-800 rounded-full text-slate-500 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity shadow-sm border border-dark-600 cursor-pointer z-20"><X size={12}/></button>
                                    </div>
                                </div>
                            );
                        })}
                        {(node.config.rules || []).length === 0 && (
                            <div className="py-8 text-center border-2 border-dashed border-dark-800 rounded-xl text-slate-600 text-xs flex flex-col items-center gap-2 bg-dark-900/20">
                                <Filter size={24} className="opacity-50 mb-2"/>
                                <p>No conditions defined.</p>
                                <p className="text-[10px] opacity-70">The workflow will always follow the "False" path.</p>
                                <Button variant="secondary" className="text-xs mt-2" onClick={addRule}>Create First Rule</Button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 gap-0 min-h-[400px] animate-in fade-in">
                    {/* Code Area */}
                    <div className="flex-1 flex flex-col relative mr-2">
                        <div className="absolute top-0 right-0 z-10 flex gap-1 p-2">
                            <button 
                                onClick={() => updateConfig('conditionExpression', '')}
                                className="p-1 bg-dark-900/80 rounded text-slate-500 hover:text-white border border-dark-700 backdrop-blur-sm"
                                title="Clear"
                            >
                                <Trash2 size={12}/>
                            </button>
                            <button 
                                onClick={() => setValidationStatus('valid')}
                                className="p-1 bg-dark-900/80 rounded text-slate-500 hover:text-green-400 border border-dark-700 backdrop-blur-sm"
                                title="Validate Syntax"
                            >
                                <Play size={12}/>
                            </button>
                        </div>
                        <textarea 
                            className="flex-1 bg-dark-950 border border-dark-700 rounded-l-xl p-4 font-mono text-xs text-blue-300 focus:border-brand-500 outline-none resize-none leading-relaxed selection:bg-brand-500/30 custom-scrollbar"
                            placeholder={`// Advanced Expression (CEL)
contract.value > 50000 && 
(user.role == 'Admin' || contract.riskScore < 20)`}
                            value={node.config.conditionExpression || ''}
                            onChange={(e) => {
                                updateConfig('conditionExpression', e.target.value);
                                setValidationStatus(null);
                            }}
                            spellCheck={false}
                        />
                        {validationStatus && (
                            <div className={`absolute bottom-2 left-2 right-2 p-2 rounded border text-[10px] flex items-center gap-2 ${validationStatus === 'valid' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                {validationStatus === 'valid' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                                {validationStatus === 'valid' ? 'Expression is valid.' : 'Syntax error at line 2.'}
                            </div>
                        )}
                    </div>
                    
                    {/* Schema Sidebar (GraphQL Style) */}
                    <div className="w-40 bg-dark-900 border border-dark-700 rounded-r-xl flex flex-col overflow-hidden">
                        <div className="p-2 bg-dark-950 border-b border-dark-700 text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Database size={10}/> Schema
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
                            {Object.entries(schemaTree).map(([category, fields]) => (
                                <div key={category} className="mb-1">
                                    <button 
                                        onClick={() => setExpandedSchema(prev => ({...prev, [category]: !prev[category]}))}
                                        className="w-full flex items-center gap-1 px-2 py-1.5 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                                    >
                                        {expandedSchema[category] ? <ChevronDown size={10}/> : <ChevronRight size={10}/>}
                                        {category}
                                    </button>
                                    
                                    {expandedSchema[category] && (
                                        <div className="pl-3 space-y-0.5 border-l border-dark-800 ml-2 mt-0.5">
                                            {(fields as {label: string, value: string, type: string}[]).map(f => (
                                                <button 
                                                    key={f.value} 
                                                    onClick={() => updateConfig('conditionExpression', (node.config.conditionExpression || '') + f.value)}
                                                    className="w-full text-left px-2 py-1 rounded text-[9px] text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors font-mono truncate group relative"
                                                    title={`${f.label} (${f.type})`}
                                                >
                                                    {f.value}
                                                    <span className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-brand-500"><Plus size={8}/></span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="p-2 border-t border-dark-700 bg-dark-950 text-[9px] text-slate-600 text-center">
                            Click to insert variable
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
  };

  const renderConfigTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 pb-4">
        <div className="space-y-3">
            <Input 
                label="Node Label" 
                value={node.label} 
                onChange={(e) => onChange({...node, label: e.target.value})} 
            />
            <SmartInput 
                label="Description" 
                value={node.config.description || ''} 
                onChange={(v) => updateConfig('description', v)} 
                multiline 
                rows={2}
                placeholder="Purpose of this step..."
                schemaTree={schemaTree}
            />
        </div>

        <div className="h-px bg-dark-800"></div>

        {/* Dynamic Node Specific Config */}
        <div>
           <h4 className="text-xs font-bold text-brand-400 uppercase mb-3 tracking-wider flex items-center gap-2"><Settings size={12}/> {node.category} Settings</h4>
           {renderSpecificConfig()}
        </div>

        <div className="h-px bg-dark-800"></div>

        {/* Common Node Settings Accordion */}
        <div className="space-y-4">
            <div className="p-3 bg-dark-950 border border-dark-800 rounded-lg">
               <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><AlertTriangle size={12}/> Error Handling</h5>
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-300">Retry on Failure</span>
                     <Switch checked={!!node.config.retryPolicy} onChange={c => updateConfig('retryPolicy', c ? { maxAttempts: 3, backoff: 'exponential' } : undefined)} />
                  </div>
                  {node.config.retryPolicy && (
                     <div className="pl-2 border-l-2 border-dark-800 ml-1 space-y-2">
                        <Input label="Max Attempts" type="number" value={node.config.retryPolicy.maxAttempts} onChange={e => updateConfig('retryPolicy', {...node.config.retryPolicy, maxAttempts: parseInt(e.target.value)})} className="h-8 text-xs"/>
                        <Select label="Backoff Strategy" options={[{label: 'Linear', value: 'linear'}, {label: 'Exponential', value: 'exponential'}]} value={node.config.retryPolicy.backoff} onChange={e => updateConfig('retryPolicy', {...node.config.retryPolicy, backoff: e.target.value})} className="h-8 text-xs"/>
                     </div>
                  )}
               </div>
            </div>

            {node.category !== 'utility' && (
                <div className="p-3 bg-dark-950 border border-dark-800 rounded-lg">
                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><Activity size={12}/> Lifecycle</h5>
                    <Select 
                        label="Update Contract Stage To"
                        options={[{label: 'No Change', value: ''}, ...stages.map(s => ({label: s.name, value: s.id}))]}
                        value={node.config.stageId || ''}
                        onChange={(e) => updateConfig('stageId', e.target.value)}
                        className="bg-dark-900 border-dark-700"
                    />
                </div>
            )}
        </div>
    </div>
  );

  const renderSimulationTab = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 text-center">
          <div className="p-6 bg-dark-950 border border-dark-800 rounded-xl flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center border-2 border-dashed border-dark-700">
                  <Play size={24} className="text-slate-500"/>
              </div>
              <div className="text-sm text-slate-400">
                  Run a test execution for this node to see variable outputs.
              </div>
              <Button variant="secondary" className="w-full"><Zap size={14} className="mr-2"/> Simulate Node</Button>
          </div>

          <div className="text-left">
              <h5 className="text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Mock Context Data</h5>
              <div className="bg-dark-950 rounded-lg border border-dark-800 p-3 font-mono text-[10px] text-blue-300 h-40 overflow-y-auto custom-scrollbar">
                  {`{
  "contract": {
    "id": "CTR-2024-001",
    "value": 150000,
    "status": "Draft"
  },
  "user": {
    "name": "Harvey Specter",
    "role": "Admin"
  }
}`}
              </div>
          </div>
      </div>
  );

  const renderAuditTab = () => (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-2">
                  <Activity size={14}/> Impact Analysis
              </div>
              <p className="text-xs text-blue-200/70 leading-relaxed">
                  Modifying this node will affect <strong className="text-white">24 active contracts</strong> currently in the 
                  <span className="bg-blue-500/20 px-1 mx-1 rounded text-blue-300 border border-blue-500/30">Review</span> stage.
              </p>
          </div>

          <div className="bg-dark-950 rounded-xl border border-dark-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-dark-800 flex justify-between items-center bg-dark-900/50">
                  <h5 className="text-xs font-bold text-slate-500 uppercase">Change History</h5>
                  <Badge color="gray">v1.2</Badge>
              </div>
              <div className="p-4 space-y-6 relative">
                  <div className="absolute left-6 top-4 bottom-4 w-px bg-dark-800"></div>
                  {[
                      {user: 'Harvey Specter', action: 'Changed approver logic', time: '2h ago', version: 'v1.2'},
                      {user: 'Mike Ross', action: 'Created node', time: '1d ago', version: 'v1.0'}
                  ].map((log, i) => (
                      <div key={i} className="flex gap-4 relative pl-2">
                          <div className="absolute left-[5px] top-1.5 w-2 h-2 rounded-full bg-dark-600 border-2 border-dark-950 ring-4 ring-dark-950"></div>
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-xs font-bold text-white">{log.action}</span>
                                 <span className="text-[9px] px-1.5 rounded bg-dark-800 text-slate-500 border border-dark-700">{log.version}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                  <Avatar size="sm" name={log.user} className="w-4 h-4 text-[8px]"/> {log.user} • {log.time}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  return (
    <div className="w-96 bg-dark-900 border-l border-dark-800 flex flex-col h-full z-30 shadow-2xl shrink-0 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-dark-800 flex justify-between items-start bg-dark-950/50 backdrop-blur-md">
         <div>
            <div className="flex items-center gap-2 mb-1">
                <Badge color="brand" className="py-0 px-1.5 text-[9px]">{node.category}</Badge>
                <span className="text-[10px] font-mono text-slate-500">{node.type}</span>
            </div>
            <h3 className="text-lg font-bold text-white truncate w-64 leading-tight">{node.label}</h3>
         </div>
         <button onClick={onClose} className="text-slate-500 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"><X size={18}/></button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-800 bg-dark-900">
          {[
              {id: 'config', icon: Settings, label: 'Config'},
              {id: 'logic', icon: GitBranch, label: 'Logic'},
              {id: 'sim', icon: Play, label: 'Test'},
              {id: 'audit', icon: History, label: 'Audit'},
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide border-b-2 transition-all ${activeTab === tab.id ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
              >
                  <tab.icon size={14}/>
                  {tab.label}
              </button>
          ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-dark-900/50">
         {activeTab === 'config' && renderConfigTab()}
         {activeTab === 'logic' && (node.category === 'condition' ? renderConditionBuilder() : <div className="text-center text-xs text-slate-500 mt-10 p-8 border-2 border-dashed border-dark-800 rounded-xl mx-4">Logic builder is primarily for Condition nodes. <br/><br/> For other nodes, use the <strong>Config</strong> tab settings.</div>)}
         {activeTab === 'sim' && renderSimulationTab()}
         {activeTab === 'audit' && renderAuditTab()}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-dark-800 bg-dark-950/50 backdrop-blur-md">
         <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3 font-mono">
            <span className="flex items-center gap-1"><HelpCircle size={10}/> ID: {node.id}</span>
            <span>v1.0.2</span>
         </div>
         <Button variant="danger" className="w-full text-xs flex justify-center gap-2 h-9 shadow-lg shadow-red-500/10" onClick={() => onDelete(node.id)}>
            <Trash2 size={14}/> Delete Node
         </Button>
      </div>
    </div>
  );
};
