
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/UIComponents';
import { 
  ArchiveRestore, UploadCloud, FileText, CheckCircle2, 
  AlertTriangle, Folder, ArrowRight, Loader2, Play,
  LayoutTemplate, Wand2, Cloud, RefreshCw, Database, Eye, Edit3,
  Shield, ChevronRight, Check, Workflow, Sparkles, ArrowLeft, Search
} from 'lucide-react';

interface MigrationFile {
  id: string;
  name: string;
  size: string;
  status: 'pending' | 'analyzing' | 'review_needed' | 'ready';
  confidence: number;
  metadata: {
    type?: string;
    counterparty?: string;
    date?: string;
    value?: string;
    stage?: string;
  };
  issues: string[];
}

const MOCK_FILES_DATA: MigrationFile[] = [
  {
    id: '1',
    name: 'TechFlow_MSA_2023_Final.pdf',
    size: '2.4 MB',
    status: 'ready',
    confidence: 98,
    metadata: {
      type: 'MSA',
      counterparty: 'TechFlow Inc',
      date: '2023-05-15',
      value: '150000',
      stage: 'Signed'
    },
    issues: []
  },
  {
    id: '2',
    name: 'Acme_NDA_Signed.pdf',
    size: '1.1 MB',
    status: 'ready',
    confidence: 95,
    metadata: {
      type: 'NDA',
      counterparty: 'Acme Corp',
      date: '2023-08-01',
      value: '0',
      stage: 'Signed'
    },
    issues: []
  },
  {
    id: '3',
    name: 'Vendor_Agmt_Stratos_Draft.docx',
    size: '450 KB',
    status: 'review_needed',
    confidence: 65,
    metadata: {
      type: 'Vendor Agreement',
      counterparty: 'Stratos Consulting',
      date: '', // Missing
      value: '25000',
      stage: 'Draft'
    },
    issues: ['Effective Date missing', 'Unclear Termination Clause']
  },
  {
    id: '4',
    name: 'Service_Order_005.pdf',
    size: '890 KB',
    status: 'review_needed',
    confidence: 72,
    metadata: {
      type: 'SOW',
      counterparty: '', // Missing
      date: '2023-09-10',
      value: '', // Missing
      stage: 'Signed'
    },
    issues: ['Counterparty undetected', 'Contract Value ambiguous']
  }
];

const LegacyMigration: React.FC = () => {
  const [step, setStep] = useState<'selection' | 'source' | 'analyze' | 'review' | 'workflow' | 'complete'>('selection');
  const [migrationStrategy, setMigrationStrategy] = useState<'existing' | 'new' | null>(null);
  const [targetContractType, setTargetContractType] = useState('MSA');
  
  const [files, setFiles] = useState<MigrationFile[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState<MigrationFile['metadata']>({});
  
  // Mock Workflow Generation State
  const [generatedWorkflow, setGeneratedWorkflow] = useState<{
      name: string;
      description: string;
      nodes: { label: string; type: string }[];
  } | null>(null);

  // --- Handlers ---

  const handleStrategySelect = (strategy: 'existing' | 'new') => {
     setMigrationStrategy(strategy);
  };

  const handleProceedToSource = () => {
     if (migrationStrategy) setStep('source');
  };

  const handleFileUpload = () => {
    // Simulate upload
    setStep('analyze');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setAnalysisProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setFiles(MOCK_FILES_DATA);
        setStep('review');
      }
    }, 80);
  };

  const handleSelectFileForReview = (file: MigrationFile) => {
    setSelectedFileId(file.id);
    setReviewForm(file.metadata);
  };

  const handleSaveRemediation = () => {
    if (!selectedFileId) return;
    setFiles(prev => prev.map(f => f.id === selectedFileId ? {
      ...f,
      status: 'ready',
      issues: [],
      metadata: reviewForm
    } : f));
    setSelectedFileId(null);
  };

  const generateAutoWorkflow = () => {
    if (migrationStrategy === 'existing') {
        // Skip workflow generation if mapped to existing
        setStep('complete');
        return;
    }

    setGeneratedWorkflow({
        name: 'Detected: Vendor Onboarding Flow',
        description: 'Based on the high volume of Vendor Agreements and NDAs found in this batch, AI suggests this optimized routing.',
        nodes: [
            { label: 'Document Ingest', type: 'Trigger' },
            { label: 'Extract Metadata (AI)', type: 'Action' },
            { label: 'Check Value > $10k', type: 'Condition' },
            { label: 'Finance Approval', type: 'Approval' },
            { label: 'Archive to Repository', type: 'Action' }
        ]
    });
    setStep('workflow');
  };

  const handleFinalMigrate = () => {
    setStep('complete');
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'ready': return <CheckCircle2 size={16} className="text-green-500"/>;
          case 'review_needed': return <AlertTriangle size={16} className="text-yellow-500"/>;
          default: return <Loader2 size={16} className="animate-spin text-blue-500"/>;
      }
  };

  // --- UI SECTIONS ---

  const renderSelectionStep = () => (
     <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Migration Strategy</h2>
            <p className="text-slate-400 max-w-lg mx-auto">
                Before importing your legacy documents, tell us how you want them organized and processed.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-10">
            {/* Existing Contract Type Option */}
            <div 
               onClick={() => handleStrategySelect('existing')}
               className={`p-8 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden ${migrationStrategy === 'existing' ? 'bg-brand-500/10 border-brand-500 ring-2 ring-brand-500/50' : 'bg-dark-900 border-dark-700 hover:border-brand-500/30 hover:bg-brand-500/5'}`}
            >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${migrationStrategy === 'existing' ? 'bg-brand-500 text-white' : 'bg-dark-800 text-slate-400 group-hover:text-brand-400'}`}>
                    <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Map to Existing Type</h3>
                <p className="text-sm text-slate-500 mb-6">Import documents into an already defined category (e.g. MSA, NDA) and inherit its current workflow.</p>
                
                {migrationStrategy === 'existing' && (
                    <div className="w-full animate-in fade-in slide-in-from-bottom-2" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-xs font-bold text-brand-400 mb-2 uppercase">Select Target Contract Type</label>
                        <Select 
                           options={[{label: 'Master Services Agreement (MSA)', value: 'MSA'}, {label: 'Non-Disclosure Agreement (NDA)', value: 'NDA'}, {label: 'Vendor Agreement', value: 'Vendor'}]} 
                           value={targetContractType}
                           onChange={(e) => setTargetContractType(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* New Workflow Option */}
            <div 
               onClick={() => handleStrategySelect('new')}
               className={`p-8 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden ${migrationStrategy === 'new' ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/50' : 'bg-dark-900 border-dark-700 hover:border-purple-500/30 hover:bg-purple-500/5'}`}
            >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${migrationStrategy === 'new' ? 'bg-purple-500 text-white' : 'bg-dark-800 text-slate-400 group-hover:text-purple-400'}`}>
                    <Sparkles size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Discover & Build Workflow</h3>
                <p className="text-sm text-slate-500 mb-6">Let AI analyze your documents to categorize them and generate a brand new workflow automatically.</p>
            </div>
        </div>

        <Button 
           variant="primary" 
           className="px-10 py-4 text-base shadow-xl disabled:opacity-50" 
           disabled={!migrationStrategy}
           onClick={handleProceedToSource}
        >
           Continue to Upload <ArrowRight size={18} className="ml-2"/>
        </Button>
     </div>
  );

  const renderSourceStep = () => (
    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95">
       <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Import Legacy Contracts</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
             <Badge color={migrationStrategy === 'existing' ? 'brand' : 'purple'}>Strategy: {migrationStrategy === 'existing' ? `Map to ${targetTypeDisplay}` : 'AI Discovery'}</Badge>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <button 
            onClick={handleFileUpload}
            className="group bg-dark-900 border border-dark-700 hover:border-brand-500/50 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:bg-brand-500/5 relative overflow-hidden"
          >
             <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-brand-500/20 relative z-10">
                <UploadCloud size={32} className="text-slate-400 group-hover:text-brand-400"/>
             </div>
             <h3 className="text-lg font-bold text-white mb-2 relative z-10">Local Bulk Upload</h3>
             <p className="text-sm text-slate-500 relative z-10">Drag & drop folders or select multiple PDF/Word files.</p>
          </button>

          <button className="group bg-dark-900 border border-dark-700 hover:border-blue-500/50 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:bg-blue-500/5">
             <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-blue-500/20">
                <Folder size={32} className="text-slate-400 group-hover:text-blue-400"/>
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Connect SharePoint</h3>
             <p className="text-sm text-slate-500">Link a specific document library or folder path.</p>
          </button>

          <button className="group bg-dark-900 border border-dark-700 hover:border-yellow-500/50 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:bg-yellow-500/5">
             <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-yellow-500/20">
                <Cloud size={32} className="text-slate-400 group-hover:text-yellow-400"/>
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Google Drive</h3>
             <p className="text-sm text-slate-500">Sync shared drives and maintain folder structure.</p>
          </button>
       </div>
       
       <div className="mt-8">
          <Button variant="ghost" onClick={() => setStep('selection')}><ArrowLeft size={16} className="mr-2"/> Back to Strategy</Button>
       </div>
    </div>
  );

  const renderAnalyzeStep = () => {
     const stage = analysisProgress < 30 ? 'OCR Scanning' : 
                  analysisProgress < 60 ? 'Entity Extraction' : 
                  analysisProgress < 90 ? 'Clause Classification' : 'Finalizing';

     return (
        <div className="flex flex-col items-center justify-center py-16 w-full max-w-4xl mx-auto animate-in fade-in zoom-in-95">
           <style>{`
             @keyframes scan-beam {
               0% { top: 0%; opacity: 0; }
               15% { opacity: 1; }
               85% { opacity: 1; }
               100% { top: 100%; opacity: 0; }
             }
             .animate-scan {
               animation: scan-beam 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
             }
           `}</style>
           
           <div className="relative w-full bg-dark-900/50 border border-dark-700 rounded-2xl p-12 overflow-hidden shadow-2xl flex flex-col items-center">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-dark-950"></div>
              
              {/* Central Visual */}
              <div className="relative z-10 mb-8">
                 <div className="w-32 h-40 bg-dark-800 rounded-lg border border-slate-700 shadow-2xl relative overflow-hidden mx-auto flex flex-col p-4 group">
                    <div className="space-y-2 opacity-50 group-hover:opacity-70 transition-opacity">
                       <div className="h-2 w-3/4 bg-slate-600 rounded"></div>
                       <div className="h-2 w-1/2 bg-slate-600 rounded"></div>
                       <div className="h-2 w-full bg-slate-700 rounded"></div>
                       <div className="h-2 w-full bg-slate-700 rounded"></div>
                       <div className="h-2 w-5/6 bg-slate-700 rounded"></div>
                       <div className="h-2 w-full bg-slate-700 rounded"></div>
                    </div>
                    
                    {/* Scan Beam */}
                    <div className="absolute left-0 w-full h-12 bg-gradient-to-b from-brand-500/0 via-brand-500/20 to-brand-500/40 border-b border-brand-400/50 animate-scan shadow-[0_0_15px_rgba(20,184,166,0.3)]"></div>
                 </div>
                 
                 {/* Rings */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-brand-500/10 rounded-full animate-[ping_3s_linear_infinite]"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-brand-500/20 rounded-full animate-[ping_3s_linear_infinite_0.5s]"></div>
              </div>
   
              {/* Status */}
              <div className="relative z-10 text-center space-y-2">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                    <Loader2 size={12} className="animate-spin"/> {stage}
                 </div>
                 <h3 className="text-2xl font-bold text-white tracking-tight">Analyzing Legacy Documents</h3>
                 <p className="text-slate-400 text-sm">AI is extracting metadata, identifying clauses, and mapping entities.</p>
              </div>
   
              {/* Progress Bar */}
              <div className="relative z-10 w-full max-w-md mt-8">
                 <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
                    <span>Progress</span>
                    <span className="text-brand-400">{analysisProgress}%</span>
                 </div>
                 <div className="h-2 bg-dark-800 rounded-full overflow-hidden border border-dark-700">
                    <div className="h-full bg-brand-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] transition-all duration-200 ease-out relative" style={{ width: `${analysisProgress}%` }}>
                       <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1s_linear_infinite]" style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem'}}></div>
                    </div>
                 </div>
              </div>
              
              {/* Steps Grid */}
              <div className="relative z-10 mt-8 grid grid-cols-3 gap-4 w-full max-w-xl">
                 {[
                    { label: 'OCR Scanning', icon: FileText, threshold: 10 },
                    { label: 'Entity Extract', icon: Search, threshold: 40 },
                    { label: 'Risk Analysis', icon: Shield, threshold: 70 }
                 ].map((step, i) => (
                    <div key={i} className={`p-3 rounded-xl border text-center transition-all duration-500 ${analysisProgress > step.threshold ? 'bg-dark-800/80 border-brand-500/30 text-white shadow-lg shadow-brand-500/5' : 'bg-dark-900/50 border-dark-700 text-slate-600 opacity-60'}`}>
                       <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors duration-300 ${analysisProgress > step.threshold + 20 ? 'bg-green-500 text-white' : analysisProgress > step.threshold ? 'bg-brand-500 text-white animate-pulse' : 'bg-dark-700 text-slate-500'}`}>
                          {analysisProgress > step.threshold + 20 ? <Check size={14}/> : <step.icon size={14}/>}
                       </div>
                       <p className="text-[10px] font-bold uppercase tracking-wide">{step.label}</p>
                    </div>
                 ))}
              </div>
   
           </div>
        </div>
     );
  };

  const renderReviewStep = () => {
     const readyCount = files.filter(f => f.status === 'ready').length;
     const needsReviewCount = files.filter(f => f.status === 'review_needed').length;

     return (
        <div className="flex flex-col h-full">
           <div className="flex justify-between items-end mb-6">
              <div>
                 <h2 className="text-2xl font-bold text-white">Review & Remediate</h2>
                 <p className="text-slate-400">AI successfully processed <strong className="text-green-400">{readyCount}</strong> files. <strong className="text-yellow-500">{needsReviewCount}</strong> files require manual verification.</p>
              </div>
              <Button 
                variant="primary" 
                disabled={needsReviewCount > 0} 
                onClick={generateAutoWorkflow}
                className="shadow-lg shadow-brand-500/20"
              >
                {needsReviewCount > 0 ? 'Fix Issues to Proceed' : migrationStrategy === 'existing' ? 'Complete Migration' : 'Next: Generate Workflow'} <ArrowRight size={16} className="ml-2"/>
              </Button>
           </div>

           <div className="flex gap-6 flex-1 overflow-hidden">
              {/* File List */}
              <div className="w-1/2 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
                 {files.map(file => (
                    <div 
                      key={file.id} 
                      onClick={() => file.status === 'review_needed' ? handleSelectFileForReview(file) : null}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedFileId === file.id 
                          ? 'bg-brand-500/10 border-brand-500 ring-1 ring-brand-500/50' 
                          : file.status === 'review_needed' 
                             ? 'bg-dark-900 border-yellow-500/30 hover:border-yellow-500/60' 
                             : 'bg-dark-900 border-dark-700 opacity-75'
                      }`}
                    >
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                             {getStatusIcon(file.status)}
                             <div>
                                <p className="text-sm font-bold text-white truncate w-64" title={file.name}>{file.name}</p>
                                <p className="text-xs text-slate-500">{file.size} • {file.confidence}% Confidence</p>
                             </div>
                          </div>
                          {file.status === 'review_needed' && <Badge color="yellow">Action Req</Badge>}
                       </div>
                       {file.issues.length > 0 && (
                          <div className="mt-2 pl-7">
                             {file.issues.map((issue, i) => (
                                <p key={i} className="text-xs text-red-400 flex items-center gap-1">
                                   <span className="w-1 h-1 rounded-full bg-red-500"></span> {issue}
                                </p>
                             ))}
                          </div>
                       )}
                    </div>
                 ))}
              </div>

              {/* Remediation Panel */}
              <Card className="w-1/2 flex flex-col border-dark-700 bg-dark-900/50" noPadding>
                 {selectedFileId ? (
                    <div className="flex flex-col h-full">
                       <div className="p-4 border-b border-dark-700 bg-dark-950/50">
                          <h3 className="font-bold text-white flex items-center gap-2">
                             <Edit3 size={16} className="text-brand-400"/> Metadata Editor
                          </h3>
                          <p className="text-xs text-slate-500 truncate mt-1">Fixing: {files.find(f => f.id === selectedFileId)?.name}</p>
                       </div>
                       
                       <div className="p-6 flex-1 overflow-y-auto space-y-5">
                          <div className="p-4 bg-dark-950 rounded-lg border border-dark-800 mb-4">
                             <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><Eye size={12}/> Document Preview Snippet</h4>
                             <p className="text-xs text-slate-400 font-serif italic leading-relaxed">
                                "...this Agreement is entered into as of [DATE MISSING], by and between the undersigned parties..."
                             </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <Input 
                                label="Contract Type" 
                                value={reviewForm.type || ''} 
                                onChange={(e) => setReviewForm({...reviewForm, type: e.target.value})} 
                             />
                             <Input 
                                label="Lifecycle Stage" 
                                value={reviewForm.stage || ''} 
                                onChange={(e) => setReviewForm({...reviewForm, stage: e.target.value})} 
                             />
                             <Input 
                                label="Counterparty" 
                                value={reviewForm.counterparty || ''} 
                                onChange={(e) => setReviewForm({...reviewForm, counterparty: e.target.value})}
                                className={!reviewForm.counterparty ? 'border-red-500/50 bg-red-500/5' : ''}
                             />
                             <Input 
                                label="Effective Date" 
                                type="date"
                                value={reviewForm.date || ''} 
                                onChange={(e) => setReviewForm({...reviewForm, date: e.target.value})}
                                className={!reviewForm.date ? 'border-red-500/50 bg-red-500/5' : ''}
                             />
                             <div className="col-span-2">
                                <Input 
                                   label="Total Contract Value (USD)" 
                                   value={reviewForm.value || ''} 
                                   onChange={(e) => setReviewForm({...reviewForm, value: e.target.value})}
                                   className={!reviewForm.value ? 'border-red-500/50 bg-red-500/5' : ''}
                                />
                             </div>
                          </div>
                       </div>

                       <div className="p-4 border-t border-dark-700 bg-dark-950/50 flex justify-end gap-3">
                          <Button variant="ghost" onClick={() => setSelectedFileId(null)}>Cancel</Button>
                          <Button variant="primary" onClick={handleSaveRemediation}>Verify & Save</Button>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                       <FileText size={48} className="mb-4 opacity-20"/>
                       <p>Select a file from the list to review metadata.</p>
                    </div>
                 )}
              </Card>
           </div>
        </div>
     );
  };

  const renderWorkflowStep = () => (
     <div className="flex flex-col h-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 text-brand-400 rounded-full text-xs font-bold border border-brand-500/20 mb-4">
              <Wand2 size={12} /> AI Suggestion
           </div>
           <h2 className="text-3xl font-bold text-white mb-2">{generatedWorkflow?.name}</h2>
           <p className="text-slate-400 max-w-2xl mx-auto">{generatedWorkflow?.description}</p>
        </div>

        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-12 relative overflow-hidden mb-10">
           {/* Workflow Visualizer */}
           <div className="absolute inset-0 bg-white/[0.02]" style={{backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
           
           <div className="relative z-10 flex items-center justify-between px-12">
              {generatedWorkflow?.nodes.map((node, i) => (
                 <div key={i} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-3 relative z-10">
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl ${
                          node.type === 'Trigger' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' :
                          node.type === 'Action' ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' :
                          node.type === 'Condition' ? 'bg-purple-500/10 border-purple-500/50 text-purple-500' :
                          'bg-green-500/10 border-green-500/50 text-green-500'
                       }`}>
                          {node.type === 'Trigger' && <Play size={24} />}
                          {node.type === 'Action' && <Database size={24} />}
                          {node.type === 'Condition' && <Shield size={24} />}
                          {node.type === 'Approval' && <CheckCircle2 size={24} />}
                       </div>
                       <div className="text-center">
                          <p className="text-sm font-bold text-white">{node.label}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wider">{node.type}</p>
                       </div>
                    </div>
                    {i < generatedWorkflow.nodes.length - 1 && (
                       <div className="h-1 flex-1 bg-dark-700 mx-4 rounded-full relative overflow-hidden">
                          <div className="absolute inset-0 bg-brand-500/50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>

        <div className="flex justify-center gap-6">
           <Button variant="secondary" className="px-8 py-4 text-base" onClick={() => {/* Navigate to Builder */}}>
              <LayoutTemplate size={18} className="mr-2"/> Customize in Builder
           </Button>
           <Button variant="primary" className="px-8 py-4 text-base shadow-xl shadow-brand-500/20" onClick={handleFinalMigrate}>
              <Check size={18} className="mr-2"/> Approve & Migrate
           </Button>
        </div>
     </div>
  );

  const renderCompleteStep = () => (
     <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 text-green-500 ring-1 ring-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
           <ArchiveRestore size={48} />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Migration Successful</h2>
        <p className="text-slate-400 text-lg max-w-md text-center mb-10">
           4 documents have been secured in the repository. 
           {migrationStrategy === 'new' 
              ? ' The "Vendor Onboarding" workflow has been activated.' 
              : ` Mapped to existing "${targetContractType}" workflow.`}
        </p>
        <div className="flex gap-4">
           <Button variant="ghost" onClick={() => { setStep('selection'); setFiles([]); setMigrationStrategy(null); }}>Migrate More</Button>
           <Button variant="primary" onClick={() => window.location.hash = '#/repository'}>Go to Repository</Button>
        </div>
     </div>
  );

  const targetTypeDisplay = targetContractType || 'Type';

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
               <ArchiveRestore className="text-brand-400" /> Legacy Migration
            </h1>
            <p className="text-slate-400 text-sm">AI-powered ingestion for historical agreements.</p>
         </div>
         <div className="flex items-center gap-2 bg-dark-900 p-1 rounded-lg border border-dark-700">
             {['Selection', 'Source', 'Analyze', 'Review', 'Workflow', 'Done'].map((s, i) => {
                 const steps = ['selection', 'source', 'analyze', 'review', 'workflow', 'complete'];
                 const currentIdx = steps.indexOf(step);
                 
                 // Skip Workflow step in visual bar if using 'existing' strategy
                 if (s === 'Workflow' && migrationStrategy === 'existing') return null;

                 const isActive = currentIdx === i;
                 const isPast = currentIdx > i;
                 
                 return (
                    <div key={s} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${isActive ? 'bg-brand-500 text-white shadow-md' : isPast ? 'text-brand-400' : 'text-slate-600'}`}>
                       {isPast && <CheckCircle2 size={12}/>}
                       {s}
                    </div>
                 )
             })}
         </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 bg-dark-950 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden relative">
         <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
         <div className="relative z-10 h-full p-8 overflow-y-auto custom-scrollbar">
            {step === 'selection' && renderSelectionStep()}
            {step === 'source' && renderSourceStep()}
            {step === 'analyze' && renderAnalyzeStep()}
            {step === 'review' && renderReviewStep()}
            {step === 'workflow' && renderWorkflowStep()}
            {step === 'complete' && renderCompleteStep()}
         </div>
      </div>
    </div>
  );
};

export default LegacyMigration;
