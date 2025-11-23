
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, Select } from '../components/UIComponents';
import { MOCK_TEMPLATES, MOCK_COMMENTS as INITIAL_COMMENTS, MOCK_CHANGES, MOCK_VARIABLES } from '../mock/data';
import { DocumentTemplate } from '../types';
import { 
  FileText, Plus, ChevronLeft, Save, Printer, List, History, 
  BookOpen, Braces, MessageSquare, Shield, Workflow, Sparkles,
  AlertTriangle, UserPlus, Minimize2, Maximize2, RefreshCw,
  PenTool, GitBranch, Eye
} from 'lucide-react';

// Imports from extracted files
import { EditorToolbar, RibbonTabType } from '../components/editor/EditorToolbar';
import { StructurePanel, ReviewPanel, CompliancePanel, AIPanel, LogicPanel, GovernancePanel } from '../components/editor/EditorPanels';
import { LayoutSettingsModal } from '../components/editor/EditorUI';

// TipTap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ExtensionBubbleMenu from '@tiptap/extension-bubble-menu';
import ExtensionFloatingMenu from '@tiptap/extension-floating-menu';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';
import TiptapTable from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import SubscriptExtension from '@tiptap/extension-subscript';
import SuperscriptExtension from '@tiptap/extension-superscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import FontFamily from '@tiptap/extension-font-family';

// --- TYPES ---

type EditorMode = 'editing' | 'suggesting' | 'viewing' | 'diff';
type LeftTab = 'structure' | 'variables' | 'assets' | 'history';
type RightTab = 'review' | 'logic' | 'compliance' | 'ai' | 'settings' | 'governance';

// --- MAIN EDITOR COMPONENT ---

const TemplateEditor: React.FC<{ template: DocumentTemplate; onSave: (t: DocumentTemplate) => void; onBack: () => void }> = ({ template, onSave, onBack }) => {
  // UI State
  const [ribbonTab, setRibbonTab] = useState<RibbonTabType>('home');
  const [leftTab, setLeftTab] = useState<LeftTab>('structure');
  const [rightTab, setRightTab] = useState<RightTab>('review');
  const [mode, setMode] = useState<EditorMode>('editing');
  const [activeCollaborators] = useState([
      { id: 'u1', name: 'Harvey S.', color: '#3b82f6' },
      { id: 'u2', name: 'Mike R.', color: '#10b981' }
  ]);

  // --- EDITOR CONFIG STATE ---
  const [zoom, setZoom] = useState(100);
  const [showRuler, setShowRuler] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [trackChanges, setTrackChanges] = useState(false);
  const [redactionMode, setRedactionMode] = useState(false);
  const [viewMode, setViewMode] = useState<'print' | 'web' | 'focus'>('print');
  
  // Force update for toolbar state sync
  const [, setUpdateTick] = useState(0);

  // Layout State (Managed here but controlled via toolbar)
  const [margins, setMargins] = useState({ top: 96, bottom: 96, left: 96, right: 96 });
  const [watermark, setWatermark] = useState<string>('');

  // Data State
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [changes] = useState(MOCK_CHANGES);
  const [outline, setOutline] = useState<string[]>([]);
  const [content] = useState(template?.content || '');

  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Editor Init
  const editor = useEditor({
    extensions: [
      StarterKit, 
      TextStyle as any, 
      Color,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start drafting...' }),
      ExtensionBubbleMenu, 
      ExtensionFloatingMenu,
      UnderlineExtension,
      Highlight.configure({ multicolor: true }),
      SubscriptExtension,
      SuperscriptExtension,
      (TiptapTable as any).configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: content,
    editable: mode !== 'viewing',
    onUpdate: ({ editor }) => {
        try {
            const json = editor.getJSON();
            if (json && Array.isArray(json.content)) {
                const headers: string[] = [];
                json.content.forEach((node) => {
                    if (node && node.type === 'heading') {
                        const contentArr = node.content;
                        if (Array.isArray(contentArr) && contentArr.length > 0) {
                            const firstChild = contentArr[0];
                            if (firstChild && (firstChild as any).text) {
                                headers.push((firstChild as any).text);
                            } else {
                                headers.push('Untitled Section');
                            }
                        } else {
                            headers.push('Untitled Section');
                        }
                    }
                });
                setOutline(headers);
            } else {
                setOutline([]);
            }
        } catch (e) {
            console.warn('Editor update parsing warning:', e);
            setOutline([]);
        }
        setUpdateTick(t => t + 1);
    },
    onSelectionUpdate: () => {
        setUpdateTick(t => t + 1);
    },
    onTransaction: () => {
        setUpdateTick(t => t + 1);
    }
  });

  // Actions passed to Toolbar
  const editorActions = {
      setZoom,
      toggleRuler: () => setShowRuler(!showRuler),
      toggleGrid: () => setShowGrid(!showGrid),
      toggleDarkMode: () => setDarkMode(!darkMode),
      toggleTrackChanges: () => setTrackChanges(!trackChanges),
      toggleRedaction: () => setRedactionMode(!redactionMode),
      setViewMode,
      addComment: () => {
          const newComment = {
              id: `c_${Date.now()}`,
              user: 'Harvey Specter',
              text: 'New comment on this section...',
              date: 'Just now',
              resolved: false,
              replies: []
          };
          setComments([newComment, ...comments]);
          setRightTab('review');
      },
      runGovernance: () => {
          setRightTab('governance');
      },
      exportDoc: () => {
          alert('Exporting document...');
      },
      onAction: (action: string) => {
          if (action === 'margins') setActiveModal('margins');
          if (action === 'watermark') setActiveModal('watermark');
          if (action === 'open_clause_library') setLeftTab('assets');
          if (action === 'open_variables') setLeftTab('variables');
      }
  };

  // Sync Ribbon Tab with Right Panel
  useEffect(() => {
      if (ribbonTab === 'review') setRightTab('review');
      if (ribbonTab === 'governance') setRightTab('governance');
  }, [ribbonTab]);

  if (!template) return null;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -m-6 bg-[#0B0E14] text-slate-200 overflow-hidden font-sans selection:bg-brand-500/30">
       
       {/* 1. COMMAND BAR */}
       <div className="h-14 bg-dark-950 border-b border-dark-700 flex items-center justify-between px-4 shrink-0 z-30 shadow-md">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronLeft size={18}/></button>
             <div>
                <div className="flex items-center gap-2">
                   <span className="font-bold text-white text-sm">{template.name}</span>
                   <Badge color={template.status === 'Active' ? 'green' : 'yellow'}>{template.status}</Badge>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                   <span>v{template.version}</span>
                   <span>•</span>
                   <span>Last saved {template.lastModified}</span>
                </div>
             </div>
          </div>

          {/* Center Actions: Mode & Collaboration */}
          <div className="flex items-center gap-4">
             <div className="flex items-center bg-dark-900 rounded-lg p-1 border border-dark-700">
                 {[
                     {id: 'editing', label: 'Editing', icon: PenTool},
                     {id: 'suggesting', label: 'Suggesting', icon: GitBranch},
                     {id: 'viewing', label: 'Viewing', icon: Eye},
                 ].map(m => (
                     <button 
                        key={m.id}
                        onClick={() => setMode(m.id as EditorMode)}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all ${mode === m.id ? 'bg-dark-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                         <m.icon size={12}/> {m.label}
                     </button>
                 ))}
             </div>
             
             <div className="h-6 w-px bg-dark-800"></div>

             {/* Avatars */}
             <div className="flex items-center -space-x-2">
                 {activeCollaborators.map(u => (
                     <div key={u.id} className="w-8 h-8 rounded-full border-2 border-dark-950 bg-dark-800 flex items-center justify-center text-xs font-bold text-white relative group cursor-pointer" style={{backgroundColor: u.color}}>
                         {u.name.charAt(0)}
                         <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-dark-950 rounded-full"></span>
                     </div>
                 ))}
                 <button className="w-8 h-8 rounded-full border-2 border-dark-950 bg-dark-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-dark-700 transition-colors">
                     <UserPlus size={14}/>
                 </button>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="secondary" className="h-8 text-xs"><Printer size={14} className="mr-2"/> Print</Button>
             <Button variant="primary" className="h-8 text-xs shadow-lg shadow-brand-500/20" onClick={() => onSave(template)}>
                <Save size={14} className="mr-2"/> Publish
             </Button>
          </div>
       </div>

       {/* 2. RIBBON TOOLBAR (EXTRACTED) */}
       <EditorToolbar 
          editor={editor} 
          activeTab={ribbonTab} 
          onTabChange={setRibbonTab}
          state={{ zoom, showRuler, showGrid, darkMode, trackChanges, redactionMode, viewMode }}
          actions={editorActions}
       />

       {/* 3. WORKSPACE GRID */}
       <div className="flex-1 flex overflow-hidden relative">
          
          {/* LEFT RAIL */}
          <div className="w-64 bg-dark-950 border-r border-dark-800 flex flex-col z-20 shrink-0">
             <div className="flex border-b border-dark-800 bg-dark-900">
                <button onClick={() => setLeftTab('structure')} className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${leftTab === 'structure' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white'}`} title="Outline"><List size={16}/></button>
                <button onClick={() => setLeftTab('variables')} className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${leftTab === 'variables' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white'}`} title="Variables"><Braces size={16}/></button>
                <button onClick={() => setLeftTab('assets')} className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${leftTab === 'assets' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white'}`} title="Clauses"><BookOpen size={16}/></button>
                <button onClick={() => setLeftTab('history')} className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${leftTab === 'history' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white'}`} title="History"><History size={16}/></button>
             </div>
             <div className="flex-1 overflow-hidden relative">
                {leftTab === 'structure' && <StructurePanel editor={editor} outline={outline} />}
                {leftTab === 'variables' && <div className="p-4 text-slate-500 text-xs text-center">Variable Panel Mock</div>}
                {leftTab === 'assets' && <div className="p-4 text-slate-500 text-xs text-center">Assets Panel Mock</div>}
                {leftTab === 'history' && <div className="p-4 text-xs text-slate-500 text-center mt-10">Version history list...</div>}
             </div>
          </div>

          {/* CENTER: Editor Canvas */}
          <div className="flex-1 bg-dark-900/30 relative flex flex-col overflow-hidden">
             
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex justify-center relative" onClick={() => editor?.commands.focus()}>
                <div 
                   className={`bg-white text-black shadow-2xl transition-transform duration-200 ease-out origin-top mb-20 relative 
                     ${mode === 'suggesting' ? 'ring-4 ring-green-500/20' : ''}
                     ${redactionMode ? 'redaction-active' : ''}
                     ${darkMode ? 'invert hue-rotate-180' : ''}
                   `}
                   style={{ 
                       width: viewMode === 'web' ? '100%' : '816px', 
                       minHeight: '1056px', 
                       paddingTop: `${margins.top}px`,
                       paddingBottom: `${margins.bottom}px`,
                       paddingLeft: `${margins.left}px`,
                       paddingRight: `${margins.right}px`,
                       transform: `scale(${zoom / 100})`,
                       marginTop: viewMode === 'focus' ? '0' : undefined
                   }}
                >
                   {/* Watermark */}
                   {watermark && (
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                           <div className="text-9xl font-black text-slate-200 opacity-50 -rotate-45 select-none uppercase whitespace-nowrap transform scale-150">
                               {watermark}
                           </div>
                       </div>
                   )}

                   {/* Ruler Mock */}
                   {showRuler && viewMode === 'print' && (
                       <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 border-b border-gray-300 flex items-end px-[96px]">
                           <div className="w-full h-1/2 flex justify-between">
                               {Array.from({length: 20}).map((_, i) => (
                                   <div key={i} className="w-px h-full bg-gray-400"></div>
                               ))}
                           </div>
                       </div>
                   )}

                   {/* Grid Overlay */}
                   {showGrid && (
                       <div className="absolute inset-0 pointer-events-none z-50" style={{backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                   )}

                   {/* Tiptap Editor */}
                   <div className="relative z-10 h-full">
                       <EditorContent editor={editor} className="prose prose-slate max-w-none focus:outline-none h-full" />
                   </div>
                </div>
             </div>
             
             {/* Zoom Controls Overlay */}
             <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-dark-900/90 backdrop-blur border border-dark-700 rounded-full p-1 shadow-xl z-20">
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"><Minimize2 size={14}/></button>
                <span className="text-xs font-mono w-10 text-center text-slate-300">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"><Maximize2 size={14}/></button>
             </div>
             
             {/* Stats Overlay */}
             <div className="absolute bottom-6 right-6 flex items-center gap-4">
                 <div className="text-[10px] text-slate-500 font-mono bg-dark-950/80 px-3 py-1 rounded-full border border-dark-800 backdrop-blur flex items-center gap-2">
                    <span>{editor?.storage?.characterCount?.words?.() || 0} words</span>
                    <span className="w-px h-3 bg-dark-700"></span>
                    <span>~{Math.ceil((editor?.getText().length || 0) / 3000) || 1} pages</span>
                 </div>
                 <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 bg-dark-950/80 px-3 py-1 rounded-full border border-dark-800 backdrop-blur">
                    <RefreshCw size={10} className="animate-spin"/> Autosaving...
                 </div>
             </div>
          </div>

          {/* RIGHT RAIL */}
          <div className="w-80 bg-dark-900 border-l border-dark-800 flex flex-col z-20 shrink-0 shadow-xl">
             <div className="flex border-b border-dark-800 bg-dark-900">
                {[
                   {id: 'review', icon: MessageSquare},
                   {id: 'logic', icon: Workflow},
                   {id: 'compliance', icon: Shield},
                   {id: 'ai', icon: Sparkles},
                   {id: 'governance', icon: AlertTriangle},
                ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setRightTab(tab.id as RightTab)}
                     className={`flex-1 py-3 flex items-center justify-center transition-all border-b-2 ${rightTab === tab.id ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                   >
                      <tab.icon size={18}/>
                   </button>
                ))}
             </div>

             <div className="flex-1 overflow-hidden relative bg-dark-950">
                {rightTab === 'review' && <ReviewPanel comments={comments} changes={changes} onAddComment={editorActions.addComment} />}
                {rightTab === 'logic' && <LogicPanel />}
                {rightTab === 'compliance' && <CompliancePanel />}
                {rightTab === 'ai' && <AIPanel />}
                {rightTab === 'governance' && <GovernancePanel />}
             </div>
          </div>
       </div>

       {/* --- MODALS --- */}
       <LayoutSettingsModal 
            isOpen={activeModal === 'watermark'} 
            onClose={() => setActiveModal(null)} 
            title="Watermark Settings"
            onApply={() => setActiveModal(null)}
        >
           <div className="space-y-4">
               <Input label="Text" placeholder="CONFIDENTIAL" value={watermark} onChange={(e) => setWatermark(e.target.value)} />
               <div className="grid grid-cols-2 gap-4">
                   <Select label="Color" options={[{label:'Gray', value:'gray'}, {label:'Red', value:'red'}]} />
                   <Select label="Opacity" options={[{label:'25%', value:'25'}, {label:'50%', value:'50'}]} />
               </div>
           </div>
       </LayoutSettingsModal>

       <LayoutSettingsModal isOpen={activeModal === 'margins'} onClose={() => setActiveModal(null)} title="Custom Margins" onApply={() => setActiveModal(null)}>
           <div className="grid grid-cols-2 gap-4">
               <Input label="Top (px)" type="number" value={margins.top} onChange={(e) => setMargins({...margins, top: parseInt(e.target.value)})} />
               <Input label="Bottom (px)" type="number" value={margins.bottom} onChange={(e) => setMargins({...margins, bottom: parseInt(e.target.value)})} />
               <Input label="Left (px)" type="number" value={margins.left} onChange={(e) => setMargins({...margins, left: parseInt(e.target.value)})} />
               <Input label="Right (px)" type="number" value={margins.right} onChange={(e) => setMargins({...margins, right: parseInt(e.target.value)})} />
           </div>
       </LayoutSettingsModal>

       <style>{`
         .redaction-active .prose {
             color: transparent;
             text-shadow: 0 0 8px rgba(0,0,0,0.5);
         }
         .page-break {
             page-break-after: always;
             height: 1px;
             border-bottom: 1px dashed #ccc;
             margin: 20px 0;
             display: flex;
             align-items: center;
             justify-content: center;
         }
         .page-break::after {
             content: 'PAGE BREAK';
             background: #eee;
             color: #999;
             font-size: 10px;
             padding: 2px 6px;
             border-radius: 4px;
         }
       `}</style>
    </div>
  );
};

const DocumentTemplates: React.FC = () => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);

  const handleEdit = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setView('editor');
  };

  const handleCreate = () => {
    const newTemplate: DocumentTemplate = {
      id: `tpl_${Date.now()}`,
      name: 'Untitled Template',
      category: 'General',
      version: '1.0',
      lastModified: 'Just now',
      status: 'Draft',
      content: '<p>Start typing...</p>',
      variables: [],
      conditions: [],
      redactionRules: []
    };
    setSelectedTemplate(newTemplate);
    setView('editor');
  };

  const handleSave = (updatedTemplate: DocumentTemplate) => {
    if (templates.find(t => t.id === updatedTemplate.id)) {
      setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    } else {
      setTemplates([...templates, updatedTemplate]);
    }
    setView('list');
    setSelectedTemplate(null);
  };

  if (view === 'editor' && selectedTemplate) {
    return (
      <TemplateEditor 
        key={selectedTemplate.id} 
        template={selectedTemplate} 
        onSave={handleSave} 
        onBack={() => { setView('list'); setSelectedTemplate(null); }} 
      />
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Document Templates</h2>
                <p className="text-slate-400">Manage standard legal agreements and clauses.</p>
            </div>
            <Button variant="primary" onClick={handleCreate} className="flex items-center gap-2"><Plus size={16}/> New Template</Button>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map(t => (
                <Card key={t.id} className="group hover:border-brand-500/30 transition-all cursor-pointer hover:-translate-y-1" onClick={() => handleEdit(t)}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-dark-950 rounded-lg border border-dark-700 text-brand-400 group-hover:text-white group-hover:bg-brand-500/20 transition-colors">
                            <FileText size={24}/>
                        </div>
                        <Badge color={t.status === 'Active' ? 'green' : 'yellow'}>{t.status}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">{t.category} • v{t.version}</p>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                        <History size={12}/> Last modified {t.lastModified}
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
};

export default DocumentTemplates;
