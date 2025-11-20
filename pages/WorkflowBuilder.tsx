
import React, { useState, useRef, useEffect } from 'react';
import { WorkflowNode, WorkflowConnection, WorkflowCategory, WorkflowStageDefinition, WorkflowTemplate } from '../types';
import { WorkflowNodeCard } from '../components/workflow/WorkflowNode';
import { WorkflowToolbar } from '../components/workflow/WorkflowToolbar';
import { PropertiesPanel } from '../components/workflow/PropertiesPanel';
import { Button, Badge } from '../components/UIComponents';
import { Play, Save, ZoomIn, ZoomOut, Maximize, AlertTriangle, Loader2, MessageSquare, Plus, Trash2, Layers, LayoutTemplate, X, CheckCircle2, Undo, Redo } from 'lucide-react';
import { INITIAL_TEMPLATES } from '../mock/data';

const INITIAL_STAGES: WorkflowStageDefinition[] = [
  { id: 'stg_draft', name: 'Drafting', color: '#94a3b8', order: 0 },
  { id: 'stg_review', name: 'Review', color: '#3b82f6', order: 1 },
  { id: 'stg_approval', name: 'Approval', color: '#eab308', order: 2 },
  { id: 'stg_sign', name: 'Signature', color: '#a855f7', order: 3 },
  { id: 'stg_active', name: 'Active', color: '#22c55e', order: 4 },
];

// Interface for history state
interface HistoryState {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

const WorkflowBuilder: React.FC = () => {
  // Canvas State
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: 'start', category: 'trigger', type: 'manual_request', label: 'Manual Request', x: 100, y: 300, config: { stageId: 'stg_draft' } }
  ]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [stages, setStages] = useState<WorkflowStageDefinition[]>(INITIAL_STAGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showStageManager, setShowStageManager] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // Undo/Redo State
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: [
    { id: 'start', category: 'trigger', type: 'manual_request', label: 'Manual Request', x: 100, y: 300, config: { stageId: 'stg_draft' } }
  ], connections: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isHistoryAction, setIsHistoryAction] = useState(false);

  // Viewport State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  
  // Interaction State
  const [dragState, setDragState] = useState<{
     type: 'node' | 'connection'; 
     id?: string; 
     startPos?: {x: number, y: number};
     sourceHandle?: string;
  } | null>(null);
  const [tempConnection, setTempConnection] = useState<{x1:number, y1:number, x2:number, y2:number} | null>(null);
  
  // Simulation State
  const [simState, setSimState] = useState<'idle' | 'running' | 'paused'>('idle');
  const [activeSimNode, setActiveSimNode] = useState<string | null>(null);
  const [simLog, setSimLog] = useState<string[]>([]);

  // Validation State
  const [validationErrors, setValidationErrors] = useState<{nodeId: string, message: string}[]>([]);

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);

  // -- HISTORY MANAGEMENT --
  useEffect(() => {
     // If nodes or connections change, and it wasn't an undo/redo action, add to history
     if (!isHistoryAction) {
         const currentState = { nodes, connections };
         // Check if significantly different from last state to avoid spam
         const lastState = history[historyIndex];
         if (JSON.stringify(lastState) !== JSON.stringify(currentState)) {
             const newHistory = history.slice(0, historyIndex + 1);
             newHistory.push(currentState);
             setHistory(newHistory);
             setHistoryIndex(newHistory.length - 1);
         }
     }
     setIsHistoryAction(false);
  }, [nodes, connections]);

  const handleUndo = () => {
     if (historyIndex > 0) {
         setIsHistoryAction(true);
         const prevState = history[historyIndex - 1];
         setNodes(prevState.nodes);
         setConnections(prevState.connections);
         setHistoryIndex(historyIndex - 1);
     }
  };

  const handleRedo = () => {
     if (historyIndex < history.length - 1) {
         setIsHistoryAction(true);
         const nextState = history[historyIndex + 1];
         setNodes(nextState.nodes);
         setConnections(nextState.connections);
         setHistoryIndex(historyIndex + 1);
     }
  };
  
  // Keyboard Shortcuts
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
              e.preventDefault();
              handleUndo();
          }
          if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
              e.preventDefault();
              handleRedo();
          }
          if (e.key === 'Delete' || e.key === 'Backspace') {
              if (selectedNodeId && !document.activeElement?.tagName.match(/INPUT|TEXTAREA/)) {
                  handleDeleteNode(selectedNodeId);
              }
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, historyIndex]);

  // -- CANVAS HELPERS --

  const screenToCanvas = (sx: number, sy: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (sx - rect.left - pan.x) / zoom,
      y: (sy - rect.top - pan.y) / zoom
    };
  };

  const getHandleColor = (type?: string) => {
     if (type === 'true_out') return '#22c55e';
     if (type === 'false_out') return '#ef4444';
     return '#64748b';
  };

  // -- HANDLERS --

  const handleLoadTemplate = (template: WorkflowTemplate) => {
      setStages(template.schema.stages);
      setNodes(template.schema.nodes);
      setConnections(template.schema.connections);
      setShowTemplateModal(false);
      setPan({x: 0, y: 0});
      setZoom(0.9);
      // Reset history
      setHistory([{ nodes: template.schema.nodes, connections: template.schema.connections }]);
      setHistoryIndex(0);
  };

  const handleDragStart = (e: React.DragEvent, category: WorkflowCategory, type: string, label: string) => {
    e.dataTransfer.setData('category', category);
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('label', label);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const category = e.dataTransfer.getData('category') as WorkflowCategory;
    const type = e.dataTransfer.getData('type');
    const label = e.dataTransfer.getData('label');
    
    if (!category || !type) return;

    const pos = screenToCanvas(e.clientX, e.clientY);
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      category,
      type,
      label,
      x: pos.x - 128, // Center horizontally (width 256/2)
      y: pos.y - 40,
      config: {}
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const handleDeleteNode = (nodeId: string) => {
     setNodes(nodes.filter(n => n.id !== nodeId));
     setConnections(connections.filter(c => c.source !== nodeId && c.target !== nodeId));
     setSelectedNodeId(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    if (e.button === 0) { // Left click
       const pos = screenToCanvas(e.clientX, e.clientY);
       setDragState({ type: 'node', id: nodeId, startPos: pos });
    }
  };

  const handleConnectionStart = (e: React.MouseEvent, nodeId: string, handleType: 'true_out' | 'false_out' | undefined) => {
     e.stopPropagation();
     // Get source node position for accurate start point
     const sourceNode = nodes.find(n => n.id === nodeId);
     if(!sourceNode) return;

     const startX = sourceNode.x + 256; // Width of node
     const startY = sourceNode.y + 40; // Middle of node approx

     // Adjust for Condition handles
     let actualY = startY;
     if (handleType === 'true_out') actualY -= 12; // Adjusted to match visual handle position
     if (handleType === 'false_out') actualY += 28;

     setDragState({ type: 'connection', id: nodeId, sourceHandle: handleType });
     setTempConnection({ x1: startX, y1: actualY, x2: startX, y2: actualY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = screenToCanvas(e.clientX, e.clientY);

    if (isPanning) {
       setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
       return;
    }

    if (dragState?.type === 'node') {
       const deltaX = pos.x - dragState.startPos!.x;
       const deltaY = pos.y - dragState.startPos!.y;
       
       setNodes(nodes.map(n => n.id === dragState.id ? { ...n, x: n.x + deltaX, y: n.y + deltaY } : n));
       setDragState({ ...dragState, startPos: pos }); // Reset start pos for smooth drag
    }

    if (dragState?.type === 'connection' && tempConnection) {
       setTempConnection({ ...tempConnection, x2: pos.x, y2: pos.y });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // Check if dropping connection on a node
    if (dragState?.type === 'connection') {
       // Simple hit detection (in real app use ref collision)
       const pos = screenToCanvas(e.clientX, e.clientY);
       // Find target node
       const target = nodes.find(n => 
          pos.x > n.x && pos.x < n.x + 256 && 
          pos.y > n.y && pos.y < n.y + 100 &&
          n.id !== dragState.id
       );

       if (target) {
          const newConn: WorkflowConnection = {
             id: `conn_${Date.now()}`,
             source: dragState.id!,
             target: target.id,
             label: dragState.sourceHandle === 'true_out' ? 'True' : dragState.sourceHandle === 'false_out' ? 'False' : undefined,
             handleId: dragState.sourceHandle as any
          };
          // Avoid duplicates
          if (!connections.find(c => c.source === newConn.source && c.target === newConn.target && c.handleId === newConn.handleId)) {
             setConnections([...connections, newConn]);
          }
       }
    }

    setDragState(null);
    setTempConnection(null);
  };

  // -- VALIDATION ENGINE --
  const validateWorkflow = () => {
    const errors: typeof validationErrors = [];
    
    // 1. Orphan Check
    nodes.forEach(node => {
       if (node.category === 'trigger') return;
       const isTarget = connections.some(c => c.target === node.id);
       if (!isTarget) errors.push({ nodeId: node.id, message: 'Node is disconnected (Orphan)' });
    });

    // 2. Config Check
    nodes.forEach(node => {
       if (node.category === 'approval' && !node.config.approverType) {
          errors.push({ nodeId: node.id, message: 'Missing Approver Configuration' });
       }
       if (node.category === 'condition' && (!node.config.rules || node.config.rules.length === 0)) {
          errors.push({ nodeId: node.id, message: 'Condition has no rules' });
       }
       if (node.type === 'generate_document' && !node.config.templateId) {
          errors.push({ nodeId: node.id, message: 'No Template Selected' });
       }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // -- SIMULATION ENGINE --
  const runSimulation = async () => {
     if (!validateWorkflow()) {
        alert("Please fix validation errors before simulating.");
        return;
     }
     setSimState('running');
     setSimLog(['Starting simulation...']);
     
     // BFS Walk
     const processNode = async (id: string) => {
        const node = nodes.find(n => n.id === id);
        if(!node) return;

        setActiveSimNode(id);
        setSimLog(prev => [...prev, `Processing: ${node.label}`]);
        
        // Simulate delay if node is a delay node
        if (node.type === 'delay') {
            setSimLog(prev => [...prev, `Waiting ${node.config.delayTime} ${node.config.delayUnit}...`]);
            await new Promise(r => setTimeout(r, 2000)); // Longer wait for visual effect
        } else {
            await new Promise(r => setTimeout(r, 800)); // Standard visual delay
        }

        const outbound = connections.filter(c => c.source === id);
        if (outbound.length > 0) {
           // Logic for splitting path (Mocking "True" for demo)
           const nextConn = outbound.find(c => c.label === 'True') || outbound[0];
           if (nextConn) {
              processNode(nextConn.target);
           } else {
              setSimState('idle');
              setActiveSimNode(null);
              setSimLog(prev => [...prev, 'End of path.']);
           }
        } else {
           setSimState('idle');
           setActiveSimNode(null);
           setSimLog(prev => [...prev, 'Workflow Complete.']);
        }
     };

     processNode('start');
  };

  // -- RENDER HELPERS --

  const renderConnections = () => {
     return (
       <svg className="absolute inset-0 pointer-events-none overflow-visible">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
            <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
            </marker>
            <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
          </defs>
          {connections.map(conn => {
             const source = nodes.find(n => n.id === conn.source);
             const target = nodes.find(n => n.id === conn.target);
             if (!source || !target) return null;

             // Source coordinates adjusted for handle type
             let sy = source.y + 40;
             if (conn.handleId === 'true_out') sy -= 12;
             if (conn.handleId === 'false_out') sy += 28;
             const sx = source.x + 256;

             const tx = target.x;
             const ty = target.y + 40;

             // Bezier
             const d = `M ${sx} ${sy} C ${sx + 80} ${sy}, ${tx - 80} ${ty}, ${tx} ${ty}`;
             const isTruePath = conn.handleId === 'true_out';
             const isFalsePath = conn.handleId === 'false_out';
             const strokeColor = isTruePath ? '#22c55e' : isFalsePath ? '#ef4444' : '#64748b';
             const markerId = isTruePath ? 'url(#arrowhead-green)' : isFalsePath ? 'url(#arrowhead-red)' : 'url(#arrowhead)';

             const isActivePath = activeSimNode === conn.source && simState === 'running';

             return (
               <g key={conn.id}>
                  <path 
                     d={d} 
                     stroke={strokeColor} 
                     strokeWidth={isActivePath ? "3" : "2"} 
                     fill="none" 
                     markerEnd={markerId}
                     strokeDasharray={isActivePath ? "5,5" : "0"}
                     className={isActivePath ? "animate-dash" : ""}
                     style={{ animationDuration: '0.5s' }}
                  />
                  {/* Label Background */}
                  {conn.label && (
                     <rect x={(sx+tx)/2 - 15} y={(sy+ty)/2 - 10} width="30" height="20" rx="4" fill="#020617" stroke={strokeColor} strokeWidth="1" />
                  )}
                  {conn.label && (
                     <text x={(sx+tx)/2} y={(sy+ty)/2 + 4} textAnchor="middle" fill={strokeColor} fontSize="10" fontWeight="bold">{conn.label}</text>
                  )}
               </g>
             );
          })}
          {tempConnection && (
             <path 
               d={`M ${tempConnection.x1} ${tempConnection.y1} C ${tempConnection.x1 + 80} ${tempConnection.y1}, ${tempConnection.x2 - 80} ${tempConnection.y2}, ${tempConnection.x2} ${tempConnection.y2}`} 
               stroke={getHandleColor(dragState?.sourceHandle)} 
               strokeWidth="2" 
               strokeDasharray="5,5"
               fill="none" 
               markerEnd={dragState?.sourceHandle === 'true_out' ? 'url(#arrowhead-green)' : dragState?.sourceHandle === 'false_out' ? 'url(#arrowhead-red)' : 'url(#arrowhead)'}
             />
          )}
       </svg>
     );
  };

  const saveJSON = () => {
     const schema = {
        meta: { name: "Workflow Export", version: "2.0", created: new Date().toISOString() },
        stages,
        nodes,
        connections
     };
     const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'workflow_schema_v2.json';
     a.click();
  };

  return (
    <div className="flex h-screen bg-dark-950 text-slate-200 overflow-hidden font-sans">
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -10; }
        }
        .animate-dash {
           animation: dash 1s linear infinite;
        }
      `}</style>

      {/* 1. Toolbar */}
      <WorkflowToolbar onDragStart={handleDragStart} />

      {/* 2. Canvas Area */}
      <div className="flex-1 flex flex-col relative h-full">
         
         {/* Header */}
         <div className="h-16 bg-dark-950/80 backdrop-blur border-b border-dark-800 flex justify-between items-center px-6 z-30 shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
               <h1 className="font-bold text-white flex items-center gap-2 text-lg">
                  <MessageSquare size={20} className="text-brand-400"/> Workflow Studio
               </h1>
               
               <div className="h-6 w-px bg-dark-700 mx-2"></div>
               
               <button 
                 onClick={() => setShowTemplateModal(true)}
                 className="px-3 py-1.5 rounded-lg bg-dark-900 border border-dark-700 text-xs font-medium text-slate-300 hover:text-white hover:border-brand-500/50 transition-all flex items-center gap-2 group"
               >
                 <LayoutTemplate size={14} className="text-slate-500 group-hover:text-brand-400"/> Templates
               </button>

               {/* Stage Manager Trigger */}
               <button onClick={() => setShowStageManager(!showStageManager)} className="px-3 py-1.5 rounded-lg bg-dark-900 border border-dark-700 text-xs font-medium text-slate-300 hover:text-white hover:border-brand-500/50 transition-all flex items-center gap-2 group">
                   <Layers size={14} className="text-slate-500 group-hover:text-brand-400"/> Stages ({stages.length})
               </button>

               {/* Undo / Redo */}
               <div className="flex gap-1 ml-4">
                   <button onClick={handleUndo} disabled={historyIndex === 0} className="p-1.5 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30" title="Undo (Ctrl+Z)">
                       <Undo size={16}/>
                   </button>
                   <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="p-1.5 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30" title="Redo (Ctrl+Y)">
                       <Redo size={16}/>
                   </button>
               </div>
            </div>

            <div className="flex items-center gap-3">
               {validationErrors.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-red-400 mr-4 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20 animate-pulse">
                     <AlertTriangle size={14}/> {validationErrors.length} Issues
                  </div>
               )}
               <Button variant="secondary" className="h-9 text-xs gap-2" onClick={runSimulation} disabled={simState === 'running'}>
                  {simState === 'running' ? <Loader2 size={14} className="animate-spin"/> : <Play size={14}/>}
                  {simState === 'running' ? 'Simulating...' : 'Live Preview'}
               </Button>
               <Button variant="primary" className="h-9 text-xs gap-2 shadow-lg shadow-brand-500/20" onClick={saveJSON}>
                  <Save size={14}/> Publish Workflow
               </Button>
            </div>
         </div>

         {/* Stage Manager Panel (Overlay) */}
         {showStageManager && (
            <div className="absolute top-16 left-0 right-0 z-40 bg-dark-900/95 border-b border-dark-700 p-4 animate-in slide-in-from-top-2 shadow-xl backdrop-blur-md">
               <div className="max-w-4xl mx-auto">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider">Lifecycle Stages Configuration</h4>
                  <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                     {stages.map((stage, i) => (
                        <div key={stage.id} className="flex items-center gap-2 bg-dark-950 border border-dark-700 p-2 rounded-lg shrink-0 group hover:border-brand-500/30 transition-colors min-w-[150px]">
                           <div className="w-3 h-3 rounded-full" style={{backgroundColor: stage.color}}></div>
                           <span className="text-sm font-bold text-white">{stage.name}</span>
                           <div className="flex-1"></div>
                           <button className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setStages(stages.filter(s => s.id !== stage.id))}><Trash2 size={14}/></button>
                        </div>
                     ))}
                     <button 
                        onClick={() => setStages([...stages, {id: `stg_${Date.now()}`, name: 'New Stage', color: '#64748b', order: stages.length}])}
                        className="flex items-center gap-2 bg-dark-950 border border-dashed border-dark-700 p-2 rounded-lg text-slate-500 hover:text-white hover:border-slate-500 shrink-0 transition-all"
                     >
                        <Plus size={14}/> Add Stage
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Template Modal */}
         {showTemplateModal && (
            <div className="absolute inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-10 animate-in fade-in">
               <div className="bg-dark-900 w-full max-w-5xl h-[80vh] rounded-2xl border border-dark-700 shadow-2xl flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-dark-800 flex justify-between items-center bg-dark-950/50">
                     <div>
                        <h2 className="text-2xl font-bold text-white">Workflow Templates</h2>
                        <p className="text-slate-400 text-sm">Jumpstart your process with pre-configured logic flows.</p>
                     </div>
                     <button onClick={() => setShowTemplateModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} className="text-slate-500 hover:text-white"/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar bg-dark-950/30">
                     {INITIAL_TEMPLATES.map(template => (
                        <div 
                           key={template.id} 
                           onClick={() => handleLoadTemplate(template)}
                           className="group bg-dark-900 border border-dark-700 hover:border-brand-500/50 rounded-xl p-6 cursor-pointer transition-all hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 relative overflow-hidden"
                        >
                           <div className="absolute top-0 right-0 p-16 bg-brand-500/5 rounded-full blur-2xl -mr-8 -mt-8 transition-opacity opacity-50 group-hover:opacity-100"></div>
                           <div className="flex justify-between items-start mb-4">
                              <div className="p-3 bg-dark-800 rounded-lg text-slate-400 group-hover:text-brand-400 group-hover:bg-brand-500/10 transition-colors">
                                 <LayoutTemplate size={24}/>
                              </div>
                              <Badge color="gray">{template.category}</Badge>
                           </div>
                           <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{template.name}</h3>
                           <p className="text-xs text-slate-400 mb-4 h-10 line-clamp-2 leading-relaxed">{template.description}</p>
                           <div className="flex gap-2 mb-4">
                              {template.tags.map(tag => (
                                 <span key={tag} className="text-[10px] bg-dark-950 border border-dark-700 px-2 py-1 rounded text-slate-500">{tag}</span>
                              ))}
                           </div>
                           <div className="flex items-center text-xs text-slate-500 pt-4 border-t border-dark-800">
                              <Layers size={12} className="mr-1"/> {template.schema.nodes.length} Steps
                              <span className="mx-2">•</span>
                              Updated {template.updated}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* Interactive Layer */}
         <div 
            className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={(e) => { 
               if(e.button === 1 || (e.button === 0 && e.shiftKey)) { // Middle click or Shift+Click
                  setIsPanning(true); 
               } 
            }}
            onMouseLeave={() => { setIsPanning(false); setDragState(null); }}
            onDragOver={(e) => e.preventDefault()} // Allow drop
            onDrop={handleDrop}
            onKeyDown={(e) => { if(e.code === 'Space') document.body.style.cursor = 'grab'; }}
            onKeyUp={() => document.body.style.cursor = 'default'}
            tabIndex={0}
         >
            {/* Grid Background */}
            <div 
               className="absolute inset-0 pointer-events-none opacity-20"
               style={{
                  backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                  backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
                  backgroundPosition: `${pan.x}px ${pan.y}px`
               }}
            />

            {/* Transform Container */}
            <div 
               className="absolute inset-0 transform-gpu origin-top-left"
               style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
               }}
            >
               {renderConnections()}
               
               {nodes.map(node => {
                  const stage = stages.find(s => s.id === node.config.stageId);
                  return (
                     <WorkflowNodeCard 
                        key={node.id}
                        node={node}
                        zoom={1} // Node handles its own zoom visuals if needed, but usually container scales
                        stageName={stage?.name}
                        stageColor={stage?.color}
                        isSelected={selectedNodeId === node.id}
                        isValid={!validationErrors.find(e => e.nodeId === node.id)}
                        isSimActive={activeSimNode === node.id}
                        onMouseDown={handleNodeMouseDown}
                        onHandleMouseDown={handleConnectionStart}
                     />
                  )
               })}
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-30">
               <div className="bg-dark-900/90 backdrop-blur border border-dark-700 rounded-lg shadow-xl p-1 flex flex-col">
                  <button onClick={() => setZoom(z => z + 0.1)} className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"><ZoomIn size={18}/></button>
                  <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"><ZoomOut size={18}/></button>
                  <button onClick={() => { setZoom(1); setPan({x:0, y:0}); }} className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"><Maximize size={18}/></button>
               </div>
            </div>

            {/* Simulation Log Overlay */}
            {simState !== 'idle' && (
               <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-dark-900/90 backdrop-blur border border-green-500/30 rounded-xl p-4 shadow-2xl w-96 animate-in slide-in-from-top-4 z-40">
                  <h4 className="text-xs font-bold text-green-400 uppercase mb-2 flex items-center gap-2"><Play size={12}/> Running Simulation</h4>
                  <div className="h-32 overflow-y-auto custom-scrollbar space-y-1">
                     {simLog.map((log, i) => (
                        <div key={i} className="text-[10px] font-mono text-slate-300 border-l-2 border-dark-700 pl-2 animate-in fade-in slide-in-from-left-2">{log}</div>
                     ))}
                  </div>
               </div>
            )}

         </div>
      </div>

      {/* 3. Properties Panel */}
      <PropertiesPanel 
         node={nodes.find(n => n.id === selectedNodeId) || null}
         stages={stages}
         onChange={(updated) => setNodes(nodes.map(n => n.id === updated.id ? updated : n))}
         onClose={() => setSelectedNodeId(null)}
         onDelete={handleDeleteNode}
      />
    </div>
  );
};

export default WorkflowBuilder;