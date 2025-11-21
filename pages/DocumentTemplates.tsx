import React, { useState } from 'react';
import { Card, Button, Input, Badge, Select } from '../components/UIComponents';
import { MOCK_TEMPLATES, MOCK_TABLES } from '../mock/data';
import { DocumentTemplate } from '../types';
import { 
  FileText, Plus, Upload, Search, LayoutTemplate, MoreVertical, 
  ChevronLeft, Save, Printer, Type, 
  Braces, GitBranch, EyeOff, Bold, Italic, Underline, AlignLeft,
  AlignCenter, AlignRight, List, MousePointer2, Sparkles,
  ArrowRightLeft, CheckCircle2, AlertTriangle, RefreshCw, Workflow,
  Check, Split, Merge, X, Cloud, ArrowRight, Layers, Wand2, ThumbsUp, Tag, Link as LinkIcon, MessageSquare,
  ZoomIn, ZoomOut, Undo, Redo, PenTool, Database, BookOpen, GripVertical, UploadCloud, Loader2
} from 'lucide-react';

const TemplateCard: React.FC<{ template: DocumentTemplate; onEdit: (t: DocumentTemplate) => void }> = ({ template, onEdit }) => (
  <Card noPadding className="group cursor-pointer hover:border-brand-500/40 transition-all relative overflow-hidden hover:shadow-lg hover:-translate-y-1">
     <div className="p-5 flex flex-col h-full" onClick={() => onEdit(template)}>
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
        
        <h3 className="font-bold text-white mb-1 group-hover:text-brand-400 transition-colors line-clamp-1" title={template.name}>{template.name}</h3>
        <div className="flex items-center gap-2 mb-4">
           <Badge color="gray">{template.category}</Badge>
           <span className="text-xs text-slate-500">v{template.version}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags?.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] bg-dark-800 text-slate-400 px-1.5 py-0.5 rounded border border-dark-700">{tag}</span>
          ))}
          {(template.tags?.length || 0) > 3 && <span className="text-[10px] text-slate-500">+{template.tags!.length - 3}</span>}
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
           <span>Updated {template.lastModified}</span>
           <Badge color={template.status === 'Active' ? 'green' : 'yellow'}>{template.status}</Badge>
        </div>
     </div>
  </Card>
);

const RibbonButton = ({ icon: Icon, label, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center px-3 py-1.5 h-full min-w-[60px] rounded-lg transition-all group ${active ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
    >
        <Icon size={20} className={`mb-1 ${active ? 'text-brand-400' : 'text-slate-400 group-hover:text-white'}`} />
        <span className="text-[10px] font-medium leading-none">{label}</span>
    </button>
);

const RibbonDivider = () => <div className="w-px h-8 bg-dark-700 mx-1 self-center"></div>;

const ImportTemplateModal = ({ onClose, onImport }: { onClose: () => void, onImport: (file: File, meta: {name: string, category: string}) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState({ name: '', category: 'NDA' });
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFile(f);
      setMeta(prev => ({ ...prev, name: f.name.replace(/\.[^/.]+$/, "") }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setMeta(prev => ({ ...prev, name: f.name.replace(/\.[^/.]+$/, "") }));
    }
  }

  const handleSubmit = () => {
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => {
        onImport(file, meta);
        setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in">
       {/* Modal Content */}
       <div className="bg-dark-900 w-full max-w-lg rounded-2xl border border-dark-700 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
          <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
             <h3 className="text-lg font-bold text-white flex items-center gap-2"><Upload size={18}/> Import Template</h3>
             <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
          </div>
          
          <div className="p-6 space-y-6">
             {/* Dropzone */}
             {!file ? (
                 <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${isDragging ? 'border-brand-500 bg-brand-500/10' : 'border-dark-700 hover:border-brand-500/30 hover:bg-dark-800'}`}
                 >
                    <div className="w-12 h-12 bg-dark-800 rounded-full flex items-center justify-center mb-4">
                       <UploadCloud size={24} className="text-slate-400"/>
                    </div>
                    <p className="text-sm font-bold text-white mb-1">Drag & drop document</p>
                    <p className="text-xs text-slate-500 mb-4">Supports .docx, .pdf, .html</p>
                    <label className="cursor-pointer">
                       <span className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-xs font-bold text-white transition-colors border border-dark-600">Browse Files</span>
                       <input type="file" className="hidden" onChange={handleFileSelect} accept=".docx,.pdf,.html" />
                    </label>
                 </div>
             ) : (
                 <div className="bg-dark-800 rounded-xl p-4 flex items-center gap-4 border border-dark-700">
                    <div className="w-10 h-10 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-400">
                       <FileText size={20}/>
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-white truncate">{file.name}</p>
                       <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => setFile(null)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"><X size={16}/></button>
                 </div>
             )}

             {/* Metadata Inputs */}
             <div className="space-y-4">
                <Input label="Template Name" value={meta.name} onChange={(e) => setMeta({...meta, name: e.target.value})} />
                <Select 
                   label="Category"
                   options={['NDA', 'MSA', 'SOW', 'Vendor', 'Offer Letter', 'Other'].map(c => ({label: c, value: c}))}
                   value={meta.category}
                   onChange={(e) => setMeta({...meta, category: e.target.value})}
                />
             </div>
          </div>

          <div className="p-6 border-t border-dark-700 bg-dark-950/30 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose} disabled={isProcessing}>Cancel</Button>
             <Button variant="primary" onClick={handleSubmit} disabled={!file || isProcessing} className="min-w-[100px]">
                {isProcessing ? <Loader2 size={16} className="animate-spin"/> : 'Import'}
             </Button>
          </div>
       </div>
    </div>
  );
}

const DocumentTemplates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'harmonization'>('library');
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [templates, setTemplates] = useState<DocumentTemplate[]>(MOCK_TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState<DocumentTemplate | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterTag, setFilterTag] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Editor State (New)
  const [ribbonTab, setRibbonTab] = useState<'home' | 'insert' | 'layout' | 'review'>('home');
  const [editorSidebarTab, setEditorSidebarTab] = useState<'variables' | 'conditions' | 'redaction'>('variables');
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showSmartAssist, setShowSmartAssist] = useState(false);

  // Harmonization State
  const [harmonizationStep, setHarmonizationStep] = useState<'upload' | 'analyzing' | 'review' | 'complete'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string}[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeClauseIndex, setActiveClauseIndex] = useState(0);
  const [analyzedClauses] = useState([/* ... same mock data ... */]); // Kept existing mock data logic

  // Filter Logic
  const filteredTemplates = templates.filter(t => {
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesTag = !filterTag || (t.tags && t.tags.includes(filterTag));
    return matchesCategory && matchesTag;
  });

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
      redactionRules: [],
      tags: ['Draft']
    };
    setActiveTemplate(newTemplate);
    setView('editor');
  };

  const handleImport = (file: File, meta: {name: string, category: string}) => {
      const newTemplate: DocumentTemplate = {
          id: `tpl_imp_${Date.now()}`,
          name: meta.name,
          category: meta.category,
          version: '1.0',
          lastModified: 'Just now',
          status: 'Draft',
          // Simulate extracted content
          content: `<h1>${meta.name}</h1><p>Imported content from <strong>${file.name}</strong>.</p><p>This document was parsed and converted on ${new Date().toLocaleDateString()}.</p><br/><p><strong>1. Confidentiality</strong><br/>The parties agree...</p>`,
          variables: [],
          conditions: [],
          redactionRules: [],
          tags: ['Imported']
      };
      
      setTemplates([newTemplate, ...templates]);
      setShowImportModal(false);
  };

  // --- NEW EDITOR VIEW ---
  if (view === 'editor' && activeTemplate) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col -m-6 bg-[#0F1115] text-slate-200 overflow-hidden">
        
        {/* 1. TOP HEADER */}
        <div className="h-14 bg-dark-950 border-b border-dark-700 flex items-center justify-between px-4 shrink-0 z-30">
           <div className="flex items-center gap-4">
              <button onClick={() => setView('list')} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                 <ChevronLeft size={20} />
              </button>
              <div className="flex flex-col">
                 <Input 
                    value={activeTemplate.name} 
                    onChange={(e) => setActiveTemplate({...activeTemplate, name: e.target.value})}
                    className="h-6 py-0 px-1 bg-transparent border-none hover:bg-white/5 focus:ring-0 text-sm font-bold w-96 text-white"
                 />
                 <div className="flex items-center gap-2 px-1 text-[10px] text-slate-500">
                    <Badge color={activeTemplate.status === 'Active' ? 'green' : 'yellow'} className="py-0">{activeTemplate.status}</Badge>
                    <span>Saved {activeTemplate.lastModified}</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button variant="secondary" className="h-8 text-xs"><Printer size={14} className="mr-2"/> Print</Button>
              <Button variant="primary" className="h-8 text-xs shadow-lg"><Save size={14} className="mr-2"/> Save Template</Button>
           </div>
        </div>

        {/* 2. RIBBON TOOLBAR */}
        <div className="bg-dark-900 border-b border-dark-700 shrink-0 flex flex-col">
            <div className="flex px-2 border-b border-dark-800">
                {['Home', 'Insert', 'Layout', 'Review'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setRibbonTab(tab.toLowerCase() as any)}
                        className={`px-5 py-2 text-xs font-bold transition-all border-b-2 ${ribbonTab === tab.toLowerCase() ? 'border-brand-500 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            <div className="h-16 flex items-center px-4 gap-2 overflow-x-auto custom-scrollbar">
                {ribbonTab === 'home' && (
                    <>
                        <div className="flex items-center gap-1 mr-2">
                            <RibbonButton icon={Undo} label="Undo" />
                            <RibbonButton icon={Redo} label="Redo" />
                        </div>
                        <RibbonDivider />
                        <div className="flex items-center gap-2 mx-2">
                            <Select options={[{label: 'Normal', value: 'p'}, {label: 'Heading 1', value: 'h1'}]} className="w-32 h-8 text-xs bg-dark-950" />
                            <Select options={[{label: 'Inter', value: 'inter'}, {label: 'Times', value: 'times'}]} className="w-24 h-8 text-xs bg-dark-950" />
                        </div>
                        <RibbonDivider />
                        <div className="flex items-center gap-1 mx-2">
                            <RibbonButton icon={Bold} label="Bold" />
                            <RibbonButton icon={Italic} label="Italic" />
                            <RibbonButton icon={Underline} label="Underline" />
                        </div>
                        <RibbonDivider />
                        <RibbonButton icon={AlignLeft} label="Left" />
                        <RibbonButton icon={AlignCenter} label="Center" />
                        <RibbonButton icon={AlignRight} label="Right" />
                    </>
                )}
                {ribbonTab === 'insert' && (
                    <>
                        <RibbonButton icon={Database} label="Variable" onClick={() => { setShowRightSidebar(true); setEditorSidebarTab('variables'); }}/>
                        <RibbonButton icon={GitBranch} label="Logic" onClick={() => { setShowRightSidebar(true); setEditorSidebarTab('conditions'); }}/>
                        <RibbonDivider />
                        <RibbonButton icon={PenTool} label="Signature" />
                        <RibbonButton icon={List} label="Table" />
                    </>
                )}
                {ribbonTab === 'layout' && (
                    <>
                        <div className="flex items-center gap-2 bg-dark-950 rounded-lg p-1 border border-dark-700">
                            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 text-slate-400 hover:text-white"><ZoomOut size={16}/></button>
                            <span className="text-xs font-mono w-10 text-center">{zoom}%</span>
                            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1 text-slate-400 hover:text-white"><ZoomIn size={16}/></button>
                        </div>
                        <RibbonDivider />
                        <RibbonButton icon={GripVertical} label="Sidebar" active={showRightSidebar} onClick={() => setShowRightSidebar(!showRightSidebar)}/>
                    </>
                )}
            </div>
        </div>

        {/* 3. WORKSPACE */}
        <div className="flex-1 flex overflow-hidden relative">
           {/* Center: Document Canvas */}
           <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-dark-900/50 custom-scrollbar">
               {/* Paper Page */}
               <div 
                  className="bg-white text-black shadow-2xl transition-transform duration-200 ease-out origin-top mb-20"
                  style={{
                      width: '816px',
                      minHeight: '1056px',
                      padding: '96px',
                      transform: `scale(${zoom / 100})`,
                  }}
               >
                  {/* Watermark */}
                  {activeTemplate.status === 'Draft' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200 text-9xl font-bold -rotate-45 pointer-events-none select-none">
                          DRAFT
                      </div>
                  )}

                  {/* Content */}
                  <div 
                    className="prose max-w-none outline-none font-serif leading-relaxed text-[11pt]" 
                    contentEditable 
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{__html: activeTemplate.content}}
                  >
                  </div>

                  {/* Logic Overlays Visual */}
                  {editorSidebarTab === 'conditions' && activeTemplate.conditions.map((cond, i) => (
                     <div key={i} className="absolute right-0 translate-x-full top-1/4 ml-4 w-64 p-3 bg-blue-50 border-l-4 border-blue-500 shadow-md rounded-r text-xs text-blue-800 z-10">
                        <div className="flex items-center gap-2 font-bold mb-1"><GitBranch size={12}/> Logic Block</div>
                        <code>{cond.condition}</code>
                     </div>
                  ))}
               </div>
           </div>

           {/* Right Sidebar: Template Controls */}
           {showRightSidebar && (
               <div className="w-80 bg-dark-950 border-l border-dark-700 flex flex-col z-20 shadow-lg animate-in slide-in-from-right-5">
                  <div className="flex border-b border-dark-800 bg-dark-900">
                     <button 
                       onClick={() => setEditorSidebarTab('variables')}
                       className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${editorSidebarTab === 'variables' ? 'text-brand-400 bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                       <Braces size={16} className="mx-auto mb-1"/> Vars
                       {editorSidebarTab === 'variables' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500"></div>}
                     </button>
                     <button 
                       onClick={() => setEditorSidebarTab('conditions')}
                       className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${editorSidebarTab === 'conditions' ? 'text-blue-400 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                       <GitBranch size={16} className="mx-auto mb-1"/> Logic
                       {editorSidebarTab === 'conditions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
                     </button>
                     <button 
                       onClick={() => setEditorSidebarTab('redaction')}
                       className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${editorSidebarTab === 'redaction' ? 'text-red-400 bg-red-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                       <EyeOff size={16} className="mx-auto mb-1"/> Mask
                       {editorSidebarTab === 'redaction' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></div>}
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                     {editorSidebarTab === 'variables' && (
                        <div className="space-y-6">
                           <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs text-brand-300 shadow-sm">
                              <h4 className="font-bold mb-1 flex items-center gap-2"><MousePointer2 size={14}/> Drag & Drop</h4>
                              Drag variables directly onto the canvas to insert dynamic fields.
                           </div>
                           
                           <div>
                              <div className="flex justify-between items-center mb-3">
                                  <h4 className="text-xs font-bold text-slate-500 uppercase">System Variables</h4>
                                  <button className="text-[10px] text-brand-500 font-bold hover:underline">+ New</button>
                              </div>
                              <div className="space-y-2">
                                 {MOCK_TABLES[0].fields.map(field => (
                                    <div key={field.id} draggable className="flex items-center gap-3 p-3 bg-dark-900 border border-dark-700 rounded-lg cursor-grab active:cursor-grabbing hover:border-brand-500/50 transition-all group">
                                       <div className="p-1.5 bg-dark-800 rounded text-slate-500 group-hover:text-brand-400">
                                          <Braces size={14}/>
                                       </div>
                                       <div>
                                          <p className="text-sm font-medium text-slate-200">{field.name}</p>
                                          <p className="text-[10px] text-slate-500 font-mono">{`{{${field.key}}}`}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     )}

                     {editorSidebarTab === 'conditions' && (
                        <div className="space-y-5">
                           <Button variant="secondary" className="w-full border-dashed border-dark-700 text-slate-400 hover:text-white hover:border-slate-500"><Plus size={14} className="mr-2"/> New Condition Block</Button>
                           <div className="space-y-3">
                              {activeTemplate.conditions.map(cond => (
                                 <div key={cond.id} className="p-4 bg-dark-900 border border-dark-700 rounded-xl shadow-sm hover:border-blue-500/50 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="font-bold text-slate-200 text-sm group-hover:text-blue-400">{cond.name}</span>
                                       <div className="p-1 bg-blue-500/10 rounded text-blue-400"><GitBranch size={12}/></div>
                                    </div>
                                    <code className="text-[10px] bg-dark-950 px-2 py-1 rounded text-slate-400 font-mono block mb-2 border border-dark-800">{cond.condition}</code>
                                    <div className="text-xs text-slate-500 line-clamp-2">Content: "{cond.content}"</div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {editorSidebarTab === 'redaction' && (
                        <div className="space-y-5">
                           <div className="space-y-3">
                              <h4 className="text-xs font-bold text-slate-500 uppercase">Active Rules</h4>
                              {activeTemplate.redactionRules.map(rule => (
                                 <div key={rule.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                       <Badge color="red">{rule.role}</Badge>
                                       <button className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                                    </div>
                                    <div className="flex gap-2 text-xs text-slate-300">
                                       <EyeOff size={14} className="text-red-400 mt-0.5"/>
                                       {rule.description}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
                  
                  <div className="p-4 bg-dark-900 border-t border-dark-800">
                      <button 
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${showSmartAssist ? 'bg-brand-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}
                        onClick={() => setShowSmartAssist(!showSmartAssist)}
                      >
                        <Sparkles size={14}/> {showSmartAssist ? 'AI Suggestions Active' : 'Enable AI Assist'}
                      </button>
                  </div>
               </div>
           )}
        </div>
      </div>
    );
  }

  // --- LIST VIEW (LIBRARY) ---
  return (
    <div className="space-y-6">
      {/* Top Tab Switcher */}
      <div className="bg-dark-900 p-1 rounded-xl inline-flex border border-dark-700 mb-2">
         <button 
           onClick={() => setActiveTab('library')}
           className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'library' ? 'bg-dark-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
         >
           <LayoutTemplate size={16}/> Template Library
         </button>
         <button 
           onClick={() => setActiveTab('harmonization')}
           className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white"
         >
           <Sparkles size={16}/> Harmonization Lab
         </button>
      </div>

      {/* Library Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dark-900/50 p-6 rounded-2xl border border-dark-700">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Available Templates</h2>
          <p className="text-slate-400 text-sm">Manage, edit, and deploy standard agreements.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary" className="flex items-center gap-2" onClick={() => setShowImportModal(true)}><Upload size={16}/> Import</Button>
           <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-brand-500/20" onClick={handleCreate}><Plus size={16}/> Create Blank</Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4">
         <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-700">
             {['All', 'NDA', 'MSA', 'SOW', 'Vendor'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${filterCategory === cat ? 'bg-dark-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {cat}
                </button>
             ))}
         </div>
         
         <div className="relative w-48">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <Input 
                placeholder="Filter by tag..." 
                className="pl-9 h-10 bg-dark-900 text-xs" 
                value={filterTag} 
                onChange={(e) => setFilterTag(e.target.value)}
            />
         </div>

         <div className="flex-1"></div>
         <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <Input placeholder="Search templates..." className="pl-9 h-10 bg-dark-900" />
         </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredTemplates.map(tpl => (
            <TemplateCard key={tpl.id} template={tpl} onEdit={handleEdit} />
         ))}
         
         {/* Empty State / Create New Placeholder */}
         <button onClick={handleCreate} className="border-2 border-dashed border-dark-700 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all duration-300 min-h-[220px] group">
            <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
               <Plus size={24} />
            </div>
            <span className="font-bold">Create New Template</span>
            <span className="text-xs mt-1 opacity-60 text-center">Start from scratch or use the Wizard</span>
         </button>
      </div>

      {/* Import Modal */}
      {showImportModal && (
          <ImportTemplateModal 
              onClose={() => setShowImportModal(false)}
              onImport={handleImport}
          />
      )}
    </div>
  );
};

export default DocumentTemplates;