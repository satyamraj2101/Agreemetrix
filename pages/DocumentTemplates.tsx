
import React, { useState } from 'react';
import { Card, Button, Input, Badge, Select } from '../components/UIComponents';
import { MOCK_TEMPLATES, MOCK_TABLES } from '../mock/data';
import { DocumentTemplate } from '../types';
import { 
  FileText, Plus, Upload, Search, LayoutTemplate, MoreVertical, 
  ChevronLeft, Save, Eye, Printer, Type, 
  Braces, GitBranch, EyeOff, Bold, Italic, Underline, AlignLeft,
  AlignCenter, AlignRight, List, MousePointer2, Sparkles,
  ArrowRightLeft, CheckCircle2, AlertTriangle, RefreshCw, Workflow,
  Check, Split, Merge, X, Cloud, ArrowRight, Layers, Wand2, ThumbsUp, Tag, Link as LinkIcon, MessageSquare
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

const DocumentTemplates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'harmonization'>('library');
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [activeTemplate, setActiveTemplate] = useState<DocumentTemplate | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterTag, setFilterTag] = useState('');

  // Editor State
  const [editorTab, setEditorTab] = useState<'variables' | 'conditions' | 'redaction' | 'comments'>('variables');
  const [showSmartAssist, setShowSmartAssist] = useState(false);

  // Harmonization State
  const [harmonizationStep, setHarmonizationStep] = useState<'upload' | 'analyzing' | 'review' | 'complete'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string}[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeClauseIndex, setActiveClauseIndex] = useState(0);

  // Mock Analysis Data
  const [analyzedClauses] = useState([
    {
        id: 'cl_1',
        title: 'Confidentiality Duration',
        description: 'Defines how long the parties must maintain secrecy.',
        variations: [
            { id: 'v1', source: 'US_Standard_NDA.docx', text: '...shall remain in effect for a period of two (2) years from the date of disclosure.', isSelected: false },
            { id: 'v2', source: 'EU_GDPR_NDA.docx', text: '...shall remain in effect for a period of five (5) years from the date of disclosure, or indefinitely for trade secrets.', isSelected: false },
            { id: 'v3', source: 'Vendor_Draft_v2.docx', text: '...shall remain in effect until the information becomes public knowledge.', isSelected: false }
        ],
        aiSuggestion: {
            text: 'The obligations of confidentiality shall remain in effect for a period of three (3) years from the date of disclosure; provided, however, that for any Trade Secrets, the obligations shall persist in perpetuity.',
            reasoning: 'Synthesized a balanced 3-year term (market standard) while adding perpetual protection for trade secrets found in the EU draft.',
            score: 98
        }
    },
    {
        id: 'cl_2',
        title: 'Governing Law',
        description: 'Determines which jurisdiction applies to disputes.',
        variations: [
            { id: 'v1', source: 'US_Standard_NDA.docx', text: 'Governed by the laws of the State of Delaware.', isSelected: false },
            { id: 'v2', source: 'EU_GDPR_NDA.docx', text: 'Governed by the laws of England and Wales.', isSelected: false }
        ],
        aiSuggestion: {
            text: 'This Agreement shall be governed by the laws of [Jurisdiction Variable], without regard to its conflict of laws principles.',
            reasoning: 'Detected conflicting jurisdictions. Recommended creating a dynamic variable [Jurisdiction] to handle multi-region workflows automatically.',
            score: 95
        }
    }
  ]);

  // Filter Logic
  const filteredTemplates = MOCK_TEMPLATES.filter(t => {
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

  const handleFileUpload = () => {
      // Simulate file upload
      const files = [
          { name: 'US_Standard_NDA.docx', size: '24 KB' },
          { name: 'EU_GDPR_NDA.docx', size: '28 KB' },
          { name: 'Vendor_Draft_v2.docx', size: '19 KB' }
      ];
      setUploadedFiles(files);
  };

  const startAnalysis = () => {
      setHarmonizationStep('analyzing');
      let progress = 0;
      const interval = setInterval(() => {
          progress += 2;
          setAnalysisProgress(progress);
          if (progress >= 100) {
              clearInterval(interval);
              setHarmonizationStep('review');
          }
      }, 50);
  };

  // --- EDITOR VIEW ---
  if (view === 'editor' && activeTemplate) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col -m-6 bg-[#F3F4F6] dark:bg-[#0B0F19] transition-colors">
        {/* Top Navigation Bar */}
        <div className="h-16 bg-white dark:bg-dark-950 border-b border-slate-200 dark:border-dark-700 flex items-center justify-between px-6 shadow-sm z-30">
           <div className="flex items-center gap-4">
              <button onClick={() => setView('list')} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                 <ChevronLeft size={20} />
              </button>
              <div>
                 <Input 
                    value={activeTemplate.name} 
                    onChange={(e) => setActiveTemplate({...activeTemplate, name: e.target.value})}
                    className="h-8 py-0 px-2 bg-transparent border-none hover:bg-slate-100 dark:hover:bg-white/5 focus:ring-0 text-lg font-bold w-96 text-slate-800 dark:text-white"
                 />
                 <div className="flex items-center gap-2 px-2 text-xs text-slate-500">
                    <Badge color={activeTemplate.status === 'Active' ? 'green' : 'yellow'}>{activeTemplate.status}</Badge>
                    <span>Last saved {activeTemplate.lastModified}</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-dark-950" title="You">HS</div>
                 <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-bold border-2 border-white dark:border-dark-950 opacity-50">+2</div>
              </div>
              <div className="h-8 w-px bg-slate-300 dark:bg-dark-700 mx-2"></div>
              <Button variant="secondary" className="h-9 text-xs gap-2 bg-white dark:bg-dark-900 border-slate-300 dark:border-dark-700"><Printer size={14}/> Print</Button>
              <Button variant="primary" className="h-9 text-xs gap-2 shadow-lg"><Save size={14}/> Save Changes</Button>
           </div>
        </div>

        {/* Toolbar */}
        <div className="h-12 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-dark-700 flex items-center justify-center px-4 gap-2 shadow-sm z-20 overflow-x-auto">
            <div className="flex items-center bg-slate-100 dark:bg-dark-800 p-1 rounded-lg">
                <button className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-brand-500 hover:bg-white dark:hover:bg-white/10 rounded transition-all"><Bold size={16}/></button>
                <button className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-brand-500 hover:bg-white dark:hover:bg-white/10 rounded transition-all"><Italic size={16}/></button>
                <button className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-brand-500 hover:bg-white dark:hover:bg-white/10 rounded transition-all"><Underline size={16}/></button>
            </div>
            <div className="w-px h-6 bg-slate-300 dark:bg-dark-700"></div>
            <div className="flex items-center bg-slate-100 dark:bg-dark-800 p-1 rounded-lg">
                <button className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-brand-500 hover:bg-white dark:hover:bg-white/10 rounded transition-all"><AlignLeft size={16}/></button>
                <button className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-brand-500 hover:bg-white dark:hover:bg-white/10 rounded transition-all"><AlignCenter size={16}/></button>
                <button className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-brand-500 hover:bg-white dark:hover:bg-white/10 rounded transition-all"><AlignRight size={16}/></button>
            </div>
            <div className="w-px h-6 bg-slate-300 dark:bg-dark-700"></div>
            <Select options={[{label: 'Paragraph', value: 'p'}, {label: 'Heading 1', value: 'h1'}, {label: 'Heading 2', value: 'h2'}]} className="w-32 h-8 text-xs bg-slate-100 dark:bg-dark-800 border-none" />
            <div className="w-px h-6 bg-slate-300 dark:bg-dark-700"></div>
            <button 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showSmartAssist ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-brand-500'}`}
                onClick={() => setShowSmartAssist(!showSmartAssist)}
            >
                <Sparkles size={14}/> Smart Assist
            </button>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
           {/* Center: Document Canvas */}
           <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#F3F4F6] dark:bg-[#0B0F19]">
               {/* Paper Page */}
               <div className="w-[816px] min-h-[1056px] bg-white text-black shadow-2xl my-4 p-[96px] relative transition-transform hover:scale-[1.005] duration-500">
                  {/* Watermark / Status */}
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

                  {/* Logic Overlays */}
                  {editorTab === 'conditions' && activeTemplate.conditions.map((cond, i) => (
                     <div key={i} className="absolute right-0 translate-x-full top-1/4 ml-4 w-64 p-3 bg-blue-50 border-l-4 border-blue-500 shadow-md rounded-r text-xs text-blue-800 z-10">
                        <div className="flex items-center gap-2 font-bold mb-1"><GitBranch size={12}/> Logic Block</div>
                        <code>{cond.condition}</code>
                        <p className="mt-1 opacity-80">Shows: "{cond.name}"</p>
                        {/* Connector Line */}
                        <div className="absolute top-4 -left-4 w-4 h-px bg-blue-500"></div>
                     </div>
                  ))}
               </div>
           </div>

           {/* Right Sidebar: Smart Tools */}
           <div className="w-80 bg-white dark:bg-dark-900 border-l border-slate-200 dark:border-dark-700 flex flex-col z-20 shadow-lg">
              <div className="flex border-b border-slate-200 dark:border-dark-700">
                 <button 
                   onClick={() => setEditorTab('variables')}
                   className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${editorTab === 'variables' ? 'border-brand-500 text-brand-500 bg-brand-50' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                 >
                   <Braces size={16} className="mx-auto mb-1"/> Vars
                 </button>
                 <button 
                   onClick={() => setEditorTab('conditions')}
                   className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${editorTab === 'conditions' ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                 >
                   <GitBranch size={16} className="mx-auto mb-1"/> Logic
                 </button>
                 <button 
                   onClick={() => setEditorTab('redaction')}
                   className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${editorTab === 'redaction' ? 'border-red-500 text-red-500 bg-red-50' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                 >
                   <EyeOff size={16} className="mx-auto mb-1"/> Mask
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50 dark:bg-dark-900/50">
                 {editorTab === 'variables' && (
                    <div className="space-y-6">
                       <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs text-brand-600 dark:text-brand-300 shadow-sm">
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
                                <div key={field.id} draggable className="flex items-center gap-3 p-3 bg-white dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-lg cursor-grab active:cursor-grabbing hover:border-brand-500 hover:shadow-md transition-all group">
                                   <div className="p-1.5 bg-slate-100 dark:bg-dark-800 rounded text-slate-500 group-hover:text-brand-500">
                                      <Braces size={14}/>
                                   </div>
                                   <div>
                                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{field.name}</p>
                                      <p className="text-[10px] text-slate-400 font-mono">{`{{${field.key}}}`}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {editorTab === 'conditions' && (
                    <div className="space-y-5">
                       <Button variant="secondary" className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"><Plus size={14} className="mr-2"/> New Condition Block</Button>
                       <div className="space-y-3">
                          {activeTemplate.conditions.map(cond => (
                             <div key={cond.id} className="p-4 bg-white dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-xl shadow-sm hover:border-blue-500 transition-all cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                   <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{cond.name}</span>
                                   <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-500"><GitBranch size={12}/></div>
                                </div>
                                <code className="text-[10px] bg-slate-100 dark:bg-dark-800 px-2 py-1 rounded text-slate-500 font-mono block mb-2 border border-slate-200 dark:border-dark-700">{cond.condition}</code>
                                <div className="text-xs text-slate-400 line-clamp-2">Content: "{cond.content}"</div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {editorTab === 'redaction' && (
                    <div className="space-y-5">
                       <div className="flex flex-wrap gap-2">
                          <button className="px-3 py-1.5 bg-white dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-full text-xs text-slate-600 hover:border-red-500 hover:text-red-500 transition-colors">Financials</button>
                          <button className="px-3 py-1.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-full text-xs text-slate-600 hover:border-red-500 hover:text-red-500 transition-colors">PII Data</button>
                          <button className="px-3 py-1.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-full text-xs text-slate-600 hover:border-red-500 hover:text-red-500 transition-colors">Trade Secrets</button>
                       </div>
                       
                       <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-500 uppercase">Active Rules</h4>
                          {activeTemplate.redactionRules.map(rule => (
                             <div key={rule.id} className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                   <Badge color="red">{rule.role}</Badge>
                                   <button className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                                </div>
                                <div className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
                                   <EyeOff size={14} className="text-red-500 mt-0.5"/>
                                   {rule.description}
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
              
              {/* Smart Assist Footer */}
              {showSmartAssist && (
                  <div className="p-4 bg-gradient-to-b from-white to-purple-50 dark:from-dark-900 dark:to-dark-950 border-t border-slate-200 dark:border-dark-700">
                      <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wide">
                          <Sparkles size={12}/> AI Suggestions
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                          "Consider adding a <strong>Force Majeure</strong> clause given the multi-region nature of this agreement."
                      </div>
                      <Button variant="primary" className="w-full text-xs h-8 bg-purple-600 hover:bg-purple-700 border-none shadow-md">Apply Suggestion</Button>
                  </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  // --- HARMONIZATION VIEW (TAB) ---
  if (activeTab === 'harmonization') {
     return (
        <div className="h-[calc(100vh-8rem)] flex flex-col -mx-6 px-6">
           {/* Harmonization Header */}
           <div className="flex justify-between items-end mb-8 py-6 border-b border-white/10">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <Badge color="brand" className="shadow-[0_0_10px_rgba(var(--color-brand-500),0.3)]">AI Lab</Badge>
                    <span className="text-slate-500 text-sm font-medium">Template Engineering</span>
                 </div>
                 <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Harmonization Engine</h2>
                 <p className="text-slate-400 max-w-2xl">Upload legacy contracts or disparate templates to synthesize a "Golden Standard" master agreement using semantic analysis.</p>
              </div>
              
              {harmonizationStep !== 'upload' && (
                  <Button variant="ghost" onClick={() => { setHarmonizationStep('upload'); setUploadedFiles([]); setAnalysisProgress(0); }} className="text-xs">
                      <RefreshCw size={14} className="mr-2"/> Reset Project
                  </Button>
              )}
           </div>

            {/* Step 1: Upload */}
           {harmonizationStep === 'upload' && (
              <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95">
                 <div className="w-full max-w-2xl">
                    <div 
                        onClick={handleFileUpload}
                        className="border-2 border-dashed border-dark-700 hover:border-brand-500/50 bg-dark-900/50 hover:bg-brand-500/5 rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-2xl group-hover:shadow-brand-500/20 z-10">
                            <Upload size={36} className="text-slate-400 group-hover:text-brand-400 transition-colors"/>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 z-10">Drop Legacy Templates Here</h3>
                        <p className="text-slate-400 text-center max-w-md mb-8 z-10 leading-relaxed">
                            Upload 3-5 variations of a contract type (e.g., "US NDA", "EU NDA", "Vendor Paper") to extract the best clauses.
                        </p>
                        <Button variant="secondary" className="z-10 px-8">Browse Files</Button>
                    </div>

                    {uploadedFiles.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Layers size={14}/> Staging Area ({uploadedFiles.length})
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                                {uploadedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-dark-900 border border-dark-700 rounded-xl animate-in slide-in-from-bottom-2 shadow-sm" style={{animationDelay: `${idx * 100}ms`}}>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20"><FileText size={18}/></div>
                                            <div>
                                                <p className="text-sm text-white font-bold">{file.name}</p>
                                                <p className="text-xs text-slate-500">{file.size} • Word Document</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-red-400 transition-colors"><X size={18}/></button>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4">
                                <Button variant="primary" className="w-full py-4 text-lg shadow-xl shadow-brand-500/20 rounded-xl font-bold" onClick={startAnalysis}>
                                    <Sparkles size={20} className="mr-3"/> Begin Harmonization
                                </Button>
                            </div>
                        </div>
                    )}
                 </div>
              </div>
           )}

           {/* Step 2: Analyzing */}
           {harmonizationStep === 'analyzing' && (
              <div className="flex-1 flex flex-col items-center justify-center bg-dark-900/30 border border-dark-700 rounded-3xl relative overflow-hidden">
                 <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                 </div>

                 <div className="relative z-10 flex flex-col items-center max-w-md text-center">
                    <div className="w-32 h-32 mb-10 relative">
                         <svg className="w-full h-full" viewBox="0 0 100 100">
                             <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="6" />
                             <circle cx="50" cy="50" r="45" fill="none" stroke="#14b8a6" strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (283 * analysisProgress / 100)} transform="rotate(-90 50 50)" className="transition-all duration-100 ease-linear drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-3xl font-bold text-white">{analysisProgress}%</span>
                             <span className="text-[10px] text-brand-400 font-bold uppercase tracking-widest mt-1">Processing</span>
                         </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Synthesizing Logic...</h3>
                    <p className="text-slate-400 text-base mb-12 leading-relaxed">
                        Our AI is comparing clause variations, identifying semantic conflicts, and constructing an optimal master template structure.
                    </p>
                    
                    <div className="w-full space-y-3">
                        {['Confidentiality Duration', 'Indemnification Cap', 'Governing Law Jurisdiction', 'Termination Rights'].map((clause, i) => (
                            <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${analysisProgress > (i+1)*25 ? 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-dark-950 border-dark-800 text-slate-600'}`}>
                                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-3">
                                   {analysisProgress > (i+1)*25 ? <CheckCircle2 size={16}/> : <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-transparent animate-spin"></div>}
                                   {clause}
                                </span>
                                {analysisProgress > (i+1)*25 && <span className="text-[10px] font-bold bg-green-500/20 px-2 py-1 rounded">DONE</span>}
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
           )}

           {/* Step 3: Review & Harmonize */}
           {harmonizationStep === 'review' && (
              <div className="flex-1 flex gap-6 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                  {/* Sidebar: Clause List */}
                  <div className="w-96 flex flex-col bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="p-5 border-b border-dark-700 bg-dark-950">
                          <h4 className="font-bold text-white flex items-center gap-2"><List size={18} className="text-brand-400"/> Detected Conflicts</h4>
                          <p className="text-xs text-slate-500 mt-1">Review AI suggestions to resolve variations.</p>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar">
                          {analyzedClauses.map((clause, idx) => (
                              <button 
                                key={clause.id}
                                onClick={() => setActiveClauseIndex(idx)}
                                className={`w-full text-left p-5 border-b border-dark-800 transition-all hover:bg-white/5 relative group ${activeClauseIndex === idx ? 'bg-brand-500/10 border-l-4 border-l-brand-500' : 'border-l-4 border-l-transparent'}`}
                              >
                                  <div className="flex justify-between items-start mb-1">
                                     <h5 className={`font-bold text-sm ${activeClauseIndex === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{clause.title}</h5>
                                     <Badge color="yellow" className="text-[9px] px-1.5 py-0.5">Needs Review</Badge>
                                  </div>
                                  <p className="text-xs text-slate-500 truncate mt-1 leading-relaxed pr-4">{clause.description}</p>
                                  <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-600">
                                     <Layers size={12}/> {clause.variations.length} Source Variations
                                  </div>
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Main: Comparison Area */}
                  <div className="flex-1 flex flex-col bg-dark-950 border border-dark-700 rounded-2xl overflow-hidden shadow-2xl">
                      {/* Clause Header */}
                      <div className="p-8 border-b border-dark-700 bg-dark-900/50 flex justify-between items-start">
                          <div>
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500 text-xs font-bold flex items-center gap-2">
                                     <AlertTriangle size={12}/> Conflict Detected
                                  </div>
                                  <span className="text-slate-500 text-xs font-mono uppercase">Clause {activeClauseIndex + 1} / {analyzedClauses.length}</span>
                              </div>
                              <h3 className="text-3xl font-bold text-white mb-2">{analyzedClauses[activeClauseIndex].title}</h3>
                              <p className="text-slate-400 text-sm max-w-2xl">{analyzedClauses[activeClauseIndex].description}</p>
                          </div>
                          <div className="flex gap-3">
                              <Button variant="secondary" disabled={activeClauseIndex === 0} onClick={() => setActiveClauseIndex(prev => prev - 1)}>Previous</Button>
                              <Button variant="primary" onClick={() => activeClauseIndex < analyzedClauses.length - 1 ? setActiveClauseIndex(prev => prev + 1) : setHarmonizationStep('complete')}>
                                  {activeClauseIndex < analyzedClauses.length - 1 ? 'Accept & Next' : 'Finalize Template'} <ArrowRight size={16} className="ml-2"/>
                              </Button>
                          </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F19]">
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl mx-auto">
                              {/* AI Suggestion (Golden Standard) */}
                              <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-bold text-brand-400 uppercase tracking-wider flex items-center gap-2">
                                          <Sparkles size={16}/> AI Golden Standard
                                      </h4>
                                      <div className="bg-brand-500/20 text-brand-400 text-xs font-bold px-2 py-1 rounded border border-brand-500/30">98% Score</div>
                                  </div>
                                  
                                  <div className="bg-gradient-to-br from-brand-900/20 to-dark-900 border border-brand-500/40 rounded-2xl p-8 relative group cursor-pointer shadow-[0_0_30px_rgba(var(--color-brand-500),0.1)] hover:shadow-[0_0_40px_rgba(var(--color-brand-500),0.15)] transition-all ring-2 ring-brand-500">
                                      <div className="absolute top-4 right-4 opacity-100 transition-opacity">
                                          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg">
                                              <Check size={18} strokeWidth={3}/>
                                          </div>
                                      </div>
                                      <p className="text-white leading-relaxed font-serif text-lg mb-6">
                                          "{analyzedClauses[activeClauseIndex].aiSuggestion.text}"
                                      </p>
                                      <div className="bg-dark-950/80 p-4 rounded-xl border border-brand-500/20 text-sm text-brand-100/80 leading-relaxed backdrop-blur-sm">
                                          <strong className="text-brand-400 block mb-1 text-xs uppercase">AI Reasoning</strong> 
                                          {analyzedClauses[activeClauseIndex].aiSuggestion.reasoning}
                                      </div>
                                  </div>
                              </div>

                              {/* Source Variations */}
                              <div className="space-y-4">
                                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                      <Layers size={16}/> Source Variations
                                  </h4>
                                  <div className="space-y-4">
                                      {analyzedClauses[activeClauseIndex].variations.map((v) => (
                                          <div key={v.id} className="p-6 rounded-2xl bg-dark-900 border border-dark-700 hover:border-slate-500 cursor-pointer transition-all group relative opacity-70 hover:opacity-100">
                                              <div className="flex justify-between mb-3">
                                                  <span className="text-xs font-bold text-slate-400 bg-dark-800 px-2 py-1 rounded">{v.source}</span>
                                              </div>
                                              <p className="text-sm text-slate-300 font-serif leading-relaxed">
                                                  "{v.text}"
                                              </p>
                                              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none flex items-center justify-center">
                                                  <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">Select This Version</span>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
           )}

           {/* Step 4: Complete */}
           {harmonizationStep === 'complete' && (
               <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95">
                   <div className="bg-dark-900 border border-dark-700 rounded-3xl p-16 max-w-3xl text-center shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-brand-600"></div>
                       <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>
                       
                       <div className="w-28 h-28 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 ring-1 ring-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                           <Wand2 size={48} />
                       </div>
                       
                       <h2 className="text-4xl font-bold text-white mb-4">Harmonization Complete!</h2>
                       <p className="text-slate-400 mb-10 text-lg max-w-lg mx-auto leading-relaxed">
                           You have successfully engineered a unified master template. 
                           All conflicts have been resolved and the new standard is ready for deployment.
                       </p>
                       
                       <div className="grid grid-cols-2 gap-6 mb-10 bg-dark-950 p-8 rounded-2xl border border-dark-800 text-left">
                           <div>
                               <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Template Name</label>
                               <Input defaultValue="Master Harmonized NDA v1.0" className="w-full" />
                           </div>
                           <div>
                               <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Contract Category</label>
                               <Select options={[{label: 'NDA', value: 'NDA'}, {label: 'MSA', value: 'MSA'}]} className="w-full" />
                           </div>
                           <div className="col-span-2">
                               <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Auto-Tagging</label>
                               <div className="flex flex-wrap gap-2">
                                   <Badge color="blue">Harmonized</Badge>
                                   <Badge color="green">Standard</Badge>
                                   <Badge color="gray">v1.0</Badge>
                                   <button className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"><Plus size={12}/> Add Tag</button>
                               </div>
                           </div>
                       </div>

                       <div className="flex gap-4 justify-center">
                           <Button variant="secondary" className="py-3 px-6" onClick={() => { setView('list'); setActiveTab('library'); }}>Save to Library</Button>
                           <Button variant="primary" className="py-3 px-8 shadow-lg shadow-brand-500/20 text-base" onClick={() => { setActiveTemplate(MOCK_TEMPLATES[0]); setView('editor'); }}>
                               <Eye size={18} className="mr-2"/> Open in Editor
                           </Button>
                       </div>
                   </div>
               </div>
           )}
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
           <Button variant="secondary" className="flex items-center gap-2"><Upload size={16}/> Import</Button>
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
    </div>
  );
};

export default DocumentTemplates;
