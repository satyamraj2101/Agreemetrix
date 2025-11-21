
import React, { useState, useRef, useEffect } from 'react';
import { WorkflowNode, WorkflowConnection, WorkflowCategory, WorkflowStageDefinition, WorkflowTemplate, UserPresence } from '../types';
import { WorkflowNodeCard } from '../components/workflow/WorkflowNode';
import { WorkflowToolbar } from '../components/workflow/WorkflowToolbar';
import { PropertiesPanel } from '../components/workflow/PropertiesPanel';
import { WorkflowAICore } from '../components/workflow/WorkflowAICore'; // Import New Component
import { Button, Badge } from '../components/UIComponents';
import { Play, Save, ZoomIn, ZoomOut, Maximize, AlertTriangle, Loader2, MessageSquare, Plus, Trash2, Layers, LayoutTemplate, X, CheckCircle2, Undo, Redo, MousePointer, Download, Upload, ChevronRight, Pause, SkipForward, RotateCcw, Grid, MonitorPlay, Users, HelpCircle, Zap, Sparkles } from 'lucide-react';
import { INITIAL_TEMPLATES } from '../mock/data';

const INITIAL_STAGES: WorkflowStageDefinition[] = [
  { id: 'stg_draft', name: 'Drafting', color: '#94a3b8', order: 0 },
  { id: 'stg_review', name: 'Review', color: '#3b82f6', order: 1 },
  { id: 'stg_approval', name: 'Approval', color: '#eab308', order: 2 },
  { id: 'stg_sign', name: 'Signature', color: '#a855f7', order: 3 },
  { id: 'stg_active', name: 'Active', color: '#22c55e', order: 4 },
];

interface HistoryState {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

// --- MOCK MULTI-USER CURSORS ---
const MOCK_PEERS: UserPresence[] = [
    { userId: 'u2', userName: 'Mike Ross', color: '#3b82f6', x: 400, y: 300 },
    { userId: 'u5', userName: 'Jessica P.', color: '#eab308', x: 800, y: 150 }
];

// MiniMap Component
const MiniMap: React.FC<{ nodes: WorkflowNode[], viewport: {x: number, y: number, zoom: number}, onClick: (x: number, y: number) => void }> = ({ nodes, viewport, onClick }) => {
    return (
        <div className="absolute bottom-8 right-8 w-48 h-32 bg-dark-900/90 border border-dark-700 rounded-lg shadow-xl overflow-hidden z-30 cursor-crosshair hidden md:block" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            onClick(x * 2000 * -1, y * 2000 * -1); // Simplified logic
        }}>
            <div className="relative w-full h-full bg-dark-950">
                {nodes.map(n => (
                    <div 
                        key={n.id} 
                        className="absolute w-1.5 h-1.5 rounded-sm bg-slate-500"
                        style={{ left: (n.x / 3000) * 100 + '%', top: (n.y / 3000) * 100 + '%' }} 
                    />
                ))}
                {/* Viewport Indicator */}
                <div 
                    className="absolute border-2 border-brand-500/50 bg-brand-500/10"
                    style={{
                        left: (viewport.x / -3000) * 100 + '%',
                        top: (viewport.y / -3000) * 100 + '%',
                        width: (100 / viewport.zoom) + '%',
                        height: (100 / viewport.zoom) + '%'
                    }}
                />
            </div>
        </div>
    )
}

// Stage Ribbon Component
const StageRibbon: React.FC<{ stages: WorkflowStageDefinition[] }> = ({ stages }) => (
    <div className="h-10 bg-dark-900 border-b border-dark-800 flex items-center px-4 gap-1 overflow-x-auto custom-scrollbar shrink-0 select-none">
        <span className="text-[10px] text-slate-500 font-bold uppercase mr-2 shrink-0">Lifecycle:</span>
        {stages.map((stage, i) => (
            <div key={stage.id} className="flex items-center shrink-0">
                <div 
                    className="px-3 py-1 rounded text-[10px] font-bold text-white flex items-center gap-2 cursor-pointer hover:brightness-110 transition-all"
                    style={{ backgroundColor: `${stage.color}20`, border: `1px solid ${stage.color}40` }}
                >
                    <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: stage.color}}></div>
                    {stage.name}
                </div>
                {i < stages.length - 1 && <div className="h-px w-4 bg-dark-700 mx-1"></div>}
            </div>
        ))}
    </div>
);

// Guide Modal
const WorkflowGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in">
        <div className="bg-dark-900 w-full max-w-2xl rounded-2xl border border-dark-700 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
                <h3 className="text-xl font-bold text-white">Workflow Builder Guide</h3>
                <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="font-bold text-white flex items-center gap-2"><MousePointer size={16} className="text-brand-400"/> Canvas Basics</h4>
                    <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                        <li>Drag nodes from the <strong>Left Palette</strong>.</li>
                        <li>Click & Drag on empty space to <strong>Pan</strong>.</li>
                        <li>Drag background to <strong>Lasso Select</strong> multiple nodes.</li>
                        <li>Hold <strong>Shift</strong> + Click to toggle selection.</li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-white flex items-center gap-2"><Zap size={16} className="text-yellow-400"/> Connections</h4>
                    <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                        <li>Drag from the <strong>Bottom Handle</strong> of a node to connect.</li>
                        <li>Logic nodes have separate <strong>True/False</strong> outputs.</li>
                        <li>Double-click a connection line to delete it.</li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-white flex items-center gap-2"><MonitorPlay size={16} className="text-blue-400"/> Simulation</h4>
                    <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                        <li>Use <strong>Test Run</strong> to validate logic.</li>
                        <li>Step through execution to see active paths.</li>
                        <li>Check the <strong>Logs</strong> for variable changes.</li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-white flex items-center gap-2"><Grid size={16} className="text-purple-400"/> Shortcuts</h4>
                    <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                        <li><code>Delete</code> to remove selected items.</li>
                        <li><code>Ctrl + Z</code> for Undo.</li>
                        <li><code>Ctrl + A</code> to Select All.</li>
                        <li>Arrow keys to Nudge nodes.</li>
                    </ul>
                </div>
            </div>
            <div className="p-6 border-t border-dark-700 bg-dark-950/30 flex justify-end">
                <Button variant="primary" onClick={onClose}>Got it</Button>
            </div>
        </div>
    </div>
);

const WorkflowBuilder: React.FC = () => {
  // Canvas State
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: 'start', category: 'trigger', type: 'manual_request', label: 'Manual Request', x: 100, y: 300, config: { stageId: 'stg_draft' } }
  ]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [stages, setStages] = useState<WorkflowStageDefinition[]>(INITIAL_STAGES);
  
  // Selection State
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [lassoRect, setLassoRect] = useState<{x:number, y:number, w:number, h:number} | null>(null);
  
  // Viewport State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  
  // Interaction State
  const [dragState, setDragState] = useState<{
     type: 'node' | 'connection' | 'lasso'; 
     id?: string; 
     startPos?: {x: number, y: number};
     sourceHandle?: string;
     initialNodePositions?: {id: string, x: number, y: number}[]; // For multi-drag
  } | null>(null);
  const [tempConnection, setTempConnection] = useState<{x1:number, y1:number, x2:number, y2:number} | null>(null);
  
  // Simulation State
  const [simState, setSimState] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [activeSimNode, setActiveSimNode] = useState<string | null>(null);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [simSpeed, setSimSpeed] = useState(1000);
  const simTimerRef = useRef<number | null>(null);

  // Modals & Panels
  const [showStageManager, setShowStageManager] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // AI CORE STATE
  const [showAICore, setShowAICore] = useState(false);

  // Undo/Redo
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: [...nodes], connections: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isHistoryAction, setIsHistoryAction] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // -- HISTORY MANAGEMENT --
  useEffect(() => {
     if (!isHistoryAction) {
         const currentState = { nodes, connections };
         const lastState = history[historyIndex];
         if (JSON.stringify(lastState?.nodes) !== JSON.stringify(nodes) || JSON.stringify(lastState?.connections) !== JSON.stringify(connections)) {
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
          if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); handleUndo(); }
          if ((e.metaKey || e.ctrlKey) && e.key === 'y') { e.preventDefault(); handleRedo(); }
          if ((e.metaKey || e.ctrlKey) && e.key === 'a') { e.preventDefault(); setSelectedNodeIds(nodes.map(n => n.id)); }
          if (e.key === 'Delete' || e.key === 'Backspace') {
              if (selectedNodeIds.length > 0 && !document.activeElement?.tagName.match(/INPUT|TEXTAREA/)) {
                  handleDeleteSelected();
              }
          }
          // Nudge
          if(selectedNodeIds.length > 0 && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
              e.preventDefault();
              const dx = e.key === 'ArrowLeft' ? -20 : e.key === 'ArrowRight' ? 20 : 0;
              const dy = e.key === 'ArrowUp' ? -20 : e.key === 'ArrowDown' ? 20 : 0;
              setNodes(prev => prev.map(n => selectedNodeIds.includes(n.id) ? { ...n, x: n.x + dx, y: n.y + dy } : n));
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, historyIndex]);

  // -- CANVAS HELPERS --

  const screenToCanvas = (sx: number, sy: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (sx - rect.left - pan.x) / zoom,
      y: (sy - rect.top - pan.y) / zoom
    };
  };

  const snapToGrid = (val: number) => Math.round(val / 20) * 20;

  // -- HANDLERS --

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
      x: snapToGrid(pos.x - 144), // Center
      y: snapToGrid(pos.y - 40),
      config: {}
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeIds([newNode.id]);
    setShowProperties(true);
  };

  const handleDeleteSelected = () => {
     setNodes(nodes.filter(n => !selectedNodeIds.includes(n.id)));
     setConnections(connections.filter(c => !selectedNodeIds.includes(c.source) && !selectedNodeIds.includes(c.target)));
     setSelectedNodeIds([]);
     setShowProperties(false);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    
    // Multi-select logic
    let newSelection = selectedNodeIds;
    if (e.shiftKey || e.metaKey) {
        if (newSelection.includes(nodeId)) newSelection = newSelection.filter(id => id !== nodeId);
        else newSelection = [...newSelection, nodeId];
    } else {
        if (!newSelection.includes(nodeId)) newSelection = [nodeId];
    }
    setSelectedNodeIds(newSelection);
    setShowProperties(true);

    if (e.button === 0) {
       const pos = screenToCanvas(e.clientX, e.clientY);
       // Capture initial positions for multi-drag
       const initialPos = nodes.filter(n => newSelection.includes(n.id)).map(n => ({ id: n.id, x: n.x, y: n.y }));
       setDragState({ type: 'node', startPos: pos, initialNodePositions: initialPos });
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
          setIsPanning(true);
      } else if (e.button === 0) {
          // Start Lasso
          const pos = screenToCanvas(e.clientX, e.clientY);
          setDragState({ type: 'lasso', startPos: pos });
          setLassoRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
          setSelectedNodeIds([]); // Clear selection on click bg
          setShowProperties(false);
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = screenToCanvas(e.clientX, e.clientY);

    if (isPanning) {
       setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
       return;
    }

    if (dragState?.type === 'node' && dragState.initialNodePositions) {
       const dx = pos.x - dragState.startPos!.x;
       const dy = pos.y - dragState.startPos!.y;
       
       // Update all selected nodes based on delta
       setNodes(prev => prev.map(n => {
           const initial = dragState.initialNodePositions!.find(ip => ip.id === n.id);
           if (initial) {
               return { ...n, x: snapToGrid(initial.x + dx), y: snapToGrid(initial.y + dy) };
           }
           return n;
       }));
    }

    if (dragState?.type === 'lasso') {
        const start = dragState.startPos!;
        const w = pos.x - start.x;
        const h = pos.y - start.y;
        setLassoRect({
            x: w < 0 ? pos.x : start.x,
            y: h < 0 ? pos.y : start.y,
            w: Math.abs(w),
            h: Math.abs(h)
        });
    }

    if (dragState?.type === 'connection' && tempConnection) {
       setTempConnection({ ...tempConnection, x2: pos.x, y2: pos.y });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // Lasso Selection Logic
    if (dragState?.type === 'lasso' && lassoRect) {
        const selected = nodes.filter(n => 
            n.x + 280 > lassoRect.x && n.x < lassoRect.x + lassoRect.w &&
            n.y + 100 > lassoRect.y && n.y < lassoRect.y + lassoRect.h
        ).map(n => n.id);
        setSelectedNodeIds(selected);
        if (selected.length > 0) setShowProperties(true);
        setLassoRect(null);
    }

    // Connection Drop Logic
    if (dragState?.type === 'connection') {
       const pos = screenToCanvas(e.clientX, e.clientY);
       const target = nodes.find(n => 
          pos.x > n.x && pos.x < n.x + 280 && 
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
          if (!connections.find(c => c.source === newConn.source && c.target === newConn.target && c.handleId === newConn.handleId)) {
             setConnections([...connections, newConn]);
          }
       }
    }

    setDragState(null);
    setTempConnection(null);
    setIsPanning(false);
  };

  // -- SIMULATION ENGINE --
  const runSimulation = () => {
     setSimState('running');
     setSimLog(['Initializing simulation environment...', 'Validating schema... OK', 'Starting execution from trigger node.']);
     setActiveSimNode('start'); 
     // Mock step loop
     let step = 0;
     simTimerRef.current = window.setInterval(() => {
         step++;
         if (step > 5) {
             setSimLog(prev => [...prev, 'Simulation completed successfully.', 'Workflow ended.']);
             setSimState('completed');
             setActiveSimNode(null);
             if (simTimerRef.current) clearInterval(simTimerRef.current);
             return;
         }
         // Randomly jump to next node for demo visual
         const nextNode = nodes[step % nodes.length];
         setActiveSimNode(nextNode?.id);
         setSimLog(prev => [...prev, `Transitioned to Step ${step}: ${nextNode?.label || 'Unknown'}`]);
     }, 1500);
  };

  const stopSimulation = () => {
      setSimState('idle');
      setActiveSimNode(null);
      if (simTimerRef.current) clearInterval(simTimerRef.current);
  };

  // -- RENDERERS --

  const renderConnections = () => (
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

             let sy = source.y + 40;
             if (conn.handleId === 'true_out') sy -= 12;
             if (conn.handleId === 'false_out') sy += 28;
             const sx = source.x + 280; // Node width
             const tx = target.x;
             const ty = target.y + 40;

             const d = `M ${sx} ${sy} C ${sx + 80} ${sy}, ${tx - 80} ${ty}, ${tx} ${ty}`;
             const color = conn.handleId === 'true_out' ? '#22c55e' : conn.handleId === 'false_out' ? '#ef4444' : '#64748b';
             const marker = conn.handleId === 'true_out' ? 'url(#arrowhead-green)' : conn.handleId === 'false_out' ? 'url(#arrowhead-red)' : 'url(#arrowhead)';
             
             return (
               <g key={conn.id}>
                  <path d={d} stroke={color} strokeWidth={simState === 'running' && activeSimNode === conn.target ? 3 : 2} strokeOpacity={simState === 'running' ? (activeSimNode === conn.target ? 1 : 0.3) : 1} fill="none" markerEnd={marker} className={simState === 'running' && activeSimNode === conn.target ? 'animate-pulse' : ''} />
                  {conn.label && (
                     <g transform={`translate(${(sx+tx)/2}, ${(sy+ty)/2})`}>
                        <rect x="-16" y="-10" width="32" height="20" rx="4" fill="#020617" stroke={color} />
                        <text y="4" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">{conn.label}</text>
                     </g>
                  )}
               </g>
             );
          })}
          {tempConnection && (
             <path d={`M ${tempConnection.x1} ${tempConnection.y1} C ${tempConnection.x1 + 80} ${tempConnection.y1}, ${tempConnection.x2 - 80} ${tempConnection.y2}, ${tempConnection.x2} ${tempConnection.y2}`} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowhead)"/>
          )}
       </svg>
  );

  return (
    <div className="flex h-screen bg-dark-950 text-slate-200 overflow-hidden font-sans">
      {/* 1. Toolbar */}
      <WorkflowToolbar onDragStart={handleDragStart} />

      {/* 2. Canvas Area */}
      <div className="flex-1 flex flex-col relative h-full">
         
         {/* Header Bar */}
         <div className="h-16 bg-dark-950/80 backdrop-blur border-b border-dark-800 flex justify-between items-center px-6 z-30 shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
               <h1 className="font-bold text-white flex items-center gap-2 text-lg">
                  <MessageSquare size={20} className="text-brand-400"/> Workflow Studio
               </h1>
               
               <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-700">
                   <button className="px-3 py-1 text-xs font-bold text-white bg-dark-800 rounded shadow-sm">v2.4 (Draft)</button>
                   <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-white transition-colors">Live</button>
                   <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-white transition-colors">History</button>
               </div>

               <button onClick={() => setShowStageManager(!showStageManager)} className="px-3 py-1.5 rounded-lg border border-dark-700 text-xs font-medium text-slate-300 hover:text-white hover:border-brand-500/50 transition-all flex items-center gap-2">
                   <Layers size={14} className="text-slate-500"/> Stages
               </button>

               {/* Undo/Redo */}
               <div className="flex gap-1">
                   <button onClick={handleUndo} disabled={historyIndex === 0} className="p-1.5 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30"><Undo size={16}/></button>
                   <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="p-1.5 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30"><Redo size={16}/></button>
               </div>
            </div>

            <div className="flex items-center gap-3">
                {/* AI Toggle Button */}
                <button 
                    onClick={() => { setShowAICore(!showAICore); setShowProperties(false); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${showAICore ? 'bg-brand-500 text-white border-brand-400 shadow-[0_0_20px_rgba(20,184,166,0.4)]' : 'bg-dark-900 text-brand-400 border-brand-500/30 hover:bg-brand-500/10'}`}
                >
                    <Sparkles size={16} className={showAICore ? 'animate-pulse' : ''}/>
                    <span className="text-xs font-bold uppercase tracking-wide">AI Assistant</span>
                </button>

                {/* Simulation Controls */}
                {simState === 'idle' ? (
                    <div className="flex items-center gap-3 pl-4 border-l border-dark-800">
                        <button onClick={() => setShowGuide(true)} className="p-2 text-slate-400 hover:text-white transition-colors"><HelpCircle size={20}/></button>
                        <Button variant="secondary" className="h-9 text-xs gap-2" onClick={runSimulation}>
                            <MonitorPlay size={14}/> Test Run
                        </Button>
                        <Button variant="primary" className="h-9 text-xs gap-2 shadow-lg shadow-brand-500/20">
                            <Save size={14}/> Publish
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-dark-900 p-1 rounded-lg border border-brand-500/30 animate-in fade-in slide-in-from-top-2">
                        <button className="p-2 bg-brand-500 text-white rounded"><Pause size={16}/></button>
                        <button className="p-2 hover:bg-white/10 text-slate-300 rounded"><Play size={16}/></button>
                        <button className="p-2 hover:bg-white/10 text-slate-300 rounded"><SkipForward size={16}/></button>
                        <div className="w-px h-6 bg-dark-700 mx-1"></div>
                        <button onClick={stopSimulation} className="p-2 hover:bg-red-500/10 text-red-400 rounded"><RotateCcw size={16}/></button>
                    </div>
                )}
            </div>
         </div>

         {/* Lifecycle Stages Ribbon */}
         <StageRibbon stages={stages} />

         {/* Interactive Canvas */}
         <div 
            className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing bg-dark-950"
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={handleCanvasMouseDown}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
         >
            {/* Grid Background */}
            {showGrid && (
                <div 
                   className="absolute inset-0 pointer-events-none opacity-20"
                   style={{
                      backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                      backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                      backgroundPosition: `${pan.x}px ${pan.y}px`
                   }}
                />
            )}

            {/* Transform Container */}
            <div 
               className="absolute inset-0 transform-gpu origin-top-left"
               style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
            >
               {renderConnections()}
               
               {nodes.map(node => {
                  const stage = stages.find(s => s.id === node.config.stageId);
                  return (
                     <WorkflowNodeCard 
                        key={node.id}
                        node={node}
                        zoom={1} 
                        stageName={stage?.name}
                        stageColor={stage?.color}
                        isSelected={selectedNodeIds.includes(node.id)}
                        isValid={true}
                        isSimActive={activeSimNode === node.id}
                        simStatus={activeSimNode === node.id ? 'running' : undefined}
                        onMouseDown={handleNodeMouseDown}
                        onHandleMouseDown={(e, nodeId, handle) => {
                            e.stopPropagation();
                            const node = nodes.find(n => n.id === nodeId);
                            if (!node) return;
                            // Basic math for handle position
                            let sy = node.y + 40; 
                            if(handle === 'true_out') sy -= 12;
                            if(handle === 'false_out') sy += 28;
                            const sx = node.x + 280;
                            
                            setDragState({ type: 'connection', id: nodeId, sourceHandle: handle });
                            setTempConnection({ x1: sx, y1: sy, x2: sx, y2: sy });
                        }}
                     />
                  )
               })}

               {/* Lasso Selection Box */}
               {dragState?.type === 'lasso' && lassoRect && (
                   <div 
                      className="absolute border border-brand-500 bg-brand-500/10 z-50 pointer-events-none"
                      style={{ left: lassoRect.x, top: lassoRect.y, width: lassoRect.w, height: lassoRect.h }}
                   />
               )}

               {/* Collaboration Cursors (Mock) */}
               {MOCK_PEERS.map(peer => (
                   <div key={peer.userId} className="absolute z-50 transition-all duration-500 ease-in-out" style={{ left: peer.x, top: peer.y }}>
                       <MousePointer fill={peer.color} className="text-dark-950" size={24} />
                       <span className="absolute left-4 top-4 px-2 py-0.5 text-[10px] font-bold text-white rounded-full whitespace-nowrap shadow-md" style={{backgroundColor: peer.color}}>
                           {peer.userName}
                       </span>
                   </div>
               ))}
            </div>

            {/* Canvas Controls Overlay */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-30">
               <div className="bg-dark-900/90 backdrop-blur border border-dark-700 rounded-lg shadow-xl p-1 flex flex-col">
                  <button onClick={() => setZoom(z => z + 0.1)} className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><ZoomIn size={18}/></button>
                  <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><ZoomOut size={18}/></button>
                  <button onClick={() => { setZoom(1); setPan({x:0, y:0}); }} className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Maximize size={18}/></button>
                  <div className="h-px bg-dark-700 my-1"></div>
                  <button onClick={() => setShowGrid(!showGrid)} className={`p-2 rounded ${showGrid ? 'text-brand-400 bg-brand-500/10' : 'text-slate-400 hover:text-white'}`}><Grid size={18}/></button>
               </div>
            </div>

            {/* Mini Map */}
            <MiniMap nodes={nodes} viewport={{x: pan.x, y: pan.y, zoom}} onClick={(x, y) => setPan({x, y})}/>

            {/* Sim Logs Overlay */}
            {simState !== 'idle' && (
                <div className="absolute top-4 right-4 w-80 bg-dark-900/90 backdrop-blur border border-dark-700 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-right-4 z-40">
                    <div className="p-3 border-b border-dark-700 bg-dark-950/50 flex justify-between items-center">
                        <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2"><MonitorPlay size={14} className="text-brand-400"/> Live Simulation</h4>
                        <button onClick={stopSimulation}><X size={14} className="text-slate-500 hover:text-white"/></button>
                    </div>
                    <div className="h-64 overflow-y-auto p-3 space-y-2 font-mono text-[10px] text-slate-300 custom-scrollbar">
                        {simLog.map((log, i) => (
                            <div key={i} className="border-l-2 border-brand-500/50 pl-2 py-0.5 animate-in fade-in slide-in-from-left-2">
                                <span className="text-slate-500 opacity-50 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                {log}
                            </div>
                        ))}
                        {simState === 'running' && <div className="text-brand-400 animate-pulse">_ awaiting response...</div>}
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* 3. Properties Panel */}
      {showProperties && !showAICore && (
          <PropertiesPanel 
             node={nodes.find(n => selectedNodeIds.includes(n.id)) || null}
             stages={stages}
             onChange={(updated) => setNodes(nodes.map(n => n.id === updated.id ? updated : n))}
             onClose={() => { setShowProperties(false); setSelectedNodeIds([]); }}
             onDelete={(id) => handleDeleteSelected()}
          />
      )}

      {/* 4. AI Core Console */}
      <WorkflowAICore 
         nodes={nodes}
         connections={connections}
         stages={stages}
         isOpen={showAICore}
         onClose={() => setShowAICore(false)}
         onUpdateGraph={(newNodes, newConns) => {
             setNodes(newNodes);
             setConnections(newConns);
         }}
         onHighlightNode={(nodeId) => setSelectedNodeIds([nodeId])}
      />

      {/* 5. Guide Modal */}
      {showGuide && <WorkflowGuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
};

export default WorkflowBuilder;
