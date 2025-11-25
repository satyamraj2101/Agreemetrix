import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Select, Badge, Switch, Avatar } from '../components/UIComponents';
import { 
  ArchiveRestore, UploadCloud, FileText, CheckCircle2, 
  AlertTriangle, Folder, ArrowRight, Loader2, Play,
  LayoutTemplate, Wand2, Cloud, RefreshCw, Database, Eye, Edit3,
  Shield, ChevronRight, Check, Workflow, Sparkles, ArrowLeft, Search,
  GitMerge, Layers, FileCode, AlertCircle, Server, HardDrive, Calendar,
  DollarSign, Link as LinkIcon, Download, Filter, Trash2, MoreHorizontal,
  ThumbsUp, ThumbsDown, Split, Flag, Lock, History, ChevronDown, X, Scale,
  MessageSquare, Zap, RotateCcw, CheckSquare, Clock, Plus
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';

// --- TYPES ---

type MigrationStage = 'connect' | 'dedupe' | 'analyze' | 'review' | 'mapping' | 'complete';

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
}

interface ExtractionField {
  key: string;
  label: string;
  value: string;
  aiSuggestion?: string;
  confidence: number; // 0-100
  source?: string; // e.g. "Header", "Page 1"
  reasoning?: string; // e.g. "Pattern matched YYYY-MM-DD"
  isPII?: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'edited' | 'flagged';
  rect?: { x: number, y: number, w: number, h: number }; 
  comments?: Comment[];
}

interface DetectedClause {
  id: string;
  name: string;
  text: string;
  standardText?: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  status: 'pending' | 'accepted' | 'rejected';
}

interface MigrationFile {
  id: string;
  name: string;
  size: string;
  source: string;
  uploadDate: string;
  author?: string;
  pageCount?: number;
  status: 'scanned' | 'processing' | 'review_needed' | 'ready' | 'duplicate' | 'archived';
  confidenceScore: number;
  fields: ExtractionField[];
  clauses: DetectedClause[];
}

interface DuplicateGroup {
  id: string;
  name: string;
  files: MigrationFile[];
  masterFileId?: string;
  matchScore: number;
}

interface MappingRule {
  id: string;
  field: string;
  operator: string;
  value: string;
  targetWorkflow: string;
}

// --- MOCK DATA ---

const INITIAL_FILES: MigrationFile[] = [
  {
    id: 'f1',
    name: 'TechFlow_MSA_2023_Signed.pdf',
    size: '2.4 MB',
    source: 'SharePoint',
    uploadDate: '2024-03-10',
    author: 'Mike Ross',
    pageCount: 12,
    status: 'ready',
    confidenceScore: 98,
    fields: [
      { key: 'type', label: 'Contract Type', value: 'MSA', confidence: 99, status: 'accepted', source: 'Header', reasoning: 'Explicit title match' },
      { key: 'party', label: 'Counterparty', value: 'TechFlow Inc', confidence: 98, status: 'accepted', source: 'Intro', reasoning: 'Named entity recognition' },
      { key: 'value', label: 'Total Value', value: '150,000', confidence: 95, status: 'accepted', source: 'Section 4', reasoning: 'Currency format found' },
      { key: 'date', label: 'Effective Date', value: '2023-05-15', confidence: 99, status: 'accepted', source: 'Footer', reasoning: 'Date pattern in footer' },
    ],
    clauses: []
  },
  {
    id: 'f2',
    name: 'Acme_Supply_Agmt_Draft_v2.pdf',
    size: '450 KB',
    source: 'Upload',
    uploadDate: '2024-03-11',
    author: 'Harvey Specter',
    pageCount: 5,
    status: 'review_needed',
    confidenceScore: 65,
    fields: [
      { key: 'type', label: 'Contract Type', value: 'Vendor Agreement', aiSuggestion: 'Supply Agreement', confidence: 70, status: 'pending', source: 'Header', reasoning: 'Ambiguous title' },
      { key: 'party', label: 'Counterparty', value: 'Acme Corp', confidence: 95, status: 'accepted', source: 'Intro', reasoning: 'Named entity recognition' },
      { key: 'value', label: 'Total Value', value: '25,000', confidence: 88, status: 'accepted', source: 'Section 3.1', reasoning: 'Currency format found' },
      { key: 'date', label: 'Effective Date', value: '', aiSuggestion: '2024-01-01', confidence: 45, status: 'pending', source: 'Inferred', reasoning: 'No explicit date found, inferred from file creation' },
      { key: 'email', label: 'Contact Email', value: 'admin@acme.com', confidence: 90, isPII: true, status: 'accepted', source: 'Signature Page', reasoning: 'Email regex match' }
    ],
    clauses: [
      { id: 'c1', name: 'Limitation of Liability', text: 'Vendor liability shall not exceed $5,000.', standardText: 'Liability capped at 12 months fees.', riskLevel: 'High', confidence: 85, status: 'pending' },
      { id: 'c2', name: 'Termination', text: '30 days notice for convenience.', riskLevel: 'Low', confidence: 92, status: 'accepted' }
    ]
  },
  {
    id: 'f3',
    name: 'Stratos_Consulting_SOW.pdf',
    size: '1.1 MB',
    source: 'Google Drive',
    uploadDate: '2024-03-12',
    author: 'Jessica Pearson',
    pageCount: 8,
    status: 'review_needed',
    confidenceScore: 72,
    fields: [
      { key: 'type', label: 'Contract Type', value: 'SOW', confidence: 95, status: 'accepted', source: 'Header', reasoning: 'Explicit title match' },
      { key: 'party', label: 'Counterparty', value: 'Stratos', confidence: 92, status: 'accepted', source: 'Intro', reasoning: 'Named entity recognition' },
      { key: 'jurisdiction', label: 'Jurisdiction', value: 'Unknown', aiSuggestion: 'Delaware', confidence: 60, status: 'pending', source: 'Inferred', reasoning: 'Address block analysis' }
    ],
    clauses: []
  }
];

const INITIAL_DUPLICATES: DuplicateGroup[] = [
  {
    id: 'g1',
    name: 'TechFlow MSA Series',
    matchScore: 98,
    files: [
      { ...INITIAL_FILES[0], id: 'd1', name: 'TechFlow_MSA_2023_Final.pdf', uploadDate: '2024-03-10 10:00', size: '2.4 MB' },
      { ...INITIAL_FILES[0], id: 'd2', name: 'TechFlow_MSA_v3_Clean.docx', uploadDate: '2024-03-09 14:30', size: '2.1 MB', status: 'duplicate', confidenceScore: 100 },
      { ...INITIAL_FILES[0], id: 'd3', name: 'MSA_TechFlow_Signed.pdf', uploadDate: '2024-03-10 10:05', size: '2.4 MB', status: 'duplicate' },
    ]
  }
];

// --- COMPONENTS ---

const StageBadge: React.FC<{ 
    id: string; 
    current: MigrationStage; 
    label: string; 
    icon: any; 
    count?: number;
    onClick: () => void;
}> = ({ id, current, label, icon: Icon, count, onClick }) => {
  const stages = ['connect', 'dedupe', 'analyze', 'review', 'mapping', 'complete'];
  const currentIndex = stages.indexOf(current);
  const stageIndex = stages.indexOf(id);
  
  const isActive = stageIndex === currentIndex;
  const isCompleted = stageIndex < currentIndex;

  return (
    <button 
        onClick={onClick}
        disabled={stageIndex > currentIndex}
        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all mb-2 group ${
            isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 
            isCompleted ? 'text-slate-300 hover:bg-white/5' : 
            'text-slate-500 opacity-60 cursor-not-allowed'
        }`}
    >
      <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md ${isActive ? 'bg-white/20' : 'bg-dark-800 border border-dark-700'}`}>
            <Icon size={16} className={isActive ? 'text-white' : isCompleted ? 'text-brand-400' : 'text-slate-500'} />
          </div>
          <span className="text-sm font-bold">{label}</span>
      </div>
      {isCompleted ? <CheckCircle2 size={16} className="text-brand-400"/> : count !== undefined && (
          <Badge color={isActive ? 'brand' : 'gray'} className="text-[10px]">{count}</Badge>
      )}
    </button>
  );
};

// --- STAGE: REVIEW CONSOLE ---

const ReviewConsole: React.FC<{ files: MigrationFile[], onComplete: () => void }> = ({ files: initialFiles, onComplete }) => {
    const [files, setFiles] = useState<MigrationFile[]>(initialFiles);
    const [selectedFileId, setSelectedFileId] = useState<string>(files[1].id);
    const [activeTab, setActiveTab] = useState<'metadata' | 'clauses' | 'activity'>('metadata');
    const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
    const [showAutoFix, setShowAutoFix] = useState(false);

    const selectedFile = files.find(f => f.id === selectedFileId)!;

    const logActivity = (action: string, target: string) => {
        const newLog: ActivityLog = {
            id: `log_${Date.now()}`,
            user: 'You',
            action,
            target,
            timestamp: new Date().toLocaleTimeString(),
            type: 'success'
        };
        setActivityLog([newLog, ...activityLog]);
    };

    const updateFieldStatus = (fileId: string, key: string, status: 'accepted' | 'rejected' | 'flagged') => {
        setFiles(prev => prev.map(f => {
            if (f.id !== fileId) return f;
            const fieldName = f.fields.find(fi => fi.key === key)?.label || key;
            logActivity(status === 'accepted' ? 'Verified' : status === 'rejected' ? 'Rejected' : 'Flagged', fieldName);
            
            return {
                ...f,
                fields: f.fields.map(field => field.key === key ? { ...field, status } : field),
                status: f.fields.every(fi => fi.status !== 'pending') ? 'ready' : 'review_needed'
            };
        }));
    };

    const handleBulkAction = (action: string) => {
        if (action === 'accept_high_confidence') {
            let count = 0;
            setFiles(prev => prev.map(f => {
                const newFields = f.fields.map(field => {
                    if (field.status === 'pending' && field.confidence > 80) {
                        count++;
                        return { ...field, status: 'accepted' as const };
                    }
                    return field;
                });
                return { ...f, fields: newFields };
            }));
            logActivity('Bulk Accept', `${count} high confidence fields`);
        }
    };

    return (
        <div className="flex h-full gap-0 animate-in fade-in">
            {/* Left: File Queue */}
            <div className="w-72 flex flex-col border-r border-dark-700 bg-dark-900/30">
                <div className="p-4 border-b border-dark-700">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-white text-sm">Review Queue</h3>
                        <Badge color="yellow">{files.filter(f => f.status === 'review_needed').length}</Badge>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14}/>
                        <Input placeholder="Filter files..." className="h-8 text-xs pl-8 bg-dark-950" />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {files.map(file => (
                        <div 
                            key={file.id}
                            onClick={() => setSelectedFileId(file.id)}
                            className={`p-3 rounded-lg cursor-pointer border transition-all group ${selectedFileId === file.id ? 'bg-brand-500/10 border-brand-500/50 ring-1 ring-brand-500/20' : 'bg-transparent border-transparent hover:bg-dark-800'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {file.status === 'ready' ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <AlertCircle size={14} className="text-yellow-500 shrink-0"/>}
                                    <span className={`text-xs font-bold truncate ${selectedFileId === file.id ? 'text-white' : 'text-slate-300'}`}>{file.name}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 pl-6">
                                <span>{file.confidenceScore}% Match</span>
                                {file.fields.filter(f => f.status === 'pending').length > 0 && <span className="text-yellow-500 font-bold">{file.fields.filter(f => f.status === 'pending').length} Issues</span>}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-3 border-t border-dark-700 bg-dark-900/50">
                    <Button variant="secondary" className="w-full text-xs" onClick={() => handleBulkAction('accept_high_confidence')}>
                        <CheckCircle2 size={14} className="mr-2"/> Auto-Accept High Conf.
                    </Button>
                </div>
            </div>

            {/* Center: Document Preview */}
            <div className="flex-1 flex flex-col bg-dark-950 relative overflow-hidden">
                <div className="absolute inset-0 flex justify-center overflow-y-auto p-8 custom-scrollbar">
                    <div className="bg-white w-[700px] min-h-[900px] shadow-2xl text-slate-800 text-xs font-serif leading-relaxed p-12 opacity-90">
                        {/* PDF Mock Content */}
                        <h1 className="text-xl font-bold text-center mb-8 text-black uppercase">{selectedFile.name.split('.')[0].replace(/_/g, ' ')}</h1>
                        <div className="space-y-4">
                            <p>This <strong>Master Services Agreement</strong> ("Agreement") is made effective as of [DATE] by and between <strong>{selectedFile.fields.find(f=>f.key==='party')?.value || 'Counterparty'}</strong> ("Client") and Agreemetrix Inc.</p>
                            <p className="text-justify">WHEREAS, Client desires to engage Provider for certain services as defined in the Statement of Work...</p>
                            <div className="h-8 bg-yellow-200/30 border-b border-yellow-400/50 w-full"></div>
                            <p>1. <strong>Term.</strong> This Agreement shall commence on the Effective Date and continue for a period of one (1) year.</p>
                            <p>2. <strong>Fees.</strong> Client shall pay fees of <strong>{selectedFile.fields.find(f=>f.key==='value')?.value || '$0'}</strong> as set forth in Exhibit A.</p>
                            {/* Visual noise for mock */}
                            {Array.from({length: 10}).map((_, i) => (
                                <div key={i} className="w-full h-3 bg-slate-100 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Toolbar Overlay */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-dark-900/90 backdrop-blur border border-dark-700 rounded-full p-1 shadow-xl z-10">
                    <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"><ArrowLeft size={16}/></button>
                    <span className="text-xs font-mono text-slate-300 py-2 px-2">Page 1 / {selectedFile.pageCount || 1}</span>
                    <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"><ArrowRight size={16}/></button>
                </div>
            </div>

            {/* Right: Inspector */}
            <div className="w-96 bg-dark-900 border-l border-dark-700 flex flex-col">
                <div className="flex border-b border-dark-700 bg-dark-950">
                    {[
                        {id: 'metadata', label: 'Fields', icon: Database},
                        {id: 'clauses', label: 'Clauses', icon: Scale},
                        {id: 'activity', label: 'History', icon: History},
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === tab.id ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            <tab.icon size={14}/> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {activeTab === 'metadata' && (
                        <>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-bold text-slate-500 uppercase">Extracted Data</h4>
                                <button onClick={() => setShowAutoFix(!showAutoFix)} className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                                    <Zap size={12}/> Auto-Fix Rules
                                </button>
                            </div>

                            {showAutoFix && (
                                <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-3 mb-4 animate-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-brand-200">Quick Actions</span>
                                        <button onClick={() => setShowAutoFix(false)}><X size={12} className="text-brand-400"/></button>
                                    </div>
                                    <div className="space-y-2">
                                        <button className="w-full text-left text-[10px] text-slate-300 hover:text-white hover:bg-brand-500/20 p-1.5 rounded transition-colors flex items-center gap-2">
                                            <Zap size={10}/> Format dates to ISO-8601
                                        </button>
                                        <button className="w-full text-left text-[10px] text-slate-300 hover:text-white hover:bg-brand-500/20 p-1.5 rounded transition-colors flex items-center gap-2">
                                            <Zap size={10}/> Normalize currency to USD
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedFile.fields.map((field, idx) => (
                                <div 
                                    key={idx} 
                                    className={`p-3 rounded-lg border transition-all group relative ${field.status === 'pending' ? 'bg-dark-800 border-brand-500/30' : 'bg-dark-950 border-dark-700 opacity-75'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-slate-300">{field.label}</span>
                                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${field.confidence > 90 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                            {field.confidence}%
                                        </div>
                                    </div>
                                    
                                    <div className="mb-2 group-focus-within:ring-1 ring-brand-500/50 rounded">
                                        <input 
                                            className={`w-full bg-transparent border-none text-sm font-medium outline-none ${field.status === 'pending' && field.aiSuggestion ? 'text-brand-200' : 'text-white'}`}
                                            defaultValue={field.value || field.aiSuggestion}
                                        />
                                    </div>

                                    {field.reasoning && (
                                        <div className="flex items-start gap-1.5 mb-3">
                                            <Sparkles size={10} className="text-brand-500 mt-0.5 shrink-0"/>
                                            <p className="text-[10px] text-slate-500 leading-tight italic">
                                                {field.reasoning} <span className="text-slate-600">• Found in {field.source}</span>
                                            </p>
                                        </div>
                                    )}

                                    {field.isPII && (
                                        <div className="flex items-center gap-1 text-[10px] text-red-400 mb-2 bg-red-500/5 px-2 py-1 rounded w-fit">
                                            <Lock size={10}/> PII Detected
                                        </div>
                                    )}

                                    {field.status === 'pending' && (
                                        <div className="flex gap-1 pt-2 border-t border-white/5">
                                            <button onClick={() => updateFieldStatus(selectedFile.id, field.key, 'accepted')} className="flex-1 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded text-[10px] font-bold transition-colors flex items-center justify-center gap-1">
                                                <Check size={12}/> Accept
                                            </button>
                                            <button onClick={() => updateFieldStatus(selectedFile.id, field.key, 'rejected')} className="flex-1 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-[10px] font-bold transition-colors flex items-center justify-center gap-1">
                                                <X size={12}/> Reject
                                            </button>
                                            <button className="p-1 hover:bg-dark-700 rounded text-slate-400 hover:text-white" title="Add Comment">
                                                <MessageSquare size={12}/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase">Session Log</h4>
                            <div className="relative border-l border-dark-700 ml-2 space-y-4">
                                {activityLog.map((log) => (
                                    <div key={log.id} className="relative pl-4">
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-dark-900"></div>
                                        <div className="text-xs text-slate-300">
                                            <span className="font-bold text-white">{log.user}</span> {log.action} <span className="text-brand-400">{log.target}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-600 mt-0.5">{log.timestamp}</div>
                                    </div>
                                ))}
                                {activityLog.length === 0 && <div className="text-[10px] text-slate-600 pl-4 italic">No actions taken yet.</div>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-dark-800 bg-dark-950/50">
                    <div className="flex gap-2">
                        <Button variant="ghost" className="flex-1 text-xs">Skip File</Button>
                        <Button variant="primary" className="flex-[2] text-xs shadow-lg shadow-green-500/20" onClick={onComplete} disabled={selectedFile.fields.some(f => f.status === 'pending')}>
                            Mark Verified <Check size={14} className="ml-2"/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const LegacyMigration: React.FC = () => {
  const [stage, setStage] = useState<MigrationStage>('connect');
  const [files, setFiles] = useState<MigrationFile[]>(INITIAL_FILES);

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-dark-950 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Rail: Navigation */}
        <div className="w-64 bg-dark-900 border-r border-dark-700 flex flex-col p-4">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ArchiveRestore className="text-brand-400" size={20}/> Migration
                </h2>
                <p className="text-xs text-slate-500 mt-1">Project: Legacy 2024</p>
            </div>

            <nav className="flex-1 space-y-1">
                {[
                    { id: 'connect', label: 'Connect Source', icon: LinkIcon },
                    { id: 'dedupe', label: 'Deduplication', icon: GitMerge, count: 3 },
                    { id: 'analyze', label: 'AI Analysis', icon: Sparkles },
                    { id: 'review', label: 'Review Queue', icon: CheckSquare, count: files.filter(f => f.status === 'review_needed').length },
                    { id: 'mapping', label: 'Map & Route', icon: Workflow },
                    { id: 'complete', label: 'Finalize', icon: Check }
                ].map(s => (
                    <StageBadge 
                        key={s.id} 
                        id={s.id}
                        current={stage} 
                        label={s.label} 
                        icon={s.icon} 
                        count={s.count}
                        onClick={() => setStage(s.id as MigrationStage)}
                    />
                ))}
            </nav>

            <div className="p-4 bg-dark-950 rounded-xl border border-dark-800 mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>45%</span>
                </div>
                <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full w-[45%]"></div>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>
            
            <div className="flex-1 overflow-hidden z-10">
                {stage === 'connect' && (
                    <div className="h-full flex items-center justify-center p-8">
                        <div className="max-w-2xl w-full space-y-8">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-white mb-3">Import Legacy Contracts</h1>
                                <p className="text-slate-400">Securely connect to your existing repository or upload files directly.</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'SharePoint', icon: FileCode, active: false },
                                    { label: 'Google Drive', icon: Cloud, active: false },
                                    { label: 'S3 Bucket', icon: Server, active: false },
                                    { label: 'Local Upload', icon: UploadCloud, active: true },
                                ].map(opt => (
                                    <button 
                                        key={opt.label}
                                        onClick={() => opt.active && setStage('dedupe')}
                                        className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all group ${opt.active ? 'bg-dark-900 border-dark-700 hover:border-brand-500 hover:bg-brand-500/5 cursor-pointer' : 'bg-dark-950 border-dark-800 opacity-50 cursor-not-allowed'}`}
                                    >
                                        <div className={`p-3 rounded-full ${opt.active ? 'bg-dark-800 text-white group-hover:bg-brand-500 group-hover:text-white' : 'bg-dark-900 text-slate-600'}`}>
                                            <opt.icon size={24}/>
                                        </div>
                                        <span className="font-bold text-slate-300 group-hover:text-white">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="border-2 border-dashed border-dark-700 rounded-xl p-10 text-center hover:border-brand-500/50 transition-colors cursor-pointer bg-dark-900/50" onClick={() => setStage('dedupe')}>
                                <UploadCloud size={48} className="mx-auto text-slate-500 mb-4"/>
                                <p className="text-slate-300 font-medium">Drag and drop files here</p>
                                <p className="text-xs text-slate-500 mt-2">Supported: PDF, DOCX (Max 50MB)</p>
                            </div>
                        </div>
                    </div>
                )}

                {stage === 'dedupe' && (
                    <div className="h-full flex flex-col p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Conflict Resolution</h2>
                                <p className="text-slate-400 text-sm">We found duplicates. Select the master record to preserve.</p>
                            </div>
                            <Button variant="primary" onClick={() => setStage('analyze')}>Resolve All <ArrowRight size={16} className="ml-2"/></Button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                            {INITIAL_DUPLICATES.map(group => (
                                <div key={group.id} className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
                                    <div className="p-4 bg-dark-950/50 border-b border-dark-700 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Badge color="yellow">Duplicate Set</Badge>
                                            <span className="font-mono text-xs text-slate-500">{group.id}</span>
                                        </div>
                                        <span className="text-xs text-brand-400 font-bold">Match Score: {group.matchScore}%</span>
                                    </div>
                                    <div className="grid grid-cols-3 divide-x divide-dark-700">
                                        {group.files.map((file, i) => (
                                            <div key={file.id} className={`p-6 flex flex-col gap-4 relative ${i === 0 ? 'bg-brand-500/5' : ''}`}>
                                                {i === 0 && <div className="absolute top-2 right-2 text-[10px] bg-brand-500 text-white px-2 py-0.5 rounded-full font-bold">Recommended</div>}
                                                <div className="flex items-center gap-3">
                                                    <FileText size={24} className="text-slate-400"/>
                                                    <div className="overflow-hidden">
                                                        <p className="font-bold text-white text-sm truncate" title={file.name}>{file.name}</p>
                                                        <p className="text-xs text-slate-500">{file.size}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-xs">
                                                    <div className="flex justify-between"><span className="text-slate-500">Date</span> <span className="text-slate-200">{file.uploadDate}</span></div>
                                                    <div className="flex justify-between"><span className="text-slate-500">Pages</span> <span className="text-slate-200">{file.pageCount || 12}</span></div>
                                                    <div className="flex justify-between"><span className="text-slate-500">Author</span> <span className="text-slate-200">{file.author || 'Unknown'}</span></div>
                                                </div>
                                                <Button variant={i === 0 ? 'primary' : 'secondary'} className="w-full text-xs mt-auto">
                                                    {i === 0 ? 'Keep Master' : 'Merge as Version'}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {stage === 'analyze' && (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center max-w-md">
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className="absolute inset-0 border-4 border-dark-800 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
                                <Sparkles size={32} className="absolute inset-0 m-auto text-brand-400 animate-pulse"/>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">AI Processing in Progress</h2>
                            <p className="text-slate-400 text-sm mb-8">Extracting metadata, analyzing clauses, and scoring risk for 142 documents.</p>
                            
                            <div className="bg-dark-900 rounded-xl p-4 text-left space-y-3 border border-dark-700">
                                <div className="flex items-center gap-3 text-xs text-slate-300">
                                    <CheckCircle2 size={14} className="text-green-500"/> OCR Text Recognition
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-300">
                                    <CheckCircle2 size={14} className="text-green-500"/> Entity Extraction
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-300">
                                    <Loader2 size={14} className="animate-spin text-brand-400"/> Risk Scoring
                                </div>
                            </div>
                            
                            <Button variant="ghost" className="mt-8" onClick={() => setStage('review')}>Skip Animation (Dev)</Button>
                        </div>
                    </div>
                )}

                {stage === 'review' && (
                    <ReviewConsole files={files} onComplete={() => setStage('mapping')} />
                )}

                {stage === 'mapping' && (
                    <div className="h-full p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Workflow Routing</h2>
                                <p className="text-slate-400 text-sm">Map migrated contracts to their target destination.</p>
                            </div>
                            <Button variant="primary" onClick={() => setStage('complete')}>Start Migration</Button>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <Card title="Logic Rules" className="h-full">
                                <div className="space-y-4">
                                    <div className="p-3 bg-dark-950 border border-dark-800 rounded-lg flex items-center gap-3">
                                        <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-1 rounded">IF</span>
                                        <span className="text-sm text-white">Contract Type</span>
                                        <span className="text-slate-500">==</span>
                                        <span className="text-sm text-white">"MSA"</span>
                                        <ArrowRight size={14} className="text-slate-600"/>
                                        <Badge color="blue">Global Procurement</Badge>
                                    </div>
                                    <Button variant="secondary" className="w-full text-xs">+ Add Rule</Button>
                                </div>
                            </Card>

                            <Card title="Simulator" className="h-full bg-dark-900/50">
                                <div className="text-center py-12">
                                    <Play size={48} className="mx-auto text-slate-600 mb-4"/>
                                    <p className="text-slate-400 text-sm">Run simulation to verify routing for 142 files.</p>
                                    <Button variant="secondary" className="mt-4">Run Test</Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {stage === 'complete' && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-in zoom-in duration-500">
                            <Check size={48}/>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Migration Complete</h2>
                        <p className="text-slate-400 max-w-md mb-8">
                            3 files have been successfully indexed, enriched, and routed to the repository.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="secondary" onClick={() => window.location.hash = '#/reports'}>View Report</Button>
                            <Button variant="primary" onClick={() => window.location.hash = '#/repository'}>Go to Repository</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default LegacyMigration;