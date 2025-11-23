
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, Badge, Avatar } from '../components/UIComponents';
import { 
  FileText, ArrowRight, Sparkles, CheckCircle2, Users, 
  Settings, ChevronRight, Bot, Braces, LayoutTemplate,
  ArrowLeft, Calendar, DollarSign, MapPin
} from 'lucide-react';
import { MOCK_TEMPLATES, MOCK_USERS } from '../mock/data';

const ContractCreationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    counterparty: 'TechFlow Inc',
    effectiveDate: '2024-04-01',
    value: '150000',
    jurisdiction: 'New York',
    paymentTerms: 'Net 30',
    owner: 'Harvey Specter'
  });

  const steps = [
    { id: 1, label: 'Select Template', icon: LayoutTemplate },
    { id: 2, label: 'Map Variables', icon: Braces },
    { id: 3, label: 'Review & Setup', icon: Settings },
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/contract/CTR-2024-003'); // Use a specific mock ID that is in Draft to simulate new contract
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Contract</h1>
          <p className="text-slate-400">Turn your request into a structured draft.</p>
        </div>
        
        {/* Stepper */}
        <div className="flex items-center gap-4">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  step === s.id ? 'border-brand-500 bg-brand-500/20 text-brand-400 shadow-[0_0_10px_rgba(var(--color-brand-500),0.3)]' : 
                  step > s.id ? 'border-green-500 bg-green-500/20 text-green-400' :
                  'border-dark-700 bg-dark-900'
                }`}>
                  {step > s.id ? <CheckCircle2 size={16} /> : <s.icon size={16} />}
                </div>
                <span className={`text-sm font-medium ${step === s.id ? 'text-brand-400' : ''}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-12 h-0.5 ${step > s.id ? 'bg-green-500/50' : 'bg-dark-700'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl mb-6">
                <Sparkles size={20} className="text-brand-400" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">AI Recommendation</h4>
                  <p className="text-xs text-slate-300">Based on your request for a "Software Agreement", we recommend the <strong>SaaS MSA v4.0</strong>.</p>
                </div>
                <Button variant="primary" className="text-xs h-8" onClick={() => setSelectedTemplate('tpl_2')}>Select Recommended</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_TEMPLATES.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-6 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 ${
                      selectedTemplate === t.id 
                        ? 'bg-brand-500/10 border-brand-500 ring-1 ring-brand-500/50' 
                        : 'bg-dark-950 border-dark-800 hover:border-brand-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-dark-900 rounded-lg text-slate-300">
                        <FileText size={24} />
                      </div>
                      {selectedTemplate === t.id && <CheckCircle2 size={20} className="text-brand-400" />}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{t.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">{t.category} • Last updated {t.lastModified}</p>
                    <div className="flex gap-2">
                      {t.tags?.map(tag => (
                        <Badge key={tag} color="gray" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Variable Mapping */}
          {step === 2 && (
            <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-4">
              <div className="col-span-8 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Braces size={20} className="text-brand-400"/> Map Variables
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <Input label="Counterparty Name" value={formData.counterparty} onChange={e => setFormData({...formData, counterparty: e.target.value})} />
                  <Input label="Effective Date" type="date" value={formData.effectiveDate} onChange={e => setFormData({...formData, effectiveDate: e.target.value})} />
                  <div className="relative">
                    <span className="absolute left-3 top-[33px] text-slate-500 text-sm">$</span>
                    <Input label="Total Contract Value" className="pl-7" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                  </div>
                  <Select label="Jurisdiction" options={[{label:'New York', value:'New York'}, {label:'California', value:'California'}]} value={formData.jurisdiction} onChange={e => setFormData({...formData, jurisdiction: e.target.value})} />
                  <Select label="Payment Terms" options={[{label:'Net 30', value:'Net 30'}, {label:'Net 45', value:'Net 45'}]} value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: e.target.value})} />
                </div>
              </div>
              
              <div className="col-span-4 bg-dark-950 border border-dark-800 rounded-xl p-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><Bot size={14}/> AI Extracted Values</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-dark-900 rounded-lg border border-dark-700 hover:border-brand-500/30 transition-colors cursor-pointer group" onClick={() => setFormData({...formData, paymentTerms: 'Net 45'})}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-slate-400">Payment Term</span>
                      <ArrowRight size={12} className="text-slate-600 group-hover:text-brand-400"/>
                    </div>
                    <div className="text-sm font-bold text-white mt-1">Net 45</div>
                    <div className="text-[10px] text-slate-500 mt-1">Found in "term_sheet.pdf"</div>
                  </div>
                  <div className="p-3 bg-dark-900 rounded-lg border border-dark-700 hover:border-brand-500/30 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-slate-400">Renewal Notice</span>
                      <ArrowRight size={12} className="text-slate-600 group-hover:text-brand-400"/>
                    </div>
                    <div className="text-sm font-bold text-white mt-1">60 Days</div>
                    <div className="text-[10px] text-slate-500 mt-1">Found in "email_thread.txt"</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Setup */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-dark-950 border border-dark-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FileText size={18} className="text-brand-400"/> Contract Summary</h3>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div className="space-y-1">
                            <span className="text-slate-500 text-xs uppercase font-bold">Template</span>
                            <p className="text-white">SaaS Master Services Agreement v4.0</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-500 text-xs uppercase font-bold">Counterparty</span>
                            <div className="flex items-center gap-2">
                                <Avatar name={formData.counterparty} size="sm" className="w-6 h-6 text-[10px]"/>
                                <p className="text-white">{formData.counterparty}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-500 text-xs uppercase font-bold">Effective Date</span>
                            <div className="flex items-center gap-2 text-slate-300">
                                <Calendar size={14}/> {formData.effectiveDate}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-500 text-xs uppercase font-bold">Contract Value</span>
                            <div className="flex items-center gap-2 text-slate-300">
                                <DollarSign size={14}/> {formData.value}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-500 text-xs uppercase font-bold">Jurisdiction</span>
                            <div className="flex items-center gap-2 text-slate-300">
                                <MapPin size={14}/> {formData.jurisdiction}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-950 border border-dark-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Users size={18} className="text-blue-400"/> Ownership & Workflow</h3>
                    <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-dark-700 mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar name={formData.owner} size="md" />
                            <div>
                                <p className="text-sm font-bold text-white">{formData.owner}</p>
                                <p className="text-xs text-slate-500">Primary Owner</p>
                            </div>
                        </div>
                        <Button variant="secondary" className="text-xs h-7">Change</Button>
                    </div>
                    
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-500 uppercase">Auto-assigned Workflow: <span className="text-blue-400">Standard High-Value Approval</span></p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <div className="px-3 py-1 bg-dark-900 rounded border border-dark-700">Draft</div>
                            <ArrowRight size={12}/>
                            <div className="px-3 py-1 bg-dark-900 rounded border border-dark-700">Legal Review</div>
                            <ArrowRight size={12}/>
                            <div className="px-3 py-1 bg-dark-900 rounded border border-dark-700">Finance Approval</div>
                            <ArrowRight size={12}/>
                            <div className="px-3 py-1 bg-dark-900 rounded border border-dark-700">Sign</div>
                        </div>
                    </div>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-1">
                 <div className="sticky top-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Live Preview</h4>
                    <div className="bg-white text-black p-6 rounded-lg shadow-xl text-[9px] font-serif leading-relaxed opacity-90 h-[500px] overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 pointer-events-none"></div>
                        <h1 className="text-lg font-bold mb-4 text-center uppercase">Master Services Agreement</h1>
                        <p className="mb-3">This Master Services Agreement (the "Agreement") is entered into as of <strong className="bg-yellow-100 px-1">{formData.effectiveDate}</strong> by and between <strong>Agreemetrix Inc.</strong> and <strong className="bg-yellow-100 px-1">{formData.counterparty}</strong>.</p>
                        <p className="mb-3"><strong>1. Services.</strong> Provider agrees to perform services as defined in...</p>
                        <p className="mb-3"><strong>2. Payment.</strong> Client shall pay fees within <strong className="bg-yellow-100 px-1">{formData.paymentTerms}</strong> of invoice date...</p>
                        <p className="mb-3"><strong>3. Term.</strong> This Agreement shall commence on the Effective Date...</p>
                        <p className="mb-3"><strong>4. Governing Law.</strong> This Agreement shall be governed by the laws of <strong className="bg-yellow-100 px-1">{formData.jurisdiction}</strong>.</p>
                    </div>
                 </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 bg-dark-950 border-t border-dark-700 flex justify-between items-center">
          <Button variant="ghost" onClick={handleBack} className="text-slate-400 hover:text-white">
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <div className="flex items-center gap-2">
             {step === 3 && <span className="text-xs text-slate-500 mr-4">Draft will be saved to <strong className="text-white">Repository / Drafts</strong></span>}
             <Button variant="primary" onClick={handleNext} disabled={step === 1 && !selectedTemplate} className="min-w-[140px] shadow-lg shadow-brand-500/20">
               {step === 3 ? 'Generate Contract' : 'Next Step'} <ArrowRight size={16} className="ml-2"/>
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractCreationWizard;
