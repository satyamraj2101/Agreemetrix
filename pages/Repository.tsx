
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Badge, Input, Button, Select } from '../components/UIComponents';
import { MOCK_CONTRACTS, MOCK_OBLIGATIONS } from '../mock/data';
import { Contract, ContractStatus, Obligation } from '../types';
import { 
  Filter, Search, Download, FileText, MoreVertical, 
  Calendar, DollarSign, Shield, User, ArrowUpRight,
  CheckCircle, XCircle, Clock, Activity, Share2, Eye, 
  AlertTriangle, FileCheck, Zap, X, ChevronRight,
  LayoutGrid, List as ListIcon, Sliders, CheckSquare,
  Bell, Maximize2, Sparkles, Printer, ZoomIn, ZoomOut, ArrowRight, LayoutTemplate, ChevronLeft
} from 'lucide-react';

const getStatusColor = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.SIGNED: return 'green';
    case ContractStatus.ACTIVE: return 'green';
    case ContractStatus.REVIEW: return 'blue';
    case ContractStatus.NEGOTIATION: return 'purple';
    case ContractStatus.APPROVAL: return 'yellow';
    case ContractStatus.DRAFT: return 'gray';
    case ContractStatus.EXPIRED: return 'red';
    default: return 'gray';
  }
};

// --- SUB-COMPONENTS ---

const ContractQuickViewModal: React.FC<{ contract: Contract; onClose: () => void }> = ({ contract, onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-dark-950 w-full max-w-6xl h-[85vh] rounded-3xl border border-dark-700 shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="h-16 border-b border-dark-700 bg-dark-900/50 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">{contract.title}</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-mono">{contract.id}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><User size={10}/> {contract.counterparty}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge color={getStatusColor(contract.status)} className="mr-2">{contract.status}</Badge>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><Printer size={18}/></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><Share2 size={18}/></button>
                    <div className="h-6 w-px bg-dark-700 mx-2"></div>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"><X size={20}/></button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* Left Panel: Intelligence */}
                <div className="w-80 lg:w-96 border-r border-dark-700 bg-dark-900/30 flex flex-col overflow-y-auto custom-scrollbar p-6 gap-6">
                    
                    {/* AI Insight Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 to-dark-900 border border-purple-500/20 shadow-inner relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 bg-purple-500/10 blur-2xl rounded-full -mr-4 -mt-4"></div>
                        <div className="relative z-10">
                            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                                <Sparkles size={12}/> AI Insight
                            </h4>
                            <p className="text-sm text-slate-200 leading-relaxed">
                                This contract has a <strong className="text-white">high risk score ({contract.riskScore})</strong> due to non-standard liability terms. Auto-renewal is active.
                            </p>
                        </div>
                    </div>

                    {/* Scorecard */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-dark-900 rounded-xl border border-dark-700 flex flex-col items-center justify-center text-center">
                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Value</p>
                            <p className="text-lg font-bold text-white font-mono">${contract.value.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-dark-900 rounded-xl border border-dark-700 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className={`absolute bottom-0 left-0 h-1 w-full ${contract.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Risk Score</p>
                            <p className={`text-lg font-bold ${contract.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{contract.riskScore}/100</p>
                        </div>
                    </div>

                    {/* Key Dates Timeline */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Critical Dates</h4>
                        <div className="space-y-4 relative pl-2">
                            <div className="absolute left-[5px] top-1 bottom-1 w-px bg-dark-700"></div>
                            
                            <div className="flex gap-3 relative">
                                <div className="w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-dark-950 z-10 mt-1"></div>
                                <div>
                                    <p className="text-xs text-slate-400">Start Date</p>
                                    <p className="text-sm font-bold text-white">{contract.startDate}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 relative">
                                <div className="w-2.5 h-2.5 rounded-full bg-dark-700 border-2 border-dark-950 z-10 mt-1"></div>
                                <div>
                                    <p className="text-xs text-slate-400">Renewal Deadline</p>
                                    <p className="text-sm font-bold text-white">{contract.renewalDate}</p>
                                    <Badge color="yellow" className="mt-1 text-[9px] px-1.5 py-0">Auto-Renews</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Obligations Teaser */}
                    <div className="bg-dark-900 border border-dark-700 rounded-xl p-1">
                       <div className="px-4 py-3 border-b border-dark-800 flex justify-between items-center">
                          <span className="text-xs font-bold text-white">Obligations</span>
                          <span className="text-xs text-slate-500">{contract.obligations?.length || 0} Active</span>
                       </div>
                       <div className="p-2 space-y-1">
                          {(contract.obligations || []).slice(0, 2).map(ob => (
                             <div key={ob.id} className="flex items-center gap-2 p-2 rounded hover:bg-dark-800/50 transition-colors">
                                <div className={`w-1.5 h-1.5 rounded-full ${ob.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                <span className="text-xs text-slate-300 truncate flex-1">{ob.title}</span>
                                <span className="text-[10px] text-slate-500">{ob.dueDate}</span>
                             </div>
                          ))}
                          {(!contract.obligations || contract.obligations.length === 0) && <div className="p-2 text-xs text-slate-500 text-center">No obligations tracked.</div>}
                       </div>
                    </div>

                </div>

                {/* Right Panel: Document Preview */}
                <div className="flex-1 bg-dark-950 flex flex-col relative">
                    {/* Preview Toolbar */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-dark-900/90 backdrop-blur border border-dark-700 rounded-full py-1.5 px-4 flex items-center gap-4 z-20 shadow-xl">
                        <span className="text-xs text-slate-400 font-medium">Page 1 of 5</span>
                        <div className="h-3 w-px bg-dark-700"></div>
                        <button className="text-slate-400 hover:text-white transition-colors"><ZoomOut size={14}/></button>
                        <button className="text-slate-400 hover:text-white transition-colors"><ZoomIn size={14}/></button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-dark-950 relative flex justify-center">
                        {/* Paper Mockup */}
                        <div className="bg-white text-black w-[600px] min-h-[800px] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-12 relative origin-top transition-transform duration-300">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-slate-100 to-white shadow-sm transform rotate-0"></div>
                            
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-serif font-bold uppercase tracking-widest mb-2">{contract.type} AGREEMENT</h1>
                                <p className="text-[10px] font-serif text-slate-500">Reference No: {contract.id}</p>
                            </div>

                            {/* Body */}
                            <div className="space-y-4 text-[10px] font-serif leading-relaxed text-justify">
                                <p><strong>THIS AGREEMENT</strong> is made on <strong>{contract.startDate}</strong> between:</p>
                                <p>
                                    (1) <strong>Agreemetrix Inc.</strong>, a company incorporated in Delaware with registered number 123456 whose registered office is at 123 AI Blvd, San Francisco, CA ("Provider"); and<br/>
                                    (2) <strong>{contract.counterparty}</strong>, a company incorporated in [Region] whose registered office is at [Address] ("Client").
                                </p>
                                
                                <h2 className="text-sm font-bold mt-6 uppercase border-b border-black pb-1">1. Definitions</h2>
                                <p>1.1 "Confidential Information" means all information disclosed by one party to the other...</p>
                                <p>1.2 "Services" means the software services provided by the Provider as described in Schedule 1.</p>

                                <h2 className="text-sm font-bold mt-6 uppercase border-b border-black pb-1">2. Term and Termination</h2>
                                <p>2.1 This Agreement shall commence on the Effective Date and shall continue for an initial term of 12 months.</p>
                                <p>2.2 Either party may terminate this Agreement with 30 days written notice prior to the renewal date.</p>

                                <h2 className="text-sm font-bold mt-6 uppercase border-b border-black pb-1">3. Fees and Payment</h2>
                                <p>3.1 The Client shall pay the Provider the Fees set out in the Order Form. Total Value: <strong>${contract.value.toLocaleString()}</strong>.</p>
                                <p>3.2 All invoices are payable within 30 days of the invoice date.</p>
                            </div>

                            {/* Signatures */}
                            <div className="mt-12 pt-8 border-t border-black flex justify-between">
                                <div className="w-1/3">
                                    <p className="text-[9px] uppercase font-bold mb-4">Signed for and on behalf of<br/>Agreemetrix Inc.</p>
                                    <div className="h-8 border-b border-black mb-1"></div>
                                    <p className="text-[8px]">Authorised Signatory</p>
                                </div>
                                <div className="w-1/3">
                                    <p className="text-[9px] uppercase font-bold mb-4">Signed for and on behalf of<br/>{contract.counterparty}</p>
                                    {contract.status === 'Signed' ? (
                                        <div className="h-8 border-b border-black mb-1 font-script text-lg relative">
                                            <span className="absolute bottom-1 left-0 text-blue-800">John Doe</span>
                                        </div>
                                    ) : (
                                        <div className="h-8 border-b border-black mb-1"></div>
                                    )}
                                    <p className="text-[8px]">Authorised Signatory</p>
                                </div>
                            </div>

                            {/* Watermark */}
                            {(contract.status === 'Draft' || contract.status === 'Negotiation') && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                                    <div className="text-[120px] font-black text-red-500/10 -rotate-45 uppercase tracking-widest border-4 border-red-500/10 p-10 rounded-xl">
                                        {contract.status}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-dark-700 bg-dark-900/50 flex justify-between items-center shrink-0">
                <div className="text-xs text-slate-500">
                    Last synchronized with repository: <span className="text-slate-300">Just now</span>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={onClose} className="text-xs">Close Preview</Button>
                    <Link to={`/contract/${contract.id}`}>
                        <Button variant="secondary" className="text-xs">
                            <LayoutTemplate size={14} className="mr-2"/> Contract Details
                        </Button>
                    </Link>
                    <Link to={`/contract/${contract.id}`}>
                        <Button variant="primary" className="text-xs shadow-lg shadow-brand-500/20">
                            Open Full Workspace <ArrowRight size={14} className="ml-2"/>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

const FacetedSearchSidebar: React.FC<{ filters: any; setFilters: (f: any) => void; isOpen: boolean }> = ({ filters, setFilters, isOpen }) => {
    return (
        <div className={`shrink-0 border-r border-dark-700 bg-dark-900/50 h-full transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'w-64' : 'w-0 border-none'}`}>
            <div className="w-64 p-4 space-y-6 custom-scrollbar overflow-y-auto h-full">
                <div className="flex items-center gap-2 font-bold text-white text-sm mb-2">
                    <Filter size={16} className="text-brand-400"/> Filters
                </div>
                
                {/* Status */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                    <div className="space-y-1">
                        {Object.values(ContractStatus).map(s => (
                            <label key={s} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                                <input type="checkbox" className="rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-offset-dark-900"/>
                                {s}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Type */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Contract Type</label>
                    <div className="space-y-1">
                        {['MSA', 'NDA', 'SOW', 'Vendor', 'License'].map(t => (
                            <label key={t} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                                <input type="checkbox" className="rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-offset-dark-900"/>
                                {t}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Value Range */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Value Range</label>
                    <div className="flex items-center gap-2">
                        <Input placeholder="Min" className="h-8 text-xs bg-dark-950"/>
                        <span className="text-slate-500">-</span>
                        <Input placeholder="Max" className="h-8 text-xs bg-dark-950"/>
                    </div>
                </div>

                {/* Risk */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Risk Score</label>
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                            <input type="checkbox" className="rounded border-dark-600 bg-dark-800 text-brand-500"/> High ({'>'}75)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                            <input type="checkbox" className="rounded border-dark-600 bg-dark-800 text-brand-500"/> Medium (50-75)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                            <input type="checkbox" className="rounded border-dark-600 bg-dark-800 text-brand-500"/> Low ({'<'}50)
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ObligationsView: React.FC<{ obligations: Obligation[] }> = ({ obligations }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
            {obligations.map(obl => (
                <div key={obl.id} className="bg-dark-900 border border-dark-700 rounded-xl p-4 hover:border-brand-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                        <Badge color={obl.priority === 'High' ? 'red' : obl.priority === 'Medium' ? 'yellow' : 'blue'}>{obl.priority}</Badge>
                        <div className={`p-1.5 rounded-lg ${obl.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                            {obl.status === 'Completed' ? <CheckCircle size={16}/> : <Clock size={16}/>}
                        </div>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 line-clamp-2">{obl.title}</h4>
                    <p className="text-xs text-slate-500 mb-4">Owner: {obl.owner}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                            <Calendar size={14} className={new Date(obl.dueDate) < new Date() ? 'text-red-400' : 'text-slate-500'}/>
                            {obl.dueDate}
                        </div>
                        <button className="text-xs font-bold text-brand-400 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details
                        </button>
                    </div>
                </div>
            ))}
            {obligations.length === 0 && (
                <div className="col-span-3 text-center py-12 text-slate-500 border-2 border-dashed border-dark-800 rounded-xl">
                    <CheckSquare size={32} className="mx-auto mb-3 opacity-20"/>
                    <p>No active obligations found matching filters.</p>
                </div>
            )}
        </div>
    );
};

const Repository: React.FC = () => {
  const [quickViewContract, setQuickViewContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'contracts' | 'obligations'>('contracts');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Quick Stats
  const totalValue = MOCK_CONTRACTS.reduce((acc, curr) => acc + curr.value, 0);
  const riskCount = MOCK_CONTRACTS.filter(c => c.riskScore > 50).length;
  const pendingObligations = MOCK_OBLIGATIONS.filter(o => o.status === 'Pending').length;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
         <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><FileText size={24}/></div>
            <div><p className="text-xs text-slate-500 font-bold uppercase">Total Contracts</p><h3 className="text-2xl font-bold text-white">{MOCK_CONTRACTS.length}</h3></div>
         </div>
         <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg text-green-400"><DollarSign size={24}/></div>
            <div><p className="text-xs text-slate-500 font-bold uppercase">Portfolio Value</p><h3 className="text-2xl font-bold text-white">${(totalValue/1000).toFixed(1)}k</h3></div>
         </div>
         <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg text-red-400"><AlertTriangle size={24}/></div>
            <div><p className="text-xs text-slate-500 font-bold uppercase">High Risk</p><h3 className="text-2xl font-bold text-white">{riskCount}</h3></div>
         </div>
         <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400"><Bell size={24}/></div>
            <div><p className="text-xs text-slate-500 font-bold uppercase">Obligations Due</p><h3 className="text-2xl font-bold text-white">{pendingObligations}</h3></div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden bg-dark-950 border border-dark-700 rounded-2xl shadow-2xl relative">
          
          {/* Sidebar Filters */}
          <FacetedSearchSidebar filters={filters} setFilters={setFilters} isOpen={isFiltersOpen} />

          {/* Results Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Toolbar */}
              <div className="p-4 border-b border-dark-700 bg-dark-900/80 backdrop-blur-md flex flex-col md:flex-row gap-4 justify-between items-center z-10">
                 <div className="flex gap-4 items-center w-full md:w-auto">
                    <button 
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className={`p-2 rounded-lg transition-colors ${isFiltersOpen ? 'bg-brand-500/10 text-brand-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        title={isFiltersOpen ? "Collapse Filters" : "Expand Filters"}
                    >
                        <Filter size={18} />
                    </button>
                    <div className="flex bg-dark-950 rounded-lg p-1 border border-dark-800">
                        <button 
                            onClick={() => setActiveTab('contracts')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'contracts' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Contracts
                        </button>
                        <button 
                            onClick={() => setActiveTab('obligations')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'obligations' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Obligations
                        </button>
                    </div>
                    <div className="relative w-full md:w-80 group">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={16} />
                       <Input 
                          placeholder="Search repository..." 
                          className="pl-10 bg-dark-950 border-dark-700 focus:border-brand-500 shadow-sm h-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)} 
                       />
                    </div>
                 </div>
                 <div className="flex gap-2 items-center">
                    {activeTab === 'contracts' && (
                        <div className="flex bg-dark-950 rounded-lg border border-dark-800 p-0.5">
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-dark-800 text-white' : 'text-slate-500'}`}><ListIcon size={16}/></button>
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-dark-800 text-white' : 'text-slate-500'}`}><LayoutGrid size={16}/></button>
                        </div>
                    )}
                    <Button variant="secondary" className="h-9 text-xs"><Download size={14} className="mr-2"/> Export</Button>
                    <Link to="/contract/new">
                        <Button variant="primary" className="h-9 text-xs shadow-lg shadow-brand-500/20"><FileText size={14} className="mr-2"/> New</Button>
                    </Link>
                 </div>
              </div>

              {/* Content Grid/List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
                  {activeTab === 'contracts' ? (
                      viewMode === 'list' ? (
                          <div className="space-y-2">
                              {/* Header */}
                              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-dark-900/50 rounded-lg mb-2">
                                  <div className="col-span-4">Contract Name</div>
                                  <div className="col-span-2">Status</div>
                                  <div className="col-span-2">Value</div>
                                  <div className="col-span-2">Risk</div>
                                  <div className="col-span-2 text-right">Owner</div>
                              </div>
                              {MOCK_CONTRACTS.map(contract => (
                                  <div key={contract.id} className="grid grid-cols-12 gap-4 px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg items-center hover:border-brand-500/50 hover:bg-dark-800 transition-all group relative">
                                      <div className="col-span-4">
                                          <Link to={`/contract/${contract.id}`} className="font-bold text-white text-sm group-hover:text-brand-400 transition-colors hover:underline block">{contract.title}</Link>
                                          <div className="text-xs text-slate-500 flex items-center gap-1"><User size={10}/> {contract.counterparty}</div>
                                      </div>
                                      <div className="col-span-2">
                                          <Badge color={getStatusColor(contract.status)}>{contract.status}</Badge>
                                      </div>
                                      <div className="col-span-2 text-sm font-mono text-slate-300">
                                          ${contract.value.toLocaleString()}
                                      </div>
                                      <div className="col-span-2">
                                          <div className="flex items-center gap-2">
                                              <div className="flex-1 h-1.5 bg-dark-950 rounded-full overflow-hidden">
                                                  <div className={`h-full rounded-full ${contract.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${contract.riskScore}%`}}></div>
                                              </div>
                                              <span className="text-xs font-bold text-slate-400">{contract.riskScore}</span>
                                          </div>
                                      </div>
                                      <div className="col-span-2 text-right text-xs text-slate-400 flex items-center justify-end gap-2">
                                          <span>{contract.owner}</span>
                                          <button 
                                            onClick={(e) => { e.preventDefault(); setQuickViewContract(contract); }}
                                            className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Quick View"
                                          >
                                              <Maximize2 size={14}/>
                                          </button>
                                          <Link to={`/contract/${contract.id}`} title="Details" className="p-1.5 text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                              <LayoutTemplate size={14}/>
                                          </Link>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                              {MOCK_CONTRACTS.map(contract => (
                                  <div key={contract.id} className="group bg-dark-900 border border-dark-700 rounded-xl p-5 hover:border-brand-500/50 transition-all hover:-translate-y-1 relative">
                                      <div className="flex justify-between items-start mb-4">
                                          <div className="p-2 bg-dark-800 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-brand-500/20 transition-colors">
                                              <FileText size={20}/>
                                          </div>
                                          <Badge color={getStatusColor(contract.status)}>{contract.status}</Badge>
                                      </div>
                                      <Link to={`/contract/${contract.id}`} className="block">
                                          <h4 className="text-sm font-bold text-white mb-1 truncate hover:text-brand-400 transition-colors">{contract.title}</h4>
                                      </Link>
                                      <p className="text-xs text-slate-500 mb-4">{contract.counterparty}</p>
                                      <div className="flex justify-between items-end border-t border-dark-800 pt-3">
                                          <div>
                                              <p className="text-[10px] text-slate-500 uppercase font-bold">Value</p>
                                              <p className="text-sm font-mono text-slate-200">${contract.value.toLocaleString()}</p>
                                          </div>
                                          <div className="text-right">
                                              <p className="text-[10px] text-slate-500 uppercase font-bold">Risk</p>
                                              <p className={`text-sm font-bold ${contract.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{contract.riskScore}</p>
                                          </div>
                                      </div>
                                      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button 
                                            onClick={(e) => { e.preventDefault(); setQuickViewContract(contract); }}
                                            className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded"
                                            title="Quick View"
                                          >
                                              <Maximize2 size={16}/>
                                          </button>
                                          <Link 
                                            to={`/contract/${contract.id}`}
                                            className="p-1.5 text-slate-500 hover:text-brand-400 hover:bg-white/10 rounded"
                                            title="Details"
                                          >
                                              <LayoutTemplate size={16}/>
                                          </Link>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )
                  ) : (
                      <ObligationsView obligations={MOCK_OBLIGATIONS} />
                  )}
              </div>
          </div>
      </div>

      {/* Snapshot Dialog */}
      {quickViewContract && <ContractQuickViewModal contract={quickViewContract} onClose={() => setQuickViewContract(null)} />}
    </div>
  );
};

export default Repository;
