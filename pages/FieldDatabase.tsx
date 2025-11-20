
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/UIComponents';
import { MOCK_TABLES, MOCK_INTEGRATIONS } from '../mock/data';
import { FieldTable, FieldDefinition } from '../types';
import { 
  Database, Plus, Settings, Link as LinkIcon, Search, FileText, Users, Briefcase, Box, 
  ArrowRight, Trash2, Lock, Edit3, Shield, X, CheckSquare, Type, Hash, Calendar, 
  DollarSign, Globe, AtSign, ToggleLeft, AlignLeft, Phone, ArrowLeftRight, ArrowLeft, 
  Layers, Eye, Code, Binary, Fingerprint, List, DatabaseZap, Check, Key, MoreHorizontal 
} from 'lucide-react';

const CONTRACT_TYPES = ['NDA', 'MSA', 'SOW', 'Licensing Agreement', 'Vendor Agreement', 'Offer Letter', 'Partnership Deed'];
const MOCK_EXTERNAL_OBJECTS = ['Opportunity', 'Account', 'Contact', 'Quote', 'Order', 'Ticket'];
const MOCK_EXTERNAL_FIELDS = ['Amount', 'StageName', 'CloseDate', 'AccountName', 'BillingCity', 'Description', 'Status', 'OwnerId', 'CreatedDate'];

const FieldDatabase: React.FC = () => {
  const [activeTableId, setActiveTableId] = useState<string>(MOCK_TABLES[0].id);
  const [tables, setTables] = useState<FieldTable[]>(MOCK_TABLES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTab, setModalTab] = useState<'general' | 'visibility' | 'integration'>('general');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New Option State for Select/Enum types
  const [currentOption, setCurrentOption] = useState('');
  
  const activeTable = tables.find(t => t.id === activeTableId) || tables[0];

  // Form State for New Field
  const [newField, setNewField] = useState<Partial<FieldDefinition>>({
    name: '',
    key: '',
    type: 'text',
    required: false,
    unique: false,
    description: '',
    visibleDocumentTypes: [],
    source: 'custom',
    options: []
  });

  // Integration State specific for form
  const [integrationConfig, setIntegrationConfig] = useState({
    enabled: false,
    appId: '',
    object: '',
    field: '',
    direction: 'import' as 'import' | 'export' | 'bidirectional'
  });

  // Auto-generate key from name (only for new fields)
  useEffect(() => {
    if (newField.name && !newField.key && !editingId) {
      const generatedKey = newField.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      setNewField(prev => ({ ...prev, key: generatedKey }));
    }
  }, [newField.name, editingId]);

  const handleEditField = (field: FieldDefinition) => {
    setEditingId(field.id);
    setNewField({
        name: field.name,
        key: field.key,
        type: field.type,
        required: field.required,
        unique: field.unique || false,
        description: field.description || '',
        visibleDocumentTypes: field.visibleDocumentTypes || [],
        source: field.source,
        relatedTableId: field.relatedTableId,
        options: field.options || []
    });

    if (field.source === 'integration' || (field.integrationAppId && field.source !== 'system')) {
        setIntegrationConfig({
            enabled: true,
            appId: field.integrationAppId || '',
            object: field.externalObject || '',
            field: field.externalField || '',
            direction: field.syncDirection || 'import'
        });
    } else {
        setIntegrationConfig({ enabled: false, appId: '', object: '', field: '', direction: 'import' });
    }
    
    setShowAddModal(true);
  };

  const handleSaveField = () => {
    if (!newField.name || !newField.key) return;

    const fieldData: FieldDefinition = {
      id: editingId || `f_${Date.now()}`,
      name: newField.name,
      key: newField.key,
      type: (newField.type as FieldDefinition['type']) || 'text',
      source: integrationConfig.enabled ? 'integration' : (newField.source || 'custom'),
      required: newField.required || false,
      unique: newField.unique || false,
      description: newField.description,
      relatedTableId: newField.relatedTableId,
      visibleDocumentTypes: newField.visibleDocumentTypes || [],
      options: newField.options || [],
      
      // Integration props
      integrationAppId: integrationConfig.enabled ? integrationConfig.appId : undefined,
      externalField: integrationConfig.enabled ? integrationConfig.field : undefined,
      externalObject: integrationConfig.enabled ? integrationConfig.object : undefined,
      syncDirection: integrationConfig.enabled ? integrationConfig.direction : undefined,
    };

    const updatedTables = tables.map(t => {
      if (t.id === activeTableId) {
        if (editingId) {
            // Update existing field
            return {
                ...t,
                fields: t.fields.map(f => f.id === editingId ? fieldData : f)
            };
        } else {
            // Add new field
            return {
                ...t,
                fields: [...t.fields, fieldData]
            };
        }
      }
      return t;
    });

    setTables(updatedTables);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewField({ name: '', key: '', type: 'text', required: false, unique: false, description: '', visibleDocumentTypes: [], source: 'custom', options: [] });
    setIntegrationConfig({ enabled: false, appId: '', object: '', field: '', direction: 'import' });
    setModalTab('general');
    setEditingId(null);
    setCurrentOption('');
  };

  const toggleDocumentType = (type: string) => {
    const current = newField.visibleDocumentTypes || [];
    if (current.includes(type)) {
      setNewField({ ...newField, visibleDocumentTypes: current.filter(t => t !== type) });
    } else {
      setNewField({ ...newField, visibleDocumentTypes: [...current, type] });
    }
  };

  const handleAddOption = () => {
      if (currentOption.trim()) {
          setNewField(prev => ({
              ...prev,
              options: [...(prev.options || []), currentOption.trim()]
          }));
          setCurrentOption('');
      }
  };

  const handleRemoveOption = (index: number) => {
      setNewField(prev => ({
          ...prev,
          options: (prev.options || []).filter((_, i) => i !== index)
      }));
  };

  // Icon mapping
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'FileText': return FileText;
      case 'Users': return Users;
      case 'Briefcase': return Briefcase;
      default: return Box;
    }
  };

  const ActiveIcon = getIcon(activeTable.icon);

  // Split fields logic
  const systemFields = activeTable.fields.filter(f => f.source === 'system');
  const customFields = activeTable.fields.filter(f => f.source !== 'system');

  // --- Field Type Categories ---
  const FIELD_CATEGORIES = [
    {
        name: 'Standard Primitives',
        types: [
            { id: 'text', label: 'String', icon: Type, desc: 'Short text' },
            { id: 'number', label: 'Integer', icon: Hash, desc: 'Whole nums' },
            { id: 'boolean', label: 'Boolean', icon: CheckSquare, desc: 'True/False' },
            { id: 'date', label: 'Date', icon: Calendar, desc: 'Calendar' },
            { id: 'select', label: 'Enum', icon: List, desc: 'Dropdown' },
        ]
    },
    {
        name: 'Business Data',
        types: [
            { id: 'email', label: 'Email', icon: AtSign, desc: 'Validated' },
            { id: 'phone', label: 'Phone', icon: Phone, desc: 'Tel numbers' },
            { id: 'url', label: 'URL', icon: Globe, desc: 'Web links' },
            { id: 'currency', label: 'Currency', icon: DollarSign, desc: 'Finance' },
            { id: 'long_text', label: 'Rich Text', icon: AlignLeft, desc: 'Long form' },
        ]
    },
    {
        name: 'PostgreSQL / SQL',
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
        types: [
            { id: 'uuid', label: 'UUID', icon: Fingerprint, desc: 'Unique ID' },
            { id: 'json', label: 'JSONB', icon: Code, desc: 'Binary JSON' },
            { id: 'array', label: 'Array', icon: Layers, desc: 'List values' },
            { id: 'decimal', label: 'Decimal', icon: Hash, desc: 'High precision' },
            { id: 'timestamp', label: 'Timestamp', icon: Calendar, desc: 'Date + Time' },
        ]
    },
    {
        name: 'MongoDB / NoSQL',
        color: 'text-green-400 border-green-500/30 bg-green-500/10',
        types: [
            { id: 'objectId', label: 'ObjectId', icon: DatabaseZap, desc: 'Mongo ID' },
            { id: 'binary', label: 'Binary', icon: Binary, desc: 'Buffer data' },
            { id: 'json', label: 'Document', icon: Code, desc: 'Nested Doc' },
        ]
    },
    {
        name: 'Relational',
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
        types: [
            { id: 'relationship', label: 'Link', icon: LinkIcon, desc: 'Foreign Key' },
        ]
    }
  ];

  const renderFieldRow = (field: FieldDefinition, isLocked: boolean) => (
    <tr key={field.id} className={`hover:bg-white/5 transition-colors group ${isLocked ? 'opacity-90' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isLocked ? 'text-slate-400' : 'text-slate-200'}`}>{field.name}</span>
          {field.required && <span className="text-[10px] text-red-400 bg-red-400/10 px-1.5 rounded font-bold">REQ</span>}
          {field.unique && <span className="text-[10px] text-purple-400 bg-purple-400/10 px-1.5 rounded font-bold">UNIQ</span>}
          {isLocked && <Lock size={10} className="text-slate-600" />}
        </div>
        <span className="text-xs text-slate-600 font-mono">{field.key}</span>
        {field.description && <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{field.description}</p>}
      </td>
      <td className="px-6 py-4">
        <Badge color="gray">{field.type}</Badge>
        {field.type === 'select' && field.options && (
            <div className="mt-1 text-[10px] text-slate-500 truncate max-w-[100px] bg-dark-800 px-1 rounded">
                {field.options.join(', ')}
            </div>
        )}
      </td>
      <td className="px-6 py-4">
        {field.source === 'system' && (
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Shield size={12} /> System Core
          </div>
        )}
        {field.source === 'integration' && (
          <div className="flex items-center gap-2 text-blue-400 text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Integration
          </div>
        )}
        {field.source === 'custom' && (
          <div className="flex items-center gap-2 text-brand-400 text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-brand-500"></div> Custom Field
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        {field.source === 'integration' && field.integrationAppId && (
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2 text-xs bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded w-fit text-blue-300">
                <Box size={12} />
                {MOCK_INTEGRATIONS.find(i => i.id === field.integrationAppId)?.name} 
                <ArrowRight size={10} /> 
                {field.externalObject ? `${field.externalObject} > ` : ''}{field.externalField}
             </div>
             {field.syncDirection && (
                <span className="text-[9px] text-slate-500 uppercase tracking-wide flex items-center gap-1 pl-1">
                   {field.syncDirection === 'import' && <ArrowRight size={8}/>}
                   {field.syncDirection === 'export' && <ArrowLeft size={8}/>}
                   {field.syncDirection === 'bidirectional' && <ArrowLeftRight size={8}/>}
                   {field.syncDirection} Sync
                </span>
             )}
          </div>
        )}
        {field.type === 'relationship' && field.relatedTableId && (
          <div className="flex items-center gap-2 text-xs bg-brand-500/10 border border-brand-500/20 px-2 py-1 rounded w-fit text-brand-300">
            <LinkIcon size={12} />
            Linked to {tables.find(t => t.id === field.relatedTableId)?.name}
          </div>
        )}
        {field.type === 'select' && field.options && (
            <div className="text-xs text-slate-500 flex items-center gap-1">
                <List size={12}/> {field.options.length} Options Configured
            </div>
        )}
        {field.source === 'system' && <span className="text-xs text-slate-600 italic">Core framework definition</span>}
        {field.source === 'custom' && field.type !== 'select' && field.type !== 'relationship' && <span className="text-xs text-slate-500">User defined property</span>}
      </td>
      <td className="px-6 py-4 text-right">
        {isLocked ? (
           <button className="p-1.5 rounded text-slate-700 cursor-not-allowed" title="System fields cannot be modified">
             <Lock size={14} />
           </button>
        ) : (
          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={() => handleEditField(field)} className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-brand-400 transition-colors">
               <Edit3 size={14} />
             </button>
             <button className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-red-400 transition-colors">
               <Trash2 size={14} />
             </button>
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 relative">
      {/* Sidebar: Tables List */}
      <Card className="w-64 flex flex-col overflow-hidden" noPadding>
        <div className="p-4 border-b border-white/5 bg-dark-900/50 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Database size={16} className="text-brand-400" />
            Data Tables
          </h3>
          <button className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {tables.map(table => {
            const Icon = getIcon(table.icon);
            return (
              <button
                key={table.id}
                onClick={() => setActiveTableId(table.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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
        <div className="p-4 border-t border-white/5 bg-dark-900/30 text-center">
           <p className="text-[10px] text-slate-500">Managed by Agreemetrix Core</p>
        </div>
      </Card>

      {/* Main Content: Schema Designer */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <div className="p-2 bg-dark-800 rounded-lg text-brand-400 border border-white/10">
                    <ActiveIcon size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-white">{activeTable.name}</h2>
                    <p className="text-sm text-slate-400">{activeTable.description}</p>
                 </div>
              </div>
           </div>
           <div className="flex gap-2">
              <Button variant="secondary" className="flex items-center gap-2"><Settings size={16} /> Settings</Button>
              <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-brand-500/20" onClick={() => { resetForm(); setShowAddModal(true); }}><Plus size={16} /> Add Custom Field</Button>
           </div>
        </div>

        {/* Fields Table */}
        <Card className="flex-1 flex flex-col overflow-hidden" noPadding>
           <div className="p-4 border-b border-white/5 flex items-center justify-between bg-dark-900/50">
              <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wide">Field Schema</h4>
              <div className="relative">
                 <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                 <input 
                   type="text" 
                   placeholder="Filter fields..." 
                   className="bg-dark-950 border border-dark-700 rounded py-1 pl-8 pr-2 text-xs text-slate-200 focus:border-brand-500 outline-none w-48 placeholder:text-slate-600"
                 />
              </div>
           </div>
           <div className="flex-1 overflow-auto bg-dark-950/50">
              <table className="w-full text-left text-sm text-slate-400">
                 <thead className="text-xs uppercase bg-dark-950 text-slate-500 font-semibold sticky top-0 z-10 shadow-sm">
                    <tr>
                       <th className="px-6 py-3">Field Name</th>
                       <th className="px-6 py-3">Data Type</th>
                       <th className="px-6 py-3">Source</th>
                       <th className="px-6 py-3">Details & Logic</th>
                       <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-dark-800">
                    {/* Section: Pre-configured */}
                    <tr className="bg-dark-900/95 backdrop-blur-sm sticky top-10 z-10">
                       <td colSpan={5} className="px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-y border-white/5">
                          <div className="flex items-center gap-2">
                             <Shield size={12} className="text-brand-500" /> 
                             System & Pre-configured Fields <span className="text-[10px] font-normal opacity-60 ml-1">(Uneditable)</span>
                          </div>
                       </td>
                    </tr>
                    {systemFields.map(field => renderFieldRow(field, true))}
                    {systemFields.length === 0 && (
                       <tr><td colSpan={5} className="px-6 py-4 text-center text-xs text-slate-600">No system fields found.</td></tr>
                    )}

                    {/* Section: Custom */}
                    <tr className="bg-dark-900/95 backdrop-blur-sm sticky top-10 z-10">
                       <td colSpan={5} className="px-6 py-2 text-xs font-bold text-brand-400 uppercase tracking-wider border-y border-white/5">
                          <div className="flex items-center gap-2">
                             <Settings size={12} />
                             Custom Fields <Badge color="brand" className="text-[9px] ml-2">Editable</Badge>
                          </div>
                       </td>
                    </tr>
                    {customFields.map(field => renderFieldRow(field, false))}
                    
                    {/* Add Row Placeholder */}
                    {customFields.length === 0 && (
                       <tr><td colSpan={5} className="px-6 py-8 text-center text-xs text-slate-600 italic border-b border-dashed border-dark-700">No custom fields defined yet.</td></tr>
                    )}
                    
                    <tr className="hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => { resetForm(); setShowAddModal(true); }}>
                       <td colSpan={5} className="px-6 py-4">
                          <button className="flex items-center justify-center gap-2 text-sm text-slate-500 group-hover:text-brand-400 transition-colors w-full border-2 border-dashed border-dark-800 group-hover:border-brand-500/30 rounded-lg py-3">
                             <Plus size={16} /> Add New Field
                          </button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </Card>
      </div>

      {/* Add Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-dark-900 w-full max-w-4xl rounded-2xl border border-dark-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] relative">
             {/* Glow Effect */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-brand-500 shadow-[0_0_40px_rgba(var(--color-brand-500),0.5)]"></div>
            
            <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-900">
              <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {editingId ? <Edit3 size={20} className="text-brand-400"/> : <Plus size={20} className="text-brand-400"/>}
                    {editingId ? 'Edit Field Configuration' : 'Add Field to Schema'}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Define data structure for <strong>{activeTable.name}</strong> object.</p>
              </div>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-dark-700 bg-dark-900/50 px-6">
               <button 
                  onClick={() => setModalTab('general')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${modalTab === 'general' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-400 hover:text-white'}`}
               >
                  <Type size={16}/> General & Type
               </button>
               <button 
                  onClick={() => setModalTab('visibility')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${modalTab === 'visibility' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400 hover:text-white'}`}
               >
                  <Layers size={16}/> Visibility & Context
               </button>
               <button 
                  onClick={() => setModalTab('integration')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${modalTab === 'integration' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-slate-400 hover:text-white'}`}
               >
                  <Box size={16}/> Integration Mapping
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-dark-950 custom-scrollbar">
              
              {/* General Tab */}
              {modalTab === 'general' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                   {/* Top Form */}
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <Input 
                           label="Field Name (Display Label)" 
                           placeholder="e.g. Renewal Notice Days" 
                           value={newField.name}
                           onChange={(e) => setNewField({...newField, name: e.target.value})}
                           className="bg-dark-900 border-dark-700 text-white focus:border-brand-500"
                         />
                         <Input 
                           label="Field Key (Database ID)" 
                           value={newField.key}
                           onChange={(e) => setNewField({...newField, key: e.target.value})}
                           className={`font-mono text-xs bg-dark-900 border-dark-700 text-white focus:border-brand-500 ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                           placeholder="renewal_notice_days"
                           disabled={!!editingId}
                           title={editingId ? "Key cannot be changed after creation" : ""}
                         />
                      </div>
                      <div className="space-y-6">
                         <div>
                           <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                           <textarea 
                              className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none resize-none h-[108px] shadow-inner placeholder:text-slate-600"
                              placeholder="Describe the purpose of this field for other admins..."
                              value={newField.description}
                              onChange={(e) => setNewField({...newField, description: e.target.value})}
                           ></textarea>
                         </div>
                      </div>
                   </div>

                   {/* Constraints */}
                   <div className="p-4 bg-dark-900 rounded-xl border border-dark-700">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Constraints & Validation</h4>
                      <div className="flex gap-4">
                          <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all flex-1 ${newField.required ? 'bg-red-500/10 border-red-500/50' : 'bg-dark-950 border-dark-700 hover:border-slate-500'}`}>
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${newField.required ? 'bg-red-500 border-red-500 text-white' : 'border-slate-500'}`}>
                                  {newField.required && <Check size={14} />}
                              </div>
                              <input type="checkbox" className="hidden" checked={newField.required} onChange={(e) => setNewField({...newField, required: e.target.checked})} />
                              <div>
                                  <span className={`text-sm font-bold ${newField.required ? 'text-red-400' : 'text-slate-300'}`}>Required Field</span>
                                  <p className="text-xs text-slate-500">Cannot be empty</p>
                              </div>
                          </label>

                          <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all flex-1 ${newField.unique ? 'bg-purple-500/10 border-purple-500/50' : 'bg-dark-950 border-dark-700 hover:border-slate-500'}`}>
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${newField.unique ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-500'}`}>
                                  {newField.unique && <Check size={14} />}
                              </div>
                              <input type="checkbox" className="hidden" checked={newField.unique} onChange={(e) => setNewField({...newField, unique: e.target.checked})} />
                              <div>
                                  <span className={`text-sm font-bold ${newField.unique ? 'text-purple-400' : 'text-slate-300'}`}>Unique Value</span>
                                  <p className="text-xs text-slate-500">No duplicates allowed</p>
                              </div>
                          </label>
                      </div>
                   </div>

                   {/* Type Selector */}
                   <div>
                     <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Database size={16} className="text-brand-400"/> Data Type Selection</h4>
                     <div className="space-y-6">
                        {FIELD_CATEGORIES.map((category, idx) => (
                           <div key={idx}>
                              <p className={`text-xs font-bold uppercase tracking-wider mb-3 border-b border-dark-800 pb-1 flex items-center gap-2 ${category.color ? category.color.split(' ')[0] : 'text-slate-500'}`}>
                                {category.name}
                                {category.color && <span className={`px-1.5 py-0.5 rounded text-[9px] ${category.color}`}>DB Optimized</span>}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                 {category.types.map(type => (
                                    <button
                                       key={type.id}
                                       onClick={() => setNewField({...newField, type: type.id as any})}
                                       className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group relative overflow-hidden hover:scale-[1.02] hover:shadow-lg duration-200 ${
                                          newField.type === type.id 
                                             ? 'bg-brand-500/10 border-brand-500 text-white ring-1 ring-brand-500/50 shadow-[0_0_15px_rgba(var(--color-brand-500),0.2)]' 
                                             : 'bg-dark-900 border-dark-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                                       }`}
                                    >
                                       <div className={`mb-2 p-2 rounded-lg ${newField.type === type.id ? 'bg-brand-500 text-white' : 'bg-dark-800 text-slate-500 group-hover:text-slate-300'}`}>
                                          <type.icon size={18} />
                                       </div>
                                       <span className="text-sm font-bold mb-0.5">{type.label}</span>
                                       <span className="text-[10px] opacity-60 leading-tight">{type.desc}</span>
                                    </button>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                   </div>
                   
                   {/* Conditional Configs Based on Type */}
                   <div className="animate-in fade-in slide-in-from-bottom-2">
                        {newField.type === 'relationship' && (
                            <div className="p-5 bg-brand-500/5 border border-brand-500/20 rounded-xl">
                                <h4 className="text-sm font-bold text-brand-400 mb-3 flex items-center gap-2"><LinkIcon size={16}/> Relationship Config</h4>
                                <Select 
                                    label="Related Table (Foreign Key)"
                                    options={tables.filter(t => t.id !== activeTableId).map(t => ({ label: t.name, value: t.id }))}
                                    value={newField.relatedTableId}
                                    onChange={(e) => setNewField({...newField, relatedTableId: e.target.value})}
                                    className="bg-dark-900 border-dark-700 text-white"
                                />
                                <p className="text-[10px] text-brand-200/60 mt-2">Creates a dynamic link to records in the target table.</p>
                            </div>
                        )}

                        {newField.type === 'select' && (
                            <div className="p-5 bg-dark-900 border border-dark-700 rounded-xl">
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><List size={16}/> Enum Options</h4>
                                <div className="flex gap-2 mb-3">
                                    <Input 
                                        placeholder="Type option label and press Enter" 
                                        value={currentOption}
                                        onChange={(e) => setCurrentOption(e.target.value)}
                                        onKeyDown={(e) => { if(e.key === 'Enter'){ handleAddOption(); } }}
                                        className="bg-dark-950 border-dark-700 text-white"
                                    />
                                    <Button variant="secondary" onClick={handleAddOption}><Plus size={16}/></Button>
                                </div>
                                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-dark-950 rounded border border-dark-800">
                                    {(newField.options || []).map((opt, i) => (
                                        <div key={i} className="px-3 py-1 bg-dark-800 text-slate-200 rounded-full text-sm border border-dark-700 flex items-center gap-2 animate-in zoom-in">
                                            {opt}
                                            <button onClick={() => handleRemoveOption(i)} className="text-slate-500 hover:text-red-400"><X size={12}/></button>
                                        </div>
                                    ))}
                                    {(newField.options || []).length === 0 && (
                                        <span className="text-xs text-slate-600 italic self-center pl-2">No options added.</span>
                                    )}
                                </div>
                            </div>
                        )}
                   </div>
                </div>
              )}

              {/* Visibility Tab */}
              {modalTab === 'visibility' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                       <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                             <Layers size={24} />
                          </div>
                          <div>
                             <h4 className="text-lg font-bold text-blue-100">Context Visibility</h4>
                             <p className="text-sm text-blue-200/70 mt-1 max-w-xl">
                                Determine where this field should appear in the application. You can limit fields to specific contract types to keep forms clean.
                             </p>
                          </div>
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">Visible In Agreement Types</label>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {CONTRACT_TYPES.map(type => {
                             const isSelected = (newField.visibleDocumentTypes || []).includes(type);
                             return (
                                <button 
                                   key={type}
                                   onClick={() => toggleDocumentType(type)}
                                   className={`p-4 rounded-xl border text-sm text-left transition-all flex items-center justify-between group ${isSelected ? 'bg-blue-500/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-dark-900 border-dark-700 text-slate-400 hover:border-slate-600 hover:bg-dark-800'}`}
                                >
                                   <span className="font-medium">{type}</span>
                                   <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                                      {isSelected && <CheckSquare size={12} className="text-white" />}
                                   </div>
                                </button>
                             )
                          })}
                       </div>
                       <p className="text-xs text-slate-500 mt-4 italic">* If no specific types are selected, this field will be globally available across all objects.</p>
                    </div>
                 </div>
              )}

              {/* Integration Tab */}
              {modalTab === 'integration' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                       <div className="flex items-start gap-4">
                          <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                             <Box size={24} />
                          </div>
                          <div>
                             <h4 className="text-lg font-bold text-purple-100">External Data Mapping</h4>
                             <p className="text-sm text-purple-200/70 mt-1">Connect this field to an external system (e.g., Salesforce, HubSpot) for automated data synchronization.</p>
                          </div>
                       </div>
                       <label className="flex items-center gap-3 cursor-pointer">
                          <span className={`text-sm font-bold uppercase ${integrationConfig.enabled ? 'text-purple-400' : 'text-slate-500'}`}>{integrationConfig.enabled ? 'Mapping Active' : 'Disabled'}</span>
                          <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${integrationConfig.enabled ? 'bg-purple-500' : 'bg-dark-700'}`}>
                             <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${integrationConfig.enabled ? 'translate-x-5' : ''}`}></div>
                          </div>
                          <input type="checkbox" className="hidden" checked={integrationConfig.enabled} onChange={(e) => setIntegrationConfig({...integrationConfig, enabled: e.target.checked})} />
                       </label>
                    </div>

                    {integrationConfig.enabled && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-dark-900 border border-dark-700 rounded-2xl animate-in zoom-in-95 duration-200 shadow-lg">
                          <div className="space-y-6">
                             <Select 
                                label="Integration Application" 
                                options={MOCK_INTEGRATIONS.filter(i => i.installed).map(i => ({ label: i.name, value: i.id }))} 
                                value={integrationConfig.appId}
                                onChange={(e) => setIntegrationConfig({...integrationConfig, appId: e.target.value})}
                                className="bg-dark-950 border-dark-800 text-white"
                             />
                             <Select 
                                label="External Object / Module"
                                options={MOCK_EXTERNAL_OBJECTS.map(o => ({ label: o, value: o }))}
                                value={integrationConfig.object}
                                onChange={(e) => setIntegrationConfig({...integrationConfig, object: e.target.value})}
                                className="bg-dark-950 border-dark-800 text-white"
                             />
                          </div>
                          <div className="space-y-6">
                             <Select 
                                label="External Field ID"
                                options={MOCK_EXTERNAL_FIELDS.map(f => ({ label: f, value: f }))}
                                value={integrationConfig.field}
                                onChange={(e) => setIntegrationConfig({...integrationConfig, field: e.target.value})}
                                className="bg-dark-950 border-dark-800 text-white"
                             />
                             <Select 
                                label="Sync Direction"
                                options={[
                                   { label: 'Import (One-way)', value: 'import' },
                                   { label: 'Export (One-way)', value: 'export' },
                                   { label: 'Bidirectional (Sync)', value: 'bidirectional' },
                                ]}
                                value={integrationConfig.direction}
                                onChange={(e) => setIntegrationConfig({...integrationConfig, direction: e.target.value as any})}
                                className="bg-dark-950 border-dark-800 text-white"
                             />
                          </div>
                          <div className="col-span-1 md:col-span-2 pt-6 border-t border-dark-800">
                             <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                   <div className="px-3 py-2 bg-dark-950 rounded border border-dark-800 text-slate-300 font-mono">{integrationConfig.object || 'Object'}</div>
                                   <span className="font-mono text-slate-600">.</span>
                                   <div className="px-3 py-2 bg-dark-950 rounded border border-dark-800 text-slate-300 font-mono">{integrationConfig.field || 'Field'}</div>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-purple-400">
                                   {integrationConfig.direction === 'import' && <ArrowRight size={20}/>}
                                   {integrationConfig.direction === 'export' && <ArrowLeft size={20}/>}
                                   {integrationConfig.direction === 'bidirectional' && <ArrowLeftRight size={20}/>}
                                   <span className="text-[10px] uppercase font-bold tracking-widest">{integrationConfig.direction}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <div className="px-3 py-2 bg-dark-950 rounded border border-brand-500/30 text-brand-400 font-mono border-dashed">{newField.key || 'internal_key'}</div>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {!integrationConfig.enabled && (
                       <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center bg-dark-900/30 rounded-2xl border border-dark-800 border-dashed">
                          <Box size={48} className="mb-4 opacity-20"/>
                          <p className="text-lg font-medium text-slate-400">Integration Disabled</p>
                          <p className="text-sm mt-1">Toggle the switch above to configure external data sources.</p>
                       </div>
                    )}
                 </div>
              )}
            </div>
            
            <div className="p-6 border-t border-dark-700 bg-dark-900/80 backdrop-blur flex justify-between items-center">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                 {modalTab === 'general' && 'Configuring field type & basic validation'}
                 {modalTab === 'visibility' && 'Setting up document context rules'}
                 {modalTab === 'integration' && 'Mapping external API endpoints'}
              </div>
              <div className="flex gap-4">
                 <Button variant="ghost" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</Button>
                 <Button variant="primary" onClick={handleSaveField} className="shadow-lg shadow-brand-500/20 px-8">{editingId ? 'Update Schema' : 'Save Field'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldDatabase;
