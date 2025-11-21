
import React, { useState } from 'react';
import { WorkflowNode, ConditionRule, UserRole, WorkflowStageDefinition } from '../../types';
import { Input, Select, Button, Badge, Switch } from '../UIComponents';
import { Trash2, Plus, X, HelpCircle, AlertCircle, FileText, User, Link as LinkIcon, Database, Mail, Braces, Clock, CheckSquare, BrainCircuit } from 'lucide-react';
import { MOCK_TEMPLATES, MOCK_USERS, MOCK_ROLES, MOCK_DEPARTMENTS, MOCK_INTEGRATIONS } from '../../mock/data';

interface PropertiesPanelProps {
  node: WorkflowNode | null;
  stages: WorkflowStageDefinition[];
  onChange: (node: WorkflowNode) => void;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
}

// Helper for inputs with smart variable insertion
const SmartInput: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (val: string) => void;
    multiline?: boolean;
    placeholder?: string;
}> = ({ label, value, onChange, multiline, placeholder }) => {
    const [showVars, setShowVars] = useState(false);
    const variables = [
        { label: 'Contract Title', value: '{{contract.title}}' },
        { label: 'Contract Value', value: '{{contract.value}}' },
        { label: 'Counterparty', value: '{{contract.counterparty}}' },
        { label: 'Owner Name', value: '{{contract.owner}}' },
        { label: 'Start Date', value: '{{contract.startDate}}' },
        { label: 'Risk Score', value: '{{contract.riskScore}}' },
        { label: 'Current Stage', value: '{{contract.status}}' },
    ];

    const insertVar = (v: string) => {
        onChange(value + v);
        setShowVars(false);
    };

    return (
        <div className="relative group/smart">
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
                <div className="absolute right-0 top-6 z-50 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl p-1 max-h-40 overflow-y-auto animate-in fade-in zoom-in-95">
                    <div className="text-[9px] text-slate-500 px-2 py-1 uppercase font-bold">Available Variables</div>
                    {variables.map(v => (
                        <button 
                            key={v.value}
                            onClick={() => insertVar(v.value)}
                            className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-brand-500 hover:text-white rounded transition-colors"
                        >
                            {v.label}
                        </button>
                    ))}
                </div>
            )}

            {multiline ? (
                <textarea 
                    className="w-full h-32 bg-dark-950 border border-dark-700 rounded-lg p-3 text-xs text-slate-300 focus:border-brand-500 outline-none resize-none"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            ) : (
                <input 
                    className="w-full rounded-lg bg-dark-950 border border-dark-700 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all hover:border-dark-600 shadow-inner"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ node, stages, onChange, onClose, onDelete }) => {
  if (!node) return null;

  // Handlers
  const updateConfig = (key: string, value: any) => {
    onChange({
      ...node,
      config: { ...node.config, [key]: value }
    });
  };

  const updateRule = (index: number, field: keyof ConditionRule, value: any) => {
    const newRules = [...(node.config.rules || [])];
    newRules[index] = { ...newRules[index], [field]: value };
    updateConfig('rules', newRules);
  };

  const addRule = () => {
    const newRule: ConditionRule = {
      id: `rule_${Date.now()}`,
      field: 'contract_value',
      operator: 'greater_than',
      value: '',
      logic: 'AND'
    };
    updateConfig('rules', [...(node.config.rules || []), newRule]);
  };

  const removeRule = (index: number) => {
    const newRules = [...(node.config.rules || [])];
    newRules.splice(index, 1);
    updateConfig('rules', newRules);
  };

  // --- RENDERERS ---

  const renderConditionBuilder = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Logic Rules</h4>
        <button onClick={addRule} className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"><Plus size={12}/> Add Rule</button>
      </div>
      
      <div className="space-y-3">
        {(node.config.rules || []).map((rule, i) => (
          <div key={i} className="p-3 bg-dark-950 rounded-lg border border-dark-700 relative group">
             {i > 0 && (
               <div className="absolute -top-5 left-4">
                  <select 
                    className="bg-dark-900 border border-dark-700 text-[10px] rounded px-1 py-0.5 text-slate-400"
                    value={rule.logic}
                    onChange={(e) => updateRule(i, 'logic', e.target.value)}
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
               </div>
             )}
             <div className="flex gap-2 mb-2">
                <Select 
                  options={[
                    {label: 'Contract Value', value: 'contract_value'},
                    {label: 'Risk Score', value: 'risk_score'},
                    {label: 'Region', value: 'region'},
                    {label: 'Legal Entity', value: 'legal_entity'},
                    {label: 'Contract Type', value: 'contract_type'}
                  ]}
                  value={rule.field}
                  onChange={(e) => updateRule(i, 'field', e.target.value)}
                  className="text-xs bg-dark-900 border-dark-700 h-8"
                />
                <Select 
                  options={[
                    {label: 'Equals', value: 'equals'},
                    {label: 'Greater Than', value: 'greater_than'},
                    {label: 'Less Than', value: 'less_than'},
                    {label: 'Contains', value: 'contains'},
                    {label: 'Is Empty', value: 'is_empty'}
                  ]}
                  value={rule.operator}
                  onChange={(e) => updateRule(i, 'operator', e.target.value)}
                  className="text-xs bg-dark-900 border-dark-700 h-8 w-28"
                />
             </div>
             <Input 
               placeholder="Value to compare..." 
               value={rule.value} 
               onChange={(e) => updateRule(i, 'value', e.target.value)}
               className="text-xs bg-dark-900 border-dark-700 h-8"
             />
             <button onClick={() => removeRule(i)} className="absolute -right-2 -top-2 p-1 bg-dark-800 rounded-full text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-dark-600"><X size={10}/></button>
          </div>
        ))}
        {(node.config.rules || []).length === 0 && (
           <div className="p-4 text-center border-2 border-dashed border-dark-800 rounded-lg text-slate-600 text-xs">
              No rules defined. This condition will always calculate as False.
           </div>
        )}
      </div>
    </div>
  );

  const renderApprovalConfig = () => (
    <div className="space-y-6">
       <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Approver Type</label>
          <div className="grid grid-cols-2 gap-2">
             {['Role', 'User', 'Group', 'Dynamic'].map(t => (
                <button 
                  key={t}
                  onClick={() => updateConfig('approverType', t.toLowerCase())}
                  className={`px-3 py-2 rounded border text-xs font-bold transition-all ${node.config.approverType === t.toLowerCase() ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-dark-950 border-dark-700 text-slate-400 hover:border-slate-500'}`}
                >
                   {t}
                </button>
             ))}
          </div>
       </div>

       {node.config.approverType === 'role' && (
          <Select 
             label="Select Role"
             options={MOCK_ROLES.map(r => ({label: r.name, value: r.name}))}
             value={node.config.approverId || ''}
             onChange={(e) => updateConfig('approverId', e.target.value)}
          />
       )}
       {node.config.approverType === 'user' && (
          <Select 
             label="Select User"
             options={MOCK_USERS.map(u => ({label: u.name, value: u.id}))}
             value={node.config.approverId || ''}
             onChange={(e) => updateConfig('approverId', e.target.value)}
          />
       )}

       <div className="p-4 bg-dark-950 rounded-lg border border-dark-700 space-y-4">
          <h5 className="text-xs font-bold text-white flex items-center gap-2"><AlertCircle size={12}/> Escalation Policy</h5>
          <Input 
             label="Escalate After (Hours)"
             type="number"
             value={node.config.escalationTime || 48}
             onChange={(e) => updateConfig('escalationTime', parseInt(e.target.value))}
          />
          <Select 
             label="Escalate To (Role)"
             options={MOCK_ROLES.map(r => ({label: r.name, value: r.id}))}
             value={node.config.escalationTarget || ''}
             onChange={(e) => updateConfig('escalationTarget', e.target.value)}
          />
       </div>
    </div>
  );

  const renderIntegrationConfig = () => (
     <div className="space-y-4">
        <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
           <Select 
              label="Integration App"
              options={MOCK_INTEGRATIONS.map(i => ({label: i.name, value: i.id}))}
              value={node.config.integrationId || ''}
              onChange={(e) => updateConfig('integrationId', e.target.value)}
           />
        </div>
        
        {node.type.includes('webhook') ? (
            <>
                <div className="flex gap-2">
                   <Select 
                      label="Method"
                      options={[{label: 'GET', value: 'GET'}, {label: 'POST', value: 'POST'}]}
                      value={node.config.method || 'POST'}
                      onChange={(e) => updateConfig('method', e.target.value)}
                      className="w-24"
                   />
                   <div className="flex-1">
                      <Input 
                         label="Endpoint URL"
                         placeholder="https://api.example.com/webhook"
                         value={node.config.endpoint || ''}
                         onChange={(e) => updateConfig('endpoint', e.target.value)}
                      />
                   </div>
                </div>
                <div>
                   <SmartInput 
                      label="Payload (JSON)"
                      placeholder='{"contractId": "{{id}}"}'
                      value={node.config.payload || ''}
                      onChange={(val) => updateConfig('payload', val)}
                      multiline
                   />
                </div>
            </>
        ) : (
            <div className="text-xs text-slate-400 italic p-2 text-center">
                Configuration handled by {MOCK_INTEGRATIONS.find(i => i.id === node.config.integrationId)?.name || 'App'} Settings.
            </div>
        )}
     </div>
  );

  const renderDocGenConfig = () => (
      <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
              <Select 
                  label="Select Document Template"
                  options={MOCK_TEMPLATES.map(t => ({label: t.name, value: t.id}))}
                  value={node.config.templateId || ''}
                  onChange={(e) => updateConfig('templateId', e.target.value)}
              />
          </div>
          <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Output Format</label>
              <div className="flex gap-3">
                  {['PDF', 'DOCX', 'HTML'].map(fmt => (
                      <button key={fmt} className="px-3 py-1 bg-dark-950 border border-dark-700 rounded text-xs text-slate-300 hover:text-white">{fmt}</button>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderSignatureConfig = () => (
      <div className="space-y-4">
          <Select 
              label="E-Signature Provider"
              options={[{label: 'DocuSign', value: 'docusign'}, {label: 'Adobe Sign', value: 'adobe'}, {label: 'HelloSign', value: 'hellosign'}]}
              value={node.config.signatureProvider || 'docusign'}
              onChange={(e) => updateConfig('signatureProvider', e.target.value)}
          />
          <div>
              <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Signatories</label>
                  <button className="text-xs text-brand-400 hover:text-white"><Plus size={12}/> Add</button>
              </div>
              <div className="space-y-2">
                  <div className="flex gap-2">
                      <Input placeholder="Role (e.g. Client)" className="h-8 text-xs" />
                      <Input placeholder="Email (Optional)" className="h-8 text-xs" />
                  </div>
                  <div className="flex gap-2">
                      <Input placeholder="Role (e.g. CEO)" className="h-8 text-xs" value="Internal Signer" disabled/>
                      <div className="w-full flex items-center text-xs text-slate-500 bg-dark-950 border border-dark-700 rounded px-2">Dynamic</div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderEmailConfig = () => (
      <div className="space-y-4">
          <Input 
              label="Recipient (Email or Variable)"
              placeholder="{{owner.email}}"
              value={node.config.recipient || ''}
              onChange={(e) => updateConfig('recipient', e.target.value)}
          />
          <SmartInput 
              label="Subject Line"
              placeholder="Action Required: Contract Review"
              value={node.config.emailSubject || ''}
              onChange={(val) => updateConfig('emailSubject', val)}
          />
          <div>
              <SmartInput 
                  label="Email Body"
                  value={node.config.emailBody || ''}
                  onChange={(val) => updateConfig('emailBody', val)}
                  multiline
                  placeholder="Dear {{counterparty_name}}, please find attached..."
              />
          </div>
      </div>
  );

  const renderDelayConfig = () => (
      <div className="space-y-4">
          <div className="flex gap-3">
              <div className="flex-1">
                  <Input 
                      label="Duration"
                      type="number"
                      value={node.config.delayTime || 1}
                      onChange={(e) => updateConfig('delayTime', e.target.value)}
                  />
              </div>
              <div className="w-32">
                  <Select 
                      label="Unit"
                      options={[{label: 'Hours', value: 'hours'}, {label: 'Days', value: 'days'}, {label: 'Weeks', value: 'weeks'}]}
                      value={node.config.delayUnit || 'days'}
                      onChange={(e) => updateConfig('delayUnit', e.target.value)}
                  />
              </div>
          </div>
          <p className="text-xs text-slate-500 bg-dark-950 p-2 rounded border border-dark-700">
              Workflow will pause at this step for the specified duration before continuing.
          </p>
      </div>
  );

  const renderTaskConfig = () => (
      <div className="space-y-4">
          <SmartInput 
              label="Task Title"
              value={node.config.taskTitle || ''}
              onChange={(val) => updateConfig('taskTitle', val)}
              placeholder="Review High Risk Clause"
          />
          <Select 
              label="Priority"
              options={[{label: 'Low', value: 'Low'}, {label: 'Medium', value: 'Medium'}, {label: 'High', value: 'High'}]}
              value={node.config.taskPriority || 'Medium'}
              onChange={(e) => updateConfig('taskPriority', e.target.value)}
          />
          <Select 
              label="Assignee"
              options={MOCK_USERS.map(u => ({label: u.name, value: u.id}))}
              value={node.config.taskAssignee || ''}
              onChange={(e) => updateConfig('taskAssignee', e.target.value)}
          />
      </div>
  );

  const renderScheduledTriggerConfig = () => (
      <div className="space-y-4">
          <Input 
              label="CRON Expression"
              value={node.config.cronSchedule || '0 9 * * 1'}
              onChange={(e) => updateConfig('cronSchedule', e.target.value)}
              placeholder="0 9 * * 1 (Every Monday at 9am)"
              className="font-mono"
          />
          <div className="text-xs text-slate-500 flex gap-2">
              <Badge color="blue">Every Mon 9am</Badge>
              <Badge color="gray">UTC Time</Badge>
          </div>
      </div>
  );

  const renderAIConfig = () => (
      <div className="space-y-4">
          <Select 
              label="AI Model"
              options={[{label: 'GPT-4o', value: 'gpt-4o'}, {label: 'Claude 3.5 Sonnet', value: 'claude-3.5'}, {label: 'Gemini Pro', value: 'gemini-pro'}]}
              value={node.config.aiModel || 'gpt-4o'}
              onChange={(e) => updateConfig('aiModel', e.target.value)}
          />
          <SmartInput 
              label="Prompt / Instruction"
              placeholder="Analyze the indemnity clause for high risk..."
              value={node.config.aiPrompt || ''}
              onChange={(val) => updateConfig('aiPrompt', val)}
              multiline
          />
          {node.type === 'risk_scorer' && (
              <Input 
                  label="Risk Alert Threshold (0-100)"
                  type="number"
                  value={node.config.riskThreshold || 75}
                  onChange={(e) => updateConfig('riskThreshold', parseInt(e.target.value))}
              />
          )}
      </div>
  );

  return (
    <div className="w-80 bg-dark-900 border-l border-dark-800 flex flex-col h-full z-30 shadow-2xl shrink-0">
      <div className="p-5 border-b border-dark-800 flex justify-between items-start">
         <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{node.category.replace('_', ' ')} Node</span>
            <h3 className="text-lg font-bold text-white">{node.label}</h3>
            <span className="text-[10px] text-brand-400 font-mono">{node.type}</span>
         </div>
         <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
         <Input 
            label="Display Label" 
            value={node.label} 
            onChange={(e) => onChange({...node, label: e.target.value})} 
         />
         
         <div>
             <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Description</label>
             <textarea 
                 className="w-full h-16 bg-dark-950 border border-dark-700 rounded-lg p-2 text-xs text-slate-300 focus:border-brand-500 outline-none resize-none"
                 value={node.config.description || ''}
                 onChange={(e) => updateConfig('description', e.target.value)}
                 placeholder="Describe what this step does..."
             />
         </div>

         <div className="pt-4 border-t border-dark-800">
             <h4 className="text-xs font-bold text-white uppercase mb-4 flex items-center gap-2">
                 <Database size={12} className="text-brand-400"/> Configuration
             </h4>
             
             {node.category === 'condition' && renderConditionBuilder()}
             {node.category === 'approval' && renderApprovalConfig()}
             {(node.category === 'integration' || node.type.includes('webhook')) && renderIntegrationConfig()}
             {node.type === 'generate_document' && renderDocGenConfig()}
             {node.type === 'signature' && renderSignatureConfig()}
             {node.type === 'send_email' && renderEmailConfig()}
             {node.type === 'delay' && renderDelayConfig()}
             {node.type === 'create_task' && renderTaskConfig()}
             {node.type === 'scheduled_trigger' && renderScheduledTriggerConfig()}
             {node.category === 'ai_agent' && renderAIConfig()}
             
             {/* Generic Stage Selector for all Nodes */}
             {node.category !== 'utility' && (
                 <div className="mt-6">
                    <Select 
                        label="Transition Contract Stage To"
                        options={[{label: 'No Change', value: ''}, ...stages.map(s => ({label: s.name, value: s.id}))]}
                        value={node.config.stageId || ''}
                        onChange={(e) => updateConfig('stageId', e.target.value)}
                        className="bg-dark-950 border-dark-700"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                       When this step is reached/completed, update the contract status.
                    </p>
                 </div>
             )}
         </div>
      </div>

      <div className="p-4 border-t border-dark-800 bg-dark-950/50">
         <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <HelpCircle size={12}/>
            <span>ID: <span className="font-mono text-slate-400">{node.id}</span></span>
         </div>
         <Button variant="danger" className="w-full text-xs flex justify-center gap-2" onClick={() => onDelete(node.id)}>
            <Trash2 size={14}/> Delete Node
         </Button>
      </div>
    </div>
  );
};
