

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Badge, Input, Button, Select } from '../components/UIComponents';
import { MOCK_CONTRACTS } from '../mock/data';
import { Contract, ContractStatus } from '../types';
import { 
  Filter, Search, Download, FileText, MoreVertical, 
  Calendar, DollarSign, Shield, User, ArrowUpRight,
  CheckCircle, XCircle, Clock, Activity, Share2, Eye, 
  AlertTriangle, FileCheck, Zap, X, ChevronRight
} from 'lucide-react';

// Helper for status colors
const getStatusColor = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.SIGNED: return 'green';
    case ContractStatus.REVIEW: return 'blue';
    case ContractStatus.APPROVAL: return 'yellow';
    case ContractStatus.DRAFT: return 'gray';
    case ContractStatus.EXPIRED: return 'red';
    default: return 'gray';
  }
};

// --- COMPONENTS ---

const ContractSnapshotModal: React.FC<{ contract: Contract; onClose: () => void }> = ({ contract, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-dark-900 w-full max-w-4xl rounded-2xl border border-dark-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 relative">
        
        {/* Header Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-brand-900/20 to-purple-900/20 z-0"></div>
        <div className="absolute top-0 right-0 p-32 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Modal Header */}
        <div className="relative z-10 p-6 border-b border-white/5 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center shadow-lg">
               <FileText size={32} className="text-brand-400" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">{contract.title}</h2>
                  <Badge color={getStatusColor(contract.status)}>{contract.status}</Badge>
               </div>
               <p className="text-sm text-slate-400 flex items-center gap-2">
                  <User size={14}/> {contract.counterparty}
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  <span className="font-mono text-xs opacity-70">{contract.id}</span>
               </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
             <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 custom-scrollbar">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Metadata */}
              <div className="lg:col-span-2 space-y-6">
                 {/* Key Metrics */}
                 <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-dark-950/50 rounded-xl border border-dark-700">
                       <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Value</p>
                       <p className="text-xl font-bold text-white font-mono">${contract.value.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-dark-950/50 rounded-xl border border-dark-700">
                       <p className="text-xs text-slate-500 font-bold uppercase mb-1">Risk Score</p>
                       <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${contract.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          <p className={`text-xl font-bold ${contract.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{contract.riskScore}/100</p>
                       </div>
                    </div>
                    <div className="p-4 bg-dark-950/50 rounded-xl border border-dark-700">
                       <p className="text-xs text-slate-500 font-bold uppercase mb-1">Renewal</p>
                       <p className="text-sm font-medium text-slate-200 flex items-center gap-2 h-7">
                          <Calendar size={14} className="text-brand-400"/> {contract.renewalDate}
                       </p>
                    </div>
                 </div>

                 {/* AI Summary Section */}
                 <div className="p-5 bg-brand-500/5 border border-brand-500/10 rounded-xl">
                    <h3 className="text-sm font-bold text-brand-100 flex items-center gap-2 mb-3">
                       <Zap size={16} className="text-brand-400" /> AI Executive Summary
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                       This <strong>{contract.type}</strong> with <strong>{contract.counterparty}</strong> is currently in the <strong>{contract.status}</strong> stage. 
                       Key obligations include a standard Net 45 payment term and a mutual non-solicitation clause. 
                       {contract.riskScore > 50 
                          ? ' Caution is advised due to non-standard liability caps detected in Section 4.' 
                          : ' The agreement largely follows standard playbook terms with low deviation.'}
                    </p>
                 </div>

                 {/* Recent Activity Mock */}
                 <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                       <div className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 text-xs font-bold">JD</div>
                          <div className="bg-dark-950 border border-dark-700 p-3 rounded-lg rounded-tl-none flex-1">
                             <p className="text-xs text-slate-300"><span className="font-bold text-white">John Doe</span> viewed the document.</p>
                             <p className="text-[10px] text-slate-500 mt-1">2 hours ago</p>
                          </div>
                       </div>
                       <div className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                             <Zap size={14} />
                          </div>
                          <div className="bg-dark-950 border border-dark-700 p-3 rounded-lg rounded-tl-none flex-1">
                             <p className="text-xs text-slate-300"><span className="font-bold text-brand-400">Agreemetrix AI</span> flagged a potential risk in Clause 12.3.</p>
                             <p className="text-[10px] text-slate-500 mt-1">5 hours ago</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Actions & Details */}
              <div className="space-y-6">
                 <div className="p-4 bg-dark-950 rounded-xl border border-dark-700 space-y-3">
                    <Button variant="primary" className="w-full justify-center shadow-lg shadow-brand-500/20" onClick={() => navigate(`/contract/${contract.id}`)}>
                       View Complete Contract Details <ArrowUpRight size={16} className="ml-2"/>
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                       <Button variant="secondary" className="w-full justify-center text-xs"><Download size={14} className="mr-2"/> PDF</Button>
                       <Button variant="secondary" className="w-full justify-center text-xs"><Share2 size={14} className="mr-2"/> Share</Button>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Required Actions</h3>
                    <div className="space-y-2">
                       {contract.status === ContractStatus.REVIEW ? (
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                             <Clock size={16} className="text-blue-400 shrink-0 mt-0.5" />
                             <div>
                                <p className="text-sm font-bold text-blue-100">Pending Review</p>
                                <p className="text-xs text-blue-200/70 mt-1">Legal team needs to approve redlines.</p>
                                <button className="mt-2 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md transition-colors">Review Now</button>
                             </div>
                          </div>
                       ) : contract.status === ContractStatus.APPROVAL ? (
                          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                             <CheckCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                             <div>
                                <p className="text-sm font-bold text-yellow-100">Awaiting Approval</p>
                                <p className="text-xs text-yellow-200/70 mt-1">CFO approval required for value > $100k.</p>
                                <div className="flex gap-2 mt-2">
                                   <button className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md transition-colors">Approve</button>
                                   <button className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md transition-colors">Reject</button>
                                </div>
                             </div>
                          </div>
                       ) : (
                          <div className="p-3 bg-dark-950 border border-dark-700 rounded-lg flex items-center justify-center text-slate-500 text-xs italic">
                             No immediate actions required.
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Details</h3>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                       <span className="text-slate-400">Owner</span>
                       <span className="text-white">{contract.owner}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                       <span className="text-slate-400">Start Date</span>
                       <span className="text-white">{contract.startDate}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                       <span className="text-slate-400">Contract Type</span>
                       <span className="text-white">{contract.type}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Repository: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Mock Filters logic
  const filteredContracts = MOCK_CONTRACTS.filter(contract => {
     const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           contract.counterparty.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesStatus = statusFilter === 'All' || contract.status === statusFilter;
     return matchesSearch && matchesStatus;
  });

  // Quick Stats
  const totalValue = filteredContracts.reduce((acc, curr) => acc + curr.value, 0);
  const activeCount = filteredContracts.filter(c => c.status !== ContractStatus.DRAFT && c.status !== ContractStatus.EXPIRED).length;
  const riskCount = filteredContracts.filter(c => c.riskScore > 50).length;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Page Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">Contract Repository</h1>
            <p className="text-slate-400">Centralized secure storage for all legal agreements.</p>
         </div>
         <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
            <div>
               <p className="text-xs text-slate-500 font-bold uppercase">Active Portfolio Value</p>
               <p className="text-lg font-bold text-white font-mono">${(totalValue/1000).toFixed(1)}k</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
               <DollarSign size={20} />
            </div>
         </div>
         <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
            <div>
               <p className="text-xs text-slate-500 font-bold uppercase">High Risk Contracts</p>
               <p className="text-lg font-bold text-red-400 font-mono">{riskCount}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
               <AlertTriangle size={20} />
            </div>
         </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-0 z-20 bg-dark-950/80 backdrop-blur-md py-4 border-b border-dark-700 -mx-6 px-6 flex flex-col md:flex-row gap-4 justify-between items-center transition-all">
         <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80 group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
               <Input 
                  placeholder="Search contracts, parties, metadata..." 
                  className="pl-10 bg-dark-900 border-dark-700 focus:border-brand-500 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
               />
            </div>
            <div className="w-40">
               <Select 
                  options={[
                     {label: 'All Statuses', value: 'All'},
                     {label: 'Draft', value: ContractStatus.DRAFT},
                     {label: 'In Review', value: ContractStatus.REVIEW},
                     {label: 'Pending Approval', value: ContractStatus.APPROVAL},
                     {label: 'Signed', value: ContractStatus.SIGNED},
                  ]} 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
               />
            </div>
         </div>
         <div className="flex gap-3 w-full md:w-auto justify-end">
            <Button variant="secondary" className="hidden md:flex items-center gap-2"><Filter size={16} /> Advanced</Button>
            <Button variant="secondary" className="flex items-center gap-2"><Download size={16} /> Export</Button>
            <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-brand-500/20"><FileText size={16} /> New Contract</Button>
         </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-3">
         {/* Table Header */}
         <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Contract Details</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Value</div>
            <div className="col-span-2">Risk</div>
            <div className="col-span-2 text-right">Actions</div>
         </div>

         {filteredContracts.length === 0 ? (
            <div className="text-center py-20 bg-dark-900/30 rounded-2xl border border-dark-700 border-dashed">
               <FileText size={48} className="mx-auto text-slate-600 mb-4 opacity-50" />
               <p className="text-slate-500 text-lg">No contracts found</p>
               <p className="text-slate-600 text-sm">Try adjusting your filters or search terms.</p>
            </div>
         ) : (
            filteredContracts.map((contract, index) => (
               <div 
                  key={contract.id}
                  onClick={() => setSelectedContract(contract)}
                  className="group relative bg-dark-900/40 border border-dark-700 hover:border-brand-500/50 hover:bg-dark-900 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] rounded-xl p-4 md:p-0 transition-all duration-300 cursor-pointer overflow-hidden animate-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms` }}
               >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/5 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  
                  <div className="relative z-10 md:grid md:grid-cols-12 md:gap-4 md:items-center md:px-6 md:py-4">
                     
                     {/* Mobile Header */}
                     <div className="flex justify-between items-start mb-4 md:hidden">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-dark-800 rounded-lg text-slate-400">
                              <FileText size={20} />
                           </div>
                           <div>
                              <h3 className="font-bold text-white">{contract.title}</h3>
                              <p className="text-xs text-slate-500">{contract.counterparty}</p>
                           </div>
                        </div>
                        <Badge color={getStatusColor(contract.status)}>{contract.status}</Badge>
                     </div>

                     {/* Col 1: Details (Desktop) */}
                     <div className="hidden md:col-span-4 md:flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-slate-400 group-hover:text-brand-400 group-hover:border-brand-500/30 transition-colors">
                           {contract.type === 'NDA' ? <Shield size={18}/> : <FileText size={18}/>}
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">{contract.title}</h3>
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><User size={10}/> {contract.counterparty}</span>
                              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                              <span>{contract.id}</span>
                           </div>
                        </div>
                     </div>

                     {/* Col 2: Status (Desktop) */}
                     <div className="hidden md:col-span-2 md:block">
                        <Badge color={getStatusColor(contract.status)}>{contract.status}</Badge>
                        <p className="text-[10px] text-slate-500 mt-1 pl-1">Updated today</p>
                     </div>

                     {/* Col 3: Value */}
                     <div className="col-span-2 flex items-center justify-between md:block">
                        <span className="text-xs font-bold text-slate-500 md:hidden">VALUE</span>
                        <div>
                           <p className="font-mono font-medium text-slate-300">${contract.value.toLocaleString()}</p>
                           <p className="text-[10px] text-slate-500 hidden md:block">USD Total</p>
                        </div>
                     </div>

                     {/* Col 4: Risk */}
                     <div className="col-span-2 flex items-center justify-between md:block mt-2 md:mt-0">
                        <span className="text-xs font-bold text-slate-500 md:hidden">RISK</span>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 h-1.5 bg-dark-800 rounded-full overflow-hidden w-24">
                              <div 
                                 className={`h-full rounded-full ${contract.riskScore > 50 ? 'bg-red-500' : contract.riskScore > 25 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                 style={{width: `${contract.riskScore}%`}}
                              ></div>
                           </div>
                           <span className={`text-xs font-bold ${contract.riskScore > 50 ? 'text-red-400' : 'text-slate-400'}`}>{contract.riskScore}</span>
                        </div>
                     </div>

                     {/* Col 5: Actions */}
                     <div className="col-span-2 flex justify-end items-center gap-2 mt-4 md:mt-0 border-t border-white/5 pt-4 md:border-none md:pt-0">
                        <Button variant="secondary" className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Quick View">
                           <Eye size={14} />
                        </Button>
                        <Button variant="ghost" className="h-8 text-xs gap-1 text-slate-400 hover:text-brand-400">
                           Details <ChevronRight size={14} />
                        </Button>
                     </div>
                  </div>
               </div>
            ))
         )}
      </div>

      {/* Modals */}
      {selectedContract && (
         <ContractSnapshotModal contract={selectedContract} onClose={() => setSelectedContract(null)} />
      )}
    </div>
  );
};

export default Repository;