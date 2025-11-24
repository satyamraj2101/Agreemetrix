
import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge, Switch } from '../components/UIComponents';
import { MOCK_TABLES, MOCK_INTEGRATIONS, MOCK_ROLES } from '../mock/data';
import { FieldTable, FieldDefinition, FieldDataType } from '../types';
import { 
  Database, Plus, Settings, Link as LinkIcon, Search, FileText, Users, Briefcase, Box, 
  ArrowRight, Trash2, Lock, Edit3, Shield, X, CheckSquare, Type, Hash, Calendar, 
  DollarSign, Globe, AtSign, AlignLeft, Phone, ArrowLeftRight, ArrowLeft, 
  Layers, Eye, Code, Binary, Fingerprint, List, DatabaseZap, Check, Key, MoreHorizontal,
  Save, AlertTriangle, FunctionSquare, EyeOff, ShieldCheck, Play, RefreshCw, UploadCloud, Download, ClipboardList
} from 'lucide-react';

const CONTRACT_TYPES = ['NDA', 'MSA', 'SOW', 'Licensing Agreement', 'Vendor Agreement', 'Offer Letter', 'Partnership Deed'];
const MOCK_EXTERNAL_OBJECTS = ['Opportunity', 'Account', 'Contact', 'Quote', 'Order', 'Ticket'];
const MOCK_EXTERNAL_FIELDS = ['Amount', 'StageName', 'CloseDate', 'AccountName', 'BillingCity', 'Description', 'Status', 'OwnerId', 'CreatedDate'];

const FieldDatabase: React.FC = () => {
  const [activeTableId, setActiveTableId] = useState<string>(MOCK_TABLES[0].id);
  const [tables, setTables] = useState<FieldTable[]>(MOCK_TABLES);
  
  // UI State
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'general' | 'data' | 'integration' | 'permissions' | 'usage'>('general');
  const [selectedField, setSelectedField] = useState<FieldDefinition | null>(null);
  const [previewRole, setPreviewRole] = useState('Admin');
  const [schemaStatus, setSchemaStatus] = useState<'Draft' | 'Published'>('Published');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTable = tables.find(t => t.id === activeTableId) || tables[0];

  // --- Editing State ---
  const [fieldForm, setFieldForm] = useState<Partial<FieldDefinition>>({});
  
  const handleEditField = (field: FieldDefinition | null) => {
    if (field?.isLocked) return; // Prevent editing locked fields
    
    setSelectedField(field);
    setFieldForm(field ? { ...field } : {
      name: '',
      key: '',
      type: 'text',
      source: 'custom',
      required: false,
      unique: false,
      description: '',
      validationRules: [],
      visibilityRules: [],
      options: []
    });
    setDrawerTab('general');
    setShowEditDrawer(true);
  };

  const handleSaveField = () => {
    const newField = {
      ...fieldForm,
      id: fieldForm.id || `f_${Date.now()}`,
      lastModified: 'Just now',
      modifiedBy: 'Admin'
    } as FieldDefinition;

    const updatedTables = tables.map(t => {
      if (t.id === activeTableId) {
        const exists = t.fields.find(f => f.id === newField.id);
        return {
          ...t,
          fields: exists 
            ? t.fields.map(f => f.id === newField.id ? newField : f)
            : [...t.fields, newField]
        };
      }
      return t;
    });

    setTables(updatedTables);
    setShowEditDrawer(false);
  };

  // --- Helpers ---
  
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'FileText': return FileText;
      case 'Users': return Users;
      case 'Briefcase': return Briefcase;
      case 'ClipboardList': return ClipboardList;
      default: return Box;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'text': return Type;
      case 'number': return Hash;
      case 'currency': return DollarSign;
      case 'date': return Calendar;
      case 'boolean': return CheckSquare;
      case 'select': return List;
      case 'relationship': return LinkIcon;
      case 'formula': return FunctionSquare;
      case 'encrypted': return Lock;
      case 'json': return Code;
      default: return Type;
    }
  };

  // --- Renderers ---

  const renderFieldRow = (field: FieldDefinition) => {
    const TypeIcon = getTypeIcon(field.type as string);
    const isSystem = field.source === 'system';
    const isLocked = field.isLocked;
    
    // Masking Preview Logic
    const isMasked = previewRole !== 'Admin' && field.visibilityRules?.some(r => r.roleId === `role_${previewRole.toLowerCase()}` && (r.access === 'masked' || r.access === 'hidden'));
    const isHidden = previewRole !== 'Admin' && field.visibilityRules?.some(r => r.roleId === `role_${previewRole.toLowerCase()}` && r.access === 'hidden');

    if (isHidden) return null;

    return (
      <tr key={field.id} className={`group transition-colors border-b border-dark-800 ${selectedField?.id === field.id ? 'bg-brand-500/10' : 'hover:bg-dark-800/50'}`}>
        <td className="px-6 py-3 align-top">
          <div className="flex items-start gap-3">
             <div className={`mt-1 p-1.5 rounded-md ${isSystem ? 'bg-dark-800 text-slate-500' : 'bg-brand-500/10 text-brand-400'}`}>
                <TypeIcon size={14} />
             </div>
             <div>
                <div className="flex items-center gap-2">
                   <span className={`text-sm font-bold ${isMasked ? 'text-slate-500 blur-[2px]' : 'text-white'}`}>
                      {isMasked ? '••••••••' : field.name}
                   </span>
                   {field.isPII && <span title="PII / Sensitive"><Lock size={12} className="text-red-400" /></span>}
                   {isLocked && <span title="System Locked"><Lock size={12} className="text-slate-500" /></span>}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">{field.key}</div>
             </div>
          </div>
        </td>
        <td className="px-6 py-3 align-top">
           <Badge color="gray" className="text-[10px] uppercase">{field.type}</Badge>
        </td>
        <td className="px-6 py-3 align-top">
           <div className="flex flex-wrap gap-1">
              {field.required && <Badge color="red" className="text-[9px]">Req</Badge>}
              {field.unique && <Badge color="purple" className="text-[9px]">Uniq</Badge>}
              {field.isIndexed && <Badge color="blue" className="text-[9px]">Idx</Badge>}
              {field.formula && <Badge color="yellow" className="text-[9px] flex gap-1"><FunctionSquare size={8}/> Calc</Badge>}
           </div>
        </td>
        <td className="px-6 py-3 align-top">
           {field.integrationAppId ? (
              <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 w-fit">
                 <Box size={12}/> 
                 <span className="font-mono">{field.externalObject}.{field.externalField}</span>
                 {field.syncDirection === 'import' && <ArrowLeft size={10}/>}
                 {field.syncDirection === 'export' && <ArrowRight size={10}/>}
                 {field.syncDirection === 'bidirectional' && <ArrowLeftRight size={10}/>}
              </div>
           ) : (
              <span className="text-xs text-slate-600">-</span>
           )}
        </td>
        <td className="px-6 py-3 align-top">
           <div className="text-[10px] text-slate-500">
              <div>{field.lastModified}</div>
              <div>by {field.modifiedBy}</div>
           </div>
        </td>
        <td className="px-6 py-3 align-top text-right">
           {!isLocked ? (
              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleEditField(field)} className="p-1.5 hover:bg-brand-500/20 rounded text-slate-400 hover:text-brand-400"><Edit3 size={14}/></button>
                 <button className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"><Trash2 size={14}/></button>
              </div>
           ) : (
              <div className="flex justify-end opacity-50 cursor-not-allowed" title="System Locked (Read Only)">
                 <Lock size={14} className="text-slate-600 mt-1.5" />
              </div>
           )}
        </td>
      </tr>
    );
  };

  const ActiveIcon = getIcon(activeTable.icon);
  const systemFields = activeTable.fields.filter(f => f.source === 'system');
  const customFields = activeTable.fields.filter(f => f.source !== 'system');

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-dark-950">
      {/* Top Header Bar */}
      <div className="h-14 border-b border-dark-700 flex items-center justify-between px-6 bg-dark-900 shrink-0">
         <div className="flex items-center gap-3">
            <Database size={18} className="text-brand-400"/>
            <h1 className="font-bold text-white text-sm uppercase tracking-wider">Master Field Console</h1>
            <div className="h-4 w-px bg-dark-700 mx-2"></div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Schema Status:</span>
                <button 
                   onClick={() => setSchemaStatus(s => s === 'Draft' ? 'Published' : 'Draft')}
                   className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${schemaStatus === 'Draft' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 'bg-green-500/10 text-green-500 border-green-500/30'}`}
                >
                   {schemaStatus === 'Draft' ? <Edit3 size={10}/> : <Check size={10}/>} {schemaStatus}
                </button>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-dark-950 p-1 rounded-lg border border-dark-800">
               <span className="text-[10px] text-slate-500 uppercase font-bold pl-2">Preview As:</span>
               <select 
                  className="bg-transparent text-xs text-white font-medium outline-none cursor-pointer"
                  value={previewRole}
                  onChange={(e) => setPreviewRole(e.target.value)}
               >
                  {['Admin', 'Legal', 'Sales', 'Finance'].map(r => <option key={r} value={r} className="bg-dark-900">{r}</option>)}
               </select>
               <Eye size={12} className="text-slate-500 mr-1"/>
            </div>
            <Button variant="primary" className="h-8 text-xs shadow-lg shadow-brand-500/20" onClick={() => { setSchemaStatus('Published'); /* Trigger publish logic */ }}>
               Publish Changes
            </Button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Left Sidebar: Tables */}
         <div className="w-64 bg-dark-900 border-r border-dark-700 flex flex-col shrink-0">
            <div className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data Objects</div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
               {tables.map(table => {
                  const Icon = getIcon(table.icon);
                  return (
                     <button
                        key={table.id}
                        onClick={() => setActiveTableId(table.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                           activeTableId === table.id
                              ? 'bg-brand-500/10 text-white border border-brand-500/20'
                              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                        }`}
                     >
                        <Icon size={16} className={activeTableId === table.id ? 'text-brand-400' : 'text-slate-500'} />
                        {table.name}
                     </button>
                  );
               })}
            </div>
            <div className="p-4 border-t border-dark-800">
               <Button variant="secondary" className="w-full text-xs"><Settings size={14} className="mr-2"/> Schema Settings</Button>
            </div>
         </div>

         {/* Center: Field Grid */}
         <div className="flex-1 flex flex-col min-w-0 bg-dark-950 relative">
            
            {/* Action Toolbar */}
            <div className="p-4 border-b border-dark-800 flex justify-between items-center bg-dark-900/50">
               <div className="flex items-center gap-3">
                  <div className="relative">
                     <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                     <input 
                        type="text" 
                        placeholder="Filter fields..." 
                        className="bg-dark-950 border border-dark-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-brand-500 outline-none w-64 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
                  <Button variant="secondary" className="h-8 text-xs"><UploadCloud size={14} className="mr-2"/> Import</Button>
                  <Button variant="secondary" className="h-8 text-xs"><Download size={14} className="mr-2"/> Export</Button>
               </div>
               <Button variant="primary" className="h-8 text-xs flex items-center gap-2" onClick={() => handleEditField(null)}>
                  <Plus size={14}/> Add Custom Field
               </Button>
            </div>

            {/* Grid Header */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <table className="w-full text-left">
                  <thead className="bg-dark-900 text-xs uppercase font-bold text-slate-500 sticky top-0 z-10 shadow-sm">
                     <tr>
                        <th className="px-6 py-3 w-[30%]">Field Name / API Key</th>
                        <th className="px-6 py-3 w-[15%]">Type</th>
                        <th className="px-6 py-3 w-[20%]">Attributes</th>
                        <th className="px-6 py-3 w-[20%]">Integration Map</th>
                        <th className="px-6 py-3 w-[15%]">Last Modified</th>
                        <th className="px-6 py-3 text-right w-[50px]"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800">
                     {/* System Fields */}
                     <tr className="bg-dark-900/50">
                        <td colSpan={6} className="px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-y border-dark-800 flex items-center gap-2">
                           <Shield size={10}/> System Core Fields
                        </td>
                     </tr>
                     {systemFields.map(renderFieldRow)}

                     {/* Custom Fields */}
                     <tr className="bg-dark-900/50">
                        <td colSpan={6} className="px-6 py-2 text-[10px] font-bold text-brand-400 uppercase tracking-wider border-y border-dark-800 flex items-center gap-2">
                           <Settings size={10}/> Custom Fields
                        </td>
                     </tr>
                     {customFields.map(renderFieldRow)}
                     {customFields.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-xs text-slate-600 italic">No custom fields. Add one to extend the schema.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Right: Configuration Drawer */}
         {showEditDrawer && (
            <div className="w-[500px] bg-dark-900 border-l border-dark-700 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 relative z-20">
               <div className="p-5 border-b border-dark-700 flex justify-between items-center bg-dark-900">
                  <div>
                     <h3 className="text-lg font-bold text-white">{selectedField ? 'Edit Field' : 'Create Field'}</h3>
                     <p className="text-xs text-slate-500">Configure metadata, logic, and permissions.</p>
                  </div>
                  <button onClick={() => setShowEditDrawer(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
               </div>

               <div className="flex border-b border-dark-700 bg-dark-950/50">
                  {[
                     { id: 'general', icon: Settings, label: 'General' },
                     { id: 'data', icon: Database, label: 'Data & Validation' },
                     { id: 'integration', icon: Box, label: 'Integration' },
                     { id: 'permissions', icon: ShieldCheck, label: 'Access' },
                     { id: 'usage', icon: Layers, label: 'Usage' }
                  ].map(tab => (
                     <button 
                        key={tab.id}
                        onClick={() => setDrawerTab(tab.id as any)}
                        className={`flex-1 py-3 flex justify-center items-center border-b-2 transition-colors ${drawerTab === tab.id ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                        title={tab.label}
                     >
                        <tab.icon size={16}/>
                     </button>
                  ))}
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dark-950 custom-scrollbar">
                  {/* General Tab */}
                  {drawerTab === 'general' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <Input 
                           label="Display Label" 
                           value={fieldForm.name} 
                           onChange={(e) => setFieldForm({...fieldForm, name: e.target.value})}
                           placeholder="e.g. Renewal Notice Days"
                        />
                        <Input 
                           label="API Name (Key)" 
                           value={fieldForm.key} 
                           onChange={(e) => setFieldForm({...fieldForm, key: e.target.value})}
                           className="font-mono text-xs"
                           placeholder="renewal_notice_days"
                           disabled={!!selectedField || !!selectedField?.isLocked}
                        />
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
                           <textarea 
                              className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none resize-none h-24"
                              value={fieldForm.description || ''}
                              onChange={(e) => setFieldForm({...fieldForm, description: e.target.value})}
                              placeholder="Explain usage for other admins..."
                           />
                        </div>
                        
                        <div className="p-4 bg-dark-900 rounded-xl border border-dark-700">
                           <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Attributes</h4>
                           <div className="grid grid-cols-2 gap-3">
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <Switch checked={fieldForm.required} onChange={(c) => setFieldForm({...fieldForm, required: c})}/>
                                 <span className="text-sm text-slate-300">Required</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <Switch checked={fieldForm.unique} onChange={(c) => setFieldForm({...fieldForm, unique: c})}/>
                                 <span className="text-sm text-slate-300">Unique</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <Switch checked={fieldForm.isIndexed} onChange={(c) => setFieldForm({...fieldForm, isIndexed: c})}/>
                                 <span className="text-sm text-slate-300">Indexed</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <Switch checked={fieldForm.isPII} onChange={(c) => setFieldForm({...fieldForm, isPII: c})}/>
                                 <span className="text-sm text-red-400">PII / Sensitive</span>
                              </label>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Data & Validation Tab */}
                  {drawerTab === 'data' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Data Type</label>
                           <div className="grid grid-cols-3 gap-2">
                              {['text', 'number', 'date', 'currency', 'select', 'boolean', 'formula', 'encrypted', 'json'].map(t => {
                                 const Icon = getTypeIcon(t);
                                 return (
                                    <button
                                       key={t}
                                       onClick={() => setFieldForm({...fieldForm, type: t})}
                                       disabled={selectedField?.isLocked}
                                       className={`flex flex-col items-center p-2 rounded border transition-all ${fieldForm.type === t ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'bg-dark-900 border-dark-700 text-slate-400 hover:border-slate-500'} ${selectedField?.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                       <Icon size={16} className="mb-1"/>
                                       <span className="text-[10px] font-bold uppercase">{t}</span>
                                    </button>
                                 )
                              })}
                           </div>
                        </div>

                        {fieldForm.type === 'formula' && (
                           <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                              <h4 className="text-xs font-bold text-yellow-500 uppercase mb-2 flex items-center gap-2"><FunctionSquare size={14}/> Formula Expression</h4>
                              <textarea 
                                 className="w-full bg-dark-900 border border-dark-700 rounded p-3 font-mono text-xs text-yellow-200 h-20 focus:border-yellow-500 outline-none"
                                 placeholder="e.g. DATE_ADD(startDate, 365, 'day')"
                                 value={fieldForm.formula || ''}
                                 onChange={(e) => setFieldForm({...fieldForm, formula: e.target.value})}
                              />
                              <div className="mt-2 flex gap-1 text-[9px] text-slate-500 font-mono">
                                 <span className="px-1 bg-dark-800 rounded border border-dark-700">DATE_ADD</span>
                                 <span className="px-1 bg-dark-800 rounded border border-dark-700">IF</span>
                                 <span className="px-1 bg-dark-800 rounded border border-dark-700">CONCAT</span>
                              </div>
                           </div>
                        )}

                        {fieldForm.type === 'select' && (
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Picklist Options</label>
                              <textarea 
                                 className="w-full bg-dark-900 border border-dark-700 rounded p-3 text-xs text-white h-20"
                                 placeholder="Enter options separated by commas..."
                                 value={(fieldForm.options || []).join(', ')}
                                 onChange={(e) => setFieldForm({...fieldForm, options: e.target.value.split(',').map(s => s.trim())})}
                              />
                           </div>
                        )}

                        <div className="p-4 bg-dark-900 rounded-xl border border-dark-700">
                           <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><ShieldCheck size={14}/> Validation Rules</h4>
                           <div className="space-y-2">
                              <div className="p-2 bg-dark-950 border border-dark-800 rounded flex items-center gap-2 text-xs text-slate-400">
                                 <Plus size={14}/> Add Validation Rule (Regex, Range, Custom)
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Integration Tab */}
                  {drawerTab === 'integration' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                           <h4 className="text-sm font-bold text-blue-100 flex items-center gap-2 mb-4"><Box size={16}/> External Mapping</h4>
                           
                           <Select 
                              label="Integration Connector"
                              options={[{label: 'None', value: ''}, ...MOCK_INTEGRATIONS.filter(i=>i.installed).map(i => ({label: i.name, value: i.id}))]}
                              value={fieldForm.integrationAppId || ''}
                              onChange={(e) => setFieldForm({...fieldForm, integrationAppId: e.target.value})}
                              className="mb-4 bg-dark-900 border-dark-700"
                           />
                           
                           {fieldForm.integrationAppId && (
                              <>
                                 <div className="grid grid-cols-2 gap-4 mb-4">
                                    <Select 
                                       label="External Object"
                                       options={MOCK_EXTERNAL_OBJECTS.map(o => ({label: o, value: o}))}
                                       value={fieldForm.externalObject || ''}
                                       onChange={(e) => setFieldForm({...fieldForm, externalObject: e.target.value})}
                                       className="bg-dark-900 border-dark-700"
                                    />
                                    <Select 
                                       label="External Field"
                                       options={MOCK_EXTERNAL_FIELDS.map(f => ({label: f, value: f}))}
                                       value={fieldForm.externalField || ''}
                                       onChange={(e) => setFieldForm({...fieldForm, externalField: e.target.value})}
                                       className="bg-dark-900 border-dark-700"
                                    />
                                 </div>
                                 <Select 
                                    label="Sync Direction"
                                    options={[{label: 'Import (Inbound)', value: 'import'}, {label: 'Export (Outbound)', value: 'export'}, {label: 'Bidirectional', value: 'bidirectional'}]}
                                    value={fieldForm.syncDirection || 'import'}
                                    onChange={(e) => setFieldForm({...fieldForm, syncDirection: e.target.value as any})}
                                    className="bg-dark-900 border-dark-700"
                                 />
                              </>
                           )}
                        </div>
                        
                        {fieldForm.integrationAppId && (
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Transformation Script (JS)</label>
                              <div className="bg-dark-950 border border-dark-700 rounded p-2 font-mono text-[10px] text-blue-300">
                                 // Optional: Transform value before save<br/>
                                 return value.trim().toUpperCase();
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {/* Permissions Tab */}
                  {drawerTab === 'permissions' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-300 text-xs mb-4">
                           <Lock size={14}/>
                           <span>Field Level Security (FLS) controls visibility per role.</span>
                        </div>
                        
                        <div className="space-y-3">
                           {MOCK_ROLES.map(role => {
                              // Mock logic for finding current rule
                              const rule = fieldForm.visibilityRules?.find(r => r.roleId === role.id) || { roleId: role.id, access: 'read_write' };
                              
                              return (
                                 <div key={role.id} className="flex items-center justify-between p-3 bg-dark-900 border border-dark-700 rounded-lg">
                                    <span className="text-sm font-medium text-white">{role.name}</span>
                                    <select 
                                       className="bg-dark-950 border border-dark-700 text-xs text-slate-300 rounded px-2 py-1 outline-none focus:border-brand-500"
                                       value={rule.access}
                                       onChange={(e) => {
                                          // Basic mock update
                                          const newRules = fieldForm.visibilityRules?.filter(r => r.roleId !== role.id) || [];
                                          newRules.push({ roleId: role.id, access: e.target.value as any });
                                          setFieldForm({...fieldForm, visibilityRules: newRules});
                                       }}
                                    >
                                       <option value="read_write">Read/Write</option>
                                       <option value="read_only">Read Only</option>
                                       <option value="masked">Masked (****)</option>
                                       <option value="hidden">Hidden</option>
                                    </select>
                                 </div>
                              )
                           })}
                        </div>
                     </div>
                  )}

                  {/* Usage Tab */}
                  {drawerTab === 'usage' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl text-center">
                              <div className="text-2xl font-bold text-white">12</div>
                              <div className="text-xs text-slate-500 uppercase font-bold">Templates</div>
                           </div>
                           <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl text-center">
                              <div className="text-2xl font-bold text-white">5</div>
                              <div className="text-xs text-slate-500 uppercase font-bold">Workflows</div>
                           </div>
                        </div>
                        
                        <div>
                           <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Dependency Graph</h4>
                           <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-slate-300 p-2 bg-dark-900 rounded border border-dark-700">
                                 <FileText size={14} className="text-brand-400"/> MSA Standard Template v2
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-300 p-2 bg-dark-900 rounded border border-dark-700">
                                 <RefreshCw size={14} className="text-purple-400"/> High Value Approval Flow
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
               </div>

               <div className="p-5 border-t border-dark-700 bg-dark-900 flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setShowEditDrawer(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleSaveField} className="shadow-lg shadow-brand-500/20">
                     <Save size={16} className="mr-2"/> Save Field
                  </Button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default FieldDatabase;
