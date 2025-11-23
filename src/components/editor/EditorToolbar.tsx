
import React, { useRef, useState } from 'react';
import { 
  Clipboard, Scissors, Copy, Type, Bold, Italic, Underline, Strikethrough, 
  Subscript, Superscript, AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  List, ListOrdered, Indent, Outdent, Pilcrow, Paintbrush, Undo, Redo, 
  Search, Replace, Braces, BookOpen, Wand2, Table, Image, Link, Minus, 
  FileMinus, Code, PenTool, LayoutTemplate, Columns, PanelTop, PanelBottom, 
  Hash, Grid, Calendar, MessageSquare, UserPlus, CheckCircle2, GitBranch, 
  EyeOff, FileDiff, ShieldAlert, Scale, CheckSquare, Lock, Eye, Moon, 
  Ruler, Sidebar, MousePointer2, FileText, Stamp, Globe, Video, Download,
  Terminal, Split, Settings, Highlighter, Baseline, Move, RotateCw, Maximize, 
  ZoomIn, ZoomOut, CheckCheck, X, AlertTriangle, Play, Shield,
  Trash2, ChevronDown, ChevronRight, Check, Server, RemoveFormatting, 
  CaseSensitive, ArrowUpDown, PaintBucket, StickyNote, Paperclip, 
  FileSpreadsheet, ClipboardPaste, Gavel, User, Monitor, Smartphone,
  FileCheck, AlertOctagon, Quote, Palette, FileJson, Bookmark, Map,
  MoreHorizontal, ToggleLeft, FileType, RefreshCw, StopCircle, Frame,
  Heading1, Heading2, Heading3, WrapText, TableProperties, Link2,
  Minimize2, FileInput, Sigma, Divide, Layout, FileSignature, Languages, ListTree,
  Printer, SpellCheck, WholeWord, Activity
} from 'lucide-react';
import { RibbonButton, RibbonDivider, RibbonGroup, RibbonSelect, RibbonIconButton, RibbonActionGroup, RibbonColorPicker } from './EditorUI';
import { Editor } from '@tiptap/react';

// --- types ---
export type RibbonTabType = 'home' | 'insert' | 'layout' | 'review' | 'view' | 'governance';

interface EditorToolbarProps {
  editor: Editor | null;
  activeTab: RibbonTabType;
  onTabChange: (tab: RibbonTabType) => void;
  state: {
    zoom: number;
    showRuler: boolean;
    showGrid: boolean;
    darkMode: boolean;
    trackChanges: boolean;
    redactionMode: boolean;
    viewMode: 'print' | 'web' | 'focus';
  };
  actions: {
    setZoom: (z: number) => void;
    toggleRuler: () => void;
    toggleGrid: () => void;
    toggleDarkMode: () => void;
    toggleTrackChanges: () => void;
    toggleRedaction: () => void;
    setViewMode: (m: 'print' | 'web' | 'focus') => void;
    addComment: () => void;
    runGovernance: () => void;
    exportDoc: () => void;
    onAction?: (action: string) => void;
  };
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  editor, activeTab, onTabChange, state, actions 
}) => {
  if (!editor) return null;

  // Local UI state
  const [formatBrush, setFormatBrush] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- helpers / safe command runner ---
  const run = async (fn: () => any) => {
    try { return await fn(); } catch (e) { console.warn('Editor command failed', e); return null; }
  };

  const safeInsertHTML = (html: string) => {
    run(() => editor.chain().focus().insertContent(html).run());
  };

  const handleFindReplace = () => {
    const find = prompt('Find text:');
    if (!find) return;
    const replace = prompt(`Replace "${find}" with: (leave blank to skip replace)`);
    const html = editor.getHTML();
    const newHtml = replace !== null ? html.split(find).join(replace) : html;
    run(() => editor.commands.setContent(newHtml));
  };

  const handleFormatCopy = () => {
    const marks = editor.getAttributes('textStyle') || {};
    setFormatBrush(marks);
  };
  
  const handleFormatApply = () => {
    if (!formatBrush) return;
    run(() => editor.chain().focus().setMark('textStyle', formatBrush).run());
    setFormatBrush(null); // Reset after apply
  };

  const handleInsertVariable = async () => {
    const key = prompt('Variable key (e.g. counterparty_name):');
    if (!key) {
        if (actions.onAction) actions.onAction('open_variables');
        return;
    }
    safeInsertHTML(`<span class="variable" data-id="${key}" style="background-color: rgba(20, 184, 166, 0.2); padding: 0 4px; border-radius: 4px; border: 1px solid rgba(20, 184, 166, 0.4); color: #14b8a6; font-family: monospace;">{{${key}}}</span>`);
  };

  const handleInsertClause = () => {
    if (actions.onAction) {
        actions.onAction('open_clause_library');
        return;
    }
    const name = prompt('Clause name:', 'Custom Clause');
    if (!name) return;
    const content = prompt('Clause content:', 'Clause text...');
    if (content === null) return;
    safeInsertHTML(`<div class="clause-block" style="border-left:3px solid #14b8a6;padding:8px;margin:8px 0;background:rgba(20,184,166,0.1)"><strong>${name}</strong><p>${content}</p></div><p></p>`);
  };

  const setHeading = (level: 1 | 2 | 3 | 0) => {
    if (level === 0) return run(() => editor.chain().focus().setParagraph().run());
    return run(() => editor.chain().focus().toggleHeading({ level }).run());
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    run(() => editor.chain().focus().setImage({ src: url }).run());
    e.currentTarget.value = '';
  };

  const handleInsertTable = (rows = 3, cols = 3) => {
    if ((editor.commands as any).insertTable) {
        run(() => editor.chain().focus().insertTable({ rows, cols }).run());
    } else {
        const rowsHtml = Array(rows).fill(`<tr>${Array(cols).fill('<td>Cell</td>').join('')}</tr>`).join('');
        safeInsertHTML(`<table border="1" style="width:100%; border-collapse:collapse;"><tbody>${rowsHtml}</tbody></table><p></p>`);
    }
  };

  const handleInsertLink = async () => {
    const url = prompt('Enter URL:');
    if (!url) return;
    run(() => editor.chain().focus().setLink({ href: url }).run());
  };

  const handleInsertSignature = () => safeInsertHTML(`<div class="signature-line" style="margin-top:40px; border-top:1px solid #ccc; width:200px; padding-top:8px; font-family: monospace;">x__________________________<br/>Signed By</div><p></p>`);

  // Current Font/Size Values
  const currentFont = editor.getAttributes('textStyle').fontFamily || 'Inter';
  const currentSize = editor.getAttributes('textStyle').fontSize ? String(editor.getAttributes('textStyle').fontSize).replace('px', '') : '12';

  return (
    <div className="bg-dark-900 border-b border-dark-700 shrink-0 flex flex-col relative z-20 shadow-sm">
      {/* Tabs */}
      <div className="flex px-2 border-b border-dark-800 overflow-x-auto">
         {['Home', 'Insert', 'Layout', 'Review', 'View', 'Governance'].map(tab => (
            <button 
                key={tab} 
                onClick={() => onTabChange(tab.toLowerCase() as RibbonTabType)} 
                className={`px-5 py-2 text-xs font-bold transition-all border-b-2 ${activeTab === tab.toLowerCase() ? 'border-brand-500 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
                {tab}
            </button>
         ))}
      </div>

      {/* Toolbar area */}
      <div className="h-28 flex items-center px-4 gap-2 overflow-x-auto custom-scrollbar bg-dark-900/95 whitespace-nowrap py-2">
         
         {/* --- HOME TAB --- */}
         {activeTab === 'home' && (
           <>
             <RibbonGroup label="Undo">
               <RibbonActionGroup>
                 <RibbonIconButton icon={Undo} title="Undo" onClick={() => run(() => editor.chain().focus().undo().run())} disabled={!editor.can().undo()} />
                 <RibbonIconButton icon={Redo} title="Redo" onClick={() => run(() => editor.chain().focus().redo().run())} disabled={!editor.can().redo()} />
               </RibbonActionGroup>
             </RibbonGroup>

             <RibbonGroup label="Clipboard">
               <RibbonActionGroup>
                 <RibbonIconButton icon={ClipboardPaste} title="Paste" onClick={() => navigator.clipboard.readText().then(t => safeInsertHTML(t))} />
                 <RibbonIconButton icon={Scissors} title="Cut" onClick={() => { const sel = editor.state.selection; navigator.clipboard.writeText(editor.state.doc.textBetween(sel.from, sel.to)); editor.chain().focus().deleteSelection().run(); }} />
                 <RibbonIconButton icon={Copy} title="Copy" onClick={() => { const sel = editor.state.selection; navigator.clipboard.writeText(editor.state.doc.textBetween(sel.from, sel.to)); }} />
                 <RibbonIconButton icon={Paintbrush} title="Format Painter" active={!!formatBrush} onClick={!formatBrush ? handleFormatCopy : handleFormatApply} color={formatBrush ? 'text-brand-400' : ''} />
               </RibbonActionGroup>
             </RibbonGroup>

             <RibbonGroup label="Font">
               <div className="flex gap-2 items-center mb-1">
                 <RibbonSelect 
                   value={currentFont}
                   options={[{label: 'Inter', value: 'Inter'}, {label: 'Times New Roman', value: 'Times New Roman'}, {label: 'Arial', value: 'Arial'}, {label: 'Roboto', value: 'Roboto'}]} 
                   width="w-32"
                   onChange={(e:any) => run(()=>editor.chain().focus().setFontFamily(e.target.value).run())}
                 />
                 <RibbonSelect 
                   value={currentSize}
                   options={['8','9','10','11','12','14','16','18','20','24','30','36', '48', '72'].map(s => ({label: s, value: s}))} 
                   width="w-16"
                   onChange={(e:any) => run(()=>editor.chain().focus().setMark('textStyle', { fontSize: `${e.target.value}px` }).run())}
                 />
                 <RibbonActionGroup>
                    <RibbonIconButton icon={Maximize} title="Grow Font" onClick={() => run(()=>editor.chain().focus().setMark('textStyle', { fontSize: `${parseInt(currentSize)+1}px` }).run())} />
                    <RibbonIconButton icon={Minimize2} title="Shrink Font" onClick={() => run(()=>editor.chain().focus().setMark('textStyle', { fontSize: `${Math.max(8, parseInt(currentSize)-1)}px` }).run())} />
                 </RibbonActionGroup>
                 <RibbonIconButton icon={RemoveFormatting} title="Clear Formatting" onClick={() => run(()=>editor.chain().focus().unsetAllMarks().run())} />
               </div>

               <div className="flex items-center gap-1">
                 <RibbonIconButton icon={Bold} title="Bold" active={editor.isActive('bold')} onClick={() => run(()=>editor.chain().focus().toggleBold().run())} />
                 <RibbonIconButton icon={Italic} title="Italic" active={editor.isActive('italic')} onClick={() => run(()=>editor.chain().focus().toggleItalic().run())} />
                 <RibbonIconButton icon={Underline} title="Underline" active={editor.isActive('underline')} onClick={() => run(()=>editor.chain().focus().toggleUnderline().run())} />
                 <RibbonIconButton icon={Strikethrough} title="Strike" active={editor.isActive('strike')} onClick={() => run(()=>editor.chain().focus().toggleStrike().run())} />
                 <RibbonIconButton icon={Subscript} title="Subscript" active={editor.isActive('subscript')} onClick={() => run(()=>editor.chain().focus().toggleSubscript?.().run())} />
                 <RibbonIconButton icon={Superscript} title="Superscript" active={editor.isActive('superscript')} onClick={() => run(()=>editor.chain().focus().toggleSuperscript?.().run())} />
                 <RibbonColorPicker icon={Highlighter} color="#fcd34d" />
                 <RibbonColorPicker icon={Baseline} color="#ef4444" />
               </div>
             </RibbonGroup>

             <RibbonGroup label="Paragraph">
               <div className="flex gap-1 mb-1">
                 <RibbonActionGroup>
                   <RibbonIconButton icon={List} title="Bulleted" active={editor.isActive('bulletList')} onClick={() => run(()=>editor.chain().focus().toggleBulletList().run())} />
                   <RibbonIconButton icon={ListOrdered} title="Numbered" active={editor.isActive('orderedList')} onClick={() => run(()=>editor.chain().focus().toggleOrderedList().run())} />
                 </RibbonActionGroup>
                 <RibbonActionGroup>
                   <RibbonIconButton icon={Outdent} title="Decrease indent" onClick={() => run(()=>editor.chain().focus().liftListItem('listItem').run())} />
                   <RibbonIconButton icon={Indent} title="Increase indent" onClick={() => run(()=>editor.chain().focus().sinkListItem('listItem').run())} />
                 </RibbonActionGroup>
               </div>
               
               <div className="flex gap-1">
                 <RibbonActionGroup>
                   <RibbonIconButton icon={AlignLeft} title="Left" active={editor.isActive({ textAlign: 'left' })} onClick={() => run(()=>editor.chain().focus().setTextAlign('left').run())} />
                   <RibbonIconButton icon={AlignCenter} title="Center" active={editor.isActive({ textAlign: 'center' })} onClick={() => run(()=>editor.chain().focus().setTextAlign('center').run())} />
                   <RibbonIconButton icon={AlignRight} title="Right" active={editor.isActive({ textAlign: 'right' })} onClick={() => run(()=>editor.chain().focus().setTextAlign('right').run())} />
                   <RibbonIconButton icon={AlignJustify} title="Justify" active={editor.isActive({ textAlign: 'justify' })} onClick={() => run(()=>editor.chain().focus().setTextAlign('justify').run())} />
                 </RibbonActionGroup>
               </div>
             </RibbonGroup>

             <RibbonGroup label="Styles">
               <div className="grid grid-cols-2 gap-1 w-24">
                  <button onClick={() => setHeading(0)} className={`text-[10px] px-1 rounded truncate ${editor.isActive('paragraph') ? 'bg-brand-500/20 text-brand-400 border border-brand-500/50' : 'text-slate-400 hover:text-white border border-transparent'}`}>Normal</button>
                  <button onClick={() => setHeading(1)} className={`text-[10px] px-1 rounded truncate font-bold ${editor.isActive('heading', {level:1}) ? 'bg-brand-500/20 text-brand-400 border border-brand-500/50' : 'text-slate-400 hover:text-white border border-transparent'}`}>Heading 1</button>
                  <button onClick={() => setHeading(2)} className={`text-[10px] px-1 rounded truncate font-bold ${editor.isActive('heading', {level:2}) ? 'bg-brand-500/20 text-brand-400 border border-brand-500/50' : 'text-slate-400 hover:text-white border border-transparent'}`}>Heading 2</button>
                  <button onClick={() => setHeading(3)} className={`text-[10px] px-1 rounded truncate font-bold ${editor.isActive('heading', {level:3}) ? 'bg-brand-500/20 text-brand-400 border border-brand-500/50' : 'text-slate-400 hover:text-white border border-transparent'}`}>Heading 3</button>
               </div>
             </RibbonGroup>

             <RibbonGroup label="Editing">
               <RibbonButton icon={Search} label="Find" onClick={handleFindReplace} />
               <RibbonButton icon={Replace} label="Replace" onClick={handleFindReplace} />
               <RibbonButton icon={MousePointer2} label="Select All" onClick={() => run(() => editor.commands.selectAll())} />
             </RibbonGroup>
           </>
         )}

         {/* --- INSERT TAB --- */}
         {activeTab === 'insert' && (
           <>
            <RibbonGroup label="CLM">
              <RibbonButton icon={Braces} label="Variable" onClick={handleInsertVariable} color="text-brand-400" />
              <RibbonButton icon={BookOpen} label="Clause" onClick={handleInsertClause} color="text-blue-400" />
              <RibbonButton icon={Wand2} label="AI Block" onClick={() => alert('Insert AI block')} badge color="text-purple-400" />
            </RibbonGroup>

            <RibbonGroup label="Media">
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              <RibbonButton icon={Table} label="Table" onClick={() => handleInsertTable(3,3)} />
              <RibbonButton icon={Image} label="Image" onClick={handleImageClick} />
              <RibbonButton icon={Link} label="Link" onClick={handleInsertLink} />
            </RibbonGroup>

            <RibbonGroup label="Breaks">
              <RibbonButton icon={FileMinus} label="Page Break" onClick={() => safeInsertHTML('<div class="page-break"></div>')} />
              <RibbonButton icon={Minus} label="Divider" onClick={() => run(()=>editor.chain().focus().setHorizontalRule().run())} />
            </RibbonGroup>

            <RibbonGroup label="Signatures">
              <RibbonButton icon={PenTool} label="Signature" onClick={handleInsertSignature} />
              <RibbonButton icon={Calendar} label="Date" onClick={() => safeInsertHTML(`<span>${new Date().toLocaleDateString()}</span>`)} />
              <RibbonButton icon={CheckSquare} label="Approval" onClick={() => safeInsertHTML('<div class="approval-block" style="border:1px dashed #64748b; padding:10px; margin:10px 0;">[Approval Block]</div>')} />
            </RibbonGroup>
           </>
         )}

         {/* --- LAYOUT TAB --- */}
         {activeTab === 'layout' && (
           <>
             <RibbonGroup label="Page Setup">
               <RibbonButton icon={FileText} label="Margins" onClick={() => actions.onAction && actions.onAction('margins')} />
               <RibbonButton icon={RotateCw} label="Orientation" onClick={() => alert('Toggle Portrait/Landscape')} />
               <RibbonButton icon={Maximize} label="Size" onClick={() => alert('Paper Size')} />
               <RibbonButton icon={Columns} label="Columns" onClick={() => alert('Columns')} />
             </RibbonGroup>
             <RibbonGroup label="Elements">
               <RibbonButton icon={PanelTop} label="Header" onClick={() => alert('Edit Header')} />
               <RibbonButton icon={PanelBottom} label="Footer" onClick={() => alert('Edit Footer')} />
               <RibbonButton icon={Hash} label="Page #" onClick={() => safeInsertHTML('<span style="float:right">Page 1</span>')} />
               <RibbonButton icon={Stamp} label="Watermark" onClick={() => actions.onAction && actions.onAction('watermark')} />
             </RibbonGroup>
           </>
         )}

         {/* --- REVIEW TAB --- */}
         {activeTab === 'review' && (
           <>
             <RibbonGroup label="Proofing">
               <RibbonButton icon={SpellCheck} label="Spelling" onClick={() => alert('Checking spelling...')} />
               <RibbonButton icon={WholeWord} label="Word Count" onClick={() => alert(`${editor.storage.characterCount.words()} words`)} />
             </RibbonGroup>
             <RibbonGroup label="Comments">
               <RibbonButton icon={MessageSquare} label="New" onClick={() => actions.addComment()} />
               <RibbonActionGroup>
                 <RibbonIconButton icon={Trash2} title="Delete" onClick={() => alert('Delete comment')} />
               </RibbonActionGroup>
             </RibbonGroup>
             <RibbonGroup label="Tracking">
               <RibbonButton icon={GitBranch} label="Track Changes" active={state.trackChanges} onClick={actions.toggleTrackChanges} color={state.trackChanges ? 'text-green-400' : ''} />
               <RibbonActionGroup>
                 <RibbonIconButton icon={Check} title="Accept" onClick={() => alert('Accept Change')} />
                 <RibbonIconButton icon={X} title="Reject" onClick={() => alert('Reject Change')} />
               </RibbonActionGroup>
             </RibbonGroup>
             <RibbonGroup label="Protection">
               <RibbonButton icon={EyeOff} label="Redact" active={state.redactionMode} onClick={actions.toggleRedaction} color={state.redactionMode ? 'text-red-400' : ''} />
               <RibbonButton icon={Lock} label="Lock Doc" onClick={() => alert('Lock document')} />
             </RibbonGroup>
           </>
         )}

         {/* --- VIEW TAB --- */}
         {activeTab === 'view' && (
           <>
            <RibbonGroup label="Zoom">
              <RibbonIconButton icon={ZoomIn} title="Zoom In" onClick={() => actions.setZoom(Math.min(200, state.zoom + 10))} />
              <RibbonIconButton icon={ZoomOut} title="Zoom Out" onClick={() => actions.setZoom(Math.max(50, state.zoom - 10))} />
              <RibbonButton icon={Maximize} label="100%" onClick={() => actions.setZoom(100)} />
            </RibbonGroup>
            <RibbonGroup label="Modes">
              <RibbonButton icon={FileText} label="Print Layout" active={state.viewMode === 'print'} onClick={() => actions.setViewMode('print')} />
              <RibbonButton icon={Monitor} label="Web Layout" active={state.viewMode === 'web'} onClick={() => actions.setViewMode('web')} />
              <RibbonButton icon={Moon} label="Dark Mode" active={state.darkMode} onClick={actions.toggleDarkMode} />
            </RibbonGroup>
            <RibbonGroup label="Show">
                <div className="flex flex-col gap-1 justify-center h-full">
                    <label className="flex items-center gap-2 text-[10px] cursor-pointer hover:text-white"><input type="checkbox" checked={state.showRuler} onChange={actions.toggleRuler}/> Ruler</label>
                    <label className="flex items-center gap-2 text-[10px] cursor-pointer hover:text-white"><input type="checkbox" checked={state.showGrid} onChange={actions.toggleGrid}/> Gridlines</label>
                </div>
            </RibbonGroup>
           </>
         )}

         {/* --- GOVERNANCE TAB --- */}
         {activeTab === 'governance' && (
           <>
            <RibbonGroup label="Analysis">
              <RibbonButton icon={Play} label="Run Check" onClick={actions.runGovernance} />
              <RibbonButton icon={AlertTriangle} label="Risks" onClick={() => alert('Show risk report')} />
              <RibbonButton icon={Activity} label="Score" onClick={() => alert('Readability Score: 65')} />
            </RibbonGroup>
            <RibbonGroup label="Playbook">
              <RibbonButton icon={Scale} label="Compare" onClick={() => alert('Compare to standard')} />
              <RibbonButton icon={Shield} label="Compliance" onClick={() => alert('Check compliance')} />
            </RibbonGroup>
           </>
         )}

      </div>
    </div>
  );
};
