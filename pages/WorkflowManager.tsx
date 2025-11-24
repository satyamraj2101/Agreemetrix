
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, Input, Select } from '../components/UIComponents';
import { INITIAL_TEMPLATES } from '../mock/data';
import { 
  Search, Plus, MoreVertical, Play, Edit, Trash2, 
  GitBranch, Clock, CheckCircle2, AlertCircle, FileText, 
  LayoutTemplate, Settings, Bot, Zap, Star
} from 'lucide-react';

const WorkflowManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'archived'>('published');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use the robust templates from mock data, enriching them with 'Published' status for the demo
  const allWorkflows = INITIAL_TEMPLATES.map((t, index) => ({
    ...t,
    status: t.status || (index < 4 ? 'Published' : 'Draft'), // Fallback if not set
    isFavorite: index === 0 // Flag the first one as favorite
  }));

  const filteredWorkflows = allWorkflows.filter(wf => {
    const matchesSearch = wf.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = 
      activeTab === 'published' ? wf.status === 'Published' :
      activeTab === 'drafts' ? wf.status === 'Draft' :
      wf.status === 'Archived';
    return matchesSearch && matchesTab;
  });

  const getCategoryColor = (cat: string) => {
      const map: Record<string, string> = {
          'Procurement': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
          'Sales': 'text-green-400 border-green-500/30 bg-green-500/10',
          'Compliance': 'text-red-400 border-red-500/30 bg-red-500/10',
          'Customer Success': 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
          'Finance': 'text-purple-400 border-purple-500/30 bg-purple-500/10'
      };
      return map[cat] || 'text-slate-400 border-dark-700 bg-dark-900';
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitBranch size={24} className="text-brand-400" /> Workflow Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Orchestrate business logic, approvals, and automations.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/workflow-ai">
            <Button variant="primary" className="shadow-lg shadow-brand-500/20">
              <Bot size={16} className="mr-2"/> Visual Builder
            </Button>
          </Link>
          <Link to="/workflows/manual">
            <Button variant="secondary">
              <FileText size={16} className="mr-2"/> Manual Editor
            </Button>
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
        <div className="flex bg-dark-950 rounded-lg p-1 border border-dark-800">
          {['published', 'drafts', 'archived'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${
                activeTab === tab ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <Input 
            placeholder="Search workflows..." 
            className="pl-10 bg-dark-950 h-10 border-dark-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar pb-10">
        {filteredWorkflows.map(wf => (
          <Card key={wf.id} className="group hover:border-brand-500/30 transition-all hover:-translate-y-1 relative flex flex-col" noPadding>
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border ${getCategoryColor(wf.category)} transition-colors`}>
                  <Zap size={24} />
                </div>
                <div className="flex items-center gap-2">
                  {wf.isFavorite && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
                  <Badge color={wf.status === 'Published' ? 'green' : 'yellow'}>{wf.status}</Badge>
                  <button className="p-1 text-slate-500 hover:text-white rounded transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{wf.name}</h3>
              <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">{wf.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-dark-950 rounded text-[10px] text-slate-400 border border-dark-800 uppercase font-bold tracking-wide">
                  {wf.category}
                </span>
                {wf.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-dark-950 rounded text-[10px] text-slate-500 border border-dark-800">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-dark-800 pt-4 mt-2">
                <div className="flex items-center gap-1">
                    <Clock size={12} /> Updated {wf.updated}
                </div>
                <div className="flex items-center gap-1 font-mono bg-dark-950 px-1.5 py-0.5 rounded">
                    <GitBranch size={12}/> {wf.schema.nodes.length} Nodes
                </div>
              </div>
            </div>

            <div className="bg-dark-950/50 p-3 border-t border-dark-800 flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <Link to={`/workflow-ai/${wf.id}`} className="flex-1">
                <Button variant="secondary" className="w-full text-xs h-8">
                  <Edit size={12} className="mr-2"/> Edit Visual
                </Button>
              </Link>
              <Link to={`/workflows/manual/${wf.id}`} className="flex-1">
                <Button variant="secondary" className="w-full text-xs h-8">
                  <LayoutTemplate size={12} className="mr-2"/> Edit Manual
                </Button>
              </Link>
            </div>
          </Card>
        ))}

        {/* Create New Placeholder */}
        <Link to="/workflow-ai" className="border-2 border-dashed border-dark-700 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all duration-300 min-h-[250px] group">
          <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
            <Plus size={24} />
          </div>
          <span className="font-bold text-lg">Create New Workflow</span>
          <span className="text-xs mt-1 opacity-60">Start from scratch or use a template</span>
        </Link>
      </div>
    </div>
  );
};

export default WorkflowManager;
