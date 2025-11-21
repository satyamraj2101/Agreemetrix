
import React from 'react';
import { WorkflowNode, WorkflowCategory } from '../../types';
import { 
  Play, ShieldCheck, GitBranch, Zap, Network, 
  AlertCircle, FileText, PenTool, MessageSquare, Mail, 
  UploadCloud, Database, MoreHorizontal, UserCheck, 
  Check, X, Clock, CheckSquare, Calendar, BrainCircuit, 
  Split, Search
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

// Enhanced Visual Styles
const CATEGORY_STYLES: Record<WorkflowCategory, { 
  headerGradient: string;
  borderColor: string;
  iconColor: string;
  glowColor: string;
  badgeBg: string;
}> = {
  trigger: { 
    headerGradient: 'from-slate-800 via-slate-900 to-dark-950', 
    borderColor: 'border-slate-600', 
    iconColor: 'text-slate-300',
    glowColor: 'rgba(148, 163, 184, 0.5)',
    badgeBg: 'bg-slate-500'
  },
  approval: { 
    headerGradient: 'from-blue-900 via-blue-950 to-dark-950', 
    borderColor: 'border-blue-500', 
    iconColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    badgeBg: 'bg-blue-500'
  },
  condition: { 
    headerGradient: 'from-amber-900 via-amber-950 to-dark-950', 
    borderColor: 'border-amber-500', 
    iconColor: 'text-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    badgeBg: 'bg-amber-500'
  },
  action: { 
    headerGradient: 'from-emerald-900 via-emerald-950 to-dark-950', 
    borderColor: 'border-emerald-500', 
    iconColor: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    badgeBg: 'bg-emerald-500'
  },
  integration: { 
    headerGradient: 'from-purple-900 via-purple-950 to-dark-950', 
    borderColor: 'border-purple-500', 
    iconColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    badgeBg: 'bg-purple-500'
  },
  stage: {
    headerGradient: 'from-orange-900 via-orange-950 to-dark-950', 
    borderColor: 'border-orange-500', 
    iconColor: 'text-orange-400',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    badgeBg: 'bg-orange-500'
  },
  utility: {
    headerGradient: 'from-cyan-900 via-cyan-950 to-dark-950', 
    borderColor: 'border-cyan-500', 
    iconColor: 'text-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    badgeBg: 'bg-cyan-500'
  },
  ai_agent: {
    headerGradient: 'from-pink-900 via-pink-950 to-dark-950',
    borderColor: 'border-pink-500',
    iconColor: 'text-pink-400',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    badgeBg: 'bg-pink-500'
  },
  document: {
    headerGradient: 'from-teal-900 via-teal-950 to-dark-950',
    borderColor: 'border-teal-500',
    iconColor: 'text-teal-400',
    glowColor: 'rgba(20, 184, 166, 0.6)',
    badgeBg: 'bg-teal-500'
  }
};

const NodeIcon = ({ type, category }: { type: string, category: WorkflowCategory }) => {
  // AI Nodes
  if (category === 'ai_agent') return <BrainCircuit size={16} />;
  
  // Specific Type overrides
  if (type.includes('document')) return <FileText size={16} />;
  if (type.includes('signature')) return <PenTool size={16} />;
  if (type.includes('email')) return <Mail size={16} />;
  if (type.includes('review') || type.includes('redline')) return <MessageSquare size={16} />;
  if (type.includes('upload')) return <UploadCloud size={16} />;
  if (type.includes('salesforce') || type.includes('crm')) return <Database size={16} />;
  if (type.includes('delay')) return <Clock size={16} />;
  if (type.includes('task')) return <CheckSquare size={16} />;
  if (type.includes('scheduled')) return <Calendar size={16} />;
  if (type.includes('risk')) return <ShieldCheck size={16} />;
  if (type.includes('split')) return <Split size={16} />;
  if (type.includes('lookup')) return <Search size={16} />;
  
  switch (category) {
    case 'trigger': return <Play size={16} />;
    case 'approval': return <ShieldCheck size={16} />;
    case 'condition': return <GitBranch size={16} />;
    case 'action': return <Zap size={16} />;
    case 'integration': return <Network size={16} />;
    default: return <Zap size={16} />;
  }
};

export const WorkflowNodeCard: React.FC<NodeProps> = ({ 
  node, isSelected, isValid, isSimActive, zoom, stageName, stageColor, onMouseDown, onHandleMouseDown 
}) => {
  const style = CATEGORY_STYLES[node.category] || CATEGORY_STYLES.action;

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, node.id)}
      className={`absolute w-72 rounded-2xl transition-all duration-200 cursor-grab active:cursor-grabbing group select-none
        ${isSelected ? 'z-30 scale-[1.02]' : 'z-20 scale-100'}
      `}
      style={{
        left: node.x,
        top: node.y,
        transform: `scale(${zoom})`,
        transformOrigin: '0 0',
        boxShadow: isSelected 
          ? `0 0 0 2px #fff, 0 0 30px ${style.glowColor}`
          : isSimActive 
            ? `0 0 0 2px #22c55e, 0 0 40px rgba(34, 197, 94, 0.6)`
            : '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
      }}
    >
        {/* Main Card Body with Glassmorphism */}
        <div className={`relative overflow-hidden rounded-2xl border bg-dark-900/90 backdrop-blur-xl ${isSelected ? 'border-white' : style.borderColor}`}>
            
            {/* Validation Error Indicator */}
            {isValid === false && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full z-50 animate-pulse shadow-[0_0_10px_#ef4444]"></div>
            )}

            {/* Header Section */}
            <div className={`bg-gradient-to-r ${style.headerGradient} p-4 relative`}>
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white/5 border border-white/10 shadow-inner ${style.iconColor}`}>
                            <NodeIcon type={node.type} category={node.category} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white leading-tight drop-shadow-md">{node.label}</h3>
                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">{node.type.replace(/_/g, ' ')}</p>
                        </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={16} className="text-slate-400 hover:text-white cursor-pointer" />
                    </div>
                </div>
                
                {/* Decoratve Header Line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Body Section */}
            <div className="p-4 space-y-3">
                {/* Config Snippet */}
                {Object.keys(node.config).length > 0 && (
                    <div className="text-[10px] text-slate-400 space-y-1 bg-dark-950/50 p-2 rounded border border-dark-800">
                        {node.config.description && <p className="italic text-slate-500 mb-1">"{node.config.description}"</p>}
                        {node.config.stageId && <div className="flex items-center gap-1"><CheckSquare size={10}/> Set Stage</div>}
                        {node.config.approverType && <div className="flex items-center gap-1"><UserCheck size={10}/> Approval: {node.config.approverType}</div>}
                        {node.category === 'ai_agent' && node.config.aiModel && <div className="flex items-center gap-1"><BrainCircuit size={10}/> {node.config.aiModel}</div>}
                    </div>
                )}

                {/* Stage Indicator */}
                {stageName && (
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-slate-500 font-bold uppercase">Stage:</span>
                        <div 
                            className="px-2 py-0.5 rounded-full text-white font-bold flex items-center gap-1"
                            style={{ backgroundColor: stageColor || '#64748b' }}
                        >
                            <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
                            {stageName}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Handles Container - Height ensures handle spacing */}
            <div className="h-4 bg-dark-950/30 border-t border-white/5"></div>
        </div>

        {/* --- CONNECTION HANDLES --- */}

        {/* Input Handle (Top) - Not for triggers */}
        {node.category !== 'trigger' && (
            <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center cursor-crosshair group/handle z-40"
            >
                <div className={`w-3 h-3 rounded-full border-2 border-dark-950 bg-slate-400 group-hover/handle:bg-white group-hover/handle:scale-125 transition-all shadow-lg`}></div>
            </div>
        )}

        {/* Output Handles (Bottom) */}
        {node.category === 'condition' ? (
            <>
                {/* True Path */}
                <div 
                    className="absolute -bottom-3 left-1/4 -translate-x-1/2 w-6 h-6 flex flex-col items-center justify-center cursor-crosshair group/handle z-40"
                    onMouseDown={(e) => onHandleMouseDown(e, node.id, 'true_out')}
                >
                    <div className="w-3 h-3 rounded-full border-2 border-dark-950 bg-green-500 group-hover/handle:bg-green-400 group-hover/handle:scale-125 transition-all shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    <span className="absolute top-4 text-[9px] font-bold text-green-500 bg-dark-950 px-1 rounded border border-dark-800 opacity-0 group-hover/handle:opacity-100 transition-opacity">TRUE</span>
                </div>
                {/* False Path */}
                <div 
                    className="absolute -bottom-3 right-1/4 translate-x-1/2 w-6 h-6 flex flex-col items-center justify-center cursor-crosshair group/handle z-40"
                    onMouseDown={(e) => onHandleMouseDown(e, node.id, 'false_out')}
                >
                    <div className="w-3 h-3 rounded-full border-2 border-dark-950 bg-red-500 group-hover/handle:bg-red-400 group-hover/handle:scale-125 transition-all shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <span className="absolute top-4 text-[9px] font-bold text-red-500 bg-dark-950 px-1 rounded border border-dark-800 opacity-0 group-hover/handle:opacity-100 transition-opacity">FALSE</span>
                </div>
            </>
        ) : (
            <div 
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center cursor-crosshair group/handle z-40"
                onMouseDown={(e) => onHandleMouseDown(e, node.id)}
            >
                <div className={`w-3 h-3 rounded-full border-2 border-dark-950 bg-slate-400 group-hover/handle:bg-brand-400 group-hover/handle:scale-125 transition-all shadow-lg`}></div>
            </div>
        )}
    </div>
  );
};
