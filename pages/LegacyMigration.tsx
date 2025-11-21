
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Select, Badge, Switch } from '../components/UIComponents';
import { 
  ArchiveRestore, UploadCloud, FileText, CheckCircle2, 
  AlertTriangle, Folder, ArrowRight, Loader2, Play,
  LayoutTemplate, Wand2, Cloud, RefreshCw, Database, Eye, Edit3,
  Shield, ChevronRight, Check, Workflow, Sparkles, ArrowLeft, Search,
  GitMerge, Layers, FileCode, AlertCircle, Server, HardDrive, Calendar,
  DollarSign, Link as LinkIcon, Download, Filter, Trash2, MoreHorizontal
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

// --- TYPES & MOCKS ---

type MigrationStage = 'connect' | 'dedupe' | 'analyze' | 'review' | 'mapping' | 'complete';

interface DetectedIssue {
  id: string;
  type: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Metadata' | 'Risk' | 'Clause' | 'Obligation';
  message: string;
  suggestion?: string;
}

interface ExtractedObligation {
  id: string;
  description: string;
  dueDate: string;
  type: 'Payment' | 'Deliverable' | 'Notice' | 'Renewal';
  riskLevel: 'High' | 'Low';
}

interface MigrationFile {
  id: string;
  name: string;
  size: string;
  source: string;
  uploadDate: string;
  status: 'scanned' | 'processing' | 'review_needed' | 'ready' | 'duplicate';
  confidence: number;
  duplicateGroupId?: string; // If grouped with others
  isMaster?: boolean; // If it's the chosen version
  metadata: {
    type?: string;
    counterparty?: string;
    effectiveDate?: string;
    value?: string;
    jurisdiction?: string;
    autoRenewal?: boolean;
  };
  issues: DetectedIssue[];
  obligations: ExtractedObligation[];
  clauses: { name: string; deviation: 'Standard' | 'Modified' | 'High Risk'; text: string }[];
}

const MOCK_FILES_DATA: MigrationFile[] = [
  {
    id: '1',
    name: 'TechFlow_MSA_2023_Final_Signed.pdf',
    size: '2.4 MB',
    source: 'SharePoint / Legal / TechFlow',
    uploadDate: '2024-03-10',
    status: 'ready',
    confidence: 98,
    metadata: {
      type: 'MSA',
      counterparty: 'TechFlow Inc',
      effectiveDate: '2023-05-15',
      value: '150000',
      jurisdiction: 'New York',
      autoRenewal: true
    },
    issues: [],
    obligations: [
      { id: 'ob1', description: 'Annual License Payment', dueDate: '2024-05-15', type: 'Payment', riskLevel: 'Low' }
    ],
    clauses: [
      { name: 'Indemnification', deviation: 'Standard', text: '...' },
      { name: 'Liability Cap', deviation: 'Standard', text: '...' }
    ]
  },
  {
    id: '2',
    name: 'TechFlow_MSA_v3.docx',
    size: '1.1 MB',
    source: 'SharePoint / Legal / TechFlow',
    uploadDate: '2024-03-09',
    status: 'duplicate',
    confidence: 100,
    duplicateGroupId: 'group_1',
    isMaster: false,
    metadata: {},
    issues: [],
    obligations: [],
    clauses: []
  },
  {
    id: '3',
    name: 'Acme_Supply_Agreement_Draft.pdf',
    size: '450 KB',
    source: 'Local Upload',
    uploadDate: '2024-03-11',
    status: 'review_needed',
    confidence: 65,
    metadata: {
      type: 'Vendor Agreement',
      counterparty: 'Acme Corp',
      effectiveDate: '', // Missing
      value: '25000',
      jurisdiction: 'California',
      autoRenewal: false
    },
    issues: [
      { id: 'i1', type: 'Critical', category: 'Metadata', message: 'Effective Date missing', suggestion: '2024-01-01 (Found in footer)' },
      { id: 'i2', type: 'High', category: 'Risk', message: 'Missing GDPR Addendum', suggestion: 'Flag for DPA' },
      { id: 'i3', type: 'Medium', category: 'Clause', message: 'Unclear Termination Clause', suggestion: 'Review Section 12.3' }
    ],
    obligations: [],
    clauses: [
      { name: 'Termination', deviation: 'High Risk', text: 'Client may terminate only for cause...' }
    ]
  },
  {
    id: '4',
    name: 'Stratos_SOW_05.pdf',
    size: '890 KB',
    source: 'Google Drive',
    uploadDate: '2024-03-11',
    status: 'review_needed',
    confidence: 72,
    metadata: {
      type: 'SOW',
      counterparty: 'Stratos Consulting',
      effectiveDate: '2023-09-10',
      value: '12000',
      jurisdiction: 'Unknown',
      autoRenewal: false
    },
    issues: [
      { id: 'i4', type: 'Medium', category: 'Metadata', message: 'Jurisdiction ambiguous', suggestion: 'Delaware (Inferred)' }
    ],
    obligations: [
      { id: 'ob2', description: 'Project Milestone 1', dueDate: '2023-12-01', type: 'Deliverable', riskLevel: 'High' }
    ],
    clauses: []
  }
];

// --- COMPONENTS ---

const StageBadge: React.FC<{ current: MigrationStage; stage: MigrationStage; label: string; icon: any }> = ({ current, stage, label, icon: Icon }) => {
  const stages = ['connect', 'dedupe', 'analyze', 'review', 'mapping', 'complete'];
  const currentIndex = stages.indexOf(current);
  const stageIndex = stages.indexOf(stage);
  
  let statusColor = 'bg-dark-800 text-slate-500 border-dark-700';
  if (stageIndex < currentIndex) statusColor = 'bg-brand-500/20 text-brand-400 border-brand-500/50'; // Completed
  if (stageIndex === currentIndex) statusColor = 'bg-brand-500 text-white border-brand-500 shadow-[0_0_15px_rgba(var(--color-brand-500),0.4)]'; // Active

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${statusColor}`}>
      <Icon size={14} />
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      {stageIndex < currentIndex && <CheckCircle2 size={14} className="ml-1" />}
    </div>
  );
};

const LegacyMigration: React.FC = () => {
  const [step, setStep] = useState<MigrationStage>('connect');
  const [files, setFiles] = useState<MigrationFile[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [reviewTab, setReviewTab] = useState<'metadata' | 'clauses' | 'obligations' | 'preview'>('metadata');
  
  // Source Config
  const [sourceType, setSourceType] = useState<string | null>(null);
  const [preserveFolders, setPreserveFolders] = useState(true);

  // Computed
  const selectedFile = files.find(f => f.id === selectedFileId);
  const readyCount = files.filter(f => f.status === 'ready').length;
  const reviewCount = files.filter(f => f.status === 'review_needed').length;
  const duplicateCount = files.filter(f => f.status === 'duplicate').length;

  // --- HANDLERS ---

  const handleConnectSource = (type: string) => {
    setSourceType(type);
    // Simulate connection delay
    setTimeout(() => {
        setStep('dedupe');
        // Load initial raw list including duplicates
        setFiles(MOCK_FILES_DATA);
    }, 1000);
  };

  const handleDedupeComplete = () => {
    setStep('analyze');
    // Simulate AI Processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAnalysisProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setStep('review');
        if(MOCK_FILES_DATA.find(f => f.status === 'review_needed')) {
            setSelectedFileId(MOCK_FILES_DATA.find(f => f.status === 'review_needed')!.id);
        }
      }
    }, 150);
  };

  const handleApplySuggestion = (issueId: string) => {
    if (!selectedFile) return;
    const issue = selectedFile.issues.find(i => i.id === issueId);
    if (!issue || !issue.suggestion) return;

    // Apply logic (mock)
    const newFiles = files.map(f => {
        if (f.id === selectedFile.id) {
            const updatedMeta = { ...f.metadata };
            if (issue.message.includes('Effective Date')) updatedMeta.effectiveDate = issue.suggestion;
            if (issue.message.includes('Jurisdiction')) updatedMeta.jurisdiction = issue.suggestion;
            
            const remainingIssues = f.issues.filter(i => i.id !== issueId);
            const newStatus = remainingIssues.length === 0 ? 'ready' : 'review_needed';
            
            return { ...f, metadata: updatedMeta, issues: remainingIssues, status: newStatus as any };
        }
        return f;
    });
    setFiles(newFiles);
  };

  const handleMarkReady = () => {
      if(!selectedFile) return;
      setFiles(prev => prev.map(f => f.id === selectedFile.id ? { ...f, status: 'ready', issues: [] } : f));
      
      // Auto select next review item
      const next = files.find(f => f.status === 'review_needed' && f.id !== selectedFile.id);
      if(next) setSelectedFileId(next.id);
      else setSelectedFileId(null);
  };

  // --- RENDERERS ---

  const renderConnect = () => (
    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95 max-w-5xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Connect Legacy Repository</h2>
            <p className="text-slate-400 max-w-lg mx-auto">
                Select a source to begin ingestion. We support bulk imports from cloud storage, local drives, and existing CLMs.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
            {[
                { id: 'local', label: 'Local Upload', icon: UploadCloud, desc: 'Drag & drop folders or PDFs' },
                { id: 'sharepoint', label: 'SharePoint', icon: FileCode, desc: 'Connect Document Library' },
                { id: 's3', label: 'Amazon S3', icon: Server, desc: 'Import from Bucket' },
                { id: 'drive', label: 'Google Drive', icon: Cloud, desc: 'Sync Shared Drives' },
                { id: 'email', label: 'Email Ingestion', icon: Layers, desc: 'Poll legal@ inbox' },
                { id: 'sftp', label: 'SFTP Server', icon: HardDrive, desc: 'Secure File Transfer' }
            ].map(src => (
                <button 
                    key={src.id}
                    onClick={() => handleConnectSource(src.id)}
                    className="group p-6 bg-dark-900 border border-dark-700 hover:border-brand-500/50 rounded-2xl text-left transition-all hover:bg-brand-500/5 hover:-translate-y-1"
                >
                    <div className="w-12 h-12 bg-dark-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-colors text-slate-400">
                        <src.icon size={24}/>
                    </div>
                    <h4 className="font-bold text-white mb-1">{src.label}</h4>
                    <p className="text-xs text-slate-500">{src.desc}</p>
                </button>
            ))}
        </div>

        <div className="w-full max-w-2xl bg-dark-900 border border-dark-700 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-dark-800 rounded-lg text-slate-400"><Folder size={20}/></div>
                <div>
                    <h5 className="text-sm font-bold text-white">Ingestion Settings</h5>
                    <p className="text-xs text-slate-500">Configure how files are processed initially.</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <Switch checked={preserveFolders} onChange={setPreserveFolders} />
                    <span className="text-xs text-slate-300">Preserve Folder Structure</span>
                </label>
            </div>
        </div>
    </div>
  );

  const renderDedupe = () => (
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-center mb-6">
              <div>
                  <h2 className="text-2xl font-bold text-white">Pre-Processing & Deduplication</h2>
                  <p className="text-slate-400 text-sm">We found <span className="text-brand-400 font-bold">45 potential duplicates</span> and grouped <span className="text-brand-400 font-bold">12 version sets</span>.</p>
              </div>
              <Button variant="primary" onClick={handleDedupeComplete}>Confirm & Start Analysis <ArrowRight size={16} className="ml-2"/></Button>
          </div>

          <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
              <div className="col-span-8 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                  {/* Dedupe Group Example */}
                  <Card noPadding className="border-l-4 border-l-yellow-500">
                      <div className="p-4 bg-dark-900/50 border-b border-dark-800 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                              <GitMerge size={16} className="text-yellow-500"/>
                              <span className="text-sm font-bold text-white">Duplicate Group: TechFlow MSA</span>
                              <Badge color="yellow">98% Match</Badge>
                          </div>
                          <div className="text-xs text-slate-500">2 Files Found</div>
                      </div>
                      <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between p-3 bg-dark-950 border border-green-500/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                  <FileText size={20} className="text-slate-400"/>
                                  <div>
                                      <p className="text-sm font-bold text-white">TechFlow_MSA_2023_Final_Signed.pdf</p>
                                      <p className="text-xs text-slate-500">2.4 MB • Modified 10 Mar 2024</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3">
                                  <Badge color="green">Keep (Master)</Badge>
                                  <input type="radio" checked readOnly className="accent-brand-500"/>
                              </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-dark-950 border border-dark-700 rounded-lg opacity-60">
                              <div className="flex items-center gap-3">
                                  <FileText size={20} className="text-slate-400"/>
                                  <div>
                                      <p className="text-sm font-bold text-white">TechFlow_MSA_v3.docx</p>
                                      <p className="text-xs text-slate-500">1.1 MB • Modified 09 Mar 2024</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3">
                                  <Badge color="gray">Archive</Badge>
                                  <input type="radio" checked={false} readOnly className="accent-brand-500"/>
                              </div>
                          </div>
                      </div>
                  </Card>

                  {/* Another Group */}
                  <Card noPadding className="border-l-4 border-l-blue-500">
                      <div className="p-4 bg-dark-900/50 border-b border-dark-800 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                              <Layers size={16} className="text-blue-500"/>
                              <span className="text-sm font-bold text-white">Version Set: Stratos SOW</span>
                              <Badge color="blue">Sequential</Badge>
                          </div>
                          <div className="text-xs text-slate-500">3 Versions</div>
                      </div>
                      <div className="p-4 space-y-2">
                          {['v1_draft', 'v2_legal_review', 'v3_final'].map((v, i) => (
                              <div key={v} className="flex items-center justify-between p-2">
                                  <span className="text-sm text-slate-300">Stratos_SOW_{v}.docx</span>
                                  <span className="text-xs text-slate-500">{i === 2 ? 'Latest' : 'History'}</span>
                              </div>
                          ))}
                      </div>
                  </Card>
              </div>

              <div className="col-span-4 space-y-6">
                  <div className="p-6 bg-dark-900 border border-dark-700 rounded-xl">
                      <h4 className="text-sm font-bold text-white mb-4">Processing Stats</h4>
                      <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Total Files Scanned</span>
                              <span className="text-white font-mono">1,204</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Exact Duplicates</span>
                              <span className="text-red-400 font-mono">45</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Version Sets</span>
                              <span className="text-blue-400 font-mono">12</span>
                          </div>
                          <div className="h-px bg-dark-700 my-2"></div>
                          <div className="flex justify-between text-sm font-bold">
                              <span className="text-white">Unique Contracts</span>
                              <span className="text-green-400 font-mono">1,147</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl flex gap-3">
                      <Sparkles size={20} className="text-brand-400 shrink-0"/>
                      <p className="text-xs text-brand-200/80">
                          AI suggests merging 12 sets based on filename patterns (e.g. "v1", "final") and content similarity > 95%.
                      </p>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderAnalyze = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center space-y-8 animate-in zoom-in-95">
        <div className="relative w-64 h-64">
            <div className="absolute inset-0 border-4 border-dark-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold text-white">{analysisProgress}%</span>
                <span className="text-xs text-brand-400 uppercase tracking-widest mt-2">Processing</span>
            </div>
        </div>
        
        <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">AI Extraction Pipeline Active</h2>
            <p className="text-slate-400">Classifying document types, extracting entities, and identifying risks.</p>
        </div>

        <div className="grid grid-cols-4 gap-4 w-full">
            {[
                { l: 'OCR', s: 'Completed', c: 'text-green-500' },
                { l: 'Classification', s: 'Completed', c: 'text-green-500' },
                { l: 'Metadata', s: analysisProgress > 50 ? 'Processing...' : 'Pending', c: 'text-brand-400' },
                { l: 'Risk Analysis', s: 'Pending', c: 'text-slate-500' }
            ].map((st, i) => (
                <div key={i} className="bg-dark-900 border border-dark-700 p-4 rounded-xl">
                    <div className={`text-sm font-bold ${st.c} mb-1`}>{st.l}</div>
                    <div className="text-xs text-slate-500">{st.s}</div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderReview = () => (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
              <div className="flex gap-6 items-center">
                  <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase font-bold">Total Files</span>
                      <span className="text-xl font-bold text-white">{files.length}</span>
                  </div>
                  <div className="w-px h-8 bg-dark-700"></div>
                  <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase font-bold">Action Required</span>
                      <span className="text-xl font-bold text-yellow-500">{reviewCount}</span>
                  </div>
                  <div className="w-px h-8 bg-dark-700"></div>
                  <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase font-bold">Ready</span>
                      <span className="text-xl font-bold text-green-500">{readyCount}</span>
                  </div>
              </div>
              <div className="flex gap-3">
                  <Button variant="secondary" className="text-xs"><Filter size={14} className="mr-2"/> Filter Issues</Button>
                  <Button variant="primary" className="text-xs shadow-lg shadow-brand-500/20" onClick={() => setStep('mapping')} disabled={reviewCount > 0}>
                      Next: Map Workflow <ArrowRight size={14} className="ml-2"/>
                  </Button>
              </div>
          </div>

          {/* Workspace */}
          <div className="flex gap-6 flex-1 overflow-hidden">
              {/* Left List */}
              <div className="w-1/3 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
                  {files.map(f => (
                      <div 
                        key={f.id} 
                        onClick={() => setSelectedFileId(f.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all group ${selectedFileId === f.id ? 'bg-brand-500/10 border-brand-500 ring-1 ring-brand-500/50' : 'bg-dark-900 border-dark-700 hover:border-dark-500'}`}
                      >
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                  <div className={`p-1.5 rounded ${f.status === 'ready' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                      <FileText size={16}/>
                                  </div>
                                  <div className="overflow-hidden">
                                      <p className={`text-sm font-bold truncate w-48 ${selectedFileId === f.id ? 'text-brand-400' : 'text-white'}`}>{f.name}</p>
                                      <p className="text-[10px] text-slate-500 flex items-center gap-2">
                                          {f.confidence}% Confidence
                                          {f.status === 'review_needed' && <span className="text-yellow-500 font-bold flex items-center gap-1">• {f.issues.length} Issues</span>}
                                      </p>
                                  </div>
                              </div>
                              {f.status === 'ready' ? <CheckCircle2 size={16} className="text-green-500"/> : <AlertTriangle size={16} className="text-yellow-500"/>}
                          </div>
                      </div>
                  ))}
              </div>

              {/* Right Remediation Panel */}
              <div className="flex-1 bg-dark-900 border border-dark-700 rounded-xl flex flex-col overflow-hidden shadow-2xl relative">
                  {selectedFile ? (
                      <>
                          <div className="p-4 border-b border-dark-700 bg-dark-950 flex justify-between items-center">
                              <div>
                                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                      <Edit3 size={14} className="text-brand-400"/> Remediation Console
                                  </h3>
                                  <p className="text-xs text-slate-500 truncate w-96">{selectedFile.name}</p>
                              </div>
                              <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-800">
                                  {['metadata', 'clauses', 'obligations', 'preview'].map(tab => (
                                      <button 
                                        key={tab}
                                        onClick={() => setReviewTab(tab as any)}
                                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${reviewTab === tab ? 'bg-dark-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                      >
                                          {tab}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-dark-950/50 relative">
                              
                              {/* AI Suggestions Floating */}
                              {selectedFile.issues.length > 0 && reviewTab !== 'preview' && (
                                  <div className="mb-6 p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl animate-in slide-in-from-top-2">
                                      <div className="flex items-center gap-2 mb-3">
                                          <Sparkles size={16} className="text-brand-400"/>
                                          <span className="text-sm font-bold text-white">AI Detected {selectedFile.issues.length} Issues</span>
                                      </div>
                                      <div className="space-y-2">
                                          {selectedFile.issues.map(issue => (
                                              <div key={issue.id} className="flex items-center justify-between p-2 bg-dark-900/80 rounded border border-brand-500/10">
                                                  <div className="flex items-center gap-2">
                                                      <AlertCircle size={14} className={issue.type === 'Critical' ? 'text-red-400' : 'text-yellow-400'}/>
                                                      <span className="text-xs text-slate-300">{issue.message}</span>
                                                      {issue.suggestion && <span className="text-xs text-brand-400 font-mono bg-brand-500/10 px-1.5 rounded">Suggestion: {issue.suggestion}</span>}
                                                  </div>
                                                  {issue.suggestion && (
                                                      <button 
                                                        onClick={() => handleApplySuggestion(issue.id)}
                                                        className="text-[10px] bg-brand-500 hover:bg-brand-400 text-white px-2 py-1 rounded font-bold transition-colors"
                                                      >
                                                          Apply
                                                      </button>
                                                  )}
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              )}

                              {reviewTab === 'metadata' && (
                                  <div className="grid grid-cols-2 gap-6">
                                      <Input label="Contract Type" value={selectedFile.metadata.type || ''} />
                                      <Input label="Counterparty" value={selectedFile.metadata.counterparty || ''} className={!selectedFile.metadata.counterparty ? 'border-red-500/50 bg-red-500/5' : ''}/>
                                      <Input label="Effective Date" type="date" value={selectedFile.metadata.effectiveDate || ''} className={!selectedFile.metadata.effectiveDate ? 'border-red-500/50 bg-red-500/5' : ''}/>
                                      <Input label="Total Value (USD)" value={selectedFile.metadata.value || ''} />
                                      <Input label="Jurisdiction" value={selectedFile.metadata.jurisdiction || ''} />
                                      <div className="flex items-center gap-2 pt-6">
                                          <Switch checked={selectedFile.metadata.autoRenewal || false} onChange={()=>{}} />
                                          <span className="text-sm text-slate-300">Auto-Renewal Clause Detected</span>
                                      </div>
                                  </div>
                              )}

                              {reviewTab === 'obligations' && (
                                  <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                          <h4 className="text-xs font-bold text-slate-500 uppercase">Extracted Milestones</h4>
                                          <button className="text-xs text-brand-400 hover:underline">+ Add Manually</button>
                                      </div>
                                      {selectedFile.obligations.length > 0 ? selectedFile.obligations.map(ob => (
                                          <div key={ob.id} className="p-3 bg-dark-900 border border-dark-700 rounded-xl flex justify-between items-center">
                                              <div className="flex gap-3 items-center">
                                                  <div className={`p-2 rounded-lg ${ob.type === 'Payment' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                      {ob.type === 'Payment' ? <DollarSign size={16}/> : <Calendar size={16}/>}
                                                  </div>
                                                  <div>
                                                      <p className="text-sm font-bold text-white">{ob.description}</p>
                                                      <p className="text-xs text-slate-500">Due: {ob.dueDate}</p>
                                                  </div>
                                              </div>
                                              <Badge color={ob.riskLevel === 'High' ? 'red' : 'green'}>{ob.riskLevel} Risk</Badge>
                                          </div>
                                      )) : (
                                          <div className="text-center py-8 text-slate-500 text-xs italic">No obligations extracted.</div>
                                      )}
                                  </div>
                              )}

                              {reviewTab === 'clauses' && (
                                  <div className="space-y-4">
                                      {selectedFile.clauses.map((cl, i) => (
                                          <div key={i} className="p-4 bg-dark-900 border border-dark-700 rounded-xl">
                                              <div className="flex justify-between items-center mb-2">
                                                  <span className="text-sm font-bold text-white">{cl.name}</span>
                                                  <Badge color={cl.deviation === 'Standard' ? 'green' : cl.deviation === 'High Risk' ? 'red' : 'yellow'}>{cl.deviation}</Badge>
                                              </div>
                                              <p className="text-xs text-slate-400 font-serif italic border-l-2 border-dark-700 pl-3">{cl.text}</p>
                                          </div>
                                      ))}
                                      {selectedFile.clauses.length === 0 && <div className="text-center py-8 text-slate-500 text-xs italic">No clauses analyzed.</div>}
                                  </div>
                              )}

                              {reviewTab === 'preview' && (
                                  <div className="h-full bg-white rounded-lg flex items-center justify-center text-black">
                                      <div className="text-center opacity-50">
                                          <FileText size={48} className="mx-auto mb-2"/>
                                          <p>PDF Viewer Mock</p>
                                      </div>
                                  </div>
                              )}
                          </div>

                          <div className="p-4 border-t border-dark-700 bg-dark-950 flex justify-between items-center">
                              <div className="text-xs text-slate-500">
                                  AI Confidence: <span className={`font-bold ${selectedFile.confidence > 90 ? 'text-green-400' : 'text-yellow-400'}`}>{selectedFile.confidence}%</span>
                              </div>
                              <div className="flex gap-3">
                                  <Button variant="secondary" onClick={() => setSelectedFileId(null)}>Skip</Button>
                                  <Button variant="primary" onClick={handleMarkReady} disabled={selectedFile.issues.length > 0}>
                                      <Check size={16} className="mr-2"/> Mark as Verified
                                  </Button>
                              </div>
                          </div>
                      </>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500">
                          <Search size={48} className="mb-4 opacity-20"/>
                          <p>Select a file to remediate</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );

  const renderMapping = () => (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95 max-w-4xl mx-auto">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Workflow & Repository Mapping</h2>
              <p className="text-slate-400 max-w-lg mx-auto">
                  How should these {readyCount} verified contracts be routed?
              </p>
          </div>

          <div className="grid grid-cols-2 gap-8 w-full mb-10">
              <div className="p-8 bg-dark-900 border border-dark-700 hover:border-brand-500/50 rounded-2xl cursor-pointer group text-center transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:text-brand-400 transition-colors">
                      <Workflow size={32}/>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Map to Existing Workflow</h3>
                  <p className="text-sm text-slate-500 mb-4">Route into current "Signed Contract" process.</p>
                  <Select options={[{label: 'General Archival', value: 'arch'}, {label: 'Vendor Onboarding', value: 'vendor'}]} className="bg-dark-950"/>
              </div>

              <div className="p-8 bg-purple-500/10 border border-purple-500/30 rounded-2xl cursor-pointer group text-center transition-all hover:-translate-y-1 relative overflow-hidden" onClick={() => setStep('complete')}>
                  <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-purple-500/30">
                      <Wand2 size={32}/>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">AI Auto-Generate</h3>
                  <p className="text-sm text-purple-200 mb-4">Create new workflow based on document types.</p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">Recommended</div>
              </div>
          </div>
      </div>
  );

  const renderComplete = () => (
      <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 text-green-500 ring-1 ring-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
           <ArchiveRestore size={48} />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Migration Successful</h2>
        <p className="text-slate-400 text-lg max-w-md text-center mb-10">
           <strong className="text-white">{readyCount} documents</strong> have been secured in the repository. 
           Obligations tracked, risks labeled, and workflows activated.
        </p>
        <div className="flex gap-4">
           <Button variant="secondary" onClick={() => window.location.reload()}><Download size={16} className="mr-2"/> Download Report</Button>
           <Button variant="primary" onClick={() => window.location.hash = '#/repository'}>Go to Repository</Button>
        </div>
     </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Stepper */}
      <div className="flex items-center justify-between mb-8 shrink-0">
         <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
               <ArchiveRestore className="text-brand-400" /> Legacy Migration Engine
            </h1>
            <p className="text-slate-400 text-sm">AI-powered ingestion for historical agreements.</p>
         </div>
         <div className="flex items-center gap-2 bg-dark-900 p-1 rounded-xl border border-dark-700">
             {[
                 { id: 'connect', label: 'Connect', icon: LinkIcon },
                 { id: 'dedupe', label: 'Scan', icon: GitMerge },
                 { id: 'analyze', label: 'Extract', icon: Sparkles },
                 { id: 'review', label: 'Review', icon: CheckCircle2 },
                 { id: 'mapping', label: 'Map', icon: Workflow },
                 { id: 'complete', label: 'Done', icon: Check }
             ].map(s => (
                 <StageBadge key={s.id} current={step} stage={s.id as MigrationStage} label={s.label} icon={s.icon} />
             ))}
         </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 bg-dark-950 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden relative">
         <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
         <div className="relative z-10 h-full p-8 overflow-y-auto custom-scrollbar">
            {step === 'connect' && renderConnect()}
            {step === 'dedupe' && renderDedupe()}
            {step === 'analyze' && renderAnalyze()}
            {step === 'review' && renderReview()}
            {step === 'mapping' && renderMapping()}
            {step === 'complete' && renderComplete()}
         </div>
      </div>
    </div>
  );
};

export default LegacyMigration;
