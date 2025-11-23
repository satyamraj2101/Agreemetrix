
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Badge, Select, Switch, Avatar } from '../components/UIComponents';
import { MOCK_TEMPLATES, MOCK_TABLES, MOCK_CLAUSES } from '../mock/data';
import { DocumentTemplate } from '../types';
import { 
  FileText, Plus, Upload, Search, LayoutTemplate, MoreVertical, 
  ChevronLeft, Save, Printer, Type, Braces, GitBranch, EyeOff, 
  Bold, Italic, Underline, List, MousePointer2, Sparkles,
  CheckCircle2, AlertTriangle, RefreshCw, Workflow, Check, X, 
  ArrowRight, Layers, Wand2, Code, Quote, Play, Bug, Lock, 
  History, FileJson, GripVertical, UploadCloud, Loader2, PenTool,
  Database, BookOpen, Split, Terminal, Globe, Columns, FileDiff,
  Undo, Redo, Scissors, Copy, AlignLeft, AlignCenter, AlignRight,
  Maximize2, Minimize2, Table as TableIcon, Eye, Shield, AlertCircle,
  MessageSquare, UserPlus, CornerUpLeft, CornerUpRight,
  FileOutput, ListOrdered, AlertOctagon, Highlighter,
  Globe2, PenLine, CheckSquare, Paperclip, Eraser, ThumbsUp, ThumbsDown,
  MessageSquarePlus, Trash2, MoreHorizontal, LockKeyhole, Flag, Link as LinkIcon, Image as ImageIcon,
  Baseline, Superscript, Subscript, Palette, Layout, Paintbrush, AlignJustify,
  Indent, Outdent, Pilcrow, CaseSensitive, ArrowUpDown, Languages, Calendar, RemoveFormatting, Clipboard,
  Replace, Hammer, Bookmark, Files, Move, FileMinus, PanelTop, PanelBottom, Stamp, Frame, PaintBucket, 
  Grid, ScanLine, FileSignature, RotateCw, Maximize, Settings, Hash
} from 'lucide-react';

// TipTap Imports
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ExtensionBubbleMenu from '@tiptap/extension-bubble-menu';
import ExtensionFloatingMenu from '@tiptap/extension-floating-menu';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
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
type RightTab = 'review' | 'logic' | 'compliance' | 'ai' | 'settings';

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

interface VariableDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'select';
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

// --- MOCK DATA EXTENDED ---

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: 'Mike Ross',
    text: 'We need to clarify the indemnity cap here. Standard is 2x, this says unlimited.',
    date: '2h ago',
    resolved: false,
    replies: [
      { user: 'Harvey Specter', text: 'Agreed. Change it to 2x fees paid.', date: '1h ago' }
    ]
  },
  {
    id: 'c2',
    user: 'Jessica Pearson',
    text: 'Is this jurisdiction correct for EU clients?',
    date: '1d ago',
    resolved: true,
    replies: []
  }
];

const MOCK_CHANGES: TrackedChange[] = [
  { id: 'tc1', type: 'delete', user: 'Mike Ross', date: '2h ago', content: 'perpetual', status: 'pending' },
  { id: 'tc2', type: 'insert', user: 'Mike Ross', date: '2h ago', content: 'three (3) year', status: 'pending' },
  { id: 'tc3', type: 'insert', user: 'Harvey Specter', date: '30m ago', content: 'Subject to Section 5.2...', status: 'accepted' }
];

const MOCK_VARIABLES: VariableDefinition[] = [
  { key: 'counterparty_name', label: 'Counterparty Name', type: 'text', required: true },
  { key: 'contract_value', label: 'Total Value', type: 'currency', required: true },
  { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
  { key: 'jurisdiction', label: 'Jurisdiction', type: 'select', required: true, options: ['New York', 'California', 'Delaware', 'London'] },
  { key: 'payment_terms', label: 'Payment Terms', type: 'select', required: false, options: ['Net 30', 'Net 45', 'Net 60'], defaultValue: 'Net 30' },
];

// --- SUB-COMPONENTS ---

const RibbonButton = ({ icon: Icon, label, active, onClick, disabled, badge, color, className = '', subLabel }: any) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center justify-center px-2 py-1.5 h-full min-w-[50px] rounded-lg transition-all group relative ${active ? 'bg-brand-500/10 text-brand-400' : disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 text-slate-400 hover:text-white'} ${className}`}
        title={label}
    >
        <Icon size={18} className={`mb-1 ${active ? 'text-brand-400' : color ? color : disabled ? 'text-slate-600' : 'text-slate-400 group-hover:text-white'}`} />
        <span className="text-[9px] font-medium leading-none text-center whitespace-nowrap">{label}</span>
        {subLabel && <span className="text-[8px] text-slate-500 leading-none mt-0.5">{subLabel}</span>}
        {badge && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
    </button>
);

const RibbonDivider = () => <div className="w-px h-8 bg-dark-700 mx-1 self-center shrink-0"></div>;

const RibbonGroupLabel = ({ children }: { children?: React.ReactNode }) => (
    <div className="absolute bottom-0 left-0 w-full text-center text-[8px] text-slate-600 font-bold uppercase tracking-wider pb-0.5 pointer-events-none select-none">
        {children}
    </div>
);

const LayoutSettingsModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    title: string;
    children?: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-dark-900 w-full max-w-md rounded-xl border border-dark-700 shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
                    <button onClick={onClose}><X size={16} className="text-slate-500 hover:text-white"/></button>
                </div>
                <div className="p-6 space-y-4">
                    {children}
                </div>
                <div className="p-4 border-t border-dark-700 bg-dark-900/30 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose} className="text-xs h-8">Cancel</Button>
                    <Button variant="primary" onClick={onClose} className="text-xs h-8">Apply</Button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN EDITOR COMPONENT ---

const TemplateEditor: React.FC<{ template: DocumentTemplate; onSave: (t: DocumentTemplate) => void; onBack: () => void }> = ({ template, onSave, onBack }) => {
  // UI State
  const [ribbonTab, setRibbonTab] = useState<'home' | 'insert' | 'layout' | 'review' | 'view' | 'governance'>('home');
  const [leftTab, setLeftTab] = useState<LeftTab>('structure');
  const [rightTab, setRightTab] = useState<RightTab>('review');
  const [mode, setMode] = useState<EditorMode>('editing');
  const [zoom, setZoom] = useState(100);
  const [activeCollaborators, setActiveCollaborators] = useState([
      { id: 'u1', name: 'Harvey S.', color: '#3b82f6' },
      { id: 'u2', name: 'Mike R.', color: '#10b981' }
  ]);

  // --- LAYOUT STATE ---
  const [marginPreset, setMarginPreset] = useState('Normal');
  const [margins, setMargins] = useState({ top: 96, bottom: 96, left: 96, right: 96 });
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pageSizePreset, setPageSizePreset] = useState('Letter');
  const [pageSize, setPageSize] = useState({ width: 816, height: 1056 });
  const [columns, setColumns] = useState(1);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [pageColor, setPageColor] = useState('#ffffff');
  const [watermark, setWatermark] = useState<string>('');
  const [showGrid, setShowGrid] = useState(false);
  const [showClauseBoundaries, setShowClauseBoundaries] = useState(false);
  const [riskHeatmap, setRiskHeatmap] = useState(false);
  const [redactionMode, setRedactionMode] = useState(false);
  
  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Helper State
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [formatPainterActive, setFormatPainterActive] = useState(false);

  // Data State
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [changes, setChanges] = useState<TrackedChange[]>(MOCK_CHANGES);
  const [variables, setVariables] = useState<VariableDefinition[]>(MOCK_VARIABLES);
  const [outline, setOutline] = useState<string[]>([]);
  const [content, setContent] = useState(template?.content || '');

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
      (Table as any).configure({ resizable: true }),
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
    }
  });

  if (!template) {
      return (
          <div className="flex items-center justify-center h-screen bg-dark-950 text-slate-500">
              <div className="text-center">
                  <AlertTriangle size={48} className="mx-auto mb-4 opacity-20"/>
                  <p>No template context found.</p>
                  <Button variant="secondary" onClick={onBack} className="mt-4">Return to Library</Button>
              </div>
          </div>
      );
  }

  // --- HELPER FUNCTIONS ---

  const addComment = () => {
      const newComment: Comment = {
          id: `c_${Date.now()}`,
          user: 'Harvey Specter',
          text: 'New comment on this section...',
          date: 'Just now',
          resolved: false,
          replies: []
      };
      setComments([newComment, ...comments]);
      setRightTab('review');
  };

  const addImage = () => {
      const url = window.prompt('Enter image URL');
      if (url) {
          (editor?.chain().focus() as any)?.setImage({ src: url }).run();
      }
  };

  const addLink = () => {
      const url = window.prompt('Enter Link URL');
      if (url) {
          editor?.chain().focus().setLink({ href: url }).run();
      }
  };

  const handlePresetMargin = (type: string) => {
      if (type === 'Normal') setMargins({ top: 96, bottom: 96, left: 96, right: 96 });
      if (type === 'Narrow') setMargins({ top: 48, bottom: 48, left: 48, right: 48 });
      if (type === 'Wide') setMargins({ top: 96, bottom: 96, left: 144, right: 144 });
  };

  const handlePageSizeChange = (type: string) => {
      if (type === 'Letter') setPageSize({ width: 816, height: 1056 });
      if (type === 'A4') setPageSize({ width: 794, height: 1123 });
      if (type === 'Legal') setPageSize({ width: 816, height: 1344 });
  };

  // --- RENDERERS ---

  const renderStructurePanel = () => (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4">
          <div className="p-4 border-b border-dark-800 flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Document Outline</h4>
              <button className="text-xs text-brand-400 hover:text-white" onClick={() => editor?.commands.focus()}>Refresh</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {outline.length > 0 ? outline.map((h, i) => (
                  <button key={i} onClick={() => { /* Scroll logic */ }} className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 truncate flex items-center gap-2 group transition-colors">
                      <div className="w-1.5 h-1.5 bg-dark-700 rounded-full group-hover:bg-brand-500 transition-colors"></div>
                      {h}
                  </button>
              )) : (
                  <div className="p-4 text-center text-xs text-slate-500">No headings detected. Use H1-H3 to build structure.</div>
              )}
          </div>
          <div className="p-4 border-t border-dark-800">
              <div className="bg-dark-900 p-3 rounded-lg border border-dark-700">
                  <h5 className="text-xs font-bold text-white mb-2 flex items-center gap-2"><FileText size={12} className="text-brand-400"/> Metadata</h5>
                  <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Author</span> <span className="text-slate-200">Harvey S.</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Created</span> <span className="text-slate-200">Oct 12, 2023</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Version</span> <span className="text-brand-400 font-bold">2.2 (Draft)</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderVariablePanel = () => <div className="p-4 text-slate-500 text-xs text-center">Variable Panel Mock</div>;
  const renderAssetsPanel = () => <div className="p-4 text-slate-500 text-xs text-center">Assets Panel Mock</div>;
  const renderReviewPanel = () => <div className="p-4 text-slate-500 text-xs text-center">Review Panel Mock</div>;
  const renderLogicPanel = () => <div className="p-4 text-slate-500 text-xs text-center">Logic Panel Mock</div>;
  const renderCompliancePanel = () => <div className="p-4 text-slate-500 text-xs text-center">Compliance Panel Mock</div>;
  const renderAIPanel = () => <div className="p-4 text-slate-500 text-xs text-center">AI Panel Mock</div>;

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

       {/* 2. RIBBON TOOLBAR */}
       <div className="bg-dark-900 border-b border-dark-700 shrink-0 flex flex-col relative z-20">
          <div className="flex px-2 border-b border-dark-800 overflow-x-auto">
             {['Home', 'Insert', 'Layout', 'Review', 'View', 'Governance'].map(tab => (
                <button 
                    key={tab} 
                    onClick={() => setRibbonTab(tab.toLowerCase() as any)} 
                    className={`px-5 py-2 text-xs font-bold transition-all border-b-2 ${ribbonTab === tab.toLowerCase() ? 'border-brand-500 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                    {tab}
                </button>
             ))}
          </div>
          
          <div className="h-20 flex items-center px-4 gap-1 overflow-x-auto custom-scrollbar bg-dark-900/50 whitespace-nowrap">
             
             {/* --- LAYOUT TAB --- */}
             {ribbonTab === 'layout' && (
                <>
                   <div className="flex items-center gap-1 px-2 relative group/ribbon">
                       <div className="flex flex-col gap-1 mr-2">
                           <div className="flex items-center gap-2">
                               <span className="text-[9px] font-bold text-slate-500 uppercase w-12 text-right">Margins</span>
                               <Select 
                                   options={[{label:'Normal', value:'Normal'}, {label:'Narrow', value:'Narrow'}, {label:'Wide', value:'Wide'}, {label:'Custom...', value:'Custom'}]} 
                                   className="w-24 h-5 text-[9px] bg-dark-950 border-dark-700 py-0" 
                                   onChange={(e) => {
                                       const val = e.target.value;
                                       setMarginPreset(val);
                                       if(val === 'Custom') setActiveModal('margins');
                                       else handlePresetMargin(val);
                                   }}
                                   value={marginPreset}
                               />
                           </div>
                           <div className="flex items-center gap-2">
                               <span className="text-[9px] font-bold text-slate-500 uppercase w-12 text-right">Size</span>
                               <Select 
                                   options={[{label:'Letter', value:'Letter'}, {label:'A4', value:'A4'}, {label:'Legal', value:'Legal'}, {label:'Custom...', value:'Custom'}]} 
                                   className="w-24 h-5 text-[9px] bg-dark-950 border-dark-700 py-0" 
                                   value={pageSizePreset} 
                                   onChange={(e)=>{
                                       const val = e.target.value;
                                       setPageSizePreset(val);
                                       if(val === 'Custom') setActiveModal('size');
                                       else handlePageSizeChange(val);
                                   }}
                               />
                           </div>
                       </div>
                       <RibbonButton icon={RotateCw} label="Orient." onClick={() => setOrientation(o => o === 'portrait' ? 'landscape' : 'portrait')} subLabel={orientation} />
                       <RibbonButton icon={Columns} label="Cols" onClick={() => setColumns(c => c === 1 ? 2 : 1)} subLabel={columns === 1 ? 'One' : 'Two'} />
                       <RibbonGroupLabel>Page Setup</RibbonGroupLabel>
                   </div>
                   <RibbonDivider />

                   <div className="flex items-center gap-1 px-2 relative group/ribbon">
                       <RibbonButton icon={FileMinus} label="Page Break" onClick={() => editor?.chain().focus().insertContent('<div class="page-break"></div>').run()} />
                       <RibbonButton icon={Split} label="Sec Break" subLabel="Next" />
                       <RibbonGroupLabel>Breaks</RibbonGroupLabel>
                   </div>
                   <RibbonDivider />

                   <div className="flex items-center gap-1 px-2 relative group/ribbon">
                       <RibbonButton icon={PanelTop} label="Header" />
                       <RibbonButton icon={PanelBottom} label="Footer" />
                       <RibbonButton icon={Hash} label="Page #" />
                       <RibbonButton icon={Stamp} label="Watermark" onClick={() => setActiveModal('watermark')} />
                       <RibbonGroupLabel>Elements</RibbonGroupLabel>
                   </div>
                   <RibbonDivider />

                   <div className="flex items-center gap-1 px-2 relative group/ribbon">
                       <RibbonButton icon={Grid} label="Grid" active={showGrid} onClick={() => setShowGrid(!showGrid)} />
                       <RibbonButton icon={ScanLine} label="Clauses" active={showClauseBoundaries} onClick={() => setShowClauseBoundaries(!showClauseBoundaries)} />
                       <RibbonButton icon={AlertOctagon} label="Heatmap" active={riskHeatmap} onClick={() => setRiskHeatmap(!riskHeatmap)} color={riskHeatmap ? 'text-red-400' : ''} />
                       <RibbonGroupLabel>Advanced</RibbonGroupLabel>
                   </div>
                </>
             )}

             {ribbonTab === 'home' && (
                <>
                   <div className="flex items-center gap-1 px-2 relative group/ribbon">
                       <RibbonButton icon={Undo} label="Undo" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()} />
                       <RibbonButton icon={Redo} label="Redo" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()} />
                       <RibbonButton icon={Paintbrush} label="Format" active={formatPainterActive} onClick={() => setFormatPainterActive(!formatPainterActive)} />
                       <RibbonGroupLabel>Editing</RibbonGroupLabel>
                   </div>
                   <RibbonDivider />
                   <div className="flex items-center gap-1 px-2 relative group/ribbon">
                       <RibbonButton icon={Bold} label="Bold" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()} />
                       <RibbonButton icon={Italic} label="Italic" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()} />
                       <RibbonButton icon={Underline} label="Underline" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()} />
                       <RibbonGroupLabel>Font</RibbonGroupLabel>
                   </div>
                </>
             )}
             {ribbonTab === 'insert' && (
                <>
                   <RibbonButton icon={Braces} label="Variable" onClick={() => { setLeftTab('variables'); }} color="text-brand-400"/>
                   <RibbonButton icon={BookOpen} label="Clause" onClick={() => { setLeftTab('assets'); }} color="text-blue-400"/>
                   <RibbonButton icon={TableIcon} label="Table" onClick={() => (editor?.chain().focus() as any).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}/>
                   <RibbonButton icon={ImageIcon} label="Image" onClick={addImage}/>
                   <RibbonButton icon={LinkIcon} label="Link" onClick={addLink}/>
                   <RibbonDivider />
                   <RibbonButton icon={Wand2} label="AI Block" badge color="text-purple-400" onClick={() => { setRightTab('ai'); }}/>
                </>
             )}
             {ribbonTab === 'review' && (
                <>
                   <RibbonButton icon={MessageSquarePlus} label="Comment" onClick={addComment} />
                   <RibbonButton icon={GitBranch} label="Track Changes" active={mode === 'suggesting'} onClick={() => setMode(m => m === 'suggesting' ? 'editing' : 'suggesting')}/>
                   <RibbonDivider />
                   <RibbonButton icon={EyeOff} label="Redact" active={redactionMode} onClick={() => setRedactionMode(!redactionMode)} color={redactionMode ? 'text-red-400' : ''} />
                </>
             )}
             {ribbonTab === 'view' && (
                 <>
                    <RibbonButton icon={Eye} label="Read Mode" onClick={() => setMode('viewing')} active={mode === 'viewing'}/>
                    <RibbonButton icon={FileDiff} label="Compare" onClick={() => setMode('diff')} active={mode === 'diff'}/>
                    <RibbonDivider />
                    <div className="flex items-center gap-2 px-2">
                       <span className="text-[10px] text-slate-500 font-bold uppercase">Zoom</span>
                       <div className="flex items-center bg-dark-950 rounded border border-dark-700">
                           <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="px-2 hover:bg-white/10">-</button>
                           <span className="text-xs w-8 text-center">{zoom}%</span>
                           <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="px-2 hover:bg-white/10">+</button>
                       </div>
                    </div>
                 </>
             )}
             {ribbonTab === 'governance' && (
                 <>
                    <RibbonButton icon={LockKeyhole} label="Hard Lock" color="text-red-400" />
                    <RibbonButton icon={Flag} label="Flag Terms" />
                    <RibbonButton icon={BookOpen} label="Playbook" onClick={() => setRightTab('compliance')} />
                 </>
             )}
          </div>
       </div>

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
                {leftTab === 'structure' && renderStructurePanel()}
                {leftTab === 'variables' && renderVariablePanel()}
                {leftTab === 'assets' && renderAssetsPanel()}
                {leftTab === 'history' && <div className="p-4 text-xs text-slate-500 text-center mt-10">Version history list...</div>}
             </div>
          </div>

          {/* CENTER: Editor Canvas */}
          <div className="flex-1 bg-dark-900/30 relative flex flex-col overflow-hidden">
             
             {/* Find & Replace Toolbar */}
             {showFindReplace && (
                 <div className="absolute top-4 right-8 z-30 bg-dark-900 border border-dark-700 rounded-lg shadow-xl p-2 flex items-center gap-2 animate-in slide-in-from-top-2">
                     <Search size={14} className="text-slate-500"/>
                     <input 
                        className="bg-dark-950 border border-dark-700 rounded px-2 py-1 text-xs text-white w-32 focus:border-brand-500 outline-none" 
                        placeholder="Find..." 
                        value={findText}
                        onChange={(e) => setFindText(e.target.value)}
                        autoFocus
                     />
                     <input className="bg-dark-950 border border-dark-700 rounded px-2 py-1 text-xs text-white w-32 focus:border-brand-500 outline-none" placeholder="Replace..." />
                     <button className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"><ArrowRight size={14}/></button>
                     <button className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white" title="Replace All"><RefreshCw size={14}/></button>
                     <div className="w-px h-4 bg-dark-700 mx-1"></div>
                     <button onClick={() => setShowFindReplace(false)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"><X size={14}/></button>
                 </div>
             )}

             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex justify-center relative" onClick={() => editor?.commands.focus()}>
                <div 
                   className={`bg-white text-black shadow-2xl transition-transform duration-200 ease-out origin-top mb-20 relative 
                     ${mode === 'suggesting' ? 'ring-4 ring-green-500/20' : ''}
                     ${riskHeatmap ? 'risk-heatmap-active' : ''}
                     ${redactionMode ? 'redaction-active' : ''}
                   `}
                   style={{ 
                       width: orientation === 'landscape' ? '1056px' : '816px', 
                       minHeight: '1056px', 
                       paddingTop: `${margins.top}px`,
                       paddingBottom: `${margins.bottom}px`,
                       paddingLeft: `${margins.left}px`,
                       paddingRight: `${margins.right}px`,
                       transform: `scale(${zoom / 100})`,
                       backgroundColor: pageColor,
                       color: '#000',
                       columnCount: columns,
                       columnGap: '40px'
                   }}
                >
                   {/* Watermark Layer */}
                   {watermark && (
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                           <div className="text-9xl font-black text-slate-200 opacity-50 -rotate-45 select-none uppercase whitespace-nowrap transform scale-150">
                               {watermark}
                           </div>
                       </div>
                   )}

                   {/* Grid Overlay */}
                   {showGrid && (
                       <div className="absolute inset-0 pointer-events-none z-50" style={{backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                   )}

                   {/* Clause Boundaries Overlay */}
                   {showClauseBoundaries && (
                       <div className="absolute inset-0 pointer-events-none z-40">
                           <div className="absolute top-24 left-12 right-12 h-32 border-2 border-dashed border-blue-300 rounded bg-blue-50/20 flex items-start justify-end p-1">
                               <span className="bg-blue-500 text-white text-[8px] px-1 rounded uppercase font-bold">Clause 1.1</span>
                           </div>
                       </div>
                   )}

                   {/* Tiptap Editor */}
                   <div className="relative z-10 h-full">
                       <EditorContent editor={editor} className="prose prose-slate max-w-none focus:outline-none h-full" />
                   </div>
                   
                   {/* Page Number Simulation */}
                   <div className="absolute bottom-8 right-12 text-gray-400 text-xs font-serif pointer-events-none select-none">Page 1</div>
                </div>
             </div>
             
             {/* Zoom Controls */}
             <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-dark-900/90 backdrop-blur border border-dark-700 rounded-full p-1 shadow-xl z-20">
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"><Minimize2 size={14}/></button>
                <span className="text-xs font-mono w-10 text-center text-slate-300">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"><Maximize2 size={14}/></button>
             </div>
             
             {/* Document Stats / Autosave Indicator */}
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
                {rightTab === 'review' && renderReviewPanel()}
                {rightTab === 'logic' && renderLogicPanel()}
                {rightTab === 'compliance' && renderCompliancePanel()}
                {rightTab === 'ai' && renderAIPanel()}
             </div>
          </div>
       </div>

       {/* --- MODALS --- */}
       
       <LayoutSettingsModal isOpen={activeModal === 'watermark'} onClose={() => setActiveModal(null)} title="Watermark Settings">
           <div className="space-y-4">
               <Input label="Text" value={watermark} onChange={(e) => setWatermark(e.target.value)} placeholder="CONFIDENTIAL" />
               <div className="grid grid-cols-2 gap-4">
                   <Select label="Color" options={[{label:'Gray', value:'gray'}, {label:'Red', value:'red'}]} value="gray" onChange={() => {}} />
                   <Select label="Opacity" options={[{label:'25%', value:'25'}, {label:'50%', value:'50'}]} value="25" onChange={() => {}} />
               </div>
               <div className="flex gap-2">
                   <Button variant="secondary" className="flex-1 text-xs" onClick={() => setWatermark('DRAFT')}>DRAFT</Button>
                   <Button variant="secondary" className="flex-1 text-xs" onClick={() => setWatermark('CONFIDENTIAL')}>CONFIDENTIAL</Button>
               </div>
           </div>
       </LayoutSettingsModal>

       <LayoutSettingsModal isOpen={activeModal === 'margins'} onClose={() => setActiveModal(null)} title="Custom Margins">
           <div className="grid grid-cols-2 gap-4">
               <Input label="Top (px)" type="number" value={margins.top} onChange={(e) => setMargins({...margins, top: parseInt(e.target.value)})} />
               <Input label="Bottom (px)" type="number" value={margins.bottom} onChange={(e) => setMargins({...margins, bottom: parseInt(e.target.value)})} />
               <Input label="Left (px)" type="number" value={margins.left} onChange={(e) => setMargins({...margins, left: parseInt(e.target.value)})} />
               <Input label="Right (px)" type="number" value={margins.right} onChange={(e) => setMargins({...margins, right: parseInt(e.target.value)})} />
           </div>
       </LayoutSettingsModal>

       <style>{`
         .risk-heatmap-active span, 
         .risk-heatmap-active p {
             text-shadow: 0 0 1px rgba(255,0,0,0.1);
         }
         .redaction-active .clause-block {
             filter: blur(4px);
             pointer-events: none;
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
