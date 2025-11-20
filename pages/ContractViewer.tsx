
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Badge } from '../components/UIComponents';
import { MOCK_CONTRACTS } from '../mock/data';
import { 
  Eye, EyeOff, ShieldAlert, CheckCircle, ChevronLeft, MessageSquare, Sparkles,
  FileText, Clock, CheckCircle2, User, ArrowRight, Calendar, Download, Share2,
  History, LayoutDashboard, FileCheck, PenTool, Briefcase, Building, DollarSign,
  AlertCircle
} from 'lucide-react';

// --- MOCK EXTENDED DATA ---
// Since we don't have a backend, we generate deterministic "Extended" data for the view
const getMockLifecycleData = (contractId: string) => {
  return {
    intake: {
      requestor: 'Sarah Jenkins (Sales)',
      submittedDate: '2023-10-12',
      businessJustification: 'Required for Q4 Enterprise Deal closure. Client requires custom SLA terms.',
      budgetCode: 'SALES-Q4-23',
      dataPrivacy: 'Yes - GDPR applicable',
      territory: 'EMEA',
      priority: 'High'
    },
    workflowStages: [
      { id: 1, name: 'Intake', status: 'completed', date: 'Oct 12, 2023' },
      { id: 2, name: 'Internal Review', status: 'completed', date: 'Oct 14, 2023' },
      { id: 3, name: 'Negotiation', status: 'current', date: 'In Progress' },
      { id: 4, name: 'Approvals', status: 'pending', date: 'Est. Oct 20' },
      { id: 5, name: 'Signatures', status: 'pending', date: 'Est. Oct 22' },
      { id: 6, name: 'Active', status: 'pending', date: '-' }
    ],
    approvers: [
      { id: 1, name: 'Legal Team', role: 'Compliance Check', status: 'approved', date: 'Oct 14, 2023', avatar: 'LT' },
      { id: 2, name: 'Mike Ross', role: 'Legal Counsel', status: 'approved', date: 'Oct 14, 2023', avatar: 'MR' },
      { id: 3, name: 'Jessica Pearson', role: 'Managing Partner', status: 'pending', date: '-', avatar: 'JP' },
      { id: 4, name: 'CFO Office', role: 'Financial Review', status: 'pending', date: '-', avatar: 'CF' },
    ],
    signatories: [
      { name: 'Harvey Specter', company: 'Agreemetrix Inc', status: 'pending', email: 'harvey@agreemetrix.ai' },
      { name: 'John Doe', company: 'Counterparty Inc', status: 'pending', email: 'j.doe@client.com' }
    ]
  };
};

const ContractViewer: React.FC = () => {
  const { id } = useParams();
  const contract = MOCK_CONTRACTS.find(c => c.id === id) || MOCK_CONTRACTS[0];
  const extendedData = getMockLifecycleData(contract.id);
  
  const [activeView, setActiveView] = useState<'overview' | 'document'>('overview');
  
  // Document View State
  const [activeRole, setActiveRole] = useState<'Legal' | 'Sales' | 'HR'>('Legal');
  const [showAI, setShowAI] = useState(true);

  // --- SUB-COMPONENTS ---

  const LifecycleStepper = () => (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-dark-800 -z-0"></div>
        
        {extendedData.workflowStages.map((stage, index) => {
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';
          const isPending = stage.status === 'pending';

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                isCompleted ? 'bg-green-500 border-dark-950 text-white' :
                isCurrent ? 'bg-dark-950 border-brand-500 text-brand-400 shadow-[0_0_15px_rgba(var(--color-brand-500),0.5)] scale-110' :
                'bg-dark-900 border-dark-700 text-slate-600'
              }`}>
                {isCompleted ? <CheckCircle2 size={18} /> : 
                 isCurrent ? <Clock size={18} className="animate-pulse" /> :
                 <span className="text-xs font-bold">{index + 1}</span>}
              </div>
              <div className="mt-3 text-center">
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  isCurrent ? 'text-brand-400' : isCompleted ? 'text-green-400' : 'text-slate-600'
                }`}>{stage.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{stage.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // --- RENDERERS ---

  const renderOverview = () => (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Left Column: Metadata & Intake */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        
        {/* Header Card */}
        <Card noPadding className="bg-gradient-to-br from-dark-900 to-dark-950 border-dark-700">
           <div className="p-6 border-b border-white/5 flex justify-between items-start">
              <div className="flex gap-4">
                 <div className="w-16 h-16 bg-brand-500/10 rounded-xl border border-brand-500/20 flex items-center justify-center text-brand-400">
                    <FileText size={32} />
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold text-white mb-1">{contract.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                       <span className="flex items-center gap-1"><Building size={14}/> {contract.counterparty}</span>
                       <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                       <span className="font-mono opacity-70">{contract.id}</span>
                       <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                       <span className="text-brand-400 font-medium">{contract.type}</span>
                    </div>
                 </div>
              </div>
              <div className="text-right">
                 <Badge color="blue" className="text-sm px-3 py-1 mb-2">{contract.status}</Badge>
                 <p className="text-xs text-slate-500">Created: {extendedData.intake.submittedDate}</p>
              </div>
           </div>
           
           <div className="grid grid-cols-4 divide-x divide-white/5 bg-white/[0.02]">
              <div className="p-4 text-center">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Value</p>
                 <p className="text-lg font-mono text-white font-bold">${contract.value.toLocaleString()}</p>
              </div>
              <div className="p-4 text-center">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Start Date</p>
                 <p className="text-sm text-white font-medium">{contract.startDate}</p>
              </div>
              <div className="p-4 text-center">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Renewal</p>
                 <p className="text-sm text-white font-medium">{contract.renewalDate}</p>
              </div>
              <div className="p-4 text-center">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Owner</p>
                 <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white">SJ</div>
                    <p className="text-sm text-white font-medium truncate">{contract.owner}</p>
                 </div>
              </div>
           </div>
        </Card>

        {/* Intake Data */}
        <Card title="Intake Request Details">
           <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 bg-dark-950 p-4 rounded-lg border border-dark-800">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Business Justification</p>
                 <p className="text-sm text-slate-300 italic">"{extendedData.intake.businessJustification}"</p>
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Requestor</p>
                 <p className="text-sm text-white flex items-center gap-2"><User size={14} className="text-brand-400"/> {extendedData.intake.requestor}</p>
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Budget Code</p>
                 <p className="text-sm text-white font-mono bg-dark-800 px-2 py-1 rounded inline-block">{extendedData.intake.budgetCode}</p>
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Data Privacy (GDPR)</p>
                 <p className="text-sm text-white flex items-center gap-2">
                    {extendedData.intake.dataPrivacy.includes('Yes') ? <ShieldAlert size={14} className="text-yellow-500"/> : <CheckCircle size={14}/>}
                    {extendedData.intake.dataPrivacy}
                 </p>
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Priority</p>
                 <Badge color={extendedData.intake.priority === 'High' ? 'red' : 'gray'}>{extendedData.intake.priority}</Badge>
              </div>
           </div>
        </Card>
        
        {/* AI Clause Analysis Preview */}
        <div className="p-5 bg-brand-500/5 border border-brand-500/20 rounded-xl">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-brand-100 flex items-center gap-2">
                   <Sparkles size={16} className="text-brand-400" /> AI Contract Insights
                </h3>
                <Button variant="neon" className="text-xs h-7 px-3" onClick={() => setActiveView('document')}>View Full Analysis</Button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
               This contract contains <strong className="text-white">3 non-standard clauses</strong>. 
               Risk score is <strong className={contract.riskScore > 50 ? 'text-red-400' : 'text-green-400'}>{contract.riskScore}/100</strong>.
               Primary deviations found in Indemnification and Payment Terms.
            </p>
            <div className="flex gap-2">
                <span className="text-[10px] px-2 py-1 bg-red-500/10 text-red-400 rounded border border-red-500/20">High Risk: Indemnity</span>
                <span className="text-[10px] px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded border border-yellow-500/20">Med Risk: Net 60</span>
            </div>
        </div>
      </div>

      {/* Right Column: Workflow & Signatories */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
         
         {/* Approval Chain */}
         <Card title="Approval Chain">
            <div className="relative pl-4 space-y-6 before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-px before:bg-dark-700">
               {extendedData.approvers.map((approver) => (
                  <div key={approver.id} className="relative flex items-start gap-4 group">
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                        approver.status === 'approved' ? 'bg-green-500 border-green-500 text-white' :
                        approver.status === 'rejected' ? 'bg-red-500 border-red-500 text-white' :
                        'bg-dark-900 border-slate-600 text-slate-500'
                     }`}>
                        {approver.status === 'approved' && <CheckCircle2 size={14} />}
                        {approver.status === 'pending' && <div className="w-2 h-2 bg-slate-500 rounded-full"></div>}
                     </div>
                     <div className="flex-1 -mt-1">
                        <div className="flex justify-between items-start">
                           <p className="text-sm font-bold text-white">{approver.name}</p>
                           {approver.status === 'approved' && <span className="text-[10px] text-slate-500">{approver.date}</span>}
                        </div>
                        <p className="text-xs text-slate-500 mb-1">{approver.role}</p>
                        <Badge color={approver.status === 'approved' ? 'green' : 'gray'}>{approver.status}</Badge>
                     </div>
                  </div>
               ))}
            </div>
         </Card>

         {/* Signatories */}
         <Card title="Signatories">
            <div className="space-y-4">
               {extendedData.signatories.map((signer, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-dark-950 rounded-lg border border-dark-800">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {signer.name.split(' ').map(n=>n[0]).join('')}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{signer.name}</p>
                        <p className="text-xs text-slate-500 truncate">{signer.company}</p>
                     </div>
                     <div className={`w-3 h-3 rounded-full border-2 ${signer.status === 'signed' ? 'bg-green-500 border-green-500' : 'bg-transparent border-slate-500'}`}></div>
                  </div>
               ))}
               <Button variant="secondary" className="w-full text-xs">
                   <PenTool size={14} className="mr-2"/> Manage Signers via DocuSign
               </Button>
            </div>
         </Card>

         {/* Actions */}
         <Card title="Quick Actions" noPadding>
            <div className="p-2 grid grid-cols-2 gap-2">
               <button className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-white/5 transition-colors gap-2 text-slate-400 hover:text-white">
                  <Download size={20}/>
                  <span className="text-xs font-bold">Download PDF</span>
               </button>
               <button className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-white/5 transition-colors gap-2 text-slate-400 hover:text-white">
                  <Share2 size={20}/>
                  <span className="text-xs font-bold">Share Link</span>
               </button>
               <button className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-white/5 transition-colors gap-2 text-slate-400 hover:text-white">
                  <History size={20}/>
                  <span className="text-xs font-bold">Audit Log</span>
               </button>
               <button className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-white/5 transition-colors gap-2 text-slate-400 hover:text-white">
                  <AlertCircle size={20}/>
                  <span className="text-xs font-bold">Report Issue</span>
               </button>
            </div>
         </Card>

      </div>
    </div>
  );

  const renderDocumentView = () => {
     // Mock text with structure to simulate redaction
    const documentSections = [
        {
          title: "1. Services and Compensation",
          content: "Client agrees to pay Vendor a total fee of $150,000 USD for the services rendered.",
          sensitiveTo: ['Sales', 'HR'], // Legal sees all
          redactionType: 'blur'
        },
        {
          title: "2. Employee Benefits",
          content: "Vendor employees assigned to this project shall receive a per diem of $200 for travel expenses.",
          sensitiveTo: ['Sales'], // HR and Legal see this
          redactionType: 'blackout'
        },
        {
          title: "3. Indemnification",
          content: "Vendor shall indemnify Client against any claims arising from gross negligence or willful misconduct.",
          sensitiveTo: [],
          isRisk: true
        }
      ];
    
      const isRedacted = (sensitiveTo: string[]) => {
        if (activeRole === 'Legal') return false;
        if (activeRole === 'Sales' && sensitiveTo.includes('Sales')) return true;
        if (activeRole === 'HR' && sensitiveTo.includes('HR')) return true;
        return false;
      };

      const SendIcon = ({size}:{size:number}) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      );

      return (
        <div className="flex flex-1 gap-6 overflow-hidden h-[calc(100vh-12rem)] animate-in fade-in">
            {/* Document View */}
            <div className="flex-1 bg-dark-900 rounded-lg border border-dark-700 shadow-sm overflow-y-auto p-12 font-serif text-slate-200 leading-relaxed">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center mb-12">
                <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">Master Services Agreement</h1>
                <p className="text-sm text-slate-500">Reference: {contract.id}</p>
                </div>

                <p>This Agreement is entered into as of {contract.startDate}, by and between {contract.counterparty} ("Vendor") and Agreemetrix Inc ("Client").</p>

                {documentSections.map((section, idx) => (
                <div key={idx} className="relative group">
                    <h3 className="font-bold text-lg mb-2">{section.title}</h3>
                    <div className={`relative p-2 rounded transition-all duration-300 ${isRedacted(section.sensitiveTo) ? 'bg-slate-100/10 select-none' : ''} ${section.isRisk && activeRole === 'Legal' ? 'bg-red-500/10 border-l-4 border-red-400 pl-4' : ''}`}>
                        
                        {/* Content Layer */}
                        <p className={isRedacted(section.sensitiveTo) ? 'blur-sm opacity-40' : ''}>
                        {section.content}
                        </p>

                        {/* Redaction Overlay */}
                        {isRedacted(section.sensitiveTo) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex items-center gap-2 px-4 py-2 bg-dark-800 text-white rounded-md shadow-lg text-xs font-bold uppercase tracking-wide border border-dark-700">
                            <EyeOff size={14} />
                            Redacted for {activeRole}
                            </div>
                        </div>
                        )}

                        {/* Risk Indicator (Legal Only) */}
                        {!isRedacted(section.sensitiveTo) && section.isRisk && activeRole === 'Legal' && (
                        <div className="absolute -right-4 top-0 translate-x-full w-48">
                            <div className="bg-dark-900 p-3 rounded border border-red-500/30 shadow-sm text-xs">
                            <div className="flex items-center gap-1 text-red-400 font-bold mb-1">
                                <ShieldAlert size={14} /> High Risk Clause
                            </div>
                            <p className="text-slate-400">Deviation from standard playbook. Uncapped liability detected.</p>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                ))}
                
                <div className="mt-12 pt-12 border-t border-dark-700 grid grid-cols-2 gap-12">
                <div>
                    <div className="h-px bg-slate-500 mb-4"></div>
                    <p className="font-bold">Signed by Vendor</p>
                    <p className="font-serif italic text-2xl mt-2 font-bold text-blue-400">John Doe</p>
                </div>
                <div>
                    <div className="h-px bg-slate-500 mb-4"></div>
                    <p className="font-bold">Signed by Client</p>
                    <div className="h-10 bg-yellow-500/10 border border-yellow-500/30 border-dashed rounded flex items-center justify-center text-yellow-500 text-xs font-medium mt-2">
                        Pending Signature
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* AI Sidebar */}
            {showAI && (
            <div className="w-80 flex flex-col gap-4">
                <Card title="Agreemetrix AI" className="flex-1 flex flex-col" action={<Sparkles size={18} className="text-brand-500"/>}>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    <div className="p-3 bg-brand-500/10 rounded-lg border border-brand-500/20">
                        <h4 className="text-sm font-bold text-brand-400 mb-1 flex items-center gap-2">
                            <CheckCircle size={14} /> Contract Summary
                        </h4>
                        <p className="text-xs text-brand-200/80">
                            This is a standard MSA. Value is $150k. Payment terms are Net 30. 
                            <br/><strong>Key Flag:</strong> Indemnity clause is non-standard.
                        </p>
                    </div>

                    <div className="p-3 bg-dark-950 rounded-lg border border-dark-800">
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role Simulator</h4>
                         <div className="flex flex-wrap gap-2">
                            {(['Legal', 'Sales', 'HR'] as const).map((role) => (
                                <button
                                key={role}
                                onClick={() => setActiveRole(role)}
                                className={`px-2 py-1 text-[10px] font-bold uppercase rounded border transition-colors ${
                                    activeRole === role 
                                    ? 'bg-slate-100 text-slate-900 border-slate-100' 
                                    : 'text-slate-500 border-slate-700 hover:border-slate-500'
                                }`}
                                >
                                {role} View
                                </button>
                            ))}
                         </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detected Risks</h4>
                        <div className="space-y-2">
                        <div className="p-3 bg-red-500/10 rounded border border-red-500/20">
                            <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-red-400">Liability Cap</span>
                            <Badge color="red">High</Badge>
                            </div>
                            <p className="text-xs text-slate-400">Clause 3 misses standard cap of 2x fees.</p>
                            <button className="mt-2 text-xs text-red-400 font-medium hover:underline">Auto-Redline</button>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
                            <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-yellow-400">Payment Terms</span>
                            <Badge color="yellow">Med</Badge>
                            </div>
                            <p className="text-xs text-slate-400">Net 15 requested; Standard is Net 45.</p>
                        </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ask Agent</h4>
                        <div className="relative">
                            <input type="text" placeholder="E.g., What is the termination notice?" className="w-full text-xs p-2 pr-8 rounded border border-dark-700 bg-dark-950 text-slate-200 focus:border-brand-500 focus:outline-none" />
                            <button className="absolute right-2 top-1.5 text-brand-500"><SendIcon size={14}/></button>
                        </div>
                    </div>
                    </div>
                </Card>
                
                <Card className="bg-dark-900 border-dark-700">
                <div className="flex items-start gap-3">
                    <MessageSquare size={20} className="mt-1 text-slate-400" />
                    <div>
                    <p className="text-sm font-medium text-slate-200">2 Comments</p>
                    <p className="text-xs text-slate-400 mt-1">
                        <strong>Mike:</strong> Can we push back on section 3?
                    </p>
                    </div>
                </div>
                </Card>
            </div>
            )}
        </div>
      );
  };

  return (
    <div className="space-y-6 pb-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex flex-col gap-4 shrink-0">
         <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/repository" className="hover:text-white transition-colors">Repository</Link>
            <ChevronLeft size={14} className="rotate-180"/>
            <span className="text-slate-200">{contract.title}</span>
         </div>

         {/* Lifecycle Stepper */}
         <LifecycleStepper />

         {/* Tab Switcher */}
         <div className="border-b border-white/10 flex gap-6">
            <button 
               onClick={() => setActiveView('overview')}
               className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeView === 'overview' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white'}`}
            >
               <div className="flex items-center gap-2"><LayoutDashboard size={16}/> Overview</div>
            </button>
            <button 
               onClick={() => setActiveView('document')}
               className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeView === 'document' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-white'}`}
            >
               <div className="flex items-center gap-2"><FileCheck size={16}/> Document & AI</div>
            </button>
         </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
         {activeView === 'overview' ? renderOverview() : renderDocumentView()}
      </div>
    </div>
  );
};

export default ContractViewer;
