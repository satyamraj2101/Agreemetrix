
import React, { useState } from 'react';
import { Card, Button, Input, Badge, Switch } from '../components/UIComponents';
import { 
  Database, Edit3, Plus, Search, Trash2, MoreVertical, 
  FileText, Globe, DollarSign, Building, Briefcase, FileCode, 
  Layers, CheckCircle2, X, Shield, Users
} from 'lucide-react';

// --- Types ---

interface MasterItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

interface MasterCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  items: MasterItem[];
}

// --- Mock Data ---

const INITIAL_DATA: MasterCategory[] = [
  {
    id: 'contract_types',
    label: 'Contract Types',
    icon: FileText,
    description: 'Define the various classifications of legal agreements used within the organization for categorization and workflow triggering.',
    items: [
      { id: '1', name: 'Non-Disclosure Agreement', code: 'NDA', description: 'Standard mutual confidentiality.', status: 'Active' },
      { id: '2', name: 'Master Services Agreement', code: 'MSA', description: 'Framework for ongoing services.', status: 'Active' },
      { id: '3', name: 'Statement of Work', code: 'SOW', description: 'Specific project scope and fees.', status: 'Active' },
      { id: '4', name: 'Licensing Agreement', code: 'LIC', description: 'Software or IP usage rights.', status: 'Active' },
      { id: '5', name: 'Vendor Agreement', code: 'VEND', description: 'Supplier terms and conditions.', status: 'Active' },
    ]
  },
  {
    id: 'legal_entities',
    label: 'Legal Entities',
    icon: Building,
    description: 'Manage internal corporate entities that act as signatories or contracting parties.',
    items: [
      { id: '1', name: 'Agreemetrix Inc.', code: 'US-HQ', description: 'Delaware Corporation (Headquarters)', status: 'Active' },
      { id: '2', name: 'Agreemetrix Ltd.', code: 'UK-LTD', description: 'United Kingdom Subsidiary', status: 'Active' },
      { id: '3', name: 'Agreemetrix Pte Ltd.', code: 'SG-APAC', description: 'Singapore Regional Office', status: 'Active' },
    ]
  },
  {
    id: 'currencies',
    label: 'Currencies',
    icon: DollarSign,
    description: 'Supported currencies for contract value tracking, reporting, and normalization.',
    items: [
      { id: '1', name: 'United States Dollar', code: 'USD', status: 'Active' },
      { id: '2', name: 'Euro', code: 'EUR', status: 'Active' },
      { id: '3', name: 'British Pound', code: 'GBP', status: 'Active' },
      { id: '4', name: 'Singapore Dollar', code: 'SGD', status: 'Active' },
      { id: '5', name: 'Japanese Yen', code: 'JPY', status: 'Inactive' },
    ]
  },
  {
    id: 'file_types',
    label: 'File Extensions',
    icon: FileCode,
    description: 'Allowed document formats for repository uploads and email attachments to ensure system compatibility.',
    items: [
      { id: '1', name: 'Adobe PDF', code: 'pdf', description: 'Portable Document Format', status: 'Active' },
      { id: '2', name: 'Microsoft Word', code: 'docx', description: 'Office Open XML Document', status: 'Active' },
      { id: '3', name: 'Legacy Word', code: 'doc', description: 'Legacy Microsoft Word', status: 'Inactive' },
      { id: '4', name: 'Excel Spreadsheet', code: 'xlsx', description: 'Pricing Tables & Schedules', status: 'Active' },
      { id: '5', name: 'Image File', code: 'png', description: 'Scanned Copies', status: 'Active' },
    ]
  },
  {
    id: 'counterparty_types',
    label: 'Counterparty Types',
    icon: Users,
    description: 'Classifications for external parties to segment relationships (Vendors, Customers, Partners).',
    items: [
      { id: '1', name: 'Customer', code: 'CUST', description: 'Revenue generating entity', status: 'Active' },
      { id: '2', name: 'Vendor', code: 'VEND', description: 'Supplier of goods/services', status: 'Active' },
      { id: '3', name: 'Partner', code: 'PART', description: 'Strategic alliance', status: 'Active' },
      { id: '4', name: 'Reseller', code: 'RSLR', description: 'Channel distributor', status: 'Active' },
    ]
  },
  { 
      id: 'jurisdictions',
      label: 'Jurisdictions', 
      icon: Globe,
      description: 'Governing laws and regions available for contract templates and clauses.',
      items: [
        { id: '1', name: 'State of New York', code: 'NY', status: 'Active' },
        { id: '2', name: 'State of California', code: 'CA', status: 'Active' },
        { id: '3', name: 'State of Delaware', code: 'DE', status: 'Active' },
        { id: '4', name: 'England & Wales', code: 'UK', status: 'Active' },
      ]
  },
  {
      id: 'industries',
      label: 'Industries',
      icon: Layers,
      description: 'Business sectors used for risk profiling and reporting categorization.',
      items: [
        { id: '1', name: 'Technology', code: 'TECH', status: 'Active' },
        { id: '2', name: 'Finance', code: 'FIN', status: 'Active' },
        { id: '3', name: 'Healthcare', code: 'HLTH', status: 'Active' },
        { id: '4', name: 'Retail', code: 'RET', status: 'Active' },
      ]
  }
];

// --- Components ---

const MasterItemModal: React.FC<{ 
  item: Partial<MasterItem> | null; 
  categoryLabel: string;
  onClose: () => void; 
  onSave: (item: MasterItem) => void 
}> = ({ item, categoryLabel, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<MasterItem>>(item || {
    name: '',
    code: '',
    description: '',
    status: 'Active'
  });

  const handleSubmit = () => {
      if (formData.name) {
          onSave({
              id: formData.id || `new_${Date.now()}`,
              name: formData.name,
              code: formData.code || '',
              description: formData.description || '',
              status: formData.status || 'Active'
          });
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-dark-900 w-full max-w-md rounded-2xl border border-dark-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
             <h3 className="text-lg font-bold text-white">{item?.id ? 'Edit Item' : 'Add New Item'}</h3>
             <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
          </div>
          <div className="p-6 space-y-5">
             <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-lg text-xs text-brand-300 flex items-center gap-2">
                <Database size={14}/>
                Adding to master list: <span className="font-bold text-white">{categoryLabel}</span>
             </div>
             <Input 
                label="Name / Label" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Non-Disclosure Agreement"
                autoFocus
             />
             <Input 
                label="Code / Abbreviation" 
                value={formData.code} 
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                placeholder="e.g. NDA"
                className="font-mono uppercase"
             />
             <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea 
                   className="w-full bg-dark-950 border border-dark-700 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none resize-none h-24 shadow-inner"
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   placeholder="Optional context..."
                />
             </div>
             <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-slate-300 font-medium">Status</span>
                <div className="flex items-center gap-3">
                   <span className={`text-xs font-bold ${formData.status === 'Active' ? 'text-green-400' : 'text-slate-500'}`}>{formData.status}</span>
                   <Switch checked={formData.status === 'Active'} onChange={(c) => setFormData({...formData, status: c ? 'Active' : 'Inactive'})} />
                </div>
             </div>
          </div>
          <div className="p-6 border-t border-dark-700 bg-dark-950/30 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose}>Cancel</Button>
             <Button variant="primary" onClick={handleSubmit} disabled={!formData.name}>Save Changes</Button>
          </div>
       </div>
    </div>
  );
};

const Masters: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(INITIAL_DATA[0].id);
  const [data, setData] = useState<MasterCategory[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MasterItem> | null>(null);

  const activeCategory = data.find(c => c.id === activeCategoryId) || data[0];
  
  const filteredItems = activeCategory.items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveItem = (newItem: MasterItem) => {
    setData(prev => prev.map(cat => {
      if (cat.id === activeCategoryId) {
        // Check if updating existing
        const exists = cat.items.find(i => i.id === newItem.id);
        if (exists) {
           return { ...cat, items: cat.items.map(i => i.id === newItem.id ? newItem : i) };
        }
        return { ...cat, items: [...cat.items, newItem] };
      }
      return cat;
    }));
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if(confirm('Are you sure you want to remove this item?')) {
        setData(prev => prev.map(cat => {
            if (cat.id === activeCategoryId) {
                return { ...cat, items: cat.items.filter(i => i.id !== itemId) };
            }
            return cat;
        }));
    }
  };

  const toggleStatus = (itemId: string) => {
    setData(prev => prev.map(cat => {
        if (cat.id === activeCategoryId) {
            return {
                ...cat, 
                items: cat.items.map(i => i.id === itemId ? { ...i, status: i.status === 'Active' ? 'Inactive' : 'Active' } : i)
            };
        }
        return cat;
    }));
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
             <Database className="text-brand-400" /> Master Data Control Room
          </h2>
          <p className="text-sm text-slate-400">Centralized management for all system reference data and configurations.</p>
        </div>
      </div>

      <div className="flex gap-6 h-full overflow-hidden">
         
         {/* Sidebar: Categories */}
         <Card className="w-72 flex flex-col p-0 overflow-hidden shrink-0" noPadding>
            <div className="p-4 border-b border-white/5 bg-dark-900/50">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Domains</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
               {data.map(category => (
                  <button
                     key={category.id}
                     onClick={() => { setActiveCategoryId(category.id); setSearchQuery(''); }}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left group ${
                        activeCategoryId === category.id
                           ? 'bg-brand-500/10 text-white border border-brand-500/20 shadow-[0_0_15px_rgba(var(--color-brand-500),0.1)]'
                           : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                     }`}
                  >
                     <div className={`p-1.5 rounded-md transition-colors ${activeCategoryId === category.id ? 'bg-brand-500 text-white' : 'bg-dark-800 text-slate-500 group-hover:text-slate-300'}`}>
                        <category.icon size={16} />
                     </div>
                     <span className="flex-1">{category.label}</span>
                     <span className="text-[10px] bg-dark-950 px-2 py-0.5 rounded text-slate-500 border border-dark-800">{category.items.length}</span>
                  </button>
               ))}
            </div>
            <div className="p-4 border-t border-white/5 bg-dark-900/30">
               <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield size={12}/>
                  <span>Admin Access Only</span>
               </div>
            </div>
         </Card>

         {/* Main Content: Active Category Manager */}
         <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            
            {/* Category Header Card */}
            <div className="bg-dark-900/50 border border-dark-700 rounded-2xl p-6 flex justify-between items-center shadow-lg">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-500/10 rounded-xl border border-brand-500/20 text-brand-400">
                     <activeCategory.icon size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-white">{activeCategory.label}</h3>
                     <p className="text-sm text-slate-400 mt-1 max-w-2xl">{activeCategory.description}</p>
                  </div>
               </div>
               <Button variant="primary" className="shadow-lg shadow-brand-500/20 px-6" onClick={() => { setEditingItem(null); setShowModal(true); }}>
                  <Plus size={18} className="mr-2" /> Add New
               </Button>
            </div>

            {/* Data Table Card */}
            <Card className="flex-1 flex flex-col overflow-hidden" noPadding>
               {/* Toolbar */}
               <div className="p-4 border-b border-white/5 flex justify-between items-center bg-dark-900/30">
                  <div className="relative w-80">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                     <input 
                        type="text" 
                        placeholder={`Search ${activeCategory.label}...`}
                        className="w-full bg-dark-950 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-brand-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
                  <div className="flex gap-2">
                     <span className="text-xs text-slate-500 self-center mr-2">{filteredItems.length} records found</span>
                  </div>
               </div>

               {/* Table */}
               <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                     <thead className="bg-dark-950 text-slate-500 text-xs uppercase font-semibold sticky top-0 z-10 shadow-sm">
                        <tr>
                           <th className="px-6 py-3 w-1/3">Name</th>
                           <th className="px-6 py-3">Code</th>
                           <th className="px-6 py-3 w-1/3">Description</th>
                           <th className="px-6 py-3">Status</th>
                           <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {filteredItems.map(item => (
                           <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                              <td className="px-6 py-4 font-bold text-white">
                                 {item.name}
                              </td>
                              <td className="px-6 py-4 font-mono text-xs text-brand-400">
                                 {item.code || '-'}
                              </td>
                              <td className="px-6 py-4 text-slate-500 truncate max-w-xs" title={item.description}>
                                 {item.description || '-'}
                              </td>
                              <td className="px-6 py-4">
                                 <Badge color={item.status === 'Active' ? 'green' : 'gray'}>{item.status}</Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                       onClick={() => toggleStatus(item.id)}
                                       className={`p-1.5 rounded transition-colors ${item.status === 'Active' ? 'text-slate-500 hover:text-yellow-400 hover:bg-yellow-500/10' : 'text-slate-500 hover:text-green-400 hover:bg-green-500/10'}`}
                                       title={item.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    >
                                       {item.status === 'Active' ? <X size={14}/> : <CheckCircle2 size={14}/>}
                                    </button>
                                    <button onClick={() => { setEditingItem(item); setShowModal(true); }} className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white" title="Edit">
                                       <Edit3 size={14}/>
                                    </button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-500" title="Delete">
                                       <Trash2 size={14}/>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                        {filteredItems.length === 0 && (
                           <tr>
                              <td colSpan={5} className="py-12 text-center text-slate-500">
                                 <Database size={48} className="mx-auto mb-3 opacity-20" />
                                 <p>No records found matching your search.</p>
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </Card>
         </div>
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
         <MasterItemModal 
            item={editingItem} 
            categoryLabel={activeCategory.label}
            onClose={() => setShowModal(false)} 
            onSave={handleSaveItem} 
         />
      )}
    </div>
  );
};

export default Masters;
