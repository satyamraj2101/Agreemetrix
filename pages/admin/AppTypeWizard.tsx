
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, Badge } from '../../components/UIComponents';
import { 
  ArrowRight, CheckCircle2, LayoutTemplate, 
  GitBranch, FileText, Shield, ArrowLeft, Save, Box, AlertTriangle,
  Wand2, Sparkles
} from 'lucide-react';
import { MOCK_TEMPLATES, INITIAL_TEMPLATES } from '../../mock/data';

const AppTypeWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    workflowId: '',
    templateId: '',
    sensitivity: 'Confidential',
    industry: 'Technology'
  });

  const steps = [
    { id: 1, label: 'Metadata', icon: Box },
    { id: 2, label: 'Workflow Map', icon: GitBranch },
    { id: 3, label: 'Default Template', icon: FileText },
    { id: 4, label: 'Review', icon: Shield },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleCreate();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/admin/application-types');
  };

  const handleCreate = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        // Navigate to the detail studio for the "new" item (mocked)
        navigate('/admin/application-types/at_new_created');
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-dark-950 p-6">
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create Application Type</h1>
          <p className="text-slate-400">Configure a new contract request lifecycle with safe defaults.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step === s.id ? 'border-brand-500 bg-brand-500/20 text-brand-400 shadow-[0_0_15px_rgba(var(--color-brand-500),0.3)]' : 
                  step > s.id ? 'border-green-500 bg-green-500/20 text-green-400' :
                  'border-dark-700 bg-dark-900'
                }`}>
                  {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                </div>
                <span className={`text-sm font-bold ${step === s.id ? 'text-brand-400' : ''}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-16 h-0.5 ${step > s.id ? 'bg-green-500/50' : 'bg-dark-700'}`} />}
            </div>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[400px] relative">
            {/* AI Helper Button */}
            <div className="absolute top-6 right-6">
                <button className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-full hover:bg-purple-500/20 transition-colors">
                    <Sparkles size={14}/> AI Assist
                </button>
            </div>

            <div className="flex-1 p-10">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-6">
                            <Input 
                                label="Application Name" 
                                placeholder="e.g. Vendor NDA Request" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                autoFocus
                            />
                            <Input 
                                label="Unique Key (API)" 
                                placeholder="VEND_NDA_REQ" 
                                className="font-mono"
                                value={formData.key}
                                onChange={e => setFormData({...formData, key: e.target.value.toUpperCase()})}
                            />
                        </div>
                        <Input 
                            label="Description" 
                            placeholder="Purpose of this request type..." 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                        <div className="grid grid-cols-2 gap-6">
                            <Select 
                                label="Data Sensitivity" 
                                options={[{label: 'Public', value: 'Public'}, {label: 'Confidential', value: 'Confidential'}, {label: 'Restricted', value: 'Restricted'}]}
                                value={formData.sensitivity}
                                onChange={e => setFormData({...formData, sensitivity: e.target.value})}
                            />
                            <Select 
                                label="Industry / Domain" 
                                options={[{label: 'Technology', value: 'Technology'}, {label: 'Healthcare', value: 'Healthcare'}, {label: 'Finance', value: 'Finance'}]}
                                value={formData.industry}
                                onChange={e => setFormData({...formData, industry: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                            <h4 className="font-bold text-blue-100 text-sm mb-1">Workflow Routing</h4>
                            <p className="text-xs text-blue-200/70">Select the primary approval flow. You can add conditional logic later.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {INITIAL_TEMPLATES.map(wf => (
                                <div 
                                    key={wf.id}
                                    onClick={() => setFormData({...formData, workflowId: wf.id})}
                                    className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.workflowId === wf.id ? 'bg-brand-500/10 border-brand-500 ring-1 ring-brand-500/50' : 'bg-dark-950 border-dark-700 hover:border-slate-500'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-bold text-white">{wf.name}</span>
                                        {formData.workflowId === wf.id && <CheckCircle2 size={16} className="text-brand-400"/>}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">{wf.description}</p>
                                    <div className="mt-3 flex gap-2">
                                        <Badge color="blue" className="text-[9px]">{wf.schema.nodes.length} Steps</Badge>
                                        <Badge color="gray" className="text-[9px]">{wf.category}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Input 
                                label="Search Templates" 
                                placeholder="Filter by name..." 
                                className="bg-dark-950"
                            />
                            <Button variant="secondary" className="mt-6">Import New</Button>
                        </div>
                        
                        <div className="h-64 overflow-y-auto custom-scrollbar border border-dark-700 rounded-xl bg-dark-950">
                            {MOCK_TEMPLATES.map(tpl => (
                                <div 
                                    key={tpl.id}
                                    onClick={() => setFormData({...formData, templateId: tpl.id})}
                                    className={`p-4 border-b border-dark-800 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between ${formData.templateId === tpl.id ? 'bg-brand-500/5' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} className={formData.templateId === tpl.id ? 'text-brand-400' : 'text-slate-500'}/>
                                        <div>
                                            <p className="text-sm font-bold text-white">{tpl.name}</p>
                                            <p className="text-xs text-slate-500">v{tpl.version} • {tpl.category}</p>
                                        </div>
                                    </div>
                                    {formData.templateId === tpl.id && <Badge color="brand">Selected</Badge>}
                                </div>
                            ))}
                        </div>
                        
                        {formData.templateId && (
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                                <AlertTriangle size={16} className="text-yellow-500 mt-0.5"/>
                                <p className="text-xs text-yellow-200">
                                    <strong>Health Check:</strong> Selected template has 3 unbound variables. You will need to map these in the Form Builder step.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-dark-950 p-4 rounded-xl border border-dark-700">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">General</h4>
                                <p className="text-lg font-bold text-white mb-1">{formData.name}</p>
                                <p className="text-xs text-slate-400 font-mono mb-2">{formData.key}</p>
                                <Badge color="purple">{formData.sensitivity}</Badge>
                            </div>
                            <div className="bg-dark-950 p-4 rounded-xl border border-dark-700">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Config</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Workflow</span>
                                        <span className="text-white">Global Procurement</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Template</span>
                                        <span className="text-white">Standard MSA v4</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Status</span>
                                        <span className="text-yellow-400">Draft Mode</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex gap-3">
                            <CheckCircle2 size={24} className="text-green-400 shrink-0"/>
                            <div>
                                <h4 className="font-bold text-green-400 text-sm mb-1">Configuration Valid</h4>
                                <p className="text-xs text-green-200/70">
                                    Core requirements met. Click "Create & Configure" to open the full App Studio for advanced setup (Form Builder, Notifications, Actions).
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-dark-950 border-t border-dark-700 flex justify-between items-center">
                <Button variant="ghost" onClick={handleBack} className="text-slate-400 hover:text-white">
                    <ArrowLeft size={16} className="mr-2"/> Back
                </Button>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => navigate('/admin/application-types')}>Cancel</Button>
                    <Button variant="primary" onClick={handleNext} className="min-w-[140px] shadow-lg shadow-brand-500/20" disabled={loading}>
                        {loading ? 'Creating...' : step === 4 ? 'Create & Open Studio' : 'Next Step'} 
                        {!loading && step < 4 && <ArrowRight size={16} className="ml-2"/>}
                        {!loading && step === 4 && <Wand2 size={16} className="ml-2"/>}
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AppTypeWizard;
