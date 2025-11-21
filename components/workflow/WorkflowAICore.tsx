
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Bot, Zap, Check, X, RotateCw, 
  ShieldCheck, GitBranch, Activity, MessageSquare, FileText, 
  ArrowRight, Play, Bug, Mic, Paperclip, Wand2
} from 'lucide-react';
import { WorkflowNode, WorkflowConnection, AIMessage, WorkflowStageDefinition } from '../../types';
import { Button } from '../UIComponents';

interface WorkflowAICoreProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  stages: WorkflowStageDefinition[];
  onUpdateGraph: (nodes: WorkflowNode[], connections: WorkflowConnection[]) => void;
  onHighlightNode: (nodeId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowAICore: React.FC<WorkflowAICoreProps> = ({
  nodes,
  connections,
  stages,
  onUpdateGraph,
  onHighlightNode,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    { 
      id: 'welcome', 
      role: 'ai', 
      content: "Hello! I'm your Workflow AI Copilot. I can build flows, fix errors, and simulate outcomes. What shall we automate today?", 
      timestamp: Date.now(),
      type: 'text' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: AIMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Processing Logic
    setTimeout(() => {
      processAIIntent(userMsg.content);
    }, 1500);
  };

  const processAIIntent = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    let response: AIMessage;

    // 1. GENERATE FLOW INTENT
    if (lowerPrompt.includes('nda') || lowerPrompt.includes('create') || lowerPrompt.includes('generate')) {
      response = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: "I've designed a standard NDA workflow with Draft Generation, Internal Approval, and DocuSign integration. Shall I apply this to the canvas?",
        timestamp: Date.now(),
        type: 'suggestion',
        actions: [{ label: 'Apply Workflow', actionId: 'generate_nda' }]
      };
    } 
    // 2. OPTIMIZE / FIX INTENT
    else if (lowerPrompt.includes('fix') || lowerPrompt.includes('optimize') || lowerPrompt.includes('debug')) {
      // Mock finding an orphaned node
      const orphanedNode = nodes.find(n => !connections.some(c => c.target === n.id) && n.id !== 'start');
      if (orphanedNode) {
        response = {
          id: `ai_${Date.now()}`,
          role: 'ai',
          content: `I detected an issue: The node "${orphanedNode.label}" is unreachable. I recommend connecting it after the previous step.`,
          timestamp: Date.now(),
          type: 'error',
          actions: [{ label: 'Fix Connection', actionId: 'fix_orphan', data: { nodeId: orphanedNode.id } }]
        };
      } else {
        response = {
          id: `ai_${Date.now()}`,
          role: 'ai',
          content: "I analyzed the workflow and everything looks optimal. No unreachable nodes or loops detected.",
          timestamp: Date.now(),
          type: 'success'
        };
      }
    }
    // 3. EXPLAIN INTENT
    else if (lowerPrompt.includes('explain') || lowerPrompt.includes('what does')) {
        response = {
            id: `ai_${Date.now()}`,
            role: 'ai',
            content: "This workflow starts with a manual request, generates an NDA based on template v2, checks if the value is > $50k to trigger legal approval, and finally sends for signature via DocuSign.",
            timestamp: Date.now(),
            type: 'narrative'
        };
    }
    // DEFAULT
    else {
      response = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: "I can help you generate workflows, optimize logic, or explain steps. Try saying 'Create a high-risk contract flow'.",
        timestamp: Date.now(),
        type: 'text'
      };
    }

    setIsTyping(false);
    setMessages(prev => [...prev, response]);
  };

  const handleAction = (actionId: string, data?: any) => {
    if (actionId === 'generate_nda') {
        // Mock creating an NDA flow
        const newNodes: WorkflowNode[] = [
            { id: 'n1', category: 'trigger', type: 'manual_request', label: 'NDA Request', x: 100, y: 300, config: { stageId: 'stg_draft' } },
            { id: 'n2', category: 'document', type: 'generate_document', label: 'Generate NDA', x: 400, y: 300, config: { templateId: 'tpl_1' } },
            { id: 'n3', category: 'condition', type: 'condition', label: 'High Value?', x: 700, y: 300, config: { rules: [{id:'r1', field:'contract.value', operator:'greater_than', value:50000, logic:'AND'}] } },
            { id: 'n4', category: 'approval', type: 'internal_approval', label: 'Legal Approval', x: 1000, y: 200, config: { approverType: 'role', approverId: 'Legal' } },
            { id: 'n5', category: 'action', type: 'signature', label: 'Send via DocuSign', x: 1300, y: 300, config: { signatureProvider: 'docusign' } }
        ];
        const newConns: WorkflowConnection[] = [
            { id: 'c1', source: 'n1', target: 'n2' },
            { id: 'c2', source: 'n2', target: 'n3' },
            { id: 'c3', source: 'n3', target: 'n4', handleId: 'true_out', label: 'Yes' },
            { id: 'c4', source: 'n3', target: 'n5', handleId: 'false_out', label: 'No' },
            { id: 'c5', source: 'n4', target: 'n5' }
        ];
        onUpdateGraph(newNodes, newConns);
        setMessages(prev => [...prev, { id: `sys_${Date.now()}`, role: 'ai', content: 'Workflow generated successfully!', timestamp: Date.now(), type: 'success' }]);
    }
    
    if (actionId === 'fix_orphan' && data?.nodeId) {
        // Mock fix: connect first node to orphan
        const newConn: WorkflowConnection = {
            id: `c_fix_${Date.now()}`,
            source: nodes[0].id,
            target: data.nodeId
        };
        onUpdateGraph(nodes, [...connections, newConn]);
        setMessages(prev => [...prev, { id: `sys_${Date.now()}`, role: 'ai', content: 'Fixed! Node is now connected.', timestamp: Date.now(), type: 'success' }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-[400px] bg-dark-950/95 backdrop-blur-xl border-l border-brand-500/30 shadow-2xl flex flex-col h-full z-40 animate-in slide-in-from-right duration-300 fixed right-0 top-16 bottom-0">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-brand-900/20 to-purple-900/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 rounded-lg border border-brand-500/30 text-brand-400 shadow-[0_0_15px_rgba(20,184,166,0.3)] animate-pulse-slow">
                <Sparkles size={20} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white leading-tight">Workflow AI</h3>
                <p className="text-[10px] text-brand-400 font-mono uppercase tracking-wider">Core Engine v2.0</p>
            </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors">
            <X size={20}/>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-white/10 bg-dark-900/50">
         <button onClick={() => processAIIntent('Optimize this flow')} className="flex items-center justify-center gap-2 p-2 rounded bg-dark-800 border border-dark-700 text-xs font-medium text-slate-300 hover:bg-brand-500/10 hover:text-brand-400 hover:border-brand-500/30 transition-all group">
            <Zap size={14} className="group-hover:text-brand-400"/> Optimize
         </button>
         <button onClick={() => processAIIntent('Generate standard NDA')} className="flex items-center justify-center gap-2 p-2 rounded bg-dark-800 border border-dark-700 text-xs font-medium text-slate-300 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30 transition-all group">
            <Wand2 size={14} className="group-hover:text-purple-400"/> Generate
         </button>
         <button onClick={() => processAIIntent('Explain selected node')} className="flex items-center justify-center gap-2 p-2 rounded bg-dark-800 border border-dark-700 text-xs font-medium text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all group">
            <MessageSquare size={14} className="group-hover:text-blue-400"/> Explain
         </button>
         <button onClick={() => processAIIntent('Debug validation errors')} className="flex items-center justify-center gap-2 p-2 rounded bg-dark-800 border border-dark-700 text-xs font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all group">
            <Bug size={14} className="group-hover:text-red-400"/> Debug
         </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-dark-950 to-dark-900">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'bg-slate-700 text-white'}`}>
                    {msg.role === 'ai' ? <Bot size={16}/> : <div className="text-xs font-bold">U</div>}
                </div>
                <div className={`max-w-[85%] space-y-2`}>
                    <div className={`p-3 rounded-xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'ai' 
                            ? 'bg-dark-800 border border-white/10 text-slate-200 rounded-tl-none' 
                            : 'bg-brand-600 text-white rounded-tr-none'
                    }`}>
                        {msg.content}
                    </div>
                    
                    {/* AI Actions */}
                    {msg.actions && (
                        <div className="flex flex-col gap-2 mt-2">
                            {msg.actions.map((action, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleAction(action.actionId, action.data)}
                                    className="flex items-center gap-2 p-2 bg-brand-500/10 border border-brand-500/30 hover:bg-brand-500/20 rounded-lg text-xs font-bold text-brand-300 transition-colors text-left"
                                >
                                    <Play size={12}/> {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        ))}
        
        {isTyping && (
            <div className="flex gap-3 animate-in fade-in">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
                    <Bot size={16}/>
                </div>
                <div className="bg-dark-800 border border-white/10 p-3 rounded-xl rounded-tl-none flex gap-1 items-center h-10">
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-dark-900">
        <div className="relative flex items-center">
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
                placeholder="Describe a workflow or ask a question..."
                className="w-full bg-dark-950 border border-dark-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none custom-scrollbar shadow-inner"
                rows={2}
            />
            <div className="absolute right-2 top-2 flex flex-col gap-1">
                <button className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-white/10 transition-colors"><Mic size={14}/></button>
                <button className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-white/10 transition-colors"><Paperclip size={14}/></button>
            </div>
            <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="absolute right-2 bottom-2 p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
                <Send size={16}/>
            </button>
        </div>
        <div className="mt-2 flex justify-between items-center text-[10px] text-slate-600">
            <span>Powered by WAI-Core™</span>
            <div className="flex items-center gap-1"><ShieldCheck size={10}/> Private Mode</div>
        </div>
      </div>
    </div>
  );
};
