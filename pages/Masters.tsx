
import React, { useState } from 'react';
import { Card, Button, Input, Badge, Switch, Select } from '../components/UIComponents';
import { 
  Database, Edit3, Plus, Search, Trash2, MoreVertical, 
  FileText, Globe, DollarSign, Building, Briefcase, FileCode, 
  Layers, CheckCircle2, X, Shield, Users, Archive, History,
  Activity, AlertTriangle, GitBranch, Clock, MapPin, Tag,
  Scale, Mail, Bell, Lock, Share2, UploadCloud, Check,
  ArrowRight, LayoutGrid, FileJson, Workflow, Link as LinkIcon
} from 'lucide-react';

// --- Extended Types for MDM ---

type MasterStatus = 'Active' | 'Draft' | 'Deprecated' | 'Pending Approval';

interface MasterItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: MasterStatus;
  version: string;
  lastUpdated: string;
  updatedBy: string;
  impactCount: number; // Mock: number of linked contracts/templates
  config?: Record<string, any>; // Flexible schema for different domains
}

interface MasterCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  items: MasterItem[];
}

interface DomainGroup {
  title: string;
  categories: MasterCategory[];
}

// --- Mock Data Generator ---

const generateHistory = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    version: `v1.${count - i}`,
    date: new Date(Date.now() - i * 86400000 * 7).toLocaleDateString(),
    user: i === 0 ? 'Harvey Specter' : 'System Admin',
    action: i === 0 ? 'Updated configuration' : 'Initial release',
    diff: i === 0 ? 'Changed SLA threshold from 24h to 48h' : 'Created entity'
  }));
};

// --- Mock Master Data ---

const MASTER_DATA_GROUPS: DomainGroup[] = [
  {
    title: 'Business Entities',
    categories: [
      {
        id: 'contract_types',
        label: 'Contract Types',
        icon: FileText,
        description: 'Canonical classifications driving workflow and template selection.',
        items: [
          { id: 'ct_1', name: 'Non-Disclosure Agreement', code: 'NDA', description: 'Standard mutual confidentiality.', status: 'Active', version: '2.1', lastUpdated: '2 days ago', updatedBy: 'Legal Ops', impactCount: 1240, config: { retention_years: 5, requires_approval: false } },
          { id: 'ct_2', name: 'Master Services Agreement', code: 'MSA', description: 'Framework for ongoing services.', status: 'Active', version: '3.0', lastUpdated: '1 week ago', updatedBy: 'General Counsel', impactCount: 85, config: { retention_years: 7, requires_approval: true } },
          { id: 'ct_3', name: 'Statement of Work', code: 'SOW', description: 'Specific project scope.', status: 'Active', version: '1.5', lastUpdated: '3 weeks ago', updatedBy: 'Sales Ops', impactCount: 420, config: { parent_type: 'MSA' } },
        ]
      },
      {
        id: 'legal_entities',
        label: 'Legal Entities',
        icon: Building,
        description: 'Internal corporate entities acting as signatories.',
        items: [
          { id: 'le_1', name: 'Agreemetrix Inc.', code: 'US-HQ', description: 'Delaware Corp (Headquarters)', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Admin', impactCount: 2100 },
          { id: 'le_2', name: 'Agreemetrix Ltd.', code: 'UK-LTD', description: 'UK Subsidiary', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Admin', impactCount: 340 },
        ]
      },
      {
        id: 'counterparty_types',
        label: 'Party Types',
        icon: Users,
        description: 'Segmentation for external relationships.',
        items: [
          { id: 'pt_1', name: 'Customer', code: 'CUST', status: 'Active', version: '1.0', lastUpdated: '6 months ago', updatedBy: 'Sales', impactCount: 1500 },
          { id: 'pt_2', name: 'Vendor', code: 'VEND', status: 'Active', version: '1.1', lastUpdated: '4 months ago', updatedBy: 'Procurement', impactCount: 400 },
        ]
      }
    ]
  },
  {
    title: 'Legal & Compliance',
    categories: [
      {
        id: 'jurisdictions',
        label: 'Jurisdictions',
        icon: Scale,
        description: 'Governing laws and regional compliance requirements.',
        items: [
          { id: 'jur_1', name: 'New York', code: 'US-NY', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Legal', impactCount: 800, config: { governing_law: 'State of New York', venue: 'New York City' } },
          { id: 'jur_2', name: 'California', code: 'US-CA', status: 'Active', version: '1.2', lastUpdated: '2 months ago', updatedBy: 'Legal', impactCount: 450, config: { governing_law: 'State of California', ccpa_compliant: true } },
          { id: 'jur_3', name: 'England & Wales', code: 'GB-EW', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Legal', impactCount: 300 },
        ]
      },
      {
        id: 'obligation_types',
        label: 'Obligation Types',
        icon: CheckCircle2,
        description: 'Categories for tracking contractual commitments.',
        items: [
          { id: 'obl_1', name: 'Payment Milestone', code: 'PAY', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Finance', impactCount: 5000 },
          { id: 'obl_2', name: 'Renewal Notice', code: 'RNW', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Ops', impactCount: 1200 },
          { id: 'obl_3', name: 'Insurance Certificate', code: 'INS', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Risk', impactCount: 800 },
        ]
      },
      {
        id: 'industries',
        label: 'Industries',
        icon: Layers,
        description: 'Business sectors for risk profiling.',
        items: [
          { id: 'ind_1', name: 'SaaS / Technology', code: 'TECH', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Admin', impactCount: 600 },
          { id: 'ind_2', name: 'Financial Services', code: 'FIN', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Admin', impactCount: 300 },
        ]
      }
    ]
  },
  {
    title: 'Finance & Operations',
    categories: [
      {
        id: 'currencies',
        label: 'Currencies',
        icon: DollarSign,
        description: 'Supported transaction currencies.',
        items: [
          { id: 'cur_1', name: 'US Dollar', code: 'USD', status: 'Active', version: '1.0', lastUpdated: 'N/A', updatedBy: 'System', impactCount: 9000 },
          { id: 'cur_2', name: 'Euro', code: 'EUR', status: 'Active', version: '1.0', lastUpdated: 'N/A', updatedBy: 'System', impactCount: 2000 },
        ]
      },
      {
        id: 'payment_terms',
        label: 'Payment Terms',
        icon: Clock,
        description: 'Standard billing profiles and due dates.',
        items: [
          { id: 'pay_1', name: 'Net 30', code: 'N30', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Finance', impactCount: 4500, config: { days: 30 } },
          { id: 'pay_2', name: 'Net 45', code: 'N45', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Finance', impactCount: 1200, config: { days: 45 } },
          { id: 'pay_3', name: 'Net 60', code: 'N60', status: 'Deprecated', version: '1.0', lastUpdated: '1 month ago', updatedBy: 'CFO', impactCount: 150, config: { days: 60, warning: 'Requires Approval' } },
        ]
      }
    ]
  },
  {
    title: 'System & Config',
    categories: [
      {
        id: 'notifications',
        label: 'Notification Templates',
        icon: Bell,
        description: 'Email and Slack message patterns.',
        items: [
          { id: 'not_1', name: 'Approval Request', code: 'APR_REQ', status: 'Active', version: '2.0', lastUpdated: '1 week ago', updatedBy: 'IT', impactCount: 0 },
          { id: 'not_2', name: 'Contract Signed', code: 'CTR_SGN', status: 'Active', version: '1.2', lastUpdated: '2 weeks ago', updatedBy: 'IT', impactCount: 0 },
        ]
      },
      {
        id: 'tags',
        label: 'Taxonomy Tags',
        icon: Tag,
        description: 'Global tags for organizing repository items.',
        items: [
          { id: 'tag_1', name: 'GDPR', code: 'GDPR', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Legal', impactCount: 250 },
          { id: 'tag_2', name: 'High Value', code: 'HIGH_VAL', status: 'Active', version: '1.0', lastUpdated: '1 year ago', updatedBy: 'Sales', impactCount: 120 },
        ]
      }
    ]
  }
];

// --- Master Item Drawer (The "Inspector") ---

const MasterItemDrawer: React.FC<{
  item: MasterItem | null;
  category: MasterCategory;
  onClose: () => void;
  onSave: (item: MasterItem) => void;
}> = ({ item, category, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'config' | 'history' | 'impact'>('general');
  const [formData, setFormData] = useState<Partial<MasterItem>>(item || {
    name: '',
    code: '',
    description: '',
    status: 'Draft',
    config: {}
  });
  
  const isNew = !item;
  const history = React.useMemo(() => generateHistory(3), []);

  const handleSave = () => {
    // Simulate version bump if editing
    const newItem = {
      ...formData,
      id: formData.id || `new_${Date.now()}`,
      version: isNew ? '1.0' : ((parseFloat(formData.version || '1.0') + 0.1).toFixed(1)),
      lastUpdated: 'Just now',
      updatedBy: 'You',
      impactCount: formData.impactCount || 0
    } as MasterItem;
    
    onSave(newItem);
  };

  const renderStatusBadge = (status: MasterStatus) => {
    switch(status) {
      case 'Active': return <Badge color="green">Active</Badge>;
      case 'Draft': return <Badge color="gray">Draft</Badge>;
      case 'Deprecated': return <Badge color="red">Deprecated</Badge>;
      case 'Pending Approval': return <Badge color="yellow">Pending Approval</Badge>;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-dark-950 border-l border-dark-700 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 border-b border-dark-700 bg-dark-900/50 backdrop-blur-md">
        <div className="flex justify-between items-start mb-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400 border border-brand-500/20">
                 <category.icon size={20} />
              </div>
              <div>
                 <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{isNew ? 'Create New Item' : formData.name}</h3>
                    {!isNew && <span className="text-xs font-mono text-slate-500 bg-dark-800 px-1.5 py-0.5 rounded">v{formData.version}</span>}
                 </div>
                 <p className="text-xs text-slate-400">{category.label} Master Record</p>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
        </div>
        
        {/* Drawer Tabs */}
        <div className="flex gap-6 -mb-6 overflow-x-auto">
           {['general', 'config', 'history', 'impact'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                 {tab === 'config' ? 'Configuration' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-dark-950">
         
         {/* General Tab */}
         {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
               <div className="grid grid-cols-2 gap-4">
                  <Input 
                     label="Display Name" 
                     value={formData.name} 
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     placeholder="e.g. Master Services Agreement"
                  />
                  <Input 
                     label="Unique Code" 
                     value={formData.code} 
                     onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                     placeholder="MSA"
                     className="font-mono"
                     disabled={!isNew}
                  />
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Description</label>
                  <textarea 
                     className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none resize-none h-24"
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     placeholder="Definition and usage guidelines..."
                  />
               </div>

               <div className="p-4 bg-dark-900 rounded-xl border border-dark-700">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Lifecycle Status</h4>
                  <div className="flex gap-2">
                     {(['Draft', 'Active', 'Deprecated'] as MasterStatus[]).map(s => (
                        <button
                           key={s}
                           onClick={() => setFormData({...formData, status: s})}
                           className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.status === s 
                              ? s === 'Active' ? 'bg-green-500/20 border-green-500 text-green-400' 
                              : s === 'Deprecated' ? 'bg-red-500/20 border-red-500 text-red-400'
                              : 'bg-slate-500/20 border-slate-500 text-slate-300'
                              : 'bg-dark-950 border-dark-800 text-slate-500 hover:border-slate-600'
                           }`}
                        >
                           {s}
                        </button>
                     ))}
                  </div>
                  {formData.status === 'Deprecated' && (
                     <div className="mt-3 flex items-start gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5"/>
                        <span>Warning: Deprecating this item will prevent it from being selected in new contracts. Existing records will be preserved.</span>
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* Config Tab */}
         {activeTab === 'config' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
               <div className="flex justify-between items-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                     <FileJson size={20} className="text-purple-400"/>
                     <div>
                        <h4 className="text-sm font-bold text-purple-100">Extended Attributes</h4>
                        <p className="text-xs text-purple-300/70">Domain-specific properties for {category.label}.</p>
                     </div>
                  </div>
               </div>

               <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
                  <div className="p-2 bg-dark-950 border-b border-dark-700 flex justify-between items-center">
                     <span className="text-xs font-mono text-slate-500 ml-2">JSON Configuration</span>
                     <button className="text-xs text-brand-400 hover:text-white px-2">Format</button>
                  </div>
                  <textarea 
                     className="w-full h-64 bg-dark-900 p-4 font-mono text-xs text-blue-300 focus:outline-none"
                     value={JSON.stringify(formData.config || {}, null, 2)}
                     onChange={(e) => {
                        try {
                           const parsed = JSON.parse(e.target.value);
                           setFormData({...formData, config: parsed});
                        } catch(err) {
                           // Allow typing invalid json
                        }
                     }}
                  />
               </div>
               
               <div className="text-xs text-slate-500">
                  <p className="font-bold mb-1">Common Keys for {category.label}:</p>
                  <div className="flex flex-wrap gap-2">
                     {['retention_period', 'requires_approval', 'default_value', 'sort_order'].map(k => (
                        <span key={k} className="px-2 py-1 bg-dark-900 border border-dark-700 rounded font-mono text-slate-400">{k}</span>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* History Tab */}
         {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
               <div className="relative border-l border-dark-700 ml-3 space-y-8">
                  {history.map((h, i) => (
                     <div key={i} className="relative pl-6">
                        <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-dark-950 ${i === 0 ? 'bg-brand-500' : 'bg-dark-600'}`}></div>
                        <div className="flex justify-between items-start mb-1">
                           <span className={`text-sm font-bold ${i === 0 ? 'text-white' : 'text-slate-400'}`}>{h.version}</span>
                           <span className="text-xs text-slate-500">{h.date}</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-1">{h.action} by <span className="text-slate-400">{h.user}</span></p>
                        <div className="p-2 bg-dark-900 rounded border border-dark-700 text-xs font-mono text-slate-400">
                           {h.diff}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Impact Tab */}
         {activeTab === 'impact' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl">
                     <p className="text-xs text-slate-500 font-bold uppercase">Active Contracts</p>
                     <p className="text-2xl font-bold text-white mt-1">{(formData.impactCount || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl">
                     <p className="text-xs text-slate-500 font-bold uppercase">Templates Used</p>
                     <p className="text-2xl font-bold text-white mt-1">3</p>
                  </div>
               </div>

               <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
                  <GitBranch size={20} className="text-blue-400 shrink-0"/>
                  <div>
                     <h4 className="text-sm font-bold text-blue-100">Referential Integrity Check</h4>
                     <p className="text-xs text-blue-200/70 mt-1">
                        This entity is referenced by {formData.impactCount} downstream records. 
                        Modifying the <strong>Code</strong> or <strong>Status</strong> may trigger a re-validation workflow for linked contracts.
                     </p>
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Linked Workflows</h4>
                  <div className="space-y-2">
                     {['Standard Approval Flow', 'High Risk Review'].map((wf, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-dark-900 border border-dark-700 rounded-lg">
                           <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Workflow size={14} className="text-slate-500"/> {wf}
                           </div>
                           <Badge color="green">Active</Badge>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

      </div>

      {/* Footer */}
      <div className="p-6 border-t border-dark-700 bg-dark-900/50 flex justify-between items-center">
         <div className="text-xs text-slate-500 flex flex-col">
            <span>Last edited {formData.lastUpdated}</span>
            <span>by {formData.updatedBy}</span>
         </div>
         <div className="flex gap-3">
            {!isNew && <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 size={16}/></Button>}
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} className="shadow-lg shadow-brand-500/20">
               {isNew ? 'Create Entity' : 'Save New Version'}
            </Button>
         </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

const Masters: React.FC = () => {
  const [activeGroupId, setActiveGroupId] = useState<string>('Business Entities');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('contract_types');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterItem | null>(null);
  
  // Initialize data
  const [dataGroups, setDataGroups] = useState<DomainGroup[]>(MASTER_DATA_GROUPS);

  const activeGroup = dataGroups.find(g => g.title === activeGroupId) || dataGroups[0];
  const activeCategory = activeGroup.categories.find(c => c.id === activeCategoryId) || activeGroup.categories[0];
  
  const filteredItems = activeCategory.items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalActive = filteredItems.filter(i => i.status === 'Active').length;
  const totalPending = filteredItems.filter(i => i.status === 'Pending Approval').length;

  // Handlers
  const handleSaveItem = (newItem: MasterItem) => {
    const newGroups = [...dataGroups];
    const groupIdx = newGroups.findIndex(g => g.title === activeGroupId);
    const catIdx = newGroups[groupIdx].categories.findIndex(c => c.id === activeCategoryId);
    
    const existingItemIdx = newGroups[groupIdx].categories[catIdx].items.findIndex(i => i.id === newItem.id);
    
    if (existingItemIdx >= 0) {
       newGroups[groupIdx].categories[catIdx].items[existingItemIdx] = newItem;
    } else {
       newGroups[groupIdx].categories[catIdx].items.push(newItem);
    }
    
    setDataGroups(newGroups);
    setShowDrawer(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-dark-950">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
             <Database className="text-brand-400" /> Master Data Management
          </h2>
          <p className="text-slate-400 text-sm mt-1">Single source of truth for business entities, rules, and reference data.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" className="text-xs"><UploadCloud size={14} className="mr-2"/> Import CSV</Button>
           <Button variant="secondary" className="text-xs"><History size={14} className="mr-2"/> Audit Logs</Button>
        </div>
      </div>

      <div className="flex gap-6 h-full overflow-hidden">
         
         {/* Sidebar: Domain Groups */}
         <Card className="w-72 flex flex-col p-0 overflow-hidden shrink-0 border-r-0 rounded-r-none" noPadding>
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
               {dataGroups.map(group => (
                  <div key={group.title}>
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">{group.title}</h4>
                     <div className="space-y-1">
                        {group.categories.map(cat => (
                           <button
                              key={cat.id}
                              onClick={() => { setActiveGroupId(group.title); setActiveCategoryId(cat.id); setSearchQuery(''); }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left group ${
                                 activeCategoryId === cat.id
                                    ? 'bg-brand-500/10 text-white border border-brand-500/20 shadow-sm'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                              }`}
                           >
                              <div className={`p-1.5 rounded-md transition-colors ${activeCategoryId === cat.id ? 'bg-brand-500 text-white' : 'bg-dark-800 text-slate-500 group-hover:text-slate-300'}`}>
                                 <cat.icon size={14} />
                              </div>
                              <span className="flex-1">{cat.label}</span>
                              {cat.items.length > 0 && <span className="text-[9px] bg-dark-950 px-1.5 py-0.5 rounded text-slate-500 border border-dark-800">{cat.items.length}</span>}
                           </button>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
            <div className="p-4 border-t border-white/5 bg-dark-900/30">
               <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                  <Shield size={12}/>
                  <span>Admin Console v2.4</span>
               </div>
            </div>
         </Card>

         {/* Main Content */}
         <div className="flex-1 flex flex-col overflow-hidden bg-dark-950 border-l border-dark-700 rounded-l-2xl shadow-2xl relative">
            
            {/* Context Header */}
            <div className="bg-dark-900 border-b border-dark-700 p-6 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-dark-800 rounded-xl border border-dark-700 text-slate-300 shadow-inner">
                     <activeCategory.icon size={24} />
                  </div>
                  <div>
                     <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white">{activeCategory.label}</h3>
                        <Badge color="blue" className="text-[10px]">MDM Domain</Badge>
                     </div>
                     <p className="text-sm text-slate-400 mt-1">{activeCategory.description}</p>
                  </div>
               </div>
               <div className="flex gap-6 text-sm">
                  <div className="text-center">
                     <p className="text-slate-500 text-xs uppercase font-bold">Active Records</p>
                     <p className="text-white font-mono font-bold">{totalActive}</p>
                  </div>
                  <div className="text-center">
                     <p className="text-slate-500 text-xs uppercase font-bold">Pending</p>
                     <p className="text-yellow-400 font-mono font-bold">{totalPending}</p>
                  </div>
                  <Button variant="primary" className="shadow-lg shadow-brand-500/20 h-10 px-6" onClick={() => { setSelectedItem(null); setShowDrawer(true); }}>
                     <Plus size={18} className="mr-2" /> Create New
                  </Button>
               </div>
            </div>

            {/* Filter Toolbar */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-dark-900/30">
               <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                     type="text" 
                     placeholder={`Search ${activeCategory.label} by name or code...`}
                     className="w-full bg-dark-950 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-brand-500 outline-none transition-all shadow-inner"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <div className="flex gap-3">
                  <Select 
                     options={[{label: 'All Statuses', value: 'All'}, {label: 'Active Only', value: 'Active'}, {label: 'Drafts', value: 'Draft'}]}
                     className="w-40 h-9 text-xs bg-dark-950"
                  />
                  <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white border border-transparent hover:border-dark-700">
                     <LayoutGrid size={18} />
                  </button>
               </div>
            </div>

            {/* Data Grid */}
            <div className="flex-1 overflow-y-auto bg-dark-950/50 relative">
               <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-dark-900 text-slate-500 text-xs uppercase font-bold tracking-wider sticky top-0 z-10 shadow-sm">
                     <tr>
                        <th className="px-6 py-3 w-1/4">Entity Name</th>
                        <th className="px-6 py-3">Code</th>
                        <th className="px-6 py-3">Version</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Impact</th>
                        <th className="px-6 py-3">Last Updated</th>
                        <th className="px-6 py-3 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800">
                     {filteredItems.map(item => (
                        <tr 
                           key={item.id} 
                           onClick={() => { setSelectedItem(item); setShowDrawer(true); }}
                           className="hover:bg-white/5 transition-colors group cursor-pointer border-l-2 border-l-transparent hover:border-l-brand-500"
                        >
                           <td className="px-6 py-4">
                              <span className="font-bold text-white block">{item.name}</span>
                              <span className="text-xs text-slate-500 truncate block w-48">{item.description}</span>
                           </td>
                           <td className="px-6 py-4 font-mono text-xs text-brand-400 bg-brand-500/5 px-2 py-1 rounded w-fit border border-brand-500/10">
                              {item.code}
                           </td>
                           <td className="px-6 py-4 text-slate-300">
                              v{item.version}
                           </td>
                           <td className="px-6 py-4">
                              {item.status === 'Active' && <Badge color="green">Active</Badge>}
                              {item.status === 'Draft' && <Badge color="gray">Draft</Badge>}
                              {item.status === 'Deprecated' && <Badge color="red">Deprecated</Badge>}
                              {item.status === 'Pending Approval' && <Badge color="yellow">Pending</Badge>}
                           </td>
                           <td className="px-6 py-4">
                              {item.impactCount > 0 ? (
                                 <div className="flex items-center gap-1 text-slate-300" title={`${item.impactCount} dependent records`}>
                                    <LinkIcon size={12} className="text-slate-500"/> {item.impactCount}
                                 </div>
                              ) : (
                                 <span className="text-slate-600 text-xs">-</span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-xs">
                              <div className="text-slate-300">{item.lastUpdated}</div>
                              <div className="text-slate-600">by {item.updatedBy}</div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                 <Edit3 size={16}/>
                              </button>
                           </td>
                        </tr>
                     ))}
                     {filteredItems.length === 0 && (
                        <tr>
                           <td colSpan={7} className="py-16 text-center text-slate-500">
                              <Database size={48} className="mx-auto mb-4 opacity-20" />
                              <p>No records found matching "{searchQuery}"</p>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* Edit Drawer */}
      {showDrawer && (
         <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" onClick={() => setShowDrawer(false)}></div>
            <MasterItemDrawer 
               item={selectedItem} 
               category={activeCategory}
               onClose={() => setShowDrawer(false)} 
               onSave={handleSaveItem} 
            />
         </>
      )}
    </div>
  );
};

export default Masters;
