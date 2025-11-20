
import React, { useState } from 'react';
import { Card, Button, Input, Badge, Avatar, Select } from '../components/UIComponents';
import { MOCK_PARTIES, MOCK_CONTRACTS } from '../mock/data';
import { Counterparty } from '../types';
import { 
  Search, Download, Plus, MapPin, FileText, TrendingUp, AlertCircle, 
  LayoutGrid, List as ListIcon, ExternalLink, Mail, Phone, 
  Shield, CheckCircle2, Globe, Building, X, MoreHorizontal, DollarSign, 
  CreditCard, Users, FileCheck, Copy, Briefcase, Save
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

const SPEND_DATA = [
  { month: 'Jan', amount: 12000 },
  { month: 'Feb', amount: 19000 },
  { month: 'Mar', amount: 15000 },
  { month: 'Apr', amount: 22000 },
  { month: 'May', amount: 28000 },
  { month: 'Jun', amount: 25000 },
];

// --- Components ---

const AddPartyModal: React.FC<{ onClose: () => void; onSave: (party: Counterparty) => void }> = ({ onClose, onSave }) => {
    // Simplified for MVP: just collects basic info to create structure
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Counterparty>>({
        name: '', type: 'Vendor', industry: '', region: '', website: '',
        addressStreet: '', addressCity: '', addressCountry: '',
        primaryContactName: '', primaryContactEmail: '',
        riskScore: 0, activeContracts: 0, totalValue: 0, status: 'Onboarding'
    });

    const handleSave = () => {
        const newParty = {
            id: `p_${Date.now()}`,
            ...formData,
            riskScore: 0,
            activeContracts: 0,
            totalValue: 0,
            status: 'Onboarding'
        } as Counterparty;
        onSave(newParty);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-dark-900 w-full max-w-2xl rounded-2xl border border-dark-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
                    <h3 className="text-lg font-bold text-white">Add New Counterparty</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">General Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Company Name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="Official Legal Name" />
                            <Select label="Relationship Type" options={[{label:'Vendor', value:'Vendor'}, {label:'Customer', value:'Customer'}, {label:'Partner', value:'Partner'}]} value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} />
                            <Input label="Industry" value={formData.industry} onChange={e=>setFormData({...formData, industry: e.target.value})} placeholder="e.g. Technology" />
                            <Input label="Website" value={formData.website} onChange={e=>setFormData({...formData, website: e.target.value})} placeholder="www.example.com" />
                        </div>

                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 mt-6">Primary Contact</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Full Name" value={formData.primaryContactName} onChange={e=>setFormData({...formData, primaryContactName: e.target.value})} />
                            <Input label="Email Address" value={formData.primaryContactEmail} onChange={e=>setFormData({...formData, primaryContactEmail: e.target.value})} />
                        </div>

                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 mt-6">Address</h4>
                        <Input label="Street Address" value={formData.addressStreet} onChange={e=>setFormData({...formData, addressStreet: e.target.value})} />
                        <div className="grid grid-cols-3 gap-4">
                            <Input label="City" value={formData.addressCity} onChange={e=>setFormData({...formData, addressCity: e.target.value})} />
                            <Input label="State/Province" value={formData.addressState} onChange={e=>setFormData({...formData, addressState: e.target.value})} />
                            <Input label="Country" value={formData.addressCountry} onChange={e=>setFormData({...formData, addressCountry: e.target.value})} />
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-dark-700 bg-dark-950/30 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} disabled={!formData.name}>Create Party</Button>
                </div>
            </div>
        </div>
    );
};

const PartyDetailDrawer: React.FC<{ party: Counterparty; onClose: () => void }> = ({ party, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'finance' | 'contacts'>('overview');
  const activeContracts = MOCK_CONTRACTS.filter(c => c.counterparty === party.name);
  
  const CopyButton = ({ text }: { text?: string }) => (
      <button 
        onClick={(e) => { e.stopPropagation(); /* Copy logic */ }}
        className="ml-2 text-slate-500 hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy"
      >
          <Copy size={12} />
      </button>
  );

  const FieldRow = ({ label, value, copy }: { label: string, value?: string, copy?: boolean }) => (
      <div className="flex justify-between items-center py-3 border-b border-dark-800 group">
          <span className="text-xs text-slate-500 font-medium">{label}</span>
          <div className="flex items-center">
              <span className="text-sm text-slate-200 font-medium text-right">{value || '-'}</span>
              {copy && value && <CopyButton text={value} />}
          </div>
      </div>
  );

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-dark-900 border-l border-dark-700 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
       {/* Header */}
       <div className="relative h-40 bg-gradient-to-br from-dark-800 to-dark-950 border-b border-dark-700 shrink-0">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
             <Button variant="secondary" className="h-8 w-8 p-0 rounded-full bg-black/20 border-none backdrop-blur-sm"><MoreHorizontal size={16}/></Button>
             <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-sm">
                <X size={18}/>
             </button>
          </div>
          <div className="absolute -bottom-12 left-8 flex items-end gap-5">
             <div className="w-24 h-24 rounded-2xl bg-dark-800 border-4 border-dark-900 shadow-2xl flex items-center justify-center text-3xl font-bold text-slate-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-500/10 group-hover:bg-brand-500/20 transition-colors"></div>
                {party.name.substring(0, 2).toUpperCase()}
             </div>
             <div className="mb-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                   {party.name} 
                   {party.status === 'Active' && <CheckCircle2 size={18} className="text-green-400" title="Verified Active"/>}
                </h2>
                <div className="flex gap-2 mt-1">
                   <Badge color={party.type === 'Customer' ? 'green' : 'blue'}>{party.type}</Badge>
                   <Badge color="gray">{party.industry}</Badge>
                   <div className="flex items-center text-xs text-slate-400 ml-2 gap-1">
                      <MapPin size={12}/> {party.addressCity || party.region}
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Tabs */}
       <div className="mt-14 px-8 border-b border-white/5 flex gap-6 overflow-x-auto">
          {['overview', 'profile', 'finance', 'contacts'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`pb-3 text-sm font-bold uppercase tracking-wide transition-all border-b-2 ${activeTab === tab ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white'}`}
             >
               {tab}
             </button>
          ))}
       </div>

       {/* Body */}
       <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar space-y-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-dark-950/50 rounded-xl border border-dark-700">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Risk Profile</p>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${party.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${party.riskScore}%`}}></div>
                           </div>
                           <span className={`text-xl font-bold ${party.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{party.riskScore}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-dark-950/50 rounded-xl border border-dark-700">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Spend (YTD)</p>
                        <p className="text-xl font-bold text-white font-mono">${party.totalValue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Contracts List */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><FileText size={14}/> Active Agreements</h4>
                       <button className="text-xs text-brand-400 font-bold hover:underline">+ New Contract</button>
                    </div>
                    <div className="space-y-2">
                        {activeContracts.length > 0 ? activeContracts.map(c => (
                           <div key={c.id} className="p-3 bg-dark-950 border border-dark-800 rounded-lg hover:border-brand-500/30 transition-colors cursor-pointer group flex justify-between items-center">
                              <div>
                                 <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{c.title}</p>
                                 <p className="text-xs text-slate-500">{c.type} • Exp: {c.renewalDate}</p>
                              </div>
                              <Badge color={c.status === 'Signed' ? 'green' : 'yellow'} className="text-[9px]">{c.status}</Badge>
                           </div>
                        )) : (
                           <div className="text-center p-6 border border-dashed border-dark-700 rounded-lg text-slate-500 text-xs">
                              No active contracts found.
                           </div>
                        )}
                    </div>
                </div>

                {/* Spend Chart */}
                <div>
                   <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><TrendingUp size={14}/> Spending Trends</h4>
                   <div className="h-40 w-full bg-dark-950 border border-dark-700 rounded-xl p-2">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={SPEND_DATA}>
                            <defs>
                               <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px'}} itemStyle={{color: '#fff'}}/>
                            <Area type="monotone" dataKey="amount" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                 <div>
                    <h4 className="text-xs font-bold text-brand-400 uppercase mb-3 flex items-center gap-2"><Building size={14}/> Entity Details</h4>
                    <div className="bg-dark-950/50 rounded-xl border border-dark-700 px-4 py-2">
                        <FieldRow label="Legal Name" value={party.legalName} copy />
                        <FieldRow label="DBA" value={party.dbaName} />
                        <FieldRow label="Tax ID / EIN" value={party.taxId} copy />
                        <FieldRow label="VAT Number" value={party.vatNumber} copy />
                        <FieldRow label="DUNS Number" value={party.dunsNumber} copy />
                        <FieldRow label="Website" value={party.website} />
                    </div>
                 </div>
                 
                 <div>
                    <h4 className="text-xs font-bold text-brand-400 uppercase mb-3 flex items-center gap-2"><MapPin size={14}/> Corporate Address</h4>
                    <div className="bg-dark-950/50 rounded-xl border border-dark-700 px-4 py-2">
                        <FieldRow label="Street" value={party.addressStreet} />
                        <FieldRow label="City" value={party.addressCity} />
                        <FieldRow label="State / Province" value={party.addressState} />
                        <FieldRow label="Postal Code" value={party.addressZip} />
                        <FieldRow label="Country" value={party.addressCountry} />
                    </div>
                 </div>

                 <div>
                    <h4 className="text-xs font-bold text-brand-400 uppercase mb-3 flex items-center gap-2"><FileCheck size={14}/> Compliance & Tags</h4>
                    <div className="bg-dark-950/50 rounded-xl border border-dark-700 p-4">
                        <div className="flex flex-wrap gap-2">
                           {party.tags?.map(t => (
                               <span key={t} className="px-2 py-1 bg-dark-800 border border-dark-600 rounded text-xs text-slate-300">{t}</span>
                           ))}
                           {(!party.tags || party.tags.length === 0) && <span className="text-xs text-slate-500 italic">No tags assigned.</span>}
                        </div>
                    </div>
                 </div>
             </div>
          )}

          {/* FINANCIALS TAB */}
          {activeTab === 'finance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                 <div className="bg-gradient-to-br from-emerald-900/20 to-dark-950 border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 bg-emerald-500/10 rounded-full blur-2xl -mr-5 -mt-5"></div>
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                       <CreditCard size={20} className="text-emerald-400"/> Banking Details
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div>
                           <p className="text-xs text-emerald-200/60 font-bold uppercase mb-1">Bank Name</p>
                           <p className="text-white font-medium">{party.bankName || 'Not Configured'}</p>
                        </div>
                        <div>
                           <p className="text-xs text-emerald-200/60 font-bold uppercase mb-1">Account Number</p>
                           <p className="text-white font-mono tracking-widest">**** {party.bankAccountLast4 || '----'}</p>
                        </div>
                        <div>
                           <p className="text-xs text-emerald-200/60 font-bold uppercase mb-1">SWIFT / BIC</p>
                           <p className="text-white font-mono">{party.swiftCode || '---'}</p>
                        </div>
                        <div>
                           <p className="text-xs text-emerald-200/60 font-bold uppercase mb-1">Currency</p>
                           <p className="text-white font-bold">{party.currency || 'USD'}</p>
                        </div>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><Briefcase size={14}/> Commercial Terms</h4>
                    <div className="bg-dark-950/50 rounded-xl border border-dark-700 px-4 py-2">
                        <FieldRow label="Standard Payment Terms" value={party.paymentTerms} />
                        <FieldRow label="Credit Limit" value="$500,000" />
                        <FieldRow label="Payment Method" value="Wire Transfer" />
                    </div>
                 </div>
              </div>
          )}

          {/* CONTACTS TAB */}
          {activeTab === 'contacts' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                 {/* Primary Card */}
                 <div className="bg-dark-950 border border-brand-500/30 rounded-xl p-5 relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                    <div className="flex gap-4 items-start relative z-10">
                       <Avatar name={party.primaryContactName || 'Unknown'} size="lg" className="w-16 h-16 text-lg border-4 border-dark-900 shadow-xl" />
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <div>
                                 <h4 className="text-lg font-bold text-white">{party.primaryContactName || 'No Contact'}</h4>
                                 <p className="text-sm text-brand-400">{party.primaryContactRole || 'Primary Contact'}</p>
                             </div>
                             <Badge color="brand">Primary</Badge>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-4">
                             <a href={`mailto:${party.primaryContactEmail}`} className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors p-2 bg-dark-900 rounded border border-dark-800 hover:border-brand-500/30">
                                <Mail size={14} className="text-slate-500"/> {party.primaryContactEmail || '-'}
                             </a>
                             <a href={`tel:${party.primaryContactPhone}`} className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors p-2 bg-dark-900 rounded border border-dark-800 hover:border-brand-500/30">
                                <Phone size={14} className="text-slate-500"/> {party.primaryContactPhone || '-'}
                             </a>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Secondary Contacts List (Mock) */}
                 <div>
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Users size={14}/> Other Contacts</h4>
                       <button className="text-xs text-brand-400 font-bold hover:underline">+ Add Contact</button>
                    </div>
                    <div className="space-y-3">
                       {[1, 2].map(i => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-dark-950 rounded-lg border border-dark-800">
                             <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-xs font-bold text-slate-500">JD</div>
                             <div className="flex-1">
                                <p className="text-sm font-medium text-slate-200">Jane Doe</p>
                                <p className="text-xs text-slate-500">Legal Counsel</p>
                             </div>
                             <div className="flex gap-2">
                                <button className="p-1.5 hover:bg-white/10 rounded text-slate-500 hover:text-white"><Mail size={14}/></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
          )}

       </div>
       
       {/* Footer Actions */}
       <div className="p-6 border-t border-dark-700 bg-dark-950 flex justify-between items-center">
          <p className="text-xs text-slate-500">Last synced: 2 hours ago</p>
          <div className="flex gap-3">
             <Button variant="ghost" onClick={onClose}>Close</Button>
             <Button variant="primary" className="px-6"><Save size={16} className="mr-2"/> Edit Party</Button>
          </div>
       </div>
    </div>
  );
};

const Parties: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedParty, setSelectedParty] = useState<Counterparty | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [parties, setParties] = useState<Counterparty[]>(MOCK_PARTIES);

  const filteredParties = parties.filter(p => {
     const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.industry || '').toLowerCase().includes(searchTerm.toLowerCase());
     const matchesType = filterType === 'All' || p.type === filterType;
     return matchesSearch && matchesType;
  });

  const totalSpend = filteredParties.reduce((acc, p) => acc + p.totalValue, 0);
  const highRiskCount = filteredParties.filter(p => p.riskScore > 50).length;

  const handleAddParty = (newParty: Counterparty) => {
      setParties([...parties, newParty]);
      setShowAddModal(false);
  };

  return (
    <div className="space-y-8 h-full flex flex-col relative">
       {/* Background Element */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

       {/* Dashboard Header */}
       <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-top-4">
          <div className="md:col-span-4">
             <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Counterparty 360°</h1>
             <p className="text-slate-400 text-sm">Manage relationships, monitor risk, and track obligations.</p>
             
             <div className="mt-6 flex gap-2">
                <Button variant="primary" className="shadow-lg shadow-brand-500/20" onClick={() => setShowAddModal(true)}><Plus size={16} className="mr-2"/> Add Party</Button>
                <Button variant="secondary"><Download size={16} className="mr-2"/> Export</Button>
             </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-3 gap-4">
             <Card noPadding className="bg-dark-900/80 border-dark-700 backdrop-blur relative overflow-hidden group">
                <div className="p-5 relative z-10">
                   <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Building size={20}/></div>
                      <Badge color="blue">Total</Badge>
                   </div>
                   <h3 className="text-2xl font-bold text-white">{filteredParties.length}</h3>
                   <p className="text-xs text-slate-500 mt-1">Active Entities</p>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mb-10 -mr-10 group-hover:scale-110 transition-transform"></div>
             </Card>

             <Card noPadding className="bg-dark-900/80 border-dark-700 backdrop-blur relative overflow-hidden group">
                <div className="p-5 relative z-10">
                   <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><AlertCircle size={20}/></div>
                      <Badge color="red">Risk</Badge>
                   </div>
                   <h3 className="text-2xl font-bold text-white">{highRiskCount}</h3>
                   <p className="text-xs text-slate-500 mt-1">High Risk Entities</p>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mb-10 -mr-10 group-hover:scale-110 transition-transform"></div>
             </Card>

             <Card noPadding className="bg-dark-900/80 border-dark-700 backdrop-blur relative overflow-hidden group">
                <div className="p-5 relative z-10">
                   <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><DollarSign size={20}/></div>
                      <Badge color="green">YTD</Badge>
                   </div>
                   <h3 className="text-2xl font-bold text-white">${(totalSpend/1000).toFixed(0)}k</h3>
                   <p className="text-xs text-slate-500 mt-1">Total Contract Value</p>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mb-10 -mr-10 group-hover:scale-110 transition-transform"></div>
             </Card>
          </div>
       </div>

       {/* Toolbar & Filters */}
       <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-dark-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex bg-dark-950 rounded-xl p-1 border border-dark-800">
             {['All', 'Vendor', 'Customer', 'Partner'].map(type => (
                <button
                   key={type}
                   onClick={() => setFilterType(type)}
                   className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === type ? 'bg-dark-800 text-white shadow-sm border border-dark-700' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   {type}
                </button>
             ))}
          </div>

          <div className="flex-1 w-full md:w-auto px-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={16} />
                <Input 
                   placeholder="Search by name, industry, or ID..." 
                   className="pl-10 bg-dark-950/50 border-dark-700 focus:bg-dark-950 h-10 transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          <div className="flex gap-2 bg-dark-950 p-1 rounded-xl border border-dark-800">
             <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-dark-800 text-brand-400 shadow-sm' : 'text-slate-500 hover:text-white'}`}
             >
                <LayoutGrid size={18} />
             </button>
             <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-dark-800 text-brand-400 shadow-sm' : 'text-slate-500 hover:text-white'}`}
             >
                <ListIcon size={18} />
             </button>
          </div>
       </div>

       {/* Content Area */}
       <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
          {viewMode === 'grid' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredParties.map((party, index) => (
                   <div 
                      key={party.id}
                      onClick={() => setSelectedParty(party)}
                      className="group bg-dark-900 border border-dark-700 rounded-2xl p-6 cursor-pointer transition-all hover:border-brand-500/40 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 relative overflow-hidden animate-in slide-in-from-bottom-4 fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                   >
                      {/* Top Banner / Status */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dark-700 to-transparent group-hover:via-brand-500 transition-all duration-500"></div>
                      
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-xl font-bold text-slate-300 border border-dark-700 shadow-lg group-hover:border-brand-500/30 transition-colors">
                               {party.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                               <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors truncate w-40" title={party.name}>{party.name}</h3>
                               <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Badge color="gray" className="px-1.5 py-0 text-[10px]">{party.type}</Badge>
                                  <span className="flex items-center gap-1"><MapPin size={10}/> {party.addressCity || party.region}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            {party.riskScore > 50 && (
                               <div className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                                  <AlertCircle size={12}/> High Risk
                               </div>
                            )}
                            {party.status === 'Active' && (
                               <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                  <CheckCircle2 size={12}/> Active
                               </div>
                            )}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                         <div className="p-3 bg-dark-950 rounded-xl border border-dark-800">
                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Active Contracts</p>
                            <div className="flex items-center gap-2">
                               <FileText size={16} className="text-blue-400"/>
                               <span className="text-white font-bold">{party.activeContracts}</span>
                            </div>
                         </div>
                         <div className="p-3 bg-dark-950 rounded-xl border border-dark-800">
                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Risk Score</p>
                            <div className="flex items-center gap-2">
                               <div className="flex-1 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${party.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${party.riskScore}%`}}></div>
                               </div>
                               <span className={`text-xs font-bold ${party.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{party.riskScore}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-white/5">
                         <div className="flex -space-x-2">
                            <Avatar name={party.primaryContactName || 'U'} size="sm" className="border-2 border-dark-900 w-6 h-6 text-[10px]" />
                            <div className="w-6 h-6 rounded-full bg-dark-800 border-2 border-dark-900 flex items-center justify-center text-[10px] text-slate-500 font-bold">+2</div>
                         </div>
                         <button className="text-xs font-bold text-brand-400 hover:text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            View 360° Profile <ExternalLink size={12}/>
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          ) : (
             <Card noPadding className="overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-dark-900 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Company Name</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Region</th>
                      <th className="px-6 py-4">Active Contracts</th>
                      <th className="px-6 py-4">Total Value</th>
                      <th className="px-6 py-4">Risk</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800">
                    {filteredParties.map((party) => (
                      <tr key={party.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedParty(party)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-dark-800 flex items-center justify-center text-xs font-bold text-slate-300">
                                {party.name.substring(0, 2).toUpperCase()}
                             </div>
                             <div>
                                <div className="font-bold text-slate-200 group-hover:text-brand-400 transition-colors">{party.name}</div>
                                <div className="text-[10px] text-slate-500">{party.industry}</div>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge color={party.type === 'Customer' ? 'green' : 'blue'}>{party.type}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs">
                             <Globe size={12} /> {party.addressCity || party.region}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-white">{party.activeContracts}</td>
                        <td className="px-6 py-4 font-mono text-slate-300">${party.totalValue.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${party.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                             <span className={party.riskScore > 50 ? 'text-red-400 font-bold' : 'text-slate-400'}>{party.riskScore}/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" className="text-xs h-8 opacity-0 group-hover:opacity-100">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </Card>
          )}
       </div>

       {/* Slide-over Drawer */}
       {selectedParty && <PartyDetailDrawer party={selectedParty} onClose={() => setSelectedParty(null)} />}
       {selectedParty && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300" onClick={() => setSelectedParty(null)}></div>}

       {/* Add Modal */}
       {showAddModal && <AddPartyModal onClose={() => setShowAddModal(false)} onSave={handleAddParty} />}

    </div>
  );
};

export default Parties;
