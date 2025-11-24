
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Input, Select } from '../../components/UIComponents';
import { MOCK_APP_TYPES } from '../../mock/data';
import { 
  Search, Plus, MoreVertical, Edit, Trash2, 
  Box, Clock, CheckCircle2, AlertCircle, FileText, 
  Settings, Copy, Filter, ArrowRight
} from 'lucide-react';

const AppTypeManager: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'archived'>('published');
  const [searchTerm, setSearchTerm] = useState('');
  const [appTypes, setAppTypes] = useState(MOCK_APP_TYPES);

  const filteredApps = appTypes.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = 
      activeTab === 'published' ? app.status === 'Published' :
      activeTab === 'drafts' ? app.status === 'Draft' :
      app.status === 'Archived';
    return matchesSearch && matchesTab;
  });

  const handleCreate = () => {
      // In a real app, this would create a DB record and redirect.
      // For mock, we'll navigate to a "new" ID.
      navigate('/admin/application-types/new');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Box size={24} className="text-brand-400" /> Application Type Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure contract request types, intake forms, and policies.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <FileText size={16} className="mr-2"/> Documentation
          </Button>
          <Button variant="primary" className="shadow-lg shadow-brand-500/20" onClick={handleCreate}>
            <Plus size={16} className="mr-2"/> Create New Type
          </Button>
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
        
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <Input 
                placeholder="Search by name or key..." 
                className="pl-10 bg-dark-950 h-10 border-dark-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <Button variant="secondary" className="h-10"><Filter size={16}/></Button>
        </div>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar pb-10">
        {filteredApps.map(app => (
          <Card key={app.id} className="group hover:border-brand-500/30 transition-all hover:-translate-y-1 relative flex flex-col h-full" noPadding>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border bg-dark-950 border-dark-700 text-brand-400 group-hover:text-white group-hover:bg-brand-500/20 transition-colors`}>
                  <Box size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <Badge color={app.status === 'Published' ? 'green' : 'yellow'}>{app.status}</Badge>
                  <button className="p-1 text-slate-500 hover:text-white rounded transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">{app.name}</h3>
              <code className="text-xs font-mono text-slate-500 bg-dark-950 px-1.5 py-0.5 rounded w-fit mb-3">{app.key}</code>
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-1">{app.description}</p>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-dark-800">
                  <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Usage (30d)</p>
                      <p className="text-white font-mono">{app.usageCount}</p>
                  </div>
                  <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Owner</p>
                      <p className="text-white">{app.owner}</p>
                  </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <div className="flex items-center gap-1">
                    <Clock size={12} /> Updated {app.lastModified}
                </div>
              </div>
            </div>

            <div className="bg-dark-950/50 p-3 border-t border-dark-800 flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <Link to={`/admin/application-types/${app.id}`} className="flex-1">
                <Button variant="secondary" className="w-full text-xs h-8">
                  <Settings size={12} className="mr-2"/> Configure
                </Button>
              </Link>
              <Button variant="ghost" className="h-8 w-8 p-0"><Copy size={14}/></Button>
            </div>
          </Card>
        ))}

        {/* Create New Placeholder */}
        <button onClick={handleCreate} className="border-2 border-dashed border-dark-700 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all duration-300 min-h-[250px] group">
          <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
            <Plus size={24} />
          </div>
          <span className="font-bold text-lg">Create New Type</span>
          <span className="text-xs mt-1 opacity-60">Start from scratch or clone existing</span>
        </button>
      </div>
    </div>
  );
};

export default AppTypeManager;
