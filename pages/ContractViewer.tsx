import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Badge } from '../components/UIComponents';
import { MOCK_CONTRACTS } from '../mock/data';
import { Eye, EyeOff, ShieldAlert, CheckCircle, ChevronLeft, MessageSquare, Sparkles } from 'lucide-react';

const ContractViewer: React.FC = () => {
  const { id } = useParams();
  const contract = MOCK_CONTRACTS.find(c => c.id === id) || MOCK_CONTRACTS[0];
  
  const [activeRole, setActiveRole] = useState<'Legal' | 'Sales' | 'HR'>('Legal');
  const [showAI, setShowAI] = useState(true);

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
    // If the current active role is in the sensitiveTo list, it means this role SHOULD NOT see it (in a real RBAC system).
    // For this demo, let's invert logic: if activeRole is NOT Legal, hide sensitive financial/HR data.
    
    if (activeRole === 'Legal') return false;
    if (activeRole === 'Sales' && sensitiveTo.includes('Sales')) return true;
    if (activeRole === 'HR' && sensitiveTo.includes('HR')) return true;
    return false;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Toolbar */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/repository" className="text-slate-500 hover:text-slate-800"><ChevronLeft size={20}/></Link>
          <div>
             <h2 className="text-lg font-bold text-slate-900">{contract.title}</h2>
             <div className="flex items-center gap-2 text-xs text-slate-500">
               <span>{contract.counterparty}</span>
               <span>•</span>
               <span>Ver 2.1</span>
             </div>
          </div>
          <Badge color="blue">{contract.status}</Badge>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
           <span className="text-xs font-medium text-slate-500 px-2">Simulate View:</span>
           {(['Legal', 'Sales', 'HR'] as const).map((role) => (
             <button
               key={role}
               onClick={() => setActiveRole(role)}
               className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                 activeRole === role 
                   ? 'bg-slate-800 text-white shadow-sm' 
                   : 'text-slate-600 hover:bg-slate-100'
               }`}
             >
               {role}
             </button>
           ))}
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Document View */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-y-auto p-12 font-serif text-slate-800 leading-relaxed">
           <div className="max-w-3xl mx-auto space-y-8">
             <div className="text-center mb-12">
               <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">Master Services Agreement</h1>
               <p className="text-sm text-slate-500">Reference: {contract.id}</p>
             </div>

             <p>This Agreement is entered into as of {contract.startDate}, by and between {contract.counterparty} ("Vendor") and Agreemetrix Inc ("Client").</p>

             {documentSections.map((section, idx) => (
               <div key={idx} className="relative group">
                 <h3 className="font-bold text-lg mb-2">{section.title}</h3>
                 <div className={`relative p-2 rounded transition-all duration-300 ${isRedacted(section.sensitiveTo) ? 'bg-slate-100 select-none' : ''} ${section.isRisk && activeRole === 'Legal' ? 'bg-red-50 border-l-4 border-red-400 pl-4' : ''}`}>
                    
                    {/* Content Layer */}
                    <p className={isRedacted(section.sensitiveTo) ? 'blur-sm opacity-40' : ''}>
                      {section.content}
                    </p>

                    {/* Redaction Overlay */}
                    {isRedacted(section.sensitiveTo) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md shadow-lg text-xs font-bold uppercase tracking-wide">
                           <EyeOff size={14} />
                           Redacted for {activeRole}
                         </div>
                      </div>
                    )}

                    {/* Risk Indicator (Legal Only) */}
                    {!isRedacted(section.sensitiveTo) && section.isRisk && activeRole === 'Legal' && (
                      <div className="absolute -right-4 top-0 translate-x-full w-48">
                        <div className="bg-white p-3 rounded border border-red-200 shadow-sm text-xs">
                           <div className="flex items-center gap-1 text-red-600 font-bold mb-1">
                             <ShieldAlert size={14} /> High Risk Clause
                           </div>
                           <p className="text-slate-600">Deviation from standard playbook. Uncapped liability detected.</p>
                        </div>
                      </div>
                    )}
                 </div>
               </div>
             ))}
             
             <div className="mt-12 pt-12 border-t border-slate-200 grid grid-cols-2 gap-12">
               <div>
                 <div className="h-px bg-black mb-4"></div>
                 <p className="font-bold">Signed by Vendor</p>
                 <p className="font-serif italic text-2xl mt-2 font-bold text-blue-900">John Doe</p>
               </div>
               <div>
                 <div className="h-px bg-black mb-4"></div>
                 <p className="font-bold">Signed by Client</p>
                 <div className="h-10 bg-yellow-50 border border-yellow-200 border-dashed rounded flex items-center justify-center text-yellow-600 text-xs font-medium mt-2">
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
                   <div className="p-3 bg-brand-50 rounded-lg border border-brand-100">
                      <h4 className="text-sm font-bold text-brand-800 mb-1 flex items-center gap-2">
                        <CheckCircle size={14} /> Contract Summary
                      </h4>
                      <p className="text-xs text-brand-700">
                        This is a standard MSA. Value is $150k. Payment terms are Net 30. 
                        <br/><strong>Key Flag:</strong> Indemnity clause is non-standard.
                      </p>
                   </div>

                   <div>
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detected Risks</h4>
                     <div className="space-y-2">
                       <div className="p-3 bg-red-50 rounded border border-red-100">
                         <div className="flex justify-between mb-1">
                           <span className="text-xs font-bold text-red-700">Liability Cap</span>
                           <Badge color="red">High</Badge>
                         </div>
                         <p className="text-xs text-slate-600">Clause 3 misses standard cap of 2x fees.</p>
                         <button className="mt-2 text-xs text-red-600 font-medium hover:underline">Auto-Redline</button>
                       </div>
                       <div className="p-3 bg-yellow-50 rounded border border-yellow-100">
                         <div className="flex justify-between mb-1">
                           <span className="text-xs font-bold text-yellow-700">Payment Terms</span>
                           <Badge color="yellow">Med</Badge>
                         </div>
                         <p className="text-xs text-slate-600">Net 15 requested; Standard is Net 45.</p>
                       </div>
                     </div>
                   </div>

                   <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ask Agent</h4>
                      <div className="relative">
                         <input type="text" placeholder="E.g., What is the termination notice?" className="w-full text-xs p-2 pr-8 rounded border border-slate-300 focus:border-brand-500 focus:outline-none" />
                         <button className="absolute right-2 top-1.5 text-brand-600"><SendIcon size={14}/></button>
                      </div>
                   </div>
                </div>
             </Card>
             
             <Card className="bg-slate-800 text-white border-slate-700">
               <div className="flex items-start gap-3">
                 <MessageSquare size={20} className="mt-1 text-slate-400" />
                 <div>
                   <p className="text-sm font-medium">2 Comments</p>
                   <p className="text-xs text-slate-400 mt-1">
                     <strong>Mike:</strong> Can we push back on section 3?
                   </p>
                 </div>
               </div>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const SendIcon = ({size}:{size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

export default ContractViewer;
