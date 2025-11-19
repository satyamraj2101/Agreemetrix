
import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/UIComponents';
import { MOCK_TABLES, MOCK_INTEGRATIONS } from '../mock/data';
import { FieldTable, FieldDefinition } from '../types';
import { Database, Plus, Table as TableIcon, Settings, Link as LinkIcon, Search, FileText, Users, Briefcase, Box, ArrowRight, Trash2, Lock, Edit3, Shield } from 'lucide-react';

const FieldDatabase: React.FC = () => {
  const [activeTableId, setActiveTableId] = useState<string>(MOCK_TABLES[0].id);
  const [tables, setTables] = useState<FieldTable[]>(MOCK_TABLES);
  
  const activeTable = tables.find(t => t.id === activeTableId) || tables[0];

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
  const systemFields = activeTable.fields.filter(f => f.source === 'system' || f.source === 'integration');
  const customFields = activeTable.fields.filter(f => f.source === 'custom');

  const renderFieldRow = (field: FieldDefinition, isLocked: boolean) => (
    <tr key={field.id} className={`hover:bg-white/5 transition-colors group ${isLocked ? 'opacity-90' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isLocked ? 'text-slate-400' : 'text-slate-200'}`}>{field.name}</span>
          {field.required && <span className="text-[10px] text-red-400 bg-red-400/10 px-1.5 rounded">REQ</span>}
          {isLocked && <Lock size={10} className="text-slate-600" />}
        </div>
        <span className="text-xs text-slate-600 font-mono">{field.key}</span>
      </td>
      <td className="px-6 py-4">
        <Badge color="gray">{field.type}</Badge>
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
          <div className="flex items-center gap-2 text-xs bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded w-fit text-blue-300">
            <Box size={12} />
            {MOCK_INTEGRATIONS.find(i => i.id === field.integrationAppId)?.name} 
            <ArrowRight size={10} /> 
            {field.externalField}
          </div>
        )}
        {field.type === 'relationship' && field.relatedTableId && (
          <div className="flex items-center gap-2 text-xs bg-brand-500/10 border border-brand-500/20 px-2 py-1 rounded w-fit text-brand-300">
            <LinkIcon size={12} />
            Linked to {tables.find(t => t.id === field.relatedTableId)?.name}
          </div>
        )}
        {field.source === 'system' && <span className="text-xs text-slate-600 italic">Core framework definition</span>}
        {field.source === 'custom' && <span className="text-xs text-slate-500">User defined property</span>}
      </td>
      <td className="px-6 py-4 text-right">
        {isLocked ? (
           <button className="p-1.5 rounded text-slate-700 cursor-not-allowed" title="System fields cannot be modified">
             <Lock size={14} />
           </button>
        ) : (
          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
             <button className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-brand-400 transition-colors">
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
    <div className="h-[calc(100vh-8rem)] flex gap-6">
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
              <Button variant="primary" className="flex items-center gap-2"><Plus size={16} /> Add Custom Field</Button>
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
                   className="bg-dark-950 border border-dark-700 rounded py-1 pl-8 pr-2 text-xs text-slate-300 focus:border-brand-500 outline-none w-48"
                 />
              </div>
           </div>
           <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm text-slate-400">
                 <thead className="text-xs uppercase bg-dark-950 text-slate-500 font-semibold sticky top-0 z-10 shadow-sm">
                    <tr>
                       <th className="px-6 py-3">Field Name</th>
                       <th className="px-6 py-3">Data Type</th>
                       <th className="px-6 py-3">Source</th>
                       <th className="px-6 py-3">Integration / Logic</th>
                       <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-dark-800">
                    {/* Section: Pre-configured */}
                    <tr className="bg-dark-900/80 backdrop-blur-sm sticky top-10 z-10">
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
                    <tr className="bg-dark-900/80 backdrop-blur-sm sticky top-10 z-10">
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
                    
                    <tr className="hover:bg-white/5 transition-colors cursor-pointer">
                       <td colSpan={5} className="px-6 py-3">
                          <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-brand-400 transition-colors w-full">
                             <Plus size={14} /> Add new field to schema
                          </button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default FieldDatabase;
