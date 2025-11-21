
import React, { useState } from 'react';
import { WorkflowCategory } from '../../types';
import { 
  Play, ShieldCheck, GitBranch, Zap, Network, GripVertical, 
  FileText, PenTool, MessageSquare, Mail, UploadCloud, 
  Database, Bell, ChevronDown, ChevronRight, UserCheck, Layers,
  Clock, CheckSquare, Calendar, BrainCircuit, Search, Filter, Users
} from 'lucide-react';

interface ToolbarProps {
  onDragStart: (e: React.DragEvent, category: WorkflowCategory, type: string, label: string) => void;
}

interface ToolGroup {
  title: string;
  icon: React.ElementType;
  items: { category: WorkflowCategory; type: string; label: string; icon: React.ElementType; color: string }[];
}

export const WorkflowToolbar: React.FC<ToolbarProps> = ({ onDragStart }) => {
  const [openGroups, setOpenGroups] = useState<string[]>(['Triggers', 'AI Agents', 'Logic']);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };

  const toolGroups: ToolGroup[] = [
    {
      title: 'Triggers',
      icon: Play,
      items: [
        { category: 'trigger', type: 'form_submission', label: 'Form Submission', icon: FileText, color: 'text-white' },
        { category: 'trigger', type: 'crm_opportunity', label: 'CRM Opportunity Won', icon: Database, color: 'text-blue-400' },
        { category: 'trigger', type: 'manual_request', label: 'Manual Request', icon: UserCheck, color: 'text-green-400' },
        { category: 'trigger', type: 'webhook_in', label: 'Incoming Webhook', icon: Network, color: 'text-purple-400' },
        { category: 'trigger', type: 'scheduled_trigger', label: 'Scheduled Run', icon: Calendar, color: 'text-orange-400' },
        { category: 'trigger', type: 'contract_imported', label: 'Contract Imported', icon: UploadCloud, color: 'text-teal-400' },
      ]
    },
    {
      title: 'AI Agents',
      icon: BrainCircuit,
      items: [
        { category: 'ai_agent', type: 'llm_flow_gen', label: 'LLM Flow Generator', icon: BrainCircuit, color: 'text-pink-400' },
        { category: 'ai_agent', type: 'risk_scorer', label: 'Clause Risk Scorer', icon: ShieldCheck, color: 'text-red-400' },
        { category: 'ai_agent', type: 'obligation_extractor', label: 'Obligation Extractor', icon: FileText, color: 'text-yellow-400' },
        { category: 'ai_agent', type: 'clause_suggestion', label: 'Clause Suggester', icon: MessageSquare, color: 'text-blue-400' },
      ]
    },
    {
      title: 'Logic & Flow',
      icon: GitBranch,
      items: [
        { category: 'condition', type: 'condition', label: 'Conditional Branch', icon: GitBranch, color: 'text-yellow-400' },
        { category: 'utility', type: 'delay', label: 'Wait / Delay', icon: Clock, color: 'text-orange-400' },
        { category: 'utility', type: 'split_parallel', label: 'Parallel Split', icon: Layers, color: 'text-cyan-400' },
        { category: 'action', type: 'stage_transition', label: 'Update Lifecycle Stage', icon: Layers, color: 'text-emerald-400' },
      ]
    },
    {
      title: 'Documents',
      icon: FileText,
      items: [
        { category: 'document', type: 'generate_document', label: 'Generate Draft', icon: FileText, color: 'text-green-400' },
        { category: 'document', type: 'insert_clause', label: 'Insert Clause', icon: FileText, color: 'text-blue-400' },
        { category: 'document', type: 'redaction', label: 'Redact Fields', icon: FileText, color: 'text-slate-400' },
        { category: 'action', type: 'upload_version', label: 'Upload Version', icon: UploadCloud, color: 'text-blue-400' },
      ]
    },
    {
      title: 'Approvals',
      icon: ShieldCheck,
      items: [
        { category: 'approval', type: 'internal_approval', label: 'Internal Approval', icon: ShieldCheck, color: 'text-blue-400' },
        { category: 'approval', type: 'parallel_approval', label: 'Parallel Approval', icon: Users, color: 'text-purple-400' },
        { category: 'action', type: 'send_review', label: 'Send for Review', icon: MessageSquare, color: 'text-yellow-400' },
      ]
    },
    {
      title: 'Signatures',
      icon: PenTool,
      items: [
        { category: 'action', type: 'signature', label: 'eSignature Request', icon: PenTool, color: 'text-purple-400' },
        { category: 'action', type: 'wet_ink', label: 'Mark as Signed (Wet)', icon: FileText, color: 'text-slate-400' },
      ]
    },
    {
      title: 'Integrations',
      icon: Network,
      items: [
        { category: 'integration', type: 'update_salesforce', label: 'Update Salesforce', icon: Database, color: 'text-blue-500' },
        { category: 'action', type: 'slack_notify', label: 'Slack Notification', icon: Bell, color: 'text-purple-500' },
        { category: 'action', type: 'send_email', label: 'Send Email', icon: Mail, color: 'text-yellow-500' },
        { category: 'integration', type: 'webhook_out', label: 'Call Webhook', icon: Network, color: 'text-pink-500' },
      ]
    }
  ];

  // Filter logic
  const filteredGroups = toolGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(group => group.items.length > 0);

  return (
    <div className="w-72 bg-dark-950 border-r border-dark-800 flex flex-col z-20 h-full">
      <div className="p-4 border-b border-dark-800 shrink-0 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <GripVertical size={16} className="text-brand-400"/> Node Palette
        </h2>
        <div className="relative">
           <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
           <input 
              type="text" 
              placeholder="Search nodes..." 
              className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white focus:border-brand-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
         {filteredGroups.map(group => (
           <div key={group.title} className="mb-2">
             <button 
               onClick={() => toggleGroup(group.title)}
               className="w-full flex items-center justify-between p-2 text-xs font-bold text-slate-500 uppercase tracking-wide hover:text-white hover:bg-white/5 rounded-lg transition-colors"
             >
               <div className="flex items-center gap-2">
                 <group.icon size={14} />
                 {group.title}
               </div>
               {openGroups.includes(group.title) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
             </button>
             
             {openGroups.includes(group.title) && (
               <div className="mt-1 space-y-1 pl-2">
                 {group.items.map((item, idx) => (
                   <div 
                     key={idx}
                     draggable
                     onDragStart={(e) => onDragStart(e, item.category, item.type, item.label)}
                     className={`flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-dark-700 hover:bg-dark-900 cursor-grab active:cursor-grabbing group transition-all`}
                   >
                     <div className={`w-7 h-7 rounded flex items-center justify-center bg-dark-800 border border-dark-700 group-hover:bg-dark-950 ${item.color}`}>
                        <item.icon size={14} />
                     </div>
                     <div>
                        <span className="block text-sm font-medium text-slate-300 group-hover:text-white">{item.label}</span>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
         ))}
      </div>
      
      <div className="p-4 border-t border-dark-800 bg-dark-900/50 shrink-0">
        <div className="text-xs text-slate-500 text-center">
          Drag nodes to the canvas to build
        </div>
      </div>
    </div>
  );
};
