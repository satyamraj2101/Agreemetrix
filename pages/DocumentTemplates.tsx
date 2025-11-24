
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Button, Input, Badge, Select, Switch, Avatar } from '../components/UIComponents';
import { MOCK_TEMPLATES, MOCK_COMMENTS as INITIAL_COMMENTS, MOCK_CHANGES, MOCK_VARIABLES } from '../mock/data';
import { DocumentTemplate } from '../types';
import { 
  FileText, Plus, ChevronLeft, Save, Printer, List, History, 
  BookOpen, Braces, MessageSquare, Shield, Workflow, Sparkles,
  AlertTriangle, UserPlus, Minimize2, Maximize2, RefreshCw,
  PenTool, GitBranch, Eye, MoreVertical, ChevronRight
} from 'lucide-react';

// Imports from extracted files
import { EditorToolbar, RibbonTabType } from '../components/editor/EditorToolbar';
import { 
    OutlineItem, StructurePanel, ReviewPanel, CompliancePanel, AIPanel, 
    LogicPanel, GovernancePanel, VariablesPanel, ClausesPanel, HistoryPanel 
} from '../components/editor/EditorPanels';
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

interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
  resolved: boolean;
  replies: { user: string; text: string; date: string }[];
  selectionId?: string; 
}

interface TrackedChange {
  id: string;
  type: 'insert' | 'delete' | 'format';
  user: string;
  date: string;
  content: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// --- UTILS ---

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Simple error boundary for the editor component
class EditorErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Editor crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-dark-950 text-slate-400">
          <div className="text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-bold text-white">Editor Encountered an Error</h3>
            <p className="text-sm mb-4">Something went wrong while rendering the document.</p>
            <Button variant="secondary" onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

// --- MAIN EDITOR COMPONENT ---

const TemplateEditor: React.FC<{ template: DocumentTemplate; onSave: (t: DocumentTemplate) => void; onBack: () => void }> = ({ template, onSave, onBack }) => {
  // UI State
  const [ribbonTab, setRibbonTab] = useState<RibbonTabType>('home');
  const [leftTab, setLeftTab] = useState<LeftTab>('structure');
  const [rightTab, setRightTab] = useState<RightTab>('review');
  const [mode, setMode] = useState<EditorMode>('editing');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
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
  
  // Layout State
  const [margins, setMargins] = useState({ top: 96, bottom: 96, left: 96, right: 96 });
  const [watermark, setWatermark] = useState<string>('');

  // Data State
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [changes, setChanges] = useState(MOCK_CHANGES); // Now mutable state
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [complianceScore, setComplianceScore] = useState(85); // Real-time score
  
  // Logic State
  const [logicRules, setLogicRules] = useState(template.conditions || []);
  
  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Optimization: Refs for debouncing
  const outlineTimeoutRef = useRef<number | null>(null);

  // --- RESIZE OBSERVER FOR SCALING ---
  const pageRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(1056); // Start with A4 min-height

  useEffect(() => {
    if (!pageRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // We use getBoundingClientRect for precise sub-pixel measurement
        const height = entry.target.getBoundingClientRect().height / (zoom / 100);
        
        // Update if height changed significantly (>1px) to avoid jitter loops
        if (Math.abs(height - contentHeight) > 1) {
            // Ensure we don't shrink below A4 minimum
            setContentHeight(Math.max(1056, height));
        }
      }
    });
    
    observer.observe(pageRef.current);
    return () => observer.disconnect();
  }, [contentHeight, zoom]);

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
    content: template?.content || '',
    editable: mode !== 'viewing',
    onUpdate: ({ editor }) => {
        // Debounce heavy outline calculation and compliance check
        if (outlineTimeoutRef.current) {
            clearTimeout(outlineTimeoutRef.current);
        }
        
        outlineTimeoutRef.current = window.setTimeout(() => {
            try {
                // 1. Outline
                const headers: OutlineItem[] = [];
                editor.state.doc.forEach((node, pos) => {
                    if (node.type.name === 'heading') {
                        headers.push({
                            text: node.textContent || 'Untitled Section',
                            level: node.attrs.level,
                            pos: pos,
                        });
                    }
                });
                setOutline(headers);

                // 2. Compliance Scanning
                const text = editor.getText().toLowerCase();
                let score = 100;
                if (text.includes('unlimited liability')) score -= 20;
                if (text.includes('indemnify')) score -= 5; // Just monitoring usage
                if (!text.includes('governing law')) score -= 10;
                if (!text.includes('termination')) score -= 10;
                setComplianceScore(Math.max(0, score));

            } catch (e) {
                console.warn('Analysis failed', e);
            }
        }, 500); // 500ms debounce
    }
  });

  const editorActions = {
      setZoom,
      toggleRuler: () => setShowRuler(!showRuler),
      toggleGrid: () => setShowGrid(!showGrid),
      toggleDarkMode: () => setDarkMode(!darkMode),
      toggleTrackChanges: () => setMode(prev => prev === 'suggesting' ? 'editing' : 'suggesting'),
      toggleRedaction: () => setRedactionMode(!redactionMode),
      setViewMode,
      addComment: () => {
          const newComment = {
              id: `c_${Date.now()}`,
              user: 'Harvey Specter',
              text: 'New comment...',
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
      exportDoc: () => alert('Exporting document to PDF...'),
      onAction: (action: string) => {
          if (action === 'margins') setActiveModal('margins');
          if (action === 'watermark') setActiveModal('watermark');
          if (action === 'open_clause_library') setLeftTab('assets');
          if (action === 'open_variables') setLeftTab('variables');
      }
  };
  
  const editorState = {
    zoom,
    showRuler,
    showGrid,
    darkMode,
    trackChanges: mode === 'suggesting',
    redactionMode,
    viewMode,
  };

  // Sync Ribbon with Sidebars
  useEffect(() => {
      if (ribbonTab === 'review') setRightTab('review');
      if (ribbonTab === 'governance') setRightTab('governance');
  }, [ribbonTab]);

  // Calculate Scaled Dimensions for the Wrapper "Sizer"
  const scale = zoom / 100;
  const baseWidth = 816; // A4 width in px at 96 DPI
  const scaledWidth = viewMode === 'web' ? '100%' : baseWidth * scale;
  const scaledHeight = contentHeight * scale;

  const handleAcceptChange = (id: string) => {
      setChanges(prev => prev.filter(c => c.id !== id));
  };

  const handleRejectChange = (id: string) => {
      setChanges(prev => prev.filter(c => c.id !== id));
  };

  // Enhanced Save Handler to include Logic Rules
  const handleSave = () => {
      const updatedTemplate = {
          ...template,
          conditions: logicRules,
          content: editor?.getHTML() || template.content,
          lastModified: 'Just now'
      };
      onSave(updatedTemplate);
  };

  if (!template) return null;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -m-6 bg-[#0B0E14] text-slate-200 overflow-hidden font-sans selection:bg-brand-500/30">
       
       {/* 1. COMMAND BAR */}
       <div className="h-14 bg-dark-950 border-b border-dark-700 flex items-center justify-between px-4 shrink-0 z-30 shadow-md relative">
          <div className="flex items-center gap-1">
             <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronLeft size={18}/></button>
             <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title={isLeftSidebarOpen ? "Collapse Left Panel" : "Expand Left Panel"}>
                <ChevronLeft size={18} className={`transition-transform duration-300 ${isLeftSidebarOpen ? '' : 'rotate-180'}`} />
             </button>
             <div className="ml-2">
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

          {/* Mode Switcher */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
          </div>

          <div className="flex items-center gap-1">
             <div className="flex items-center -space-x-2 mr-2">
                 {activeCollaborators.map(u => (
                     <div key={u.id} className="w-8 h-8 rounded-full border-2 border-dark-950 bg-dark-800 flex items-center justify-center text-xs font-bold text-white relative" style={{backgroundColor: u.color}}>
                         {u.name.charAt(0)}
                     </div>
                 ))}
                 <button className="w-8 h-8 rounded-full border-2 border-dark-950 bg-dark-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-dark-700 transition-colors">
                     <UserPlus size={14}/>
                 </button>
             </div>
             <Button variant="secondary" className="h-8 text-xs"><Printer size={14} className="mr-2"/> Print</Button>
             <Button variant="primary" className="h-8 text-xs shadow-lg shadow-brand-500/20" onClick={handleSave}>
                <Save size={14} className="mr-2"/> Publish
             </Button>
             <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title={isRightSidebarOpen ? "Collapse Right Panel" : "Expand Right Panel"}>
                <ChevronRight size={18} className={`transition-transform duration-300 ${isRightSidebarOpen ? '' : 'rotate-180'}`} />
             </button>
          </div>
       </div>

       {/* 2. RIBBON TOOLBAR */}
       <EditorToolbar 
          editor={editor} 
          activeTab={ribbonTab} 
          onTabChange={setRibbonTab}
          state={editorState}
          actions={editorActions}
       />

       {/* 3. WORKSPACE GRID */}
       <div className="flex-1 flex overflow-hidden relative">
          
          {/* LEFT RAIL */}
          <div className={`bg-dark-950 border-r border-dark-800 flex flex-col z-20 shrink-0 transition-all duration-300 ease-in-out ${isLeftSidebarOpen ? 'w-64' : 'w-0'}`}>
            <div className="flex flex-col h-full overflow-hidden whitespace-nowrap">
                <div className="flex border-b border-dark-800 bg-dark-900">
                    <button onClick={() => setLeftTab('structure')} className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${leftTab === 'structure' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white'}`} title="Outline"><List size={16}/></button>
                    <button onClick={() => setLeftTab('variables')} className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${leftTab === 'variables' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white'}`} title="Variables"><Braces size={16}/></button>
                    <button onClick={() => setLeftTab('assets')} className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${leftTab === 'assets' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white'}`} title="Clauses"><BookOpen size={16}/></button>
                    <button onClick={() => setLeftTab('history')} className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${leftTab === 'history' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white'}`} title="History"><History size={16}/></button>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    {leftTab === 'structure' && <StructurePanel editor={editor} outline={outline} />}
                    {leftTab === 'variables' && <VariablesPanel editor={editor} />}
                    {leftTab === 'assets' && <ClausesPanel editor={editor} />}
                    {leftTab === 'history' && <HistoryPanel />}
                </div>
            </div>
          </div>

          {/* CENTER: Editor Canvas */}
          <div className="flex-1 bg-dark-900/30 relative flex flex-col overflow-hidden">
             
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex justify-center items-start relative" onClick={() => editor?.commands.focus()}>
                <EditorErrorBoundary>
                    {/* Sizer Wrapper: This div reserves the correct Scroll Area Size */}
                    <div
                       style={{
                           width: typeof scaledWidth === 'number' ? `${scaledWidth}px` : scaledWidth,
                           height: `${scaledHeight}px`, // This grows as contentHeight grows
                           position: 'relative',
                           marginTop: viewMode === 'focus' ? '0' : undefined,
                           flexShrink: 0, // Prevent flexbox from squashing it
                           transition: 'width 0.2s ease, height 0.2s ease' // Smooth zoom/resize
                       }}
                    >
                        {/* The Actual Page Content - Scaled and Positioned */}
                        <div 
                           ref={pageRef}
                           className={`bg-white text-black shadow-2xl absolute top-0 left-0 origin-top-left
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
                               transform: `scale(${scale})`,
                               // Critical: Align origin to the sizer's top-left so coordinates match
                               transformOrigin: 'top left', 
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

                           {/* Tiptap Editor */}
                           <div className="relative z-10 h-full">
                               <EditorContent editor={editor} className="prose prose-slate max-w-none focus:outline-none h-full min-h-[800px]" />
                           </div>
                        </div>
                    </div>
                </EditorErrorBoundary>
             </div>
             
             {/* Zoom Controls */}
             <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-dark-900/90 backdrop-blur border border-dark-700 rounded-full p-1 shadow-xl z-20">
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"><Minimize2 size={14}/></button>
                <span className="text-xs font-mono w-10 text-center text-slate-300">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"><Maximize2 size={14}/></button>
             </div>
             
             {/* Stats */}
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
          <div className={`bg-dark-900 border-l border-dark-800 flex flex-col z-20 shrink-0 shadow-xl transition-all duration-300 ease-in-out ${isRightSidebarOpen ? 'w-80' : 'w-0'}`}>
             <div className="flex flex-col h-full overflow-hidden whitespace-nowrap">
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
                    {rightTab === 'review' && <ReviewPanel comments={comments} changes={changes} onAddComment={editorActions.addComment} onAcceptChange={handleAcceptChange} onRejectChange={handleRejectChange} />}
                    {rightTab === 'logic' && <LogicPanel rules={logicRules} onUpdateRules={setLogicRules} />}
                    {rightTab === 'compliance' && <CompliancePanel score={complianceScore} />}
                    {rightTab === 'ai' && <AIPanel editor={editor} />}
                    {rightTab === 'governance' && <GovernancePanel />}
                </div>
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
      content: '<h1>Untitled Document</h1><p>Start typing here...</p>',
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
