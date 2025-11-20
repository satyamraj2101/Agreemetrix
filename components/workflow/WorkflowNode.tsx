
import React from 'react';
import { WorkflowNode, WorkflowCategory } from '../../types';
import { 
  Play, ShieldCheck, GitBranch, Zap, Network, 
  AlertCircle, FileText, PenTool, MessageSquare, Mail, 
  UploadCloud, Database, MoreHorizontal, UserCheck, 
  Check, X, Clock, CheckSquare
} from 'lucide-react';

interface NodeProps {
  node: WorkflowNode;
  isSelected: boolean;
  isValid?: boolean;
  isSimActive?: boolean;
  zoom: number;
  stageName?: string;
  stageColor?: string;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onHandleMouseDown: (e: React.MouseEvent, nodeId: string, handleType?: 'true_out' | 'false_out') => void;
}

const CATEGORY_STYLES: Record<WorkflowCategory, { 
  bg: string; border: string; iconBg: string; iconColor: string; shadow: string; glow: string;
}> = {
  trigger: { 
    bg: 'bg-slate-900/90 backdrop-blur-md', border: 'border-slate-600', 
    iconBg: 'bg-slate-800', iconColor: 'text-white', shadow: 'shadow-xl', glow: 'shadow-white/5'
  },
  approval: { 
    bg: 'bg-dark-900/90 backdrop-blur-md', border: 'border-blue-500', 
    iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400', shadow: 'shadow-xl shadow-blue-900/20', glow: 'shadow-blue-500/20'
  },
  condition: { 
    bg: 'bg-dark-900/90 backdrop-blur-md', border: 'border-yellow-500', 
    iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-400', shadow: 'shadow-xl shadow-yellow-900/20', glow: 'shadow-yellow-500/20'
  },
  action: { 
    bg: 'bg-dark-900/90 backdrop-blur-md', border: 'border-green-500', 
    iconBg: 'bg-green-500/20', iconColor: 'text-green-400', shadow: 'shadow-xl shadow-green-900/20', glow: 'shadow-green-500/20'
  },
  integration: { 
    bg: 'bg-dark-900/90 backdrop-blur-md', border: 'border-purple-500', 
    iconBg: 'bg-purple-500/20', iconColor: 'text-purple-400', shadow: 'shadow-xl shadow-purple-900/20', glow: 'shadow-purple-500/20'
  },
  stage: {
    bg: 'bg-dark-900/90 backdrop-blur-md', border: 'border-orange-500',
    iconBg: 'bg-orange-500/20', iconColor: 'text-orange-400', shadow: 'shadow-xl shadow-orange-900/20', glow: 'shadow-orange-500/20'
  },
  utility: {
    bg: 'bg-dark-900/90 backdrop-blur-md', border: 'border-cyan-500',
    iconBg: 'bg-cyan-500/20', iconColor: 'text-cyan-400', shadow: 'shadow-xl shadow-cyan-900/20', glow: 'shadow-cyan-500/20'
  }
};

const NodeIcon = ({ type, category }: { type: string, category: WorkflowCategory }) => {
  // Specific Type Icons
  if (type.includes('document')) return <FileText size={14} />;
  if (type.includes('signature')) return <PenTool size={14} />;
  if (type.includes('email')) return <Mail size={14} />;
  if (type.includes('review') || type.includes('redline')) return <MessageSquare size={14} />;
  if (type.includes('upload')) return <UploadCloud size={14} />;
  if (type.includes('salesforce') || type.includes('crm')) return <Database size={14} />;
  if (type.includes('delay')) return <Clock size={14} />;
  if (type.includes('task')) return <CheckSquare size={14} />;
  
  // Category Defaults
  switch (category) {
    case 'trigger': return <Play size={14} />;
    case 'approval': return <ShieldCheck size={14} />;
    case 'condition': return <GitBranch size={14} />;
    case 'action': return <Zap size={14} />;
    case 'integration': return <Network size={14} />;
    case 'utility': return <Zap size={14} />;
    default: return <Play size={14} />;
  }
};

export const WorkflowNodeCard: React.FC<NodeProps> = ({ 
  node, isSelected, isValid, isSimActive, zoom, stageName, stageColor, onMouseDown, onHandleMouseDown 
}) => {
  const style = CATEGORY_STYLES[node.category];

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, node.id)}
      className={`absolute w-64 rounded-xl border-2 transition-all duration-300 cursor-grab active:cursor-grabbing group
        ${isSelected ? `ring-4 ring-opacity-50 ${style.border} z-20 scale-[1.02]` : 'border-transparent z-10'}
        ${style.bg} ${style.border} ${style.shadow} hover:${style.glow}
        ${isSimActive ? 'ring-4 ring-green-400 shadow-[0_0_30px_rgba(74,222,128,0.4)] scale-105' : ''}
      `}
      style={{
        left: node.x,
        top: node.y,
        transform: `scale(${zoom})`,
        transformOrigin: '0 0'
      }}
    >
      {/* Stage Indicator Badge */}
      {stageName && (
        <div 
           className="absolute -top-6 left-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-t-lg border-t border-x shadow-sm transform transition-all group-hover:-translate-y-1"
           style={{ 
             backgroundColor: stageColor ? `${stageColor}20` : '#1e293b', 
             color: stageColor || '#94a3b8',
             borderColor: stageColor ? `${stageColor}40` : '#475569'
           }}
        >
          Stage: {stageName}
        </div>
      )}

      {/* Invalid Indicator */}
      {isValid === false && (
        <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg z-30 animate-bounce border-2 border-dark-950">
          <AlertCircle size={16} />
        </div>
      )}

      {/* Simulation Active Indicator */}
      {isSimActive && (
        <div className="absolute -top-3 -left-3 bg-green-500 text-white rounded-full p-1.5 shadow-lg z-30 animate-pulse border-2 border-dark-950">
          <Play size={16} fill="currentColor" />
        </div>
      )}

      {/* Header */}
      <div className={`p-3 border-b border-white/5 flex items-center justify-between ${node.category === 'trigger' ? 'rounded-t-xl' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.iconBg} ${style.iconColor} shadow-inner`}>
            <NodeIcon type={node.type} category={node.category} />
          </div>
          <div>
             <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 opacity-80">{node.type.replace(/_/g, ' ')}</span>
             <span className="block text-sm font-bold text-white truncate w-32" title={node.label}>{node.label}</span>
          </div>
        </div>
        <MoreHorizontal size={16} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
      </div>

      {/* Body Preview (Context Sensitive) */}
      <div className="p-3 text-xs text-slate-400 bg-black/20 rounded-b-xl min-h-[48px] flex flex-col justify-center relative overflow-hidden">
        {/* Background Shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

        {node.category === 'approval' && (
          <div className="flex items-center gap-2 relative z-10">
            <UserCheck size={12} className="text-blue-400"/>
            <span className="text-blue-300 font-medium">{node.config.approverType === 'role' ? node.config.approverId : 'Dynamic User'}</span>
          </div>
        )}
        {node.category === 'condition' && (
          <div className="space-y-1 relative z-10">
            {node.config.rules?.slice(0, 2).map((rule, i) => (
               <div key={i} className="font-mono bg-white/5 px-2 py-1 rounded border border-white/5 truncate flex items-center gap-2 text-[10px]">
                  <span className="text-yellow-500/70">{rule.field}</span> 
                  <span className="text-slate-500">{rule.operator === 'greater_than' ? '>' : '='}</span> 
                  <span className="text-white">{rule.value}</span>
               </div>
            ))}
            {(!node.config.rules || node.config.rules.length === 0) && <span className="text-red-400 italic flex items-center gap-1"><AlertCircle size={10}/> No rules defined</span>}
          </div>
        )}
        {node.category === 'integration' && (
           <div className="truncate font-mono text-purple-300 relative z-10 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
              <span className="font-bold mr-2">{node.config.method || 'POST'}</span> {node.config.endpoint || '/api/...'}
           </div>
        )}
        {node.category === 'action' && node.type === 'generate_document' && (
           <div className="flex items-center gap-2 text-green-300 relative z-10">
              <FileText size={12} />
              <span>{node.config.templateId ? 'Template Selected' : 'Select Template'}</span>
           </div>
        )}
        {node.category === 'action' && node.type === 'signature' && (
           <div className="flex items-center gap-2 text-green-300 relative z-10">
              <PenTool size={12} />
              <span>{node.config.signatureProvider || 'Provider'}</span>
           </div>
        )}
        {node.category === 'utility' && node.type === 'delay' && (
           <div className="flex items-center gap-2 text-cyan-300 relative z-10 font-mono">
              <Clock size={12} />
              <span>Wait {node.config.delayTime || 1} {node.config.delayUnit || 'days'}</span>
           </div>
        )}
        {/* Default Description Fallback */}
        {node.config.description && (
           <p className="mt-1 text-[10px] text-slate-500 line-clamp-2 relative z-10">{node.config.description}</p>
        )}
      </div>

      {/* Handles */}
      <div className="absolute top-0 bottom-0 -left-3 w-6 flex items-center justify-start pointer-events-none">
         {node.category !== 'trigger' && (
            <div className="w-3 h-3 rounded-full bg-slate-400 border-2 border-dark-950 shadow-sm pointer-events-auto hover:scale-125 transition-transform" />
         )}
      </div>

      {/* Output Handles */}
      {node.category === 'condition' ? (
        <div className="absolute top-0 bottom-0 -right-4 w-8 flex flex-col justify-center gap-6 py-4 pointer-events-none">
           <div className="relative group/handle pointer-events-auto flex justify-end items-center">
              <span className="absolute right-5 bg-green-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/handle:opacity-100 transition-all translate-x-2 group-hover/handle:translate-x-0">TRUE</span>
              <div 
                className="w-4 h-4 rounded-full bg-green-500 border-2 border-dark-950 shadow-lg cursor-crosshair hover:scale-125 transition-transform flex items-center justify-center"
                onMouseDown={(e) => onHandleMouseDown(e, node.id, 'true_out')}
                title="True Path"
              >
                 <Check size={8} className="text-white stroke-[4px]" />
              </div>
           </div>
           <div className="relative group/handle pointer-events-auto flex justify-end items-center">
              <span className="absolute right-5 bg-red-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/handle:opacity-100 transition-all translate-x-2 group-hover/handle:translate-x-0">FALSE</span>
              <div 
                className="w-4 h-4 rounded-full bg-red-500 border-2 border-dark-950 shadow-lg cursor-crosshair hover:scale-125 transition-transform flex items-center justify-center"
                onMouseDown={(e) => onHandleMouseDown(e, node.id, 'false_out')}
                title="False Path"
              >
                 <X size={8} className="text-white stroke-[4px]" />
              </div>
           </div>
        </div>
      ) : (
        <div className="absolute top-0 bottom-0 -right-3 w-6 flex items-center justify-end pointer-events-none">
           <div 
              className="w-3 h-3 rounded-full bg-slate-400 border-2 border-dark-950 shadow-sm cursor-crosshair pointer-events-auto hover:bg-brand-500 hover:scale-125 transition-all"
              onMouseDown={(e) => onHandleMouseDown(e, node.id)}
           />
        </div>
      )}
    </div>
  );
};