
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Badge, Avatar, Input, Select, Card } from '../components/UIComponents';
import { MOCK_CONTRACTS, MOCK_CLAUSES, MOCK_VERSIONS as INITIAL_VERSIONS } from '../mock/data';
import { 
  ChevronLeft, Save, Printer, Share2, FileText, MoreVertical,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, Type, Search, ZoomIn, ZoomOut, Undo, Redo,
  MessageSquare, GitBranch, Sparkles, History, Database, 
  BookOpen, Check, X, Eye, EyeOff, Plus, Minus,
  Settings, Download, PenTool, ChevronDown, GripVertical,
  CheckCircle2, AlertTriangle, Copy, Calendar, DollarSign,
  User, Shield, Link as LinkIcon, Globe, Layers, Upload,
  Activity, Clock, Briefcase, TrendingUp, CheckSquare,
  AlertCircle, FolderTree, Bot, Play, Flag, Wand2, Quote, Code
} from 'lucide-react';

// TipTap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ExtensionBubbleMenu from '@tiptap/extension-bubble-menu';
import ExtensionFloatingMenu from '@tiptap/extension-floating-menu';

// --- TYPES ---

interface EditorComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  date: string;
  resolved: boolean;
  selectionId?: string;
}

interface EditorChange {
  id: string;
  type: 'insert' | 'delete';
  userId: string;
  userName: string;
  text: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

type ViewTab = 'document' | 'overview' | 'workflow' | 'obligations' | 'financials' | 'risk' | 'family';

// --- MOCK EDITOR DATA ---

const INITIAL_COMMENTS: EditorComment[] = [
  { id: 'c1', userId: 'u2', userName: 'Mike Ross', text: 'We need to cap this liability at 2x fees. Standard policy.', date: '2h ago', resolved: false, selectionId: 'sel1' },
  { id: 'c2', userId: 'u5', userName: 'Jessica Pearson', text: 'Is this payment term standard for this region?', date: '1d ago', resolved: true, selectionId: 'sel2' }
];

const INITIAL_CHANGES: EditorChange[] = [
  { id: 'ch1', type: 'delete', userId: 'u2', userName: 'Mike Ross', text: 'perpetual', date: '2h ago', status: 'pending' },
  { id: 'ch2', type: 'insert', userId: 'u2', userName: 'Mike Ross', text: 'three (3) year', date: '2h ago', status: 'pending' },
  { id: 'ch3', type: 'insert', userId: 'u1', userName: 'Harvey Specter', text: 'Subject to the limitations set forth in Section 8...', date: '30m ago', status: 'accepted' }
];

// --- SUB-COMPONENTS ---

const RibbonButton = ({ icon: Icon, label, active, onClick, subLabel, disabled }: any) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center justify-center px-3 py-1.5 h-full min-w-[60px] rounded-lg transition-all group ${active ? 'bg-brand-500/10 text-brand-400' : disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
    >
        <Icon size={20} className={`mb-1 ${active ? 'text-brand-400' : disabled ? 'text-slate-600' : 'text-slate-400 group-hover:text-white'}`} />
        <span className="text-[10px] font-medium leading-none">{label}</span>
        {subLabel && <span className="text-[9px] text-slate-500 mt-0.5 leading-none scale-90">{subLabel}</span>}
    </button>
);

const RibbonDivider = () => <div className="w-px h-8 bg-dark-700 mx-1 self-center"></div>;

const SummaryMetric = ({ label, value, subtext, color = 'text-white', icon: Icon }: any) => (
    <div className="flex items-center gap-3 px-4 border-r border-dark-700 last:border-r-0">
        {Icon && <div className={`p-2 rounded-lg bg-dark-800 ${color}`}><Icon size={16}/></div>}
        <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">{label}</p>
            <p className={`text-sm font-bold ${color}`}>{value}</p>
            {subtext && <p className="text-[9px] text-slate-500">{subtext}</p>}
        </div>
    </div>
);

// --- MAIN COMPONENT ---

const ContractViewer: React.FC = () => {
  const { id } = useParams();
  const contract = MOCK_CONTRACTS.find(c => c.id === id) || MOCK_CONTRACTS[0];
  
  // -- STATE --
  const [activeView, setActiveView] = useState<ViewTab>('document');
  
  // Editor State
  const [ribbonTab, setRibbonTab] = useState<'home' | 'insert' | 'review' | 'view'>('home');
  const [sidebarTab, setSidebarTab] = useState<'clauses' | 'comments' | 'changes' | 'ai' | 'metadata' | 'versions'>('comments');
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [editMode, setEditMode] = useState<'editing' | 'suggesting' | 'viewing'>('suggesting');
  const [comments, setComments] = useState<EditorComment[]>(INITIAL_COMMENTS);
  const [changes, setChanges] = useState<EditorChange[]>(INITIAL_CHANGES);
  const [showAIChat, setShowAIChat] = useState(false);

  // --- TIPTAP SETUP ---
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your contract...',
      }),
      ExtensionBubbleMenu,
      ExtensionFloatingMenu,
    ],
    content: `
      <h1>${contract.type} Agreement</h1>
      <p>This ${contract.type} ("Agreement") is made effective as of <strong>${contract.startDate}</strong>, by and between <strong>Agreemetrix Inc.</strong> ("Provider") and <strong>${contract.counterparty}</strong> ("Client").</p>
      
      <h2>1. Services</h2>
      <p>Provider agrees to perform the services described in one or more Statements of Work ("SOW") attached hereto as Exhibit A. Detailed specifications for the Services shall be set forth in the applicable SOW.</p>
      
      <h2>2. Term and Termination</h2>
      <p>This Agreement shall commence on the Effective Date and continue for a period of three (3) years (the "Initial Term"). Thereafter, it shall automatically renew for successive one-year periods unless either party provides written notice of non-renewal at least thirty (30) days prior to the end of the then-current term.</p>
      
      <h2>3. Fees and Payment</h2>
      <p>Client shall pay Provider the fees set forth in the applicable SOW. All invoices are due and payable within thirty (30) days of the invoice date.</p>
      
      <h2>4. Confidentiality</h2>
      <p>Each party agrees to protect the Confidential Information of the other party with the same degree of care that it uses to protect its own confidential information of like kind, but in no event less than reasonable care.</p>
      
      <blockquote>"Confidential Information" means all information disclosed by a party ("Disclosing Party") to the other party ("Receiving Party"), whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.</blockquote>
    `,
  });

  // --- VIEW RENDERERS ---

  const renderOverview = () => (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="Executive Summary" className="col-span-2">
                  <div className="flex gap-4 items-start">
                      <div className="p-3 bg-brand-500/10 rounded-xl border border-brand-500/20 text-brand-400 shrink-0">
                          <Bot size={24} />
                      </div>
                      <div className="space-y-3">
                          <p className="text-slate-300 text-sm leading-relaxed">
                              This is a standard <strong>{contract.type}</strong> with <strong>{contract.counterparty}</strong>. 
                              It includes a <span className="text-white font-bold">3-year term</span> with auto-renewal. 
                              Key obligations focus on data privacy (GDPR) and quarterly performance reviews. 
                              <span className="text-yellow-400"> Note:</span> Liability cap is higher than standard playbook (3x vs 2x).
                          </p>
                          <div className="flex gap-2">
                              <Badge color="green">Standard Terms</Badge>
                              <Badge color="yellow">High Liability</Badge>
                              <Badge color="blue">GDPR</Badge>
                          </div>
                      </div>
                  </div>
              </Card>
              <Card title="Key Dates">
                  <div className="space-y-4">
                      <div className="flex justify-between items-center p-2 bg-dark-950 rounded border border-dark-700">
                          <div className="flex items-center gap-3">
                              <Calendar size={16} className="text-green-400"/>
                              <div>
                                  <p className="text-xs text-slate-500 uppercase font-bold">Effective Date</p>
                                  <p className="text-sm font-bold text-white">{contract.startDate}</p>
                              </div>
                          </div>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-dark-950 rounded border border-dark-700">
                          <div className="flex items-center gap-3">
                              <Calendar size={16} className="text-red-400"/>
                              <div>
                                  <p className="text-xs text-slate-500 uppercase font-bold">Renewal / Expiry</p>
                                  <p className="text-sm font-bold text-white">{contract.renewalDate}</p>
                              </div>
                          </div>
                          <Badge color="blue">Auto-Renew</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-dark-950 rounded border border-dark-700">
                          <div className="flex items-center gap-3">
                              <Clock size={16} className="text-yellow-400"/>
                              <div>
                                  <p className="text-xs text-slate-500 uppercase font-bold">Notice Period</p>
                                  <p className="text-sm font-bold text-white">60 Days</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </Card>
          </div>

          {/* Metadata Grid */}
          <Card title="Contract Data" noPadding>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-dark-700 border-b border-dark-700">
                  <div className="p-4">
                      <p className="text-xs text-slate-500 mb-1">Contract Type</p>
                      <p className="text-sm text-white font-medium">{contract.type}</p>
                  </div>
                  <div className="p-4">
                      <p className="text-xs text-slate-500 mb-1">Jurisdiction</p>
                      <p className="text-sm text-white font-medium">New York, USA</p>
                  </div>
                  <div className="p-4">
                      <p className="text-xs text-slate-500 mb-1">Business Unit</p>
                      <p className="text-sm text-white font-medium">Enterprise Sales</p>
                  </div>
                  <div className="p-4">
                      <p className="text-xs text-slate-500 mb-1">Payment Terms</p>
                      <p className="text-sm text-white font-medium">Net 45</p>
                  </div>
                  <div className="p-4">
                      <p className="text-xs text-slate-500 mb-1">Owner</p>
                      <div className="flex items-center gap-2">
                          <Avatar name={contract.owner} size="sm"/>
                          <p className="text-sm text-white font-medium">{contract.owner}</p>
                      </div>
                  </div>
                  <div className="p-4">
                      <p className="text-xs text-slate-500 mb-1">Counterparty Contact</p>
                      <p className="text-sm text-white font-medium">legal@counterparty.com</p>
                  </div>
                  <div className="p-4">
                      <p className="text-xs text-slate-500 mb-1">Folder Location</p>
                      <p className="text-sm text-brand-400 font-medium flex items-center gap-1 cursor-pointer hover:underline"><FolderTree size={12}/> /Legal/Commercial/MSA</p>
                  </div>
                  <div className="p-4">
                      <p className="text-xs text-slate-500 mb-1">Linked Opportunity</p>
                      <p className="text-sm text-blue-400 font-medium flex items-center gap-1 cursor-pointer hover:underline"><LinkIcon size={12}/> OPP-2024-8392</p>
                  </div>
              </div>
          </Card>
      </div>
  );

  // --- EDITOR VIEW (DOCUMENT TAB) ---
  const renderDocumentEditor = () => (
      <div className="flex flex-col h-full">
          {/* RIBBON TOOLBAR */}
          <div className="bg-dark-900 border-b border-dark-700 shrink-0 flex flex-col">
              <div className="flex px-2 border-b border-dark-800">
                  {['Home', 'Insert', 'Review', 'View'].map(tab => (
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
                  {editor && ribbonTab === 'home' && (
                      <>
                          <div className="flex items-center gap-1 mr-2">
                              <RibbonButton 
                                icon={Undo} 
                                label="Undo" 
                                onClick={() => editor.chain().focus().undo().run()} 
                                disabled={!editor.can().undo()}
                              />
                              <RibbonButton 
                                icon={Redo} 
                                label="Redo" 
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                              />
                          </div>
                          <RibbonDivider />
                          <div className="flex items-center gap-2 mx-2">
                              <Select 
                                options={[
                                    {label: 'Normal', value: 'paragraph'}, 
                                    {label: 'Heading 1', value: '1'},
                                    {label: 'Heading 2', value: '2'},
                                    {label: 'Heading 3', value: '3'}
                                ]} 
                                className="w-32 h-8 text-xs bg-dark-950"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if(val === 'paragraph') editor.chain().focus().setParagraph().run();
                                    else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
                                }} 
                              />
                          </div>
                          <RibbonDivider />
                          <div className="flex items-center gap-1 mx-2">
                              <RibbonButton 
                                icon={Bold} label="Bold" 
                                active={editor.isActive('bold')} 
                                onClick={() => editor.chain().focus().toggleBold().run()} 
                              />
                              <RibbonButton 
                                icon={Italic} label="Italic" 
                                active={editor.isActive('italic')} 
                                onClick={() => editor.chain().focus().toggleItalic().run()} 
                              />
                              <RibbonButton 
                                icon={Quote} label="Quote" 
                                active={editor.isActive('blockquote')} 
                                onClick={() => editor.chain().focus().toggleBlockquote().run()} 
                              />
                          </div>
                          <RibbonDivider />
                          <RibbonButton icon={List} label="List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
                          <RibbonButton icon={Code} label="Code" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
                      </>
                  )}
                  {ribbonTab === 'review' && (
                      <>
                          <div className="flex items-center bg-dark-950 rounded-lg p-1 border border-dark-700 mr-2">
                              <button onClick={() => setEditMode('editing')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${editMode === 'editing' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}>Editing</button>
                              <button onClick={() => setEditMode('suggesting')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1 ${editMode === 'suggesting' ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-white'}`}><GitBranch size={12}/> Suggesting</button>
                          </div>
                          <RibbonDivider />
                          <RibbonButton icon={MessageSquare} label="Comment" onClick={() => { setShowRightSidebar(true); setSidebarTab('comments'); }} />
                          <RibbonButton icon={CheckCircle2} label="Accept All" />
                      </>
                  )}
                  {ribbonTab === 'insert' && (
                      <>
                          <RibbonButton icon={BookOpen} label="Clause" />
                          <RibbonButton icon={Database} label="Variable" />
                          <RibbonButton icon={PenTool} label="Signature" onClick={() => editor?.chain().focus().insertContent('<p><strong>[SIGNATURE BLOCK]</strong></p>').run()}/>
                          <RibbonButton icon={Wand2} label="AI Block" />
                      </>
                  )}
                  {ribbonTab === 'view' && (
                      <div className="flex items-center gap-2 bg-dark-950 rounded-lg p-1 border border-dark-700">
                          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 text-slate-400 hover:text-white"><ZoomOut size={16}/></button>
                          <span className="text-xs font-mono w-10 text-center">{zoom}%</span>
                          <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1 text-slate-400 hover:text-white"><ZoomIn size={16}/></button>
                      </div>
                  )}
              </div>
          </div>

          {/* MAIN WORKSPACE */}
          <div className="flex-1 flex overflow-hidden relative">
              {/* LEFT SIDEBAR: OUTLINE */}
              {showLeftSidebar && (
                  <div className="w-64 bg-dark-950 border-r border-dark-700 flex flex-col z-10 shrink-0">
                      <div className="p-4 border-b border-dark-800 flex justify-between items-center">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outline</h3>
                          <button onClick={() => setShowLeftSidebar(false)} className="text-slate-500 hover:text-white"><X size={14}/></button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                          {['1. Services', '2. Term and Termination', '3. Fees and Payment', '4. Confidentiality', '5. Limitation of Liability'].map((item, i) => (
                              <button key={i} className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors truncate flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-dark-700"></div>
                                  {item}
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              {/* CENTER: CANVAS WITH TIPTAP */}
              <div className="flex-1 overflow-y-auto bg-dark-900/50 relative flex justify-center p-8 custom-scrollbar" onClick={() => editor?.commands.focus()}>
                  <div 
                      className="bg-white shadow-2xl transition-transform duration-200 ease-out origin-top mb-20 relative"
                      style={{ width: '816px', minHeight: '1056px', padding: '96px', transform: `scale(${zoom / 100})` }}
                  >
                      {editor && (
                        <>
                          <EditorContent editor={editor} className="prose prose-slate max-w-none focus:outline-none min-h-[500px] text-black" />
                        </>
                      )}
                  </div>
              </div>

              {/* RIGHT SIDEBAR: CONTEXT PANEL */}
              {showRightSidebar && (
                  <div className="w-80 bg-dark-950 border-l border-dark-700 flex flex-col z-10 shrink-0 shadow-xl">
                      <div className="flex border-b border-dark-800 bg-dark-900">
                          {[
                              {id: 'comments', icon: MessageSquare, label: comments.filter(c=>!c.resolved).length},
                              {id: 'changes', icon: GitBranch, label: changes.filter(c=>c.status==='pending').length},
                              {id: 'clauses', icon: BookOpen, label: ''},
                              {id: 'ai', icon: Sparkles, label: ''},
                          ].map(tab => (
                              <button 
                                  key={tab.id}
                                  onClick={() => setSidebarTab(tab.id as any)}
                                  className={`flex-1 py-3 flex justify-center items-center relative transition-colors ${sidebarTab === tab.id ? 'text-brand-400 bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                              >
                                  <tab.icon size={16} />
                                  {tab.label ? <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold border border-dark-900">{tab.label}</span> : null}
                                  {sidebarTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500"></div>}
                              </button>
                          ))}
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                          {sidebarTab === 'comments' && (
                              <div className="space-y-4">
                                  <div className="flex justify-between items-center mb-2">
                                      <h4 className="text-xs font-bold text-slate-500 uppercase">Open Threads</h4>
                                      <button className="text-xs text-brand-400 hover:text-white flex items-center gap-1"><Plus size={12}/> New</button>
                                  </div>
                                  {comments.filter(c => !c.resolved).map(comment => (
                                      <div key={comment.id} className="bg-dark-900 border border-dark-700 rounded-xl p-3 hover:border-brand-500/30 transition-all group">
                                          <div className="flex justify-between items-start mb-2">
                                              <div className="flex items-center gap-2">
                                                  <Avatar name={comment.userName} size="sm" className="w-6 h-6 text-[9px]" />
                                                  <span className="text-xs font-bold text-white">{comment.userName}</span>
                                                  <span className="text-[10px] text-slate-500">{comment.date}</span>
                                              </div>
                                              <button className="text-slate-500 hover:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"><Check size={14}/></button>
                                          </div>
                                          <p className="text-sm text-slate-300 mb-2">{comment.text}</p>
                                          <input placeholder="Reply..." className="w-full bg-dark-950 border border-dark-800 rounded px-2 py-1 text-xs text-white focus:border-brand-500 outline-none"/>
                                      </div>
                                  ))}
                              </div>
                          )}
                          {sidebarTab === 'clauses' && (
                              <div className="space-y-4">
                                  <Input placeholder="Search clause library..." className="bg-dark-900 text-xs"/>
                                  {MOCK_CLAUSES.map(c => (
                                      <div key={c.id} draggable className="p-3 bg-dark-900 rounded border border-dark-700 cursor-grab hover:border-brand-500/50">
                                          <div className="flex justify-between mb-1"><span className="font-bold text-xs text-white">{c.name}</span><Badge color="gray" className="text-[9px]">{c.category}</Badge></div>
                                          <p className="text-xs text-slate-400 line-clamp-2 italic">"{c.content}"</p>
                                      </div>
                                  ))}
                              </div>
                          )}
                          {sidebarTab === 'ai' && (
                              <div className="space-y-6">
                                  <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl">
                                      <div className="flex items-center gap-2 mb-3 text-brand-400 font-bold text-sm"><Sparkles size={16}/> AI Analysis</div>
                                      <p className="text-xs text-slate-300 leading-relaxed mb-4">Scanning document...</p>
                                      <Button variant="neon" className="w-full text-xs">Re-Analyze</Button>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              )}
          </div>
      </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -m-6 bg-[#0F1115] text-slate-200 overflow-hidden">
        
        {/* 1. GLOBAL HEADER */}
        <div className="h-16 bg-dark-950 border-b border-dark-700 flex items-center justify-between px-6 shrink-0 z-30 shadow-lg">
            <div className="flex items-center gap-4">
                <Link to="/repository" className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                </Link>
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-white tracking-tight">{contract.title}</h1>
                        <Badge color={contract.status === 'Signed' ? 'green' : 'blue'}>{contract.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                       <span className="font-mono opacity-70">{contract.id}</span>
                       <span>•</span>
                       <span className="flex items-center gap-1"><User size={10}/> {contract.counterparty}</span>
                    </div>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="hidden xl:flex bg-dark-900/50 rounded-lg border border-dark-700 p-1.5">
                <SummaryMetric label="Value" value={`$${contract.value.toLocaleString()}`} icon={DollarSign} color="text-green-400"/>
                <SummaryMetric label="Risk" value={`${contract.riskScore}/100`} icon={Shield} color={contract.riskScore > 50 ? 'text-red-400' : 'text-green-400'}/>
                <SummaryMetric label="Renewal" value={contract.renewalDate} icon={Calendar}/>
                <SummaryMetric label="Owner" value={contract.owner} icon={User}/>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="secondary" className="h-9 text-xs shadow-sm" onClick={() => setShowAIChat(!showAIChat)}><Bot size={16} className="mr-2 text-brand-400"/> Ask AI</Button>
                <div className="h-8 w-px bg-dark-700 mx-1"></div>
                <Button variant="primary" className="h-9 text-xs shadow-lg shadow-brand-500/20"><Save size={16} className="mr-2"/> Save</Button>
            </div>
        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="bg-dark-900 border-b border-dark-700 px-6 flex gap-6">
            {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'document', label: 'Document Editor', icon: FileText },
                { id: 'workflow', label: 'Workflow', icon: GitBranch },
                { id: 'obligations', label: 'Obligations', icon: CheckSquare },
                { id: 'financials', label: 'Financials', icon: DollarSign },
                { id: 'risk', label: 'Risk & Compliance', icon: AlertTriangle },
                { id: 'family', label: 'Related Contracts', icon: FolderTree },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as ViewTab)}
                    className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-all ${activeView === tab.id ? 'border-brand-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>

        {/* 3. MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-dark-950 relative custom-scrollbar">
            {activeView === 'document' && renderDocumentEditor()}
            {activeView === 'overview' && renderOverview()}
            {/* Other views omitted for brevity as they use the same pattern as before */}
            {/* AI Chat Float */}
            {showAIChat && (
                <div className="absolute bottom-6 right-6 w-96 bg-dark-900 border border-brand-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 z-50 h-[500px]">
                    <div className="p-4 bg-brand-500/10 border-b border-brand-500/20 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2"><Bot size={18} className="text-brand-400"/> Contract Assistant</h3>
                        <button onClick={() => setShowAIChat(false)}><X size={16} className="text-slate-400 hover:text-white"/></button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-400 shrink-0"><Bot size={16}/></div>
                            <div className="bg-dark-800 p-3 rounded-2xl rounded-tl-none text-sm text-slate-300 border border-dark-700">
                                I've analyzed this agreement. You can ask me about risks, obligations, or specific clauses.
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-dark-700 bg-dark-950">
                        <input placeholder="Ask about this contract..." className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 outline-none"/>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ContractViewer;
