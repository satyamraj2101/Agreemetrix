
import React, { useState } from 'react';
import { Card, Button, Input, Badge, Select } from '../components/UIComponents';
import { MOCK_TEMPLATES, MOCK_TABLES } from '../mock/data';
import { DocumentTemplate } from '../types';
import { 
  FileText, Plus, Upload, Search, LayoutTemplate, MoreVertical, 
  ChevronLeft, Save, Eye, Printer, Type, 
  Braces, GitBranch, EyeOff, Bold, Italic, Underline, AlignLeft,
  AlignCenter, AlignRight, List, MousePointer2
} from 'lucide-react';

const DocumentTemplates: React.FC = () => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [activeTemplate, setActiveTemplate] = useState<DocumentTemplate | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');

  // Editor State
  const [editorTab, setEditorTab] = useState<'variables' | 'conditions' | 'redaction'>('variables');

  // Filter Logic
  const filteredTemplates = MOCK_TEMPLATES.filter(t => 
    filterCategory === 'All' || t.category === filterCategory
  );

  // Actions
  const handleEdit = (template: DocumentTemplate) => {
    setActiveTemplate(template);
    setView('editor');
  };

  const handleCreate = () => {
    const newTemplate: DocumentTemplate = {
      id: `tpl_${Date.now()}`,
      name: 'New Template',
      category: 'NDA',
      version: '0.1',
      lastModified: 'Just now',
      status: 'Draft',
      content: '<h1>New Agreement</h1><p>Start typing here...</p>',
      variables: [],
      conditions: [],
      redactionRules: []
    };
    setActiveTemplate(newTemplate);
    setView('editor');
  };

  const TemplateCard = ({ template }: { template: DocumentTemplate }) => (
    <Card noPadding className="group cursor-pointer hover:border-brand-500/40 transition-all relative overflow-hidden">
       <div className="p-5 flex flex-col h-full" onClick={() => handleEdit(template)}>
          <div className="flex justify-between items-start mb-3">
             <div className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-brand-400 group-hover:bg-brand-500/10 transition-colors">
                <FileText size={20} />
             </div>
             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white" onClick={(e) => e.stopPropagation()}>
                   <MoreVertical size={16} />
                </button>
             </div>
          </div>
          
          <h3 className="font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">{template.name}</h3>
          <div className="flex items-center gap-2 mb-4">
             <Badge color="gray">{template.category}</Badge>
             <span className="text-xs text-slate-500">v{template.version}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
             <span>Updated {template.lastModified}</span>
             <Badge color={template.status === 'Active' ? 'green' : 'yellow'}>{template.status}</Badge>
          </div>
       </div>
    </Card>
  );

  // --- EDITOR VIEW ---
  if (view === 'editor' && activeTemplate) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col -m-6">
        {/* Toolbar */}
        <div className="h-14 bg-dark-950 border-b border-dark-700 flex items-center justify-between px-4 z-20">
           <div className="flex items-center gap-4">
              <button onClick={() => setView('list')} className="p-2 hover:bg-white/5 rounded text-slate-400 hover:text-white">
                 <ChevronLeft size={20} />
              </button>
              <div className="h-8 w-px bg-dark-700"></div>
              <div>
                 <Input 
                    value={activeTemplate.name} 
                    onChange={(e) => setActiveTemplate({...activeTemplate, name: e.target.value})}
                    className="h-8 py-1 bg-transparent border-none hover:bg-white/5 focus:ring-0 text-sm font-bold w-64"
                 />
              </div>
              <Badge color={activeTemplate.status === 'Active' ? 'green' : 'yellow'}>{activeTemplate.status}</Badge>
           </div>

           {/* Formatting Tools (Mock) */}
           <div className="flex items-center gap-1 bg-dark-800 p-1 rounded-lg border border-dark-700">
              <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded"><Bold size={14}/></button>
              <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded"><Italic size={14}/></button>
              <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded"><Underline size={14}/></button>
              <div className="w-px h-4 bg-dark-600 mx-1"></div>
              <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded"><AlignLeft size={14}/></button>
              <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded"><AlignCenter size={14}/></button>
              <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded"><AlignRight size={14}/></button>
           </div>

           <div className="flex items-center gap-2">
              <Button variant="secondary" className="h-8 text-xs gap-2"><Eye size={14}/> Preview</Button>
              <Button variant="primary" className="h-8 text-xs gap-2"><Save size={14}/> Save</Button>
           </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
           {/* Left: Configuration Panel */}
           <div className="w-80 bg-dark-900 border-r border-dark-700 flex flex-col z-10">
              <div className="flex border-b border-dark-700">
                 <button 
                   onClick={() => setEditorTab('variables')}
                   className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${editorTab === 'variables' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                 >
                   Variables
                 </button>
                 <button 
                   onClick={() => setEditorTab('conditions')}
                   className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${editorTab === 'conditions' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                 >
                   Logic
                 </button>
                 <button 
                   onClick={() => setEditorTab('redaction')}
                   className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${editorTab === 'redaction' ? 'border-red-500 text-red-400 bg-red-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                 >
                   Redact
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                 {editorTab === 'variables' && (
                    <div className="space-y-4">
                       <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-lg text-xs text-brand-200">
                          Drag & drop variables into the document to make them dynamic.
                       </div>
                       <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">System Fields</h4>
                          <div className="space-y-2">
                             {MOCK_TABLES[0].fields.map(field => (
                                <div key={field.id} className="flex items-center gap-2 p-2 bg-dark-950 border border-dark-700 rounded cursor-grab active:cursor-grabbing hover:border-brand-500/50 transition-colors group">
                                   <Braces size={14} className="text-slate-500 group-hover:text-brand-400"/>
                                   <span className="text-sm text-slate-300">{field.name}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {editorTab === 'conditions' && (
                    <div className="space-y-4">
                       <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-200">
                          Highlight text in the document and click "Add Condition" to make it dynamic.
                       </div>
                       <Button variant="secondary" className="w-full text-xs border-dashed border-blue-500/50 text-blue-400 hover:bg-blue-500/10"><Plus size={14} className="mr-2"/> Add New Condition</Button>
                       
                       <div className="space-y-2">
                          {activeTemplate.conditions.map(cond => (
                             <div key={cond.id} className="p-3 bg-dark-950 border border-dark-700 rounded group hover:border-blue-500/50">
                                <div className="flex justify-between items-start mb-1">
                                   <span className="font-bold text-slate-300 text-sm">{cond.name}</span>
                                   <GitBranch size={14} className="text-blue-500"/>
                                </div>
                                <code className="text-[10px] bg-dark-900 px-1 py-0.5 rounded text-slate-400 font-mono block mb-2">{cond.condition}</code>
                                <div className="text-xs text-slate-500 line-clamp-2 italic">"{cond.content}"</div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {editorTab === 'redaction' && (
                    <div className="space-y-4">
                       <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-200">
                          Select text sections to hide them from specific user roles.
                       </div>
                       
                       {activeTemplate.redactionRules.map(rule => (
                          <div key={rule.id} className="p-3 bg-dark-950 border border-dark-700 rounded group hover:border-red-500/50">
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Hidden For</span>
                                <Badge color="red">{rule.role}</Badge>
                             </div>
                             <div className="flex gap-2 text-xs text-slate-300">
                                <EyeOff size={14} className="text-red-400 mt-0.5"/>
                                {rule.description}
                             </div>
                          </div>
                       ))}
                       
                       <div className="border-t border-white/5 pt-4">
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Quick Actions</h4>
                          <div className="grid grid-cols-2 gap-2">
                             <button className="p-2 bg-dark-800 hover:bg-red-900/20 border border-dark-700 hover:border-red-500/30 rounded text-xs text-slate-300 flex flex-col items-center gap-1">
                                <EyeOff size={16} className="text-red-400"/> Hide Financials
                             </button>
                             <button className="p-2 bg-dark-800 hover:bg-red-900/20 border border-dark-700 hover:border-red-500/30 rounded text-xs text-slate-300 flex flex-col items-center gap-1">
                                <EyeOff size={16} className="text-red-400"/> Hide PII
                             </button>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>

           {/* Center: Document Canvas */}
           <div className="flex-1 bg-dark-800 overflow-y-auto p-8 flex justify-center relative">
               {/* Paper */}
               <div className="w-[800px] min-h-[1100px] bg-white text-slate-900 shadow-2xl p-[60px] relative">
                  {/* Simulate Word Editor Content */}
                  <div 
                    className="prose max-w-none outline-none font-serif" 
                    contentEditable 
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{__html: activeTemplate.content}}
                  >
                  </div>

                  {/* Visual Overlay for Logic (Simulation) */}
                  {editorTab === 'conditions' && (
                     <div className="absolute top-[280px] right-[60px] w-64 p-2 bg-blue-100 border-l-4 border-blue-500 shadow-lg text-xs text-blue-900 z-10 animate-in fade-in slide-in-from-left-2">
                        <strong>Logic Block: High Value</strong><br/>
                        Only shows if Value &gt; $100k
                     </div>
                  )}

                  {editorTab === 'redaction' && (
                     <div className="absolute bottom-[200px] left-[60px] right-[60px] h-24 bg-red-100/30 border-2 border-dashed border-red-400 flex items-center justify-center pointer-events-none">
                        <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded uppercase shadow-sm">Hidden for Sales</span>
                     </div>
                  )}
               </div>
           </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Document Templates</h2>
          <p className="text-slate-400">Manage legal agreement templates with advanced logic and dynamic redaction.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary" className="flex items-center gap-2"><Upload size={16}/> Import Word (.docx)</Button>
           <Button variant="primary" className="flex items-center gap-2" onClick={handleCreate}><Plus size={16}/> Create Blank</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-1">
         <button 
           onClick={() => setFilterCategory('All')}
           className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${filterCategory === 'All' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-white'}`}
         >
           All Templates
         </button>
         {['NDA', 'MSA', 'SOW', 'Vendor'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${filterCategory === cat ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              {cat}
            </button>
         ))}
         
         <div className="flex-1"></div>
         <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <Input placeholder="Search templates..." className="pl-9 h-9 bg-dark-900" />
         </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredTemplates.map(tpl => (
            <TemplateCard key={tpl.id} template={tpl} />
         ))}
         
         {/* Empty State / Create New Placeholder */}
         <button onClick={handleCreate} className="border-2 border-dashed border-dark-700 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all duration-300 min-h-[220px] group">
            <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Plus size={24} />
            </div>
            <span className="font-bold">Create New Template</span>
            <span className="text-xs mt-1 opacity-60 text-center">Start from scratch or use the Wizard</span>
         </button>
      </div>
    </div>
  );
};

export default DocumentTemplates;
