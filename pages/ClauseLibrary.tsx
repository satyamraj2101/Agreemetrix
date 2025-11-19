import React, { useState } from 'react';
import { Card, Button, Input, Badge, Select } from '../components/UIComponents';
import { MOCK_CLAUSES } from '../mock/data';
import { Search, Plus, Filter, Edit2, Trash2, AlertTriangle, Tag } from 'lucide-react';

const ClauseLibrary: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('All');

  const filteredClauses = MOCK_CLAUSES.filter(clause => {
    const matchesSearch = clause.name.toLowerCase().includes(filter.toLowerCase()) || clause.content.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = category === 'All' || clause.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Clause Library</h2>
          <p className="text-sm text-slate-400">Manage standard legal language and playbooks.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2"><Plus size={16} /> Add Clause</Button>
      </div>

      <div className="flex gap-4 items-center bg-dark-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input 
            placeholder="Search clauses content..." 
            className="pl-10 bg-dark-950 border-dark-700" 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Select 
          options={[
            {label: 'All Categories', value: 'All'},
            {label: 'Indemnity', value: 'Indemnity'},
            {label: 'Liability', value: 'Liability'},
            {label: 'Compliance', value: 'Compliance'},
            {label: 'Confidentiality', value: 'Confidentiality'}
          ]}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-48"
        />
        <div className="h-8 w-px bg-white/10"></div>
        <Button variant="ghost" className="text-xs"><Filter size={14} className="mr-2" /> More Filters</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClauses.map(clause => (
          <Card key={clause.id} className="group hover:border-brand-500/30 transition-all duration-300" noPadding>
             <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                   <div>
                      <Badge color="gray">{clause.category}</Badge>
                      <h3 className="font-bold text-lg text-slate-200 mt-2 group-hover:text-brand-400 transition-colors">{clause.name}</h3>
                   </div>
                   {clause.riskLevel === 'High' && (
                     <div className="text-red-400" title="High Risk"><AlertTriangle size={18} /></div>
                   )}
                </div>
                
                <div className="p-3 bg-dark-950 rounded border border-dark-800 text-sm text-slate-400 font-serif italic leading-relaxed h-32 overflow-y-auto custom-scrollbar">
                   "{clause.content}"
                </div>

                <div className="flex flex-wrap gap-2">
                   {clause.tags.map(tag => (
                     <span key={tag} className="text-[10px] flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                       <Tag size={10} /> {tag}
                     </span>
                   ))}
                </div>
             </div>
             <div className="px-5 py-3 border-t border-white/5 flex justify-between items-center bg-dark-900/30">
                <span className="text-xs text-slate-500 font-mono">{clause.id}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-1.5 hover:bg-brand-500/10 hover:text-brand-400 rounded transition-colors"><Edit2 size={14} /></button>
                   <button className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors"><Trash2 size={14} /></button>
                </div>
             </div>
          </Card>
        ))}
        
        {/* Add New Placeholder */}
        <button className="border-2 border-dashed border-dark-700 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all duration-300 min-h-[280px]">
           <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mb-4">
             <Plus size={24} />
           </div>
           <span className="font-bold">Create New Clause</span>
           <span className="text-xs mt-1 opacity-60">Add to playbook</span>
        </button>
      </div>
    </div>
  );
};

export default ClauseLibrary;