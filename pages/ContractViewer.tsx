
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Badge, Avatar, Input, Select, Card } from '../components/UIComponents';
import { MOCK_CONTRACTS, MOCK_CLAUSES, MOCK_VERSIONS as INITIAL_VERSIONS } from '../mock/data';
import { DocumentTemplate } from '../types';
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
  AlertCircle, FolderTree, Bot, Play, Flag, Wand2, Quote, Code,
  Workflow, ArrowRight, Trash2, MousePointer2,
  Minimize2, Maximize2, RefreshCw
} from 'lucide-react';

// Imports for Editor
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { StructurePanel, ReviewPanel, CompliancePanel, AIPanel, LogicPanel, GovernancePanel, VariablesPanel, ClausesPanel, HistoryPanel } from '../components/editor/EditorPanels';
import { LayoutSettingsModal, CollapsibleSection } from '../components/editor/EditorUI';
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

type ViewTab = 'document' | 'signature' | 'overview' | 'workflow' | 'obligations';
type LifecycleStage = 'Request' | 'Draft' | 'Review' | 'Approval' | 'Sign' | 'Active';

const LIFECYCLE_STEPS: LifecycleStage[] = ['Request', 'Draft', 'Review', 'Approval', 'Sign', 'Active'];

interface Signer {
    id: string;
    name: string;
    email: string;
    role: 'Internal' | 'External';
    color: string;
}

interface PlacedField {
    id: string;
    type: string;
    x: number;
    y: number;
    signerId: string;
    page: number;
}

// --- HELPER COMPONENTS ---

const LifecycleRibbon: React.FC<{ currentStage: LifecycleStage }> = ({ currentStage }) => {
    const currentIndex = LIFECYCLE_STEPS.indexOf(currentStage);
    
    return (
        <div className="flex items-center w-full bg-dark-900 border-b border-dark-800 px-6 py-0 h-12 overflow-x-auto custom-scrollbar">
            {LIFECYCLE_STEPS.map((step, i) => {
                const isActive = i === currentIndex;
                const isPast = i < currentIndex;
                
                return (
                    <div key={step} className="flex items-center">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            isActive ? 'bg-brand-500 text-white shadow-[0_0_10px_rgba(var(--color-brand-500),0.4)]' : 
                            isPast ? 'text-brand-400' : 'text-slate-600'
                        }`}>
                            {isPast ? <CheckCircle2 size={14} /> : <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-slate-600'}`}></div>}
                            {step}
                        </div>
                        {i < LIFECYCLE_STEPS.length - 1 && (
                            <div className={`w-8 h-0.5 mx-2 ${isPast ? 'bg-brand-500/50' : 'bg-dark-700'}`}></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const SignatureSetup: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [activeSignerId, setActiveSignerId] = useState('s1');
    const [placedFields, setPlacedFields] = useState<PlacedField[]>([]);
    const [zoom, setZoom] = useState(100);
    const canvasRef = useRef<HTMLDivElement>(null);

    const signers: Signer[] = [
        { id: 's1', name: 'Harvey Specter', email: 'harvey@psl.com', role: 'Internal', color: 'bg-blue-500' },
        { id: 's2', name: 'John Doe', email: 'legal@acme.com', role: 'External', color: 'bg-yellow-500' }
    ];

    const activeSigner = signers.find(s => s.id === activeSignerId);

    const handleDragStart = (e: React.DragEvent, type: string) => {
        e.dataTransfer.setData('fieldType', type);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const fieldType = e.dataTransfer.getData('fieldType');
        if (!fieldType || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        // Calculate position relative to the canvas (taking zoom into account)
        const x = (e.clientX - rect.left) / (zoom / 100);
        const y = (e.clientY - rect.top) / (zoom / 100);

        const newField: PlacedField = {
            id: `f_${Date.now()}`,
            type: fieldType,
            x: Math.min(Math.max(0, x - 60), 816 - 120), // Simple bounds checking
            y: Math.min(Math.max(0, y - 20), 1056 - 40),
            signerId: activeSignerId,
            page: 1
        };

        setPlacedFields([...placedFields, newField]);
    };

    const removeField = (id: string) => {
        setPlacedFields(placedFields.filter(f => f.id !== id));
    };

    return (
        <div className="flex h-full bg-dark-950">
            {/* Sidebar */}
            <div className="w-72 border-r border-dark-800 bg-dark-900 flex flex-col z-20">
                <div className="p-4 border-b border-dark-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">1. Select Signer</h4>
                    <div className="space-y-2">
                        {signers.map(s => (
                            <div 
                                key={s.id} 
                                onClick={() => setActiveSignerId(s.id)}
                                className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center gap-3 ${activeSignerId === s.id ? `bg-${s.color === 'bg-blue-500' ? 'blue' : 'yellow'}-500/10 border-${s.color === 'bg-blue-500' ? 'blue' : 'yellow'}-500` : 'bg-dark-950 border-dark-700 hover:border-slate-600'}`}
                            >
                                <div className={`w-8 h-8 rounded-full ${s.color} text-white flex items-center justify-center text-xs font-bold shadow-lg`}>
                                    {s.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold ${activeSignerId === s.id ? 'text-white' : 'text-slate-300'}`}>{s.name}</p>
                                    <p className="text-[10px] text-slate-500">{s.role} • {s.email}</p>
                                </div>
                                {activeSignerId === s.id && <div className={`w-2 h-2 rounded-full ${s.color}`}></div>}
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-3 text-xs border border-dashed border-dark-700 hover:border-slate-500 text-slate-400 hover:text-white">
                        <Plus size={14} className="mr-2"/> Add Signer
                    </Button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">2. Drag Fields</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {['Signature', 'Initials', 'Date Signed', 'Name', 'Title', 'Company', 'Text Box', 'Checkbox'].map(field => (
                            <div 
                                key={field} 
                                draggable
                                onDragStart={(e) => handleDragStart(e, field)}
                                className="p-3 bg-dark-950 border border-dark-700 rounded-lg text-xs font-medium text-slate-300 flex flex-col items-center gap-2 hover:border-brand-500 hover:bg-brand-500/5 hover:text-white cursor-grab active:cursor-grabbing transition-all"
                            >
                                <div className="p-1.5 bg-dark-800 rounded text-slate-400">
                                    {field === 'Signature' ? <PenTool size={16}/> : field === 'Date Signed' ? <Calendar size={16}/> : <Type size={16}/>}
                                </div>
                                {field}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-dark-800 bg-dark-950/50">
                    <div className="flex justify-between items-center mb-4 text-xs text-slate-400">
                        <span>Fields placed: <strong className="text-white">{placedFields.length}</strong></span>
                        <button className="hover:text-red-400" onClick={() => setPlacedFields([])}>Reset All</button>
                    </div>
                    <Button variant="primary" className="w-full shadow-lg shadow-brand-500/20" onClick={onComplete} disabled={placedFields.length === 0}>
                        Send Envelope <ArrowRight size={16} className="ml-2"/>
                    </Button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-dark-950/50 overflow-y-auto p-8 flex justify-center relative" onClick={(e) => e.stopPropagation()}>
                <div 
                    className="bg-white transition-transform duration-200 shadow-2xl origin-top relative"
                    style={{ 
                        width: '816px', 
                        minHeight: '1056px',
                        transform: `scale(${zoom / 100})`
                    }}
                >
                    {/* Drop Zone Overlay */}
                    <div 
                        ref={canvasRef}
                        className="absolute inset-0 z-10"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {placedFields.map((field) => {
                            const signer = signers.find(s => s.id === field.signerId);
                            const borderColor = signer?.color.replace('bg-', 'border-');
                            const bgColor = signer?.color.replace('bg-', 'bg-') + '/10';
                            const textColor = signer?.color.replace('bg-', 'text-');

                            return (
                                <div
                                    key={field.id}
                                    className={`absolute flex items-center justify-center border-2 rounded group cursor-pointer hover:shadow-lg ${borderColor} ${bgColor}`}
                                    style={{
                                        left: field.x,
                                        top: field.y,
                                        width: '140px',
                                        height: '40px'
                                    }}
                                >
                                    <span className={`text-xs font-bold uppercase ${textColor} flex items-center gap-1`}>
                                        {field.type}
                                        {signer?.role === 'Internal' ? <User size={10}/> : <Globe size={10}/>}
                                    </span>
                                    
                                    {/* Delete Button */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X size={12}/>
                                    </button>
                                    
                                    {/* Tooltip */}
                                    <div className={`absolute top-full left-0 mt-1 px-2 py-1 rounded text-[9px] text-white bg-dark-900 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none`}>
                                        Assigned to: {signer?.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mock Document Content */}
                    <div className="p-16 text-black font-serif text-sm space-y-6 pointer-events-none select-none opacity-80">
                        <h1 className="text-center text-2xl font-bold mb-12">MASTER SERVICES AGREEMENT</h1>
                        <p>This Master Services Agreement (the "Agreement") is entered into as of April 1, 2024 (the "Effective Date"), by and between <strong>Agreemetrix Inc.</strong>, a Delaware corporation ("Client"), and <strong>TechFlow Inc.</strong> ("Provider").</p>
                        <p className="font-bold mt-6">1. SERVICES</p>
                        <p>Provider agrees to perform the services described in one or more Statements of Work ("SOW") attached hereto (the "Services"). Provider shall perform the Services in a professional and workmanlike manner.</p>
                        <p className="font-bold mt-6">2. PAYMENT</p>
                        <p>Client shall pay Provider the fees set forth in the applicable SOW. Unless otherwise specified, payment terms are Net 30 days from receipt of an undisputed invoice.</p>
                        <p className="font-bold mt-6">3. TERM AND TERMINATION</p>
                        <p>This Agreement commences on the Effective Date and continues for a period of one (1) year, automatically renewing for successive one-year terms unless terminated by either party with thirty (30) days' written notice.</p>
                        <p className="font-bold mt-6">4. CONFIDENTIALITY</p>
                        <p>Each party agrees to protect the other party's Confidential Information with the same degree of care it uses to protect its own confidential information of like nature, but in no event less than reasonable care.</p>
                        
                        {/* Spacer for signature area at bottom */}
                        <div className="mt-32 pt-8 border-t-2 border-black flex justify-between">
                            <div className="w-5/12">
                                <p className="font-bold mb-4">Agreemetrix Inc.</p>
                                <div className="h-10 border-b border-black mb-2"></div>
                                <p className="text-xs">Authorized Signature</p>
                                <p className="mt-4 text-xs">Name: Harvey Specter</p>
                                <p className="text-xs">Title: Senior Partner</p>
                            </div>
                            <div className="w-5/12">
                                <p className="font-bold mb-4">TechFlow Inc.</p>
                                <div className="h-10 border-b border-black mb-2"></div>
                                <p className="text-xs">Authorized Signature</p>
                                <p className="mt-4 text-xs">Name: _________________</p>
                                <p className="text-xs">Title: __________________</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-dark-900/90 backdrop-blur border border-dark-700 rounded-full p-1 shadow-xl z-20">
                    <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"><Minimize2 size={14}/></button>
                    <span className="text-xs font-mono w-10 text-center text-slate-300">{zoom}%</span>
                    <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"><Maximize2 size={14}/></button>
                </div>
            </div>
        </div>
    );
};

// --- ACTIVE (SIGNED) VIEW ---

const ActiveContractView: React.FC = () => {
    return (
        <div className="flex h-full bg-dark-950">
            {/* Left Sidebar: Metadata & Activity */}
            <div className="w-80 border-r border-dark-800 bg-dark-900 flex flex-col z-20 overflow-hidden">
                <div className="p-6 border-b border-dark-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                            <CheckCircle2 size={24}/>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Active</h3>
                            <p className="text-xs text-green-400 font-medium">Signed on Apr 2, 2024</p>
                        </div>
                    </div>
                    <Button variant="primary" className="w-full shadow-lg shadow-brand-500/10 mb-2">
                        <Download size={16} className="mr-2"/> Download Signed PDF
                    </Button>
                    <Button variant="secondary" className="w-full text-xs">
                        <Share2 size={14} className="mr-2"/> Share with Stakeholders
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <CollapsibleSection title="Key Terms" icon={FileText} defaultOpen={true}>
                        <div className="space-y-3 mt-2">
                            <div className="p-3 bg-dark-950 rounded-lg border border-dark-800">
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Effective Date</p>
                                <p className="text-sm text-white font-medium">April 1, 2024</p>
                            </div>
                            <div className="p-3 bg-dark-950 rounded-lg border border-dark-800">
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Renewal Date</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-white font-medium">April 1, 2025</p>
                                    <Badge color="yellow">364 Days Left</Badge>
                                </div>
                            </div>
                            <div className="p-3 bg-dark-950 rounded-lg border border-dark-800">
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Total Value</p>
                                <p className="text-sm text-white font-medium font-mono">$150,000.00 USD</p>
                            </div>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="Obligations" icon={CheckSquare} defaultOpen={true} rightElement={<Badge color="blue">2</Badge>}>
                        <div className="space-y-2 mt-2">
                            <div className="flex gap-3 items-start p-2 hover:bg-dark-800 rounded transition-colors cursor-pointer">
                                <div className="mt-0.5 min-w-[16px]"><Clock size={16} className="text-yellow-500"/></div>
                                <div>
                                    <p className="text-xs text-slate-200 font-medium">Payment Milestone 1</p>
                                    <p className="text-[10px] text-slate-500">Due May 1, 2024</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start p-2 hover:bg-dark-800 rounded transition-colors cursor-pointer">
                                <div className="mt-0.5 min-w-[16px]"><RefreshCw size={16} className="text-blue-500"/></div>
                                <div>
                                    <p className="text-xs text-slate-200 font-medium">QBR Meeting</p>
                                    <p className="text-[10px] text-slate-500">Due July 1, 2024</p>
                                </div>
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>
            </div>

            {/* Main Viewer */}
            <div className="flex-1 bg-dark-950/50 p-8 overflow-y-auto flex justify-center">
                <div className="bg-white w-[816px] min-h-[1056px] shadow-2xl relative text-black p-16 font-serif text-sm opacity-90 select-none pointer-events-none">
                    {/* Watermark */}
                    <div className="absolute top-8 right-8 border-4 border-green-600 text-green-600 px-4 py-2 rounded font-sans font-bold text-xl opacity-40 rotate-[-15deg]">
                        SIGNED & EXECUTED
                    </div>

                    <h1 className="text-center text-2xl font-bold mb-12">MASTER SERVICES AGREEMENT</h1>
                    <p className="mb-6 text-justify leading-relaxed">This Master Services Agreement (the "Agreement") is entered into as of April 1, 2024 (the "Effective Date"), by and between <strong>Agreemetrix Inc.</strong>, a Delaware corporation ("Client"), and <strong>TechFlow Inc.</strong> ("Provider").</p>
                    
                    <p className="font-bold mt-6 mb-2">1. SERVICES</p>
                    <p className="mb-4 text-justify leading-relaxed">Provider agrees to perform the services described in one or more Statements of Work ("SOW") attached hereto (the "Services"). Provider shall perform the Services in a professional and workmanlike manner consistent with industry standards.</p>
                    
                    <p className="font-bold mt-6 mb-2">2. PAYMENT</p>
                    <p className="mb-4 text-justify leading-relaxed">Client shall pay Provider the fees set forth in the applicable SOW. Unless otherwise specified, payment terms are Net 30 days from receipt of an undisputed invoice. Late payments shall accrue interest at a rate of 1.5% per month or the maximum rate permitted by law, whichever is lower.</p>
                    
                    <div className="mt-20 pt-8 border-t-2 border-black flex justify-between">
                        <div className="w-5/12 relative">
                            {/* Digital Signature Stamp */}
                            <div className="absolute -top-12 left-4 font-script text-3xl text-blue-800 opacity-90 rotate-[-5deg]">Harvey Specter</div>
                            <div className="absolute -top-14 left-32 text-[8px] font-sans text-slate-500 bg-white/80 px-1 border border-slate-300">
                                Digitally Signed<br/>ID: 8a92-b412<br/>04/02/2024
                            </div>

                            <p className="font-bold mb-4">Agreemetrix Inc.</p>
                            <div className="h-10 border-b border-black mb-2"></div>
                            <p className="text-xs">Authorized Signature</p>
                            <p className="mt-4 text-xs">Name: Harvey Specter</p>
                            <p className="text-xs">Title: Senior Partner</p>
                        </div>
                        <div className="w-5/12 relative">
                             {/* Digital Signature Stamp */}
                             <div className="absolute -top-10 left-6 font-script text-2xl text-black opacity-80">John Doe</div>
                             <div className="absolute -top-14 left-32 text-[8px] font-sans text-slate-500 bg-white/80 px-1 border border-slate-300">
                                Digitally Signed<br/>ID: 7c31-f900<br/>04/02/2024
                            </div>

                            <p className="font-bold mb-4">TechFlow Inc.</p>
                            <div className="h-10 border-b border-black mb-2"></div>
                            <p className="text-xs">Authorized Signature</p>
                            <p className="mt-4 text-xs">Name: John Doe</p>
                            <p className="text-xs">Title: CEO</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const ContractViewer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Determine Contract Context (Mock)
  const contract = id === 'new-draft' ? {
      id: 'CTR-DRAFT-001',
      title: 'MSA - TechFlow Inc (Draft)',
      counterparty: 'TechFlow Inc',
      value: 150000,
      status: 'Draft',
      startDate: '2024-04-01',
      renewalDate: '2025-04-01',
      riskScore: 10,
      owner: 'Harvey Specter',
      type: 'MSA'
  } : MOCK_CONTRACTS.find(c => c.id === id) || MOCK_CONTRACTS[0];

  // State
  const [activeView, setActiveView] = useState<ViewTab>('document');
  const [lifecycleStage, setLifecycleStage] = useState<LifecycleStage>(
      contract.status === 'Draft' ? 'Draft' : 
      contract.status === 'In Review' ? 'Review' : 
      contract.status === 'Pending Approval' ? 'Approval' :
      contract.status === 'Signed' ? 'Active' : 'Draft'
  );

  // Force Active view if status matches
  useEffect(() => {
      if (contract.status === 'Signed' || lifecycleStage === 'Active') {
          setActiveView('overview'); // Reuse logic or create distinct active view switch
      }
  }, [contract.status, lifecycleStage]);

  // Editor State (Lifted from internal component for direct control)
  const editor = useEditor({
    extensions: [
      StarterKit, TextStyle as any, Color, FontFamily, TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start drafting...' }), ExtensionBubbleMenu, ExtensionFloatingMenu,
      UnderlineExtension, Highlight.configure({ multicolor: true }), SubscriptExtension, SuperscriptExtension,
      (TiptapTable as any).configure({ resizable: true }), TableRow, TableHeader, TableCell, ImageExtension, 
      LinkExtension, TaskList, TaskItem
    ],
    content: `<h1>${contract.type} Agreement</h1><p>This ${contract.type} ("Agreement") is made effective as of <strong>${contract.startDate}</strong>.</p><p>Between <strong>Agreemetrix Inc.</strong> and <strong>${contract.counterparty}</strong>.</p><p>WHEREAS, Provider is in the business of providing software services...</p>`,
  });

  const [ribbonTab, setRibbonTab] = useState('home');
  const [leftTab, setLeftTab] = useState('structure');
  const [rightTab, setRightTab] = useState('review');
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const handlePrimaryAction = () => {
      if (lifecycleStage === 'Draft') setLifecycleStage('Review');
      else if (lifecycleStage === 'Review') setLifecycleStage('Approval');
      else if (lifecycleStage === 'Approval') setActiveView('signature'); // Go to sign setup
      else if (lifecycleStage === 'Sign') setLifecycleStage('Active');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -m-6 bg-[#0F1115] text-slate-200 overflow-hidden">
        
        {/* 1. GLOBAL HEADER */}
        <div className="h-16 bg-dark-950 border-b border-dark-700 flex items-center justify-between px-6 shrink-0 z-30 shadow-lg">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/repository')} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-white tracking-tight">{contract.title}</h1>
                        <Badge color={contract.status === 'Signed' || lifecycleStage === 'Active' ? 'green' : 'blue'}>{lifecycleStage}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                       <span className="font-mono opacity-70">{contract.id}</span>
                       <span>•</span>
                       <span className="flex items-center gap-1"><User size={10}/> {contract.counterparty}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {lifecycleStage !== 'Active' && (
                    <>
                        <Button variant="secondary" className="h-9 text-xs shadow-sm"><Share2 size={16} className="mr-2"/> Share</Button>
                        <div className="h-8 w-px bg-dark-700 mx-1"></div>
                        <Button variant="primary" className="h-9 text-xs shadow-lg shadow-brand-500/20" onClick={handlePrimaryAction}>
                            {lifecycleStage === 'Draft' ? 'Send for Review' : 
                            lifecycleStage === 'Review' ? 'Submit for Approval' :
                            lifecycleStage === 'Approval' ? 'Prepare for Signature' :
                            lifecycleStage === 'Sign' ? 'Mark as Signed' : 'Download PDF'}
                            <ArrowRight size={16} className="ml-2"/>
                        </Button>
                    </>
                )}
                {lifecycleStage === 'Active' && (
                    <Button variant="secondary" className="h-9 text-xs border-green-500/30 text-green-400 bg-green-500/10 cursor-default">
                        <CheckCircle2 size={16} className="mr-2"/> Contract Active
                    </Button>
                )}
            </div>
        </div>

        {/* 2. LIFECYCLE RIBBON */}
        <LifecycleRibbon currentStage={lifecycleStage} />

        {/* 3. NAVIGATION TABS (Hidden in Active View for simplicity, or show subset) */}
        {lifecycleStage !== 'Active' && (
            <div className="bg-dark-900 border-b border-dark-700 px-6 flex gap-6 shrink-0">
                {[
                    { id: 'document', label: 'Document Editor', icon: FileText },
                    { id: 'signature', label: 'Signature Setup', icon: PenTool, disabled: lifecycleStage === 'Draft' || lifecycleStage === 'Review' },
                    { id: 'overview', label: 'Overview', icon: Activity },
                    { id: 'workflow', label: 'Workflow', icon: GitBranch },
                ].map(tab => (
                    <button
                        key={tab.id}
                        disabled={tab.disabled}
                        onClick={() => setActiveView(tab.id as ViewTab)}
                        className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-all ${activeView === tab.id ? 'border-brand-500 text-white' : 'border-transparent text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'}`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>
        )}

        {/* 4. MAIN CONTENT AREA */}
        <div className="flex-1 overflow-hidden relative bg-dark-950">
            
            {/* ACTIVE / SIGNED VIEW */}
            {lifecycleStage === 'Active' ? (
                <ActiveContractView />
            ) : (
                <>
                    {/* DOCUMENT EDITOR VIEW */}
                    {activeView === 'document' && (
                        <div className="flex h-full flex-col">
                            {/* Use the EditorToolbar component we extracted */}
                            <EditorToolbar 
                                editor={editor}
                                activeTab={ribbonTab as any}
                                onTabChange={(t) => setRibbonTab(t)}
                                state={{zoom: 100, showRuler: true, showGrid: false, darkMode: false, trackChanges: false, redactionMode: false, viewMode: 'print'}}
                                actions={{
                                    setZoom: ()=>{}, toggleRuler: ()=>{}, toggleGrid: ()=>{}, toggleDarkMode: ()=>{}, 
                                    toggleTrackChanges: ()=>{}, toggleRedaction: ()=>{}, setViewMode: ()=>{}, 
                                    addComment: ()=>{}, runGovernance: ()=>{}, exportDoc: ()=>{}
                                }}
                            />
                            
                            <div className="flex-1 flex overflow-hidden">
                                {/* Left Panel */}
                                <div className={`bg-dark-950 border-r border-dark-800 transition-all duration-300 ${isLeftOpen ? 'w-64' : 'w-0'}`}>
                                    {isLeftOpen && <StructurePanel editor={editor} outline={[]} />}
                                </div>

                                {/* Canvas */}
                                <div className="flex-1 bg-dark-900/50 overflow-y-auto p-8 flex justify-center">
                                    <div className="bg-white w-[816px] min-h-[1056px] shadow-2xl text-black relative">
                                        <EditorContent editor={editor} className="prose prose-slate max-w-none focus:outline-none p-24 min-h-full"/>
                                    </div>
                                </div>

                                {/* Right Panel */}
                                <div className={`bg-dark-900 border-l border-dark-800 transition-all duration-300 ${isRightOpen ? 'w-80' : 'w-0'}`}>
                                    {isRightOpen && <ReviewPanel comments={[]} changes={[]} onAddComment={()=>{}} />}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SIGNATURE VIEW */}
                    {activeView === 'signature' && (
                        <SignatureSetup onComplete={() => {
                            setLifecycleStage('Sign');
                            // Ideally show a notification here
                        }} />
                    )}

                    {/* OVERVIEW VIEW */}
                    {activeView === 'overview' && (
                        <div className="p-8 max-w-5xl mx-auto space-y-6">
                            <Card title="Executive Summary">
                                <div className="p-4 flex gap-4 bg-brand-500/10 border border-brand-500/20 rounded-xl">
                                    <Bot size={24} className="text-brand-400"/>
                                    <p className="text-sm text-slate-300">This contract is in the <strong>{lifecycleStage}</strong> stage. It contains standard terms with one detected deviation in the Indemnity clause.</p>
                                </div>
                            </Card>
                        </div>
                    )}
                </>
            )}

        </div>
    </div>
  );
};

export default ContractViewer;
