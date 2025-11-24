
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Input, Select, Badge, Switch } from '../components/UIComponents';
import { 
  ArrowLeft, Save, Plus, Trash2, GripVertical, ChevronDown, ChevronRight, 
  Play, ShieldCheck, FileText, Zap, GitBranch, AlertCircle 
} from 'lucide-react';
import { INITIAL_STAGES, INITIAL_TEMPLATES } from '../mock/data';
import { WorkflowNode, WorkflowStageDefinition } from '../types';

const ManualWorkflowEditor: React.FC = () => {
  const { id } = useParams();
  
  // Find template by ID or fallback to the first one
  const initialTemplate = id ? (INITIAL_TEMPLATES.find(t => t.id === id) || INITIAL_TEMPLATES[0]) : INITIAL_TEMPLATES[0];

  const [template, setTemplate] = useState(initialTemplate);
  const [nodes, setNodes] = useState<WorkflowNode[]>(template.schema.nodes);
  const [stages, setStages] = useState<WorkflowStageDefinition[]>(template.schema.stages);
  
  // Re-hydrate if ID changes (e.g. navigation)
  useEffect(() => {
      if (id) {
          const found = INITIAL_TEMPLATES.find(t => t.id === id);
          if (found) {
              setTemplate(found);
              setNodes(found.schema.nodes);
              setStages(found.schema.stages);
          }
      }
  }, [id]);

  // Sort nodes by stage for linear view (simplified logic)
  const nodesByStage = stages.map(stage => ({
    stage,
    nodes: nodes.filter(n => n.config.stageId === stage.id)
  }));

  // Handle Adding Node
  const addNode = (stageId: string) => {
    const newNode: WorkflowNode = {
      id: `n_${Date.now()}`,
      category: 'action',
      type: 'generic_action',
      label: 'New Action',
      x: 0, y: 0,
      config: { stageId }
    };
    setNodes([...nodes, newNode]);
  };

  // Handle Node Update
  const updateNode = (id: string, field: string, value: any) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const updateNodeConfig = (id: string, field: string, value: any) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, config: { ...n.config, [field]: value } } : n));
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-dark-950">
      {/* Header */}
      <div className="h-16 border-b border-dark-700 bg-dark-900 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/workflows/manage" className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              {template.name} <Badge color="yellow">Draft Mode</Badge>
            </h1>
            <p className="text-xs text-slate-500">Manual Configuration Editor</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost">Discard Changes</Button>
          <Button variant="primary" className="shadow-lg shadow-brand-500/20">
            <Save size={16} className="mr-2"/> Save Workflow
          </Button>
        </div>
      </div>

      {/* Content - Linear List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 max-w-5xl mx-auto w-full">
        
        {/* Global Settings */}
        <Card className="mb-8 border-l-4 border-l-brand-500">
          <div className="grid grid-cols-2 gap-6">
            <Input label="Workflow Name" value={template.name} onChange={()=>{}} />
            <Select label="Category" options={[{label:'NDA', value:'NDA'}, {label:'MSA', value:'MSA'}]} value={template.category} onChange={()=>{}} />
            <div className="col-span-2">
              <Input label="Description" value={template.description} onChange={()=>{}} />
            </div>
          </div>
        </Card>

        {/* Stages & Steps */}
        <div className="space-y-8 relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-800 z-0"></div>
          
          {nodesByStage.map(({ stage, nodes: stageNodes }, stageIdx) => (
            <div key={stage.id} className="relative z-10">
              {/* Stage Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-dark-900 border-4 border-dark-950 flex items-center justify-center font-bold text-white shadow-lg" style={{backgroundColor: stage.color}}>
                  {stageIdx + 1}
                </div>
                <div className="flex-1 p-4 bg-dark-900 border border-dark-700 rounded-xl flex justify-between items-center shadow-md">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{stage.name} Phase</h3>
                    <p className="text-xs text-slate-500">Lifecycle Stage Configuration</p>
                  </div>
                  <Badge color="gray">{stageNodes.length} Steps</Badge>
                </div>
              </div>

              {/* Nodes List */}
              <div className="pl-16 space-y-4">
                {stageNodes.map((node, nodeIdx) => (
                  <div key={node.id} className="bg-dark-900/50 border border-dark-700 rounded-xl overflow-hidden transition-all hover:border-dark-600 hover:bg-dark-900 group">
                    {/* Node Header */}
                    <div className="p-4 flex items-center gap-4 border-b border-dark-800/50">
                      <div className="cursor-grab text-slate-600 hover:text-slate-400"><GripVertical size={16}/></div>
                      <div className={`p-2 rounded-lg bg-dark-950 border border-dark-800`}>
                        {node.category === 'trigger' ? <Play size={16} className="text-green-400"/> : 
                         node.category === 'approval' ? <ShieldCheck size={16} className="text-blue-400"/> :
                         node.category === 'document' ? <FileText size={16} className="text-purple-400"/> :
                         <Zap size={16} className="text-yellow-400"/>}
                      </div>
                      <div className="flex-1">
                        <input 
                          className="bg-transparent text-sm font-bold text-white outline-none w-full"
                          value={node.label}
                          onChange={(e) => updateNode(node.id, 'label', e.target.value)}
                        />
                        <div className="text-[10px] text-slate-500 font-mono uppercase">{node.type}</div>
                      </div>
                      <button onClick={() => deleteNode(node.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    </div>

                    {/* Config Form */}
                    <div className="p-4 bg-dark-950/30 grid grid-cols-2 gap-4">
                       <div className="col-span-2">
                          <Input 
                            label="Description" 
                            className="bg-dark-950 h-8 text-xs" 
                            value={node.config.description || ''} 
                            onChange={(e) => updateNodeConfig(node.id, 'description', e.target.value)}
                            placeholder="Describe what this step does..."
                          />
                       </div>
                       
                       {node.category === 'approval' && (
                          <>
                             <Select 
                                label="Approver Type" 
                                className="bg-dark-950 h-8 text-xs"
                                options={[{label:'User', value:'user'}, {label:'Role', value:'role'}, {label:'Group', value:'group'}]}
                                value={node.config.approverType || 'role'}
                                onChange={(e) => updateNodeConfig(node.id, 'approverType', e.target.value)}
                             />
                             <Select 
                                label="Assignment" 
                                className="bg-dark-950 h-8 text-xs"
                                options={[{label:'Legal Team', value:'Legal'}, {label:'CFO', value:'CFO'}]}
                                value={node.config.approverId || ''}
                                onChange={(e) => updateNodeConfig(node.id, 'approverId', e.target.value)}
                             />
                          </>
                       )}

                       {node.category === 'document' && (
                          <div className="col-span-2">
                             <Select 
                                label="Document Template" 
                                className="bg-dark-950 h-8 text-xs"
                                options={[{label:'Standard NDA', value:'tpl_1'}, {label:'MSA v4', value:'tpl_2'}]}
                                value={node.config.templateId || ''}
                                onChange={(e) => updateNodeConfig(node.id, 'templateId', e.target.value)}
                             />
                          </div>
                       )}
                    </div>
                  </div>
                ))}

                {/* Add Step Button */}
                <button 
                  onClick={() => addNode(stage.id)}
                  className="w-full py-3 border-2 border-dashed border-dark-800 rounded-xl text-xs font-bold text-slate-500 hover:text-brand-400 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14}/> Add Step to {stage.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManualWorkflowEditor;
