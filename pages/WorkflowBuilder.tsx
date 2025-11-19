
import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input, Badge, Select } from '../components/UIComponents';
import { ChatMessage, WorkflowNode, WorkflowStage, UserRole, WorkflowTemplate } from '../types';
import { MOCK_INTEGRATIONS } from '../mock/data';
import { 
  Send, Bot, User, Play, Settings, Network, CheckSquare, X, GitBranch, Trash2, 
  LayoutTemplate, Save, MousePointer2, GripVertical, Sparkles, MoreVertical, 
  RotateCcw, PenTool, Search, Edit2, Plus, Zap, Code, Terminal, ArrowRight, 
  ArrowLeft, Tag, MoveLeft, MoveRight, ChevronRight, ChevronLeft, CheckCircle, PlayCircle,
  CloudLightning
} from 'lucide-react';

// Initial Stages
const INITIAL_STAGES: WorkflowStage[] = [
  { id: 'stage_1', name: 'Intake & Request', order: 0, color: 'border-yellow-500' },
  { id: 'stage_2', name: 'Internal Review', order: 1, color: 'border-blue-500' },
  { id: 'stage_3', name: 'Negotiation', order: 2, color: 'border-purple-500' },
  { id: 'stage_4', name: 'Approval', order: 3, color: 'border-red-500' },
  { id: 'stage_5', name: 'Sign & Store', order: 4, color: 'border-green-500' },
];

const STAGE_COLORS = [
  { label: 'Yellow', value: 'border-yellow-500', bg: 'bg-yellow-500' },
  { label: 'Blue', value: 'border-blue-500', bg: 'bg-blue-500' },
  { label: 'Purple', value: 'border-purple-500', bg: 'bg-purple-500' },
  { label: 'Red', value: 'border-red-500', bg: 'bg-red-500' },
  { label: 'Green', value: 'border-green-500', bg: 'bg-green-500' },
  { label: 'Pink', value: 'border-pink-500', bg: 'bg-pink-500' },
  { label: 'Orange', value: 'border-orange-500', bg: 'bg-orange-500' },
  { label: 'Cyan', value: 'border-cyan-500', bg: 'bg-cyan-500' },
];

// Sample Workflow Data
const SAMPLE_WORKFLOW: WorkflowNode[] = [
  { id: '1', stageId: 'stage_1', label: 'Sales Request', type: 'trigger', details: 'Source: Salesforce Opportunity > $50k' },
  { id: '2', stageId: 'stage_1', label: 'Standard Check', type: 'condition', details: 'Is on Standard Paper?' },
  { id: '3', stageId: 'stage_2', label: 'Legal Review', type: 'approval', role: UserRole.LEGAL, details: 'Assigned to: Legal Team Queue' },
  { id: '4', stageId: 'stage_4', label: 'CFO Approval', type: 'approval', role: UserRole.FINANCE, details: 'Required if value > $100k' },
  { id: '5', stageId: 'stage_5', label: 'E-Sign', type: 'action', details: 'Provider: DocuSign' },
];

const INITIAL_TEMPLATES: WorkflowTemplate[] = [
  { 
    id: 't1', 
    name: 'Standard NDA Workflow', 
    description: 'Simple 2-step approval for non-disclosure agreements.', 
    tags: ['Legal', 'Quick'], 
    nodes: SAMPLE_WORKFLOW.slice(0, 3),
    updated: '2 days ago', 
    category: 'Legal' 
  },
  { 
    id: 't2', 
    name: 'High-Value MSA Review', 
    description: 'Multi-department approval chain for >$100k contracts.', 
    tags: ['Finance', 'Complex'], 
    nodes: SAMPLE_WORKFLOW,
    updated: '1 week ago', 
    category: 'Finance' 
  },
  { 
    id: 't3', 
    name: 'Vendor Onboarding', 
    description: 'Compliance check, security review, and finance setup.', 
    tags: ['Procurement'], 
    nodes: SAMPLE_WORKFLOW,
    updated: '3 days ago', 
    category: 'Procurement' 
  },
  { 
    id: 't4', 
    name: 'Fast-Track Sales Order', 
    description: 'Auto-approval logic for standard terms.', 
    tags: ['Sales'], 
    nodes: SAMPLE_WORKFLOW.slice(0, 2),
    updated: 'Yesterday', 
    category: 'Sales' 
  },
];

// --- CONFIGURATION CONSTANTS ---

const TRIGGER_PROVIDERS = [
  { label: 'System / Manual Form', value: 'manual' },
  ...MOCK_INTEGRATIONS.filter(i => ['CRM', 'ERP'].includes(i.category)).map(i => ({ label: i.name, value: i.id }))
];

const ACTION_PROVIDERS = [
  { label: 'Agreemetrix System', value: 'system' },
  ...MOCK_INTEGRATIONS.map(i => ({ label: i.name, value: i.id }))
];

const APP_EVENTS: Record<string, { label: string; value: string }[]> = {
  'manual': [
    { label: 'User Submits Intake Form', value: 'form_submit' },
    { label: 'Incoming Webhook (API)', value: 'webhook' }
  ],
  'sf': [
    { label: 'New Opportunity Created', value: 'opp_created' },
    { label: 'Opportunity Stage Changed', value: 'opp_stage' },
    { label: 'Contract Value Changed', value: 'val_change' }
  ],
  'hubspot': [
    { label: 'Deal Moved to Won', value: 'deal_won' },
    { label: 'Company Created', value: 'company_new' }
  ],
  'jira': [
    { label: 'Issue Transitioned', value: 'issue_trans' },
    { label: 'New Legal Ticket', value: 'ticket_new' }
  ]
};

const APP_ACTIONS: Record<string, { label: string; value: string }[]> = {
  'system': [
    { label: 'Send Email Notification', value: 'email' },
    { label: 'Generate Document from Template', value: 'doc_gen' },
    { label: 'Wait for Time Period', value: 'wait' }
  ],
  'sf': [
    { label: 'Update Opportunity Stage', value: 'update_stage' },
    { label: 'Create Contract Record', value: 'create_rec' },
    { label: 'Post to Chatter', value: 'chatter' }
  ],
  'slack': [
    { label: 'Send Channel Message', value: 'msg_channel' },
    { label: 'Send Direct Message', value: 'msg_dm' }
  ],
  'jira': [
    { label: 'Create Jira Ticket', value: 'create_ticket' },
    { label: 'Add Comment to Issue', value: 'add_comment' }
  ],
  'docusign': [
    { label: 'Send Envelope for Signature', value: 'send_env' },
    { label: 'Void Envelope', value: 'void_env' }
  ],
  'drive': [
    { label: 'Upload Document', value: 'upload' },
    { label: 'Create Folder', value: 'folder' }
  ]
};

const WorkflowBuilder: React.FC = () => {
  // View State
  const [activeView, setActiveView] = useState<'editor' | 'templates'>('editor');
  const [rightPanelTab, setRightPanelTab] = useState<'ai' | 'properties'>('ai');
  const [logicMode, setLogicMode] = useState<'visual' | 'code'>('visual');
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  
  // Testing & Publishing State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [testSteps, setTestSteps] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [publishToast, setPublishToast] = useState(false);

  // Template Management State
  const [templateSearch, setTemplateSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  
  // Stage Management State
  const [stages, setStages] = useState<WorkflowStage[]>(INITIAL_STAGES);
  const [activeStageMenu, setActiveStageMenu] = useState<string | null>(null); // Which stage menu is open
  const [activeAddMenu, setActiveAddMenu] = useState<string | null>(null); // Which stage add menu is open
  const [showStageModal, setShowStageModal] = useState(false);
  const [stageForm, setStageForm] = useState({ id: '', name: '', color: 'border-gray-500' });
  const [isEditingStage, setIsEditingStage] = useState(false);

  // Workflow Data State
  const [workflow, setWorkflow] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  
  // Templates State
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(INITIAL_TEMPLATES);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: '', description: '', category: 'General', tags: '' });

  // Node Configs
  const [jqlCode, setJqlCode] = useState<Record<string, string>>({}); 
  const [nodeConfigs, setNodeConfigs] = useState<Record<string, any>>({});

  // Chat State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{
      id: '1',
      sender: 'system',
      text: 'Hello! I am the Agreemetrix Workflow Agent. Describe the workflow you want to build.',
      timestamp: new Date(),
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // SVG Lines State
  const [connections, setConnections] = useState<{x1:number, y1:number, x2:number, y2:number}[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // --- Effects ---
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedNode) {
        setRightPanelTab('properties');
        setIsRightPanelOpen(true);
    }
  }, [selectedNode]);

  // Close stage menus when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
        setActiveStageMenu(null);
        setActiveAddMenu(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Recalculate lines
  useEffect(() => {
    const calculateConnections = () => {
      if (!canvasRef.current) return;
      const newConnections: any[] = [];
      
      const stageIds = stages.map(s => s.id);
      
      stageIds.forEach((stageId, idx) => {
        if (idx === stageIds.length - 1) return;
        const nextStageId = stageIds[idx + 1];

        const currentStageNodes = workflow.filter(n => n.stageId === stageId);
        const nextStageNodes = workflow.filter(n => n.stageId === nextStageId);

        if (currentStageNodes.length > 0 && nextStageNodes.length > 0) {
          const sourceNode = currentStageNodes[currentStageNodes.length - 1];
          const targetNode = nextStageNodes[0];

          const sourceEl = document.getElementById(`node-${sourceNode.id}`);
          const targetEl = document.getElementById(`node-${targetNode.id}`);
          const canvasRect = canvasRef.current?.getBoundingClientRect();

          if (sourceEl && targetEl && canvasRect) {
            const srcRect = sourceEl.getBoundingClientRect();
            const tgtRect = targetEl.getBoundingClientRect();

            // Improved curve logic
            newConnections.push({
              x1: (srcRect.right - canvasRect.left),
              y1: (srcRect.top + srcRect.height / 2) - canvasRect.top,
              x2: (tgtRect.left - canvasRect.left),
              y2: (tgtRect.top + tgtRect.height / 2) - canvasRect.top
            });
          }
        }
      });
      setConnections(newConnections);
    };

    const timer = setTimeout(calculateConnections, 100);
    window.addEventListener('resize', calculateConnections);
    return () => {
      window.removeEventListener('resize', calculateConnections);
      clearTimeout(timer);
    };
  }, [workflow, stages, activeView, isRightPanelOpen]); // Added isRightPanelOpen dependancy for resize

  // --- Test & Publish Handlers ---

  const handleTestRun = () => {
    setIsTestModalOpen(true);
    setTestStatus('running');
    setTestSteps([]);
    
    // Simulate Test Steps
    const steps = ['Validating Logic Gates...', 'Checking Role Assignments...', 'Verifying Integration Credentials...', 'Simulating Payload...'];
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            setTestSteps(prev => [...prev, step]);
            if (index === steps.length - 1) {
                setTimeout(() => setTestStatus('success'), 500);
            }
        }, (index + 1) * 800);
    });
  };

  const handlePublish = () => {
     setIsPublished(true);
     setPublishToast(true);
     setTimeout(() => setPublishToast(false), 3000);
  };

  // --- Stage Handlers ---

  const handleAddStageClick = () => {
    setStageForm({ id: '', name: '', color: 'border-gray-500' });
    setIsEditingStage(false);
    setShowStageModal(true);
  };

  const handleEditStageClick = (stage: WorkflowStage, e: React.MouseEvent) => {
    e.stopPropagation();
    setStageForm({ id: stage.id, name: stage.name, color: stage.color });
    setIsEditingStage(true);
    setShowStageModal(true);
    setActiveStageMenu(null);
  };

  const handleSaveStage = () => {
    if (isEditingStage) {
      setStages(prev => prev.map(s => s.id === stageForm.id ? { ...s, name: stageForm.name, color: stageForm.color } : s));
    } else {
      const newStage: WorkflowStage = {
        id: `stage_${Date.now()}`,
        name: stageForm.name || 'New Stage',
        color: stageForm.color,
        order: stages.length
      };
      setStages(prev => [...prev, newStage]);
    }
    setShowStageModal(false);
  };

  const handleDeleteStage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStages(prev => prev.filter(s => s.id !== id));
    setWorkflow(prev => prev.filter(n => n.stageId !== id)); // Remove nodes in deleted stage
    setActiveStageMenu(null);
  };

  const handleMoveStage = (index: number, direction: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    const newStages = [...stages];
    if (direction === 'left' && index > 0) {
      [newStages[index], newStages[index - 1]] = [newStages[index - 1], newStages[index]];
    } else if (direction === 'right' && index < stages.length - 1) {
      [newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]];
    }
    setStages(newStages);
    setActiveStageMenu(null);
  };

  const toggleStageMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStageMenu(activeStageMenu === id ? null : id);
    setActiveAddMenu(null);
  };
  
  const toggleAddMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveAddMenu(activeAddMenu === id ? null : id);
    setActiveStageMenu(null);
  };

  // --- Workflow Handlers ---

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const systemMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: 'I have analyzed your request. Based on standard best practices, I have drafted a workflow flow below.',
        timestamp: new Date(),
        workflowPreview: SAMPLE_WORKFLOW
      };
      setMessages(prev => [...prev, systemMsg]);
      setWorkflow(SAMPLE_WORKFLOW);
      setIsTyping(false);
    }, 1200);
  };

  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    e.dataTransfer.setData('nodeId', nodeId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleToolDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData('nodeId');
    const toolType = e.dataTransfer.getData('type') as WorkflowNode['type'];

    if (nodeId) {
      setWorkflow(prev => prev.map(node => 
        node.id === nodeId ? { ...node, stageId } : node
      ));
    } else if (toolType) {
      handleAddNode(toolType, stageId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAddNode = (type: WorkflowNode['type'], stageId: string) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      stageId,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      details: 'Configure details in panel'
    };
    setWorkflow(prev => [...prev, newNode]);
    setSelectedNode(newNode);
  };

  const updateSelectedNode = (updates: Partial<WorkflowNode>) => {
    if (!selectedNode) return;
    const updatedNode = { ...selectedNode, ...updates };
    setSelectedNode(updatedNode);
    setWorkflow(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
  };

  const updateNodeConfig = (key: string, value: any) => {
    if (!selectedNode) return;
    setNodeConfigs(prev => ({
      ...prev,
      [selectedNode.id]: {
        ...(prev[selectedNode.id] || {}),
        [key]: value
      }
    }));
  };

  // --- Template Handlers ---
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase()) || 
                          t.description.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEditTemplate = (tpl: WorkflowTemplate) => {
    setTemplateForm({
        name: tpl.name,
        description: tpl.description,
        category: tpl.category,
        tags: tpl.tags.join(', ')
    });
    setEditingTemplateId(tpl.id);
    setShowSaveModal(true);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleLoadTemplate = (tpl: WorkflowTemplate) => {
    setWorkflowName(tpl.name);
    setWorkflow(tpl.nodes || []);
    setActiveView('editor');
  };

  const handleSaveTemplateSubmit = () => {
    const processedTags = templateForm.tags.split(',').map(s => s.trim()).filter(Boolean);
    
    if (editingTemplateId) {
        setTemplates(prev => prev.map(t => t.id === editingTemplateId ? {
            ...t,
            name: templateForm.name,
            description: templateForm.description,
            category: templateForm.category,
            tags: processedTags
        } : t));
    } else {
        const newTpl: WorkflowTemplate = {
            id: `tpl-${Date.now()}`,
            name: templateForm.name,
            description: templateForm.description,
            category: templateForm.category,
            tags: processedTags,
            nodes: [...workflow],
            updated: 'Just now'
        };
        setTemplates(prev => [...prev, newTpl]);
    }
    setShowSaveModal(false);
    setEditingTemplateId(null);
    setTemplateForm({ name: '', description: '', category: 'General', tags: '' });
  };

  const handleCreateNewFromModal = () => {
    setEditingTemplateId(null);
    setTemplateForm({ name: '', description: '', category: 'General', tags: '' });
    setShowSaveModal(true);
  };

  // --- Components ---

  const JQLEditor = ({ nodeId }: { nodeId: string }) => {
    const code = jqlCode[nodeId] || `// Agreemetrix JQL\nIF contract.value > 50000 \nAND contract.risk_score >= 75\nTHEN \n   ROUTE_TO "Legal Review"\nELSE\n   AUTO_APPROVE`;
    return (
      <div className="flex flex-col h-64 bg-dark-950 border border-dark-700 rounded-lg overflow-hidden font-mono text-xs">
        <div className="flex justify-between items-center px-3 py-2 bg-dark-900 border-b border-dark-700">
           <span className="text-slate-400 flex items-center gap-2"><Terminal size={12} /> Logic Editor</span>
           <Badge color="blue">JQL</Badge>
        </div>
        <textarea 
          className="flex-1 bg-transparent p-3 text-slate-300 outline-none resize-none focus:bg-white/5 transition-colors"
          value={code}
          onChange={(e) => setJqlCode(prev => ({...prev, [nodeId]: e.target.value}))}
          spellCheck={false}
        ></textarea>
      </div>
    );
  };

  const renderPropertiesPanel = () => {
    if (!selectedNode) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
           <MousePointer2 size={32} className="mb-4 opacity-20" />
           <p className="text-xs">Select a node to configure its properties.</p>
        </div>
      );
    }

    const config = nodeConfigs[selectedNode.id] || {};
    const providerId = config.providerId;

    return (
      <div className="p-5 space-y-6 pb-20">
         <div className="flex justify-between items-start">
            <div>
               <Badge color={
                  selectedNode.type === 'trigger' ? 'yellow' : selectedNode.type === 'condition' ? 'blue' : selectedNode.type === 'approval' ? 'red' : 'green'
               }>{selectedNode.type}</Badge>
               <h3 className="text-lg font-bold text-white mt-1">{selectedNode.label}</h3>
            </div>
            <button onClick={() => setSelectedNode(null)}><X size={16} className="text-slate-500 hover:text-white"/></button>
         </div>

         <div className="space-y-4">
            <Input label="Node Name" value={selectedNode.label} onChange={(e) => updateSelectedNode({ label: e.target.value })} />
            <Input label="Description" value={selectedNode.details || ''} onChange={(e) => updateSelectedNode({ details: e.target.value })} />
            
            {selectedNode.type === 'trigger' && (
              <div className="space-y-3 p-3 bg-dark-900 rounded border border-dark-700">
                 <h4 className="text-xs font-bold text-slate-500 uppercase">Trigger Configuration</h4>
                 <Select label="Integration App" options={TRIGGER_PROVIDERS} value={providerId || 'manual'} onChange={(e) => updateNodeConfig('providerId', e.target.value)} />
                 <Select label="Event" options={APP_EVENTS[providerId || 'manual'] || []} value={config.eventId || ''} onChange={(e) => updateNodeConfig('eventId', e.target.value)} />
                 {providerId === 'sf' && (
                   <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                     <Input label="Object Type" defaultValue="Opportunity" disabled={true} />
                     <Input label="Stage Condition" placeholder="e.g. Closed Won" />
                   </div>
                 )}
                 {providerId === 'manual' && config.eventId === 'webhook' && (
                    <div className="p-2 bg-dark-950 rounded border border-dark-800 text-xs font-mono text-slate-400 break-all">POST /api/hooks/v1/trigger/{selectedNode.id}</div>
                 )}
              </div>
            )}

            {selectedNode.type === 'approval' && (
              <div className="space-y-3 p-3 bg-dark-900 rounded border border-dark-700">
                 <h4 className="text-xs font-bold text-slate-500 uppercase">Approval Settings</h4>
                 <Select label="Responsible Role" options={[ {label: 'Legal Team', value: UserRole.LEGAL}, {label: 'Finance Team', value: UserRole.FINANCE}, {label: 'Sales Manager', value: UserRole.SALES}, {label: 'HR Department', value: UserRole.HR}, {label: 'System Admin', value: UserRole.ADMIN} ]} value={selectedNode.role || ''} onChange={(e) => updateSelectedNode({ role: e.target.value as UserRole })} />
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Assignment Logic</label>
                    <div className="flex gap-2">
                       <select className="bg-dark-950 border border-dark-700 rounded text-xs px-2 py-1 text-white w-24"><option>Always</option><option>If...</option></select>
                       <input placeholder="e.g. Value > 50000" className="flex-1 bg-dark-950 border border-dark-700 rounded text-xs px-2 py-1 text-white" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Leave blank to always assign to this role.</p>
                 </div>
              </div>
            )}

            {selectedNode.type === 'action' && (
               <div className="space-y-3 p-3 bg-dark-900 rounded border border-dark-700">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Action Configuration</h4>
                  <Select label="Integration App" options={ACTION_PROVIDERS} value={providerId || 'system'} onChange={(e) => updateNodeConfig('providerId', e.target.value)} />
                  <Select label="Action to Perform" options={APP_ACTIONS[providerId || 'system'] || []} value={config.actionId || ''} onChange={(e) => updateNodeConfig('actionId', e.target.value)} />
                  {config.actionId === 'email' && (
                     <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                        <Input label="Recipient (Email or Variable)" placeholder="{{contract.owner_email}}" />
                        <Input label="Subject Line" placeholder="Review Required: {{contract.title}}" />
                     </div>
                  )}
                  {providerId === 'slack' && (
                     <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                        <Input label="Channel ID" placeholder="#legal-updates" />
                        <textarea className="w-full bg-dark-950 border border-dark-700 rounded p-2 text-xs text-white" placeholder="Message body..." rows={3}></textarea>
                     </div>
                  )}
                  {providerId === 'jira' && (
                     <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                        <Input label="Project Key" placeholder="LEG" />
                        <Select label="Issue Type" options={[{label: 'Task', value:'Task'}, {label:'Sub-task', value:'Sub-task'}]} />
                     </div>
                  )}
               </div>
            )}

            {selectedNode.type === 'condition' && (
               <div>
                  <div className="flex justify-between items-center mb-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logic Engine</label>
                     <div className="flex bg-dark-900 rounded p-0.5 border border-dark-700">
                        <button onClick={() => setLogicMode('visual')} className={`px-2 py-1 text-[10px] rounded ${logicMode === 'visual' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}>Visual</button>
                        <button onClick={() => setLogicMode('code')} className={`px-2 py-1 text-[10px] rounded ${logicMode === 'code' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}>JQL</button>
                     </div>
                  </div>
                  {logicMode === 'visual' ? (
                     <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                           <span className="font-bold text-brand-400">IF</span>
                           <select className="bg-dark-950 border border-dark-700 rounded px-2 py-1 outline-none"><option>Contract Value</option><option>Risk Score</option></select>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                           <select className="bg-dark-950 border border-dark-700 rounded px-2 py-1 outline-none"><option>Greater Than</option><option>Equals</option></select>
                           <input className="bg-dark-950 border border-dark-700 rounded px-2 py-1 w-20 outline-none" defaultValue="50000" />
                        </div>
                        <Button variant="secondary" className="w-full text-xs mt-2">+ Add Condition</Button>
                     </div>
                  ) : (
                     <JQLEditor nodeId={selectedNode.id} />
                  )}
               </div>
            )}

            <div className="pt-4 border-t border-dark-700">
               <Button variant="ghost" className="w-full text-red-400 hover:bg-red-900/20 hover:text-red-300" onClick={() => { setWorkflow(prev => prev.filter(n => n.id !== selectedNode.id)); setSelectedNode(null); }}>
                 <Trash2 size={14} className="mr-2"/> Delete Node
               </Button>
            </div>
         </div>
      </div>
    );
  };

  const renderEditor = () => (
    <div className="flex h-full gap-px bg-dark-800 overflow-hidden">
      {/* Left: Toolbox */}
      <div className="w-14 bg-dark-950 border-r border-dark-700 flex flex-col items-center py-4 gap-4 z-20 shadow-xl">
         <div className="p-2 bg-brand-500/10 rounded text-brand-400 mb-2"><PenTool size={20} /></div>
         {[{ type: 'trigger', icon: Play, color: 'text-yellow-500', label: 'Trigger' }, { type: 'approval', icon: User, color: 'text-red-500', label: 'Approval' }, { type: 'condition', icon: GitBranch, color: 'text-blue-500', label: 'Condition' }, { type: 'action', icon: Zap, color: 'text-green-500', label: 'Action' }].map((tool) => (
           <div key={tool.type} className="group relative" draggable onDragStart={(e) => handleToolDragStart(e, tool.type)}>
             <div className={`p-3 rounded-lg bg-dark-900 border border-dark-700 text-slate-400 hover:bg-dark-800 hover:border-slate-500 hover:${tool.color} cursor-grab active:cursor-grabbing transition-all shadow-sm`}>
               <tool.icon size={20} />
             </div>
             <div className="absolute left-full top-2 ml-2 px-2 py-1 bg-dark-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 border border-dark-600 shadow-lg">Drag {tool.label}</div>
           </div>
         ))}
      </div>

      {/* Center: Canvas (Stage Based) */}
      <div className="flex-1 flex flex-col bg-dark-900 relative overflow-hidden dot-grid-bg">
         <div className="h-14 bg-dark-950 border-b border-dark-700 flex justify-between items-center px-6 z-20 shadow-sm">
            <div className="flex items-center gap-3">
               <span className="font-bold text-white">{workflowName}</span>
               {isPublished ? <Badge color="green">Active</Badge> : <Badge color="yellow">Draft</Badge>}
            </div>
            <div className="flex items-center gap-2">
               <Button variant="ghost" className="text-xs" onClick={() => setWorkflow([])}><RotateCcw size={14} className="mr-1"/> Reset</Button>
               <Button variant="secondary" className="text-xs" onClick={handleTestRun}><PlayCircle size={14} className="mr-1"/> Test Run</Button>
               <Button variant="primary" className="text-xs" onClick={handlePublish} disabled={isPublished}><CloudLightning size={14} className="mr-1"/> {isPublished ? 'Published' : 'Publish'}</Button>
               <Button variant="ghost" className="text-xs ml-2" onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} title="Toggle Properties"><Settings size={16}/></Button>
            </div>
         </div>

         <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative custom-scrollbar" ref={canvasRef}>
             {/* SVG Layer for connections */}
             <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full overflow-visible">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                  </marker>
                </defs>
                {connections.map((conn, i) => (
                  <path 
                    key={i} 
                    d={`M ${conn.x1} ${conn.y1} C ${conn.x1 + 60} ${conn.y1}, ${conn.x2 - 60} ${conn.y2}, ${conn.x2} ${conn.y2}`} 
                    fill="none" 
                    stroke="#64748b" 
                    strokeWidth="2" 
                    strokeDasharray="4 4" 
                    markerEnd="url(#arrowhead)" 
                    className="opacity-40" 
                  />
                ))}
             </svg>

             <div className="flex gap-6 h-full min-w-max pb-8">
                 {stages.map((stage, index) => (
                    <div 
                      key={stage.id}
                      className="w-72 flex flex-col bg-dark-950/80 border border-dark-700 rounded-xl h-full backdrop-blur-sm relative z-10 shadow-lg transition-all hover:border-dark-600"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, stage.id)}
                    >
                       {/* Stage Header */}
                       <div className={`p-3 border-t-4 ${stage.color} rounded-t-xl bg-dark-900/80 border-b border-dark-700 flex justify-between items-center relative`}>
                          <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wide truncate pr-2">{stage.name}</h4>
                          <div className="flex gap-1 relative">
                            <button 
                                className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-white" 
                                onClick={(e) => toggleAddMenu(stage.id, e)} 
                                title="Add Node"
                            >
                                <Plus size={14}/>
                            </button>
                            {activeAddMenu === stage.id && (
                                <div className="absolute right-0 top-8 w-36 bg-dark-900 border border-dark-700 rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100 flex flex-col">
                                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-500 border-b border-dark-800 mb-1">Add Node</div>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddNode('trigger', stage.id); setActiveAddMenu(null); }} className="text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                                        <Play size={12} className="text-yellow-500"/> Trigger
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddNode('action', stage.id); setActiveAddMenu(null); }} className="text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                                        <Zap size={12} className="text-green-500"/> Action
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddNode('condition', stage.id); setActiveAddMenu(null); }} className="text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                                        <GitBranch size={12} className="text-blue-500"/> Condition
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddNode('approval', stage.id); setActiveAddMenu(null); }} className="text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                                        <User size={12} className="text-red-500"/> Approval
                                    </button>
                                </div>
                            )}

                            <button className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-white" onClick={(e) => toggleStageMenu(stage.id, e)}><MoreVertical size={14}/></button>
                          </div>
                          
                          {/* Stage Menu Popover */}
                          {activeStageMenu === stage.id && (
                            <div className="absolute right-2 top-10 w-40 bg-dark-900 border border-dark-700 rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                               <button onClick={(e) => handleEditStageClick(stage, e)} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                                  <Edit2 size={12} /> Edit Stage
                               </button>
                               <button onClick={(e) => handleMoveStage(index, 'left', e)} disabled={index === 0} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                                  <MoveLeft size={12} /> Move Left
                               </button>
                               <button onClick={(e) => handleMoveStage(index, 'right', e)} disabled={index === stages.length - 1} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                                  <MoveRight size={12} /> Move Right
                               </button>
                               <div className="border-t border-white/5 my-1"></div>
                               <button onClick={(e) => handleDeleteStage(stage.id, e)} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 flex items-center gap-2">
                                  <Trash2 size={12} /> Delete Stage
                               </button>
                            </div>
                          )}
                       </div>

                       {/* Nodes Container */}
                       <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                          {workflow.filter(n => n.stageId === stage.id).map((node) => (
                             <div 
                                id={`node-${node.id}`}
                                key={node.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, node.id)}
                                onClick={() => setSelectedNode(node)}
                                className={`bg-dark-900 border rounded-lg p-3 cursor-pointer shadow-md group transition-all relative z-20 ${selectedNode?.id === node.id ? 'border-brand-500 ring-1 ring-brand-500/50 shadow-[0_0_15px_rgba(var(--color-brand-500),0.2)]' : 'border-dark-700 hover:border-slate-500 hover:-translate-y-0.5 hover:shadow-lg'}`}
                             >
                                <div className="flex justify-between items-start mb-2">
                                   <div className="flex items-center gap-2">
                                      {node.type === 'trigger' && <Play size={12} className="text-yellow-500"/>}
                                      {node.type === 'condition' && <GitBranch size={12} className="text-blue-500"/>}
                                      {node.type === 'approval' && <User size={12} className="text-red-500"/>}
                                      {node.type === 'action' && <Zap size={12} className="text-green-500"/>}
                                      <span className="text-[10px] font-bold uppercase text-slate-500">{node.type}</span>
                                   </div>
                                   <GripVertical size={12} className="text-dark-700 group-hover:text-slate-500 cursor-grab"/>
                                </div>
                                <p className="text-sm font-medium text-slate-200">{node.label}</p>
                                {node.details && <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{node.details}</p>}
                                {node.type === 'approval' && node.role && <Badge color="gray" className="mt-1 text-[9px]">{node.role}</Badge>}
                                {(node.type === 'condition' && jqlCode[node.id]) && (
                                   <div className="mt-2 pt-2 border-t border-dark-700 flex items-center gap-1 text-[9px] text-brand-400"><Code size={8} /> Custom JQL</div>
                                )}
                             </div>
                          ))}
                          {workflow.filter(n => n.stageId === stage.id).length === 0 && (
                             <div className="h-24 border-2 border-dashed border-dark-800 rounded-lg flex flex-col items-center justify-center text-slate-600 text-xs bg-dark-900/30">Drag items here</div>
                          )}
                       </div>
                    </div>
                 ))}
                 
                 {/* Add Stage Button */}
                 <button onClick={handleAddStageClick} className="w-12 h-full rounded-xl border-2 border-dashed border-dark-700 hover:border-brand-500 hover:bg-brand-500/5 transition-all flex flex-col items-center justify-center text-slate-500 hover:text-brand-400 gap-2 bg-dark-950/50">
                    <Plus size={20} />
                    <span className="text-[10px] font-bold uppercase rotate-90 whitespace-nowrap">Add Stage</span>
                 </button>
             </div>
         </div>
      </div>

      {/* Right: Properties Panel (Collapsible) */}
      <div className={`bg-dark-950 border-l border-dark-700 flex flex-col z-30 shadow-2xl transition-all duration-300 ease-in-out ${isRightPanelOpen ? 'w-96 translate-x-0' : 'w-0 translate-x-full opacity-0 overflow-hidden'}`}>
         <div className="flex border-b border-dark-700 min-w-[24rem]">
            <button onClick={() => setRightPanelTab('ai')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${rightPanelTab === 'ai' ? 'text-brand-400 border-b-2 border-brand-500 bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'}`}><Sparkles size={14} /> AI Agent</button>
            <button onClick={() => setRightPanelTab('properties')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${rightPanelTab === 'properties' ? 'text-brand-400 border-b-2 border-brand-500 bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'}`}><Settings size={14} /> Config</button>
            <button onClick={() => setIsRightPanelOpen(false)} className="px-3 border-l border-dark-700 text-slate-500 hover:text-white"><ChevronRight size={16} /></button>
         </div>
         {rightPanelTab === 'ai' && (
            <div className="flex-1 flex flex-col overflow-hidden min-w-[24rem]">
               <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-dark-900/20">
                  {messages.map((msg) => (
                     <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${msg.sender === 'user' ? 'bg-dark-800 border-dark-700' : 'bg-brand-500/10 border-brand-500/20'}`}>{msg.sender === 'user' ? <User size={14} className="text-slate-400" /> : <Bot size={14} className="text-brand-400" />}</div>
                        <div className={`max-w-[85%] p-3 rounded-lg text-xs border ${msg.sender === 'user' ? 'bg-dark-800 border-dark-700 text-slate-200' : 'bg-brand-500/5 border-brand-500/10 text-slate-200'}`}><p>{msg.text}</p>{msg.workflowPreview && <div className="mt-2 p-2 bg-dark-950 rounded border border-white/10 text-[10px] text-green-400 flex gap-1 items-center"><CheckSquare size={10}/> Preview Loaded</div>}</div>
                     </div>
                  ))}
                  <div ref={messagesEndRef} />
               </div>
               <div className="p-4 border-t border-dark-700 bg-dark-900">
                  <div className="flex gap-2">
                     <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Build a workflow..." className="h-9 text-xs" onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
                     <Button variant="neon" className="h-9 w-9 p-0 flex items-center justify-center" onClick={handleSend} disabled={isTyping}><Send size={14}/></Button>
                  </div>
               </div>
            </div>
         )}
         {rightPanelTab === 'properties' && <div className="flex-1 overflow-y-auto custom-scrollbar min-w-[24rem]">{renderPropertiesPanel()}</div>}
      </div>
    </div>
  );

  const renderTemplatesView = () => (
     <div className="flex flex-col h-full bg-dark-900">
        <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-950">
            <div className="flex items-center gap-4">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <Input placeholder="Search templates..." className="pl-9 h-10 bg-dark-900" value={templateSearch} onChange={(e) => setTemplateSearch(e.target.value)} />
                </div>
                <div className="w-48"><Select options={[{ label: 'All Categories', value: 'All' }, { label: 'Legal', value: 'Legal' }, { label: 'Finance', value: 'Finance' }, { label: 'Sales', value: 'Sales' }, { label: 'Procurement', value: 'Procurement' }, { label: 'HR', value: 'HR' }]} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} /></div>
            </div>
            <Button variant="primary" onClick={() => setActiveView('editor')}><Plus size={16} className="mr-2" /> Create from Scratch</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map(tpl => (
                    <Card key={tpl.id} noPadding className="group hover:border-brand-500/40 transition-all relative flex flex-col h-full">
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <Badge color="gray">{tpl.category}</Badge>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditTemplate(tpl)} className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors" title="Edit Details"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDeleteTemplate(tpl.id)} className="p-1.5 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400 transition-colors" title="Delete Template"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-brand-400 transition-colors">{tpl.name}</h3>
                            <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">{tpl.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">{tpl.tags.map((tag: string, i: number) => (<span key={i} className="text-[10px] px-2 py-1 rounded bg-dark-800 border border-dark-700 text-slate-400 flex items-center gap-1"><Tag size={10} /> {tag}</span>))}</div>
                            <div className="pt-4 border-t border-dark-700 flex items-center justify-between">
                                <div className="text-xs text-slate-500"><span className="block">{tpl.nodes.length} Steps</span><span className="block opacity-60">{tpl.updated}</span></div>
                                <Button variant="secondary" className="text-xs h-8" onClick={() => handleLoadTemplate(tpl)}>Use Template <ArrowRight size={12} className="ml-1" /></Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
     </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col relative">
       <div className="flex items-center justify-between mb-4">
          <div className="flex p-1 bg-dark-900 rounded-lg border border-dark-700">
             <button onClick={() => setActiveView('editor')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeView === 'editor' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}><Network size={14} /> Designer</button>
             <button onClick={() => setActiveView('templates')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeView === 'templates' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}><LayoutTemplate size={14} /> Templates</button>
          </div>
       </div>

       <div className="flex-1 bg-dark-950 border border-dark-700 rounded-xl overflow-hidden shadow-2xl flex flex-col relative">
          {activeView === 'editor' ? renderEditor() : renderTemplatesView()}
          
          {/* Publish Toast */}
          {publishToast && (
              <div className="absolute bottom-8 right-8 bg-green-500 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[100]">
                  <CheckCircle size={20} />
                  <div>
                      <p className="font-bold text-sm">Published Successfully!</p>
                      <p className="text-xs opacity-90">Workflow is now active v1.0</p>
                  </div>
              </div>
          )}
       </div>

       {/* Test Run Modal */}
       {isTestModalOpen && (
           <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm animate-in fade-in">
               <div className="w-full max-w-lg bg-dark-900 border border-dark-700 rounded-xl shadow-2xl overflow-hidden">
                   <div className="p-4 border-b border-dark-700 bg-dark-950 flex justify-between items-center">
                       <h3 className="font-bold text-white flex items-center gap-2"><PlayCircle size={18} className="text-brand-400"/> Workflow Test Simulator</h3>
                       <button onClick={() => setIsTestModalOpen(false)} className="text-slate-500 hover:text-white"><X size={18}/></button>
                   </div>
                   <div className="p-6 bg-dark-900 min-h-[300px]">
                       <div className="space-y-4 font-mono text-xs">
                           {testSteps.map((step, i) => (
                               <div key={i} className="flex items-center gap-3 text-slate-300 animate-in slide-in-from-left-2">
                                   <span className="text-brand-500">➜</span> {step}
                               </div>
                           ))}
                           {testStatus === 'running' && (
                               <div className="flex items-center gap-2 text-slate-500 animate-pulse">
                                   <div className="w-2 h-2 bg-slate-500 rounded-full"></div> Processing...
                               </div>
                           )}
                           {testStatus === 'success' && (
                               <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 flex items-center gap-3 animate-in zoom-in">
                                   <CheckCircle size={24} />
                                   <div>
                                       <p className="font-bold text-sm">Test Completed Successfully</p>
                                       <p className="text-[10px] opacity-80">No logic errors or broken paths detected.</p>
                                   </div>
                               </div>
                           )}
                       </div>
                   </div>
                   <div className="p-4 border-t border-dark-700 bg-dark-950 flex justify-end">
                       <Button variant="secondary" onClick={() => setIsTestModalOpen(false)}>{testStatus === 'success' ? 'Close' : 'Cancel Test'}</Button>
                   </div>
               </div>
           </div>
       )}

       {/* Template Modal */}
       {showSaveModal && (
           <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
               <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
                   <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-800/50">
                       <h3 className="text-lg font-bold text-white flex items-center gap-2"><Save size={18} className="text-brand-400"/> {editingTemplateId ? 'Edit Template Metadata' : 'Save as New Template'}</h3>
                       <button onClick={() => setShowSaveModal(false)} className="text-slate-500 hover:text-white"><X size={18}/></button>
                   </div>
                   <div className="p-6 space-y-4">
                       <Input label="Template Name" value={templateForm.name} onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})} />
                       <Select label="Category" options={[{ label: 'General', value: 'General' }, { label: 'Legal', value: 'Legal' }, { label: 'Finance', value: 'Finance' }, { label: 'Sales', value: 'Sales' }, { label: 'Procurement', value: 'Procurement' }, { label: 'HR', value: 'HR' }]} value={templateForm.category} onChange={(e) => setTemplateForm({...templateForm, category: e.target.value})} />
                       <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label><textarea className="w-full rounded-lg bg-dark-950/50 border border-dark-700 px-3 py-2.5 text-sm text-white h-24 resize-none" value={templateForm.description} onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}></textarea></div>
                       <Input label="Tags (comma separated)" placeholder="e.g. NDA, Quick, Automated" value={templateForm.tags} onChange={(e) => setTemplateForm({...templateForm, tags: e.target.value})} />
                   </div>
                   <div className="p-4 border-t border-dark-700 bg-dark-800/30 flex justify-end gap-3">
                       <Button variant="ghost" onClick={() => setShowSaveModal(false)}>Cancel</Button>
                       <Button variant="primary" onClick={handleSaveTemplateSubmit}>{editingTemplateId ? 'Update Template' : 'Create Template'}</Button>
                   </div>
               </div>
           </div>
       )}

       {/* Stage Config Modal */}
       {showStageModal && (
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
             <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-800/50">
                   <h3 className="text-lg font-bold text-white flex items-center gap-2"><LayoutTemplate size={18} className="text-brand-400"/> {isEditingStage ? 'Edit Stage' : 'Add New Stage'}</h3>
                   <button onClick={() => setShowStageModal(false)} className="text-slate-500 hover:text-white"><X size={18}/></button>
                </div>
                <div className="p-6 space-y-4">
                   <Input label="Stage Name" value={stageForm.name} onChange={(e) => setStageForm({...stageForm, name: e.target.value})} placeholder="e.g. Legal Review" />
                   <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Stage Color Indicator</label>
                      <div className="grid grid-cols-4 gap-3">
                         {STAGE_COLORS.map(color => (
                            <button key={color.value} onClick={() => setStageForm({...stageForm, color: color.value})} className={`h-8 rounded-lg ${color.bg} opacity-80 hover:opacity-100 transition-all ring-2 ring-offset-2 ring-offset-dark-900 ${stageForm.color === color.value ? 'ring-white scale-110' : 'ring-transparent'}`} title={color.label}></button>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="p-4 border-t border-dark-700 bg-dark-800/30 flex justify-end gap-3">
                   <Button variant="ghost" onClick={() => setShowStageModal(false)}>Cancel</Button>
                   <Button variant="primary" onClick={handleSaveStage}>{isEditingStage ? 'Save Changes' : 'Create Stage'}</Button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default WorkflowBuilder;
