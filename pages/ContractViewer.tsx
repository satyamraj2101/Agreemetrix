
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Badge, Avatar, Input, Select, Card } from '../components/UIComponents';
import { MOCK_CONTRACTS, MOCK_VERSIONS, MOCK_OBLIGATIONS, MOCK_RISKS, MOCK_CLAUSES } from '../mock/data';
import { Contract, ContractStatus, Obligation } from '../types';
import { 
  ChevronLeft, Save, Share2, FileText, MoreVertical,
  MessageSquare, GitBranch, Sparkles, History, Database, 
  Check, X, Eye, Settings, Download, PenTool, ChevronDown,
  CheckCircle2, AlertTriangle, Calendar, DollarSign,
  User, Globe, Activity, Clock, Shield, ArrowRight,
  FileClock, Lock, Globe2, ExternalLink, Users, RefreshCw,
  Minimize2, Maximize2, BookOpen, LayoutTemplate, Scale,
  Printer, Mail, Flag, Bell, CreditCard, CheckSquare, Type, Briefcase,
  PieChart, AlignLeft, List, Link as LinkIcon, Building,
  Hash, Edit3, ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

// Imports for Editor
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { StructurePanel, ReviewPanel, CompliancePanel, AIPanel, LogicPanel, GovernancePanel, VariablesPanel, ClausesPanel, HistoryPanel } from '../components/editor/EditorPanels';
import { CollapsibleSection } from '../components/editor/EditorUI';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

// --- TYPES ---

type ViewTab = 'document' | 'signature' | 'overview' | 'workflow' | 'audit';
type LifecycleStage = 'Request' | 'Draft' | 'Review' | 'Negotiation' | 'Approval' | 'Sign' | 'Active';
type ViewerMode = 'Internal' | 'Guest_Portal';

const LIFECYCLE_STEPS: LifecycleStage[] = ['Request', 'Draft', 'Review', 'Negotiation', 'Approval', 'Sign', 'Active'];

// --- SUB-COMPONENTS ---

const LifecycleRibbon: React.FC<{ currentStage: LifecycleStage }> = ({ currentStage }) => {
    const currentIndex = LIFECYCLE_STEPS.indexOf(currentStage);
    
    return (
        <div className="flex items-center w-full bg-dark-900 border-b border-dark-800 px-6 py-0 h-12 overflow-x-auto custom-scrollbar shrink-0">
            {LIFECYCLE_STEPS.map((step, i) => {
                const isActive = i === currentIndex;
                const isPast = i < currentIndex;
                
                return (
                    <div key={step} className="flex items-center">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            isActive ? 'bg-brand-500 text-white shadow-[0_0_10px_rgba(var(--color-brand-500),0.4)]' : 
                            isPast ? 'text-brand-400' : 'text-slate-600'
                        }`}>
                            {isPast ? <CheckCircle2 size={14} /> : <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-slate-600'}`}></div>}
                            {step}
                        </div>
                        {i < LIFECYCLE_STEPS.length - 1 && (
                            <div className={`w-8 h-0.5 mx-2 ${isPast ? 'bg-brand-500/50' : 'bg-dark-700'}`}></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const AuditLogPanel: React.FC<{ contract: Contract }> = ({ contract }) => (
    <div className="h-full flex flex-col bg-dark-950 animate-in fade-in slide-in-from-right-2">
        <div className="p-4 border-b border-dark-800 bg-dark-900/50">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield size={16} className="text-brand-400"/> Immutable Audit Trail
            </h3>
            <p className="text-xs text-slate-500 mt-1">Legally admissible record of all activities.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="relative border-l-2 border-dark-800 ml-3 space-y-8">
                {(contract.auditLog || []).map((log, i) => (
                    <div key={log.id} className="relative pl-6 group">
                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-dark-950 border-2 border-slate-600 group-hover:border-brand-500 transition-colors"></div>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{log.action}</span>
                                <span className="text-xs text-slate-500 font-mono">{log.timestamp.split(' ')[1]}</span>
                            </div>
                            <p className="text-xs text-slate-400">{log.details}</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] bg-dark-800 px-1.5 py-0.5 rounded text-slate-500 border border-dark-700 flex items-center gap-1">
                                    <User size={8}/> {log.user}
                                </span>
                                <span className="text-[10px] bg-dark-800 px-1.5 py-0.5 rounded text-slate-500 border border-dark-700 flex items-center gap-1">
                                    <Globe size={8}/> {log.ipAddress}
                                </span>
                                {log.hash && (
                                    <span className="text-[10px] text-brand-500/50 font-mono" title="Merkle Hash">{log.hash}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- DETAILS PAGE COMPONENT (ContractOverview) ---

const ContractOverview: React.FC<{ contract: Contract }> = ({ contract }) => {
    const RISK_DATA = [
        { name: 'Low', value: 60, color: '#10b981' },
        { name: 'Medium', value: 30, color: '#eab308' },
        { name: 'High', value: 10, color: '#ef4444' },
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-dark-950 p-8 custom-scrollbar animate-in fade-in">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* 1. Header Card */}
                <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-brand-500/5 blur-3xl rounded-full -mr-12 -mt-12"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white">{contract.title}</h1>
                                <Badge color={contract.status === 'Active' ? 'green' : contract.status === 'Draft' ? 'gray' : 'purple'}>{contract.status}</Badge>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-slate-400">
                                <span className="flex items-center gap-2"><FileText size={16}/> {contract.type} Agreement</span>
                                <span className="flex items-center gap-2 font-mono"><Hash size={16}/> {contract.id}</span>
                                <span className="flex items-center gap-2"><Clock size={16}/> Last updated: Today</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" className="shadow-sm"><Share2 size={16} className="mr-2"/> Share</Button>
                            <Button variant="secondary" className="shadow-sm"><Printer size={16} className="mr-2"/> Export PDF</Button>
                            <Button variant="primary" className="shadow-lg shadow-brand-500/20"><Edit3 size={16} className="mr-2"/> Edit Contract</Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN - Key Info */}
                    <div className="space-y-6 lg:col-span-2">
                        
                        {/* Executive Summary */}
                        <Card title="Executive Summary" icon={Sparkles} action={<Badge color="brand">AI Generated</Badge>}>
                            <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                This <strong>{contract.type}</strong> establishes a strategic partnership with <strong>{contract.counterparty}</strong> for software services. 
                                Key focus areas include a <span className="text-white font-bold">$150k annual commitment</span> and rigorous data privacy compliance.
                                The agreement includes a standard <strong>Net 45</strong> payment term and mutual indemnification clauses.
                            </p>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dark-800">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Effective Date</p>
                                    <p className="text-white font-medium flex items-center gap-2"><Calendar size={14} className="text-brand-400"/> {contract.startDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Renewal Date</p>
                                    <p className="text-white font-medium flex items-center gap-2"><RefreshCw size={14} className="text-brand-400"/> {contract.renewalDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Jurisdiction</p>
                                    <p className="text-white font-medium flex items-center gap-2"><Scale size={14} className="text-brand-400"/> New York</p>
                                </div>
                            </div>
                        </Card>

                        {/* Financials & Obligations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card title="Financial Terms" icon={DollarSign}>
                                <div className="flex flex-col items-center justify-center py-6">
                                    <span className="text-4xl font-bold text-white mb-2">${contract.value.toLocaleString()}</span>
                                    <span className="text-xs text-slate-500 bg-dark-950 px-3 py-1 rounded-full border border-dark-800">Total Contract Value</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm border-b border-dark-800 pb-2">
                                        <span className="text-slate-400">Payment Terms</span>
                                        <span className="text-white">Net 45 Days</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-dark-800 pb-2">
                                        <span className="text-slate-400">Billing Cycle</span>
                                        <span className="text-white">Quarterly</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Renewal Cap</span>
                                        <span className="text-white">5% Increase</span>
                                    </div>
                                </div>
                            </Card>

                            <Card title="Active Obligations" icon={CheckSquare}>
                                <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                                    {(contract.obligations || []).map((ob, i) => (
                                        <div key={i} className="flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${ob.status === 'Completed' ? 'bg-green-500 border-green-500' : 'border-slate-600'}`}>
                                                {ob.status === 'Completed' && <Check size={10} className="text-white"/>}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${ob.status === 'Completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{ob.title}</p>
                                                <p className="text-xs text-slate-500">Due: {ob.dueDate}</p>
                                            </div>
                                            <Badge color={ob.priority === 'High' ? 'red' : 'gray'}>{ob.priority}</Badge>
                                        </div>
                                    ))}
                                    {(!contract.obligations || contract.obligations.length === 0) && (
                                        <p className="text-center text-slate-500 text-xs py-4">No active obligations.</p>
                                    )}
                                </div>
                                <Button variant="secondary" className="w-full mt-4 text-xs">View All Tasks</Button>
                            </Card>
                        </div>

                        {/* Clause Analysis */}
                        <Card title="Critical Clause Analysis" icon={BookOpen}>
                            <div className="space-y-4">
                                {MOCK_CLAUSES.slice(0,3).map((clause, i) => (
                                    <div key={i} className="p-3 bg-dark-950 border border-dark-800 rounded-xl hover:border-brand-500/30 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <h5 className="text-sm font-bold text-white">{clause.name}</h5>
                                            <Badge color={clause.riskLevel === 'High' ? 'red' : clause.riskLevel === 'Medium' ? 'yellow' : 'green'}>{clause.riskLevel} Risk</Badge>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2 italic border-l-2 border-dark-700 pl-3">"{clause.content}"</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN - Risks & Parties */}
                    <div className="space-y-6">
                        
                        {/* Risk Score */}
                        <Card title="Risk Assessment" icon={ShieldAlert} className="overflow-hidden relative">
                            <div className="flex flex-col items-center relative z-10">
                                <div className="relative w-40 h-40">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={RISK_DATA}
                                                innerRadius={60}
                                                outerRadius={75}
                                                paddingAngle={5}
                                                dataKey="value"
                                                startAngle={90}
                                                endAngle={-270}
                                            >
                                                {RISK_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </RePieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-3xl font-bold ${contract.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{contract.riskScore}</span>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Risk Score</span>
                                    </div>
                                </div>
                                <div className="w-full space-y-2 mt-4">
                                    {(MOCK_RISKS.filter(r => r.contractId === contract.id).length > 0 ? MOCK_RISKS.filter(r => r.contractId === contract.id) : [{description: 'No critical risks detected', severity: 'Low', id: '0'}]).map((risk, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs p-2 bg-dark-950 rounded border border-dark-800">
                                            <AlertTriangle size={12} className={risk.severity === 'High' || risk.severity === 'Critical' ? 'text-red-400' : 'text-green-400'}/>
                                            <span className="text-slate-300 flex-1 truncate">{risk.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Stakeholders */}
                        <Card title="Stakeholders" icon={Users}>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Internal Owner</p>
                                    <div className="flex items-center gap-3 p-2 bg-dark-950 rounded-lg border border-dark-800">
                                        <Avatar name={contract.owner} size="md"/>
                                        <div>
                                            <p className="text-sm font-bold text-white">{contract.owner}</p>
                                            <p className="text-xs text-slate-500">Legal Counsel</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Counterparty Contact</p>
                                    <div className="flex items-center gap-3 p-2 bg-dark-950 rounded-lg border border-dark-800">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/30">JD</div>
                                        <div>
                                            <p className="text-sm font-bold text-white">John Doe</p>
                                            <p className="text-xs text-slate-500">General Counsel, {contract.counterparty}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Counterparty Card */}
                        <Card title="Counterparty Info" icon={Building}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-black font-bold text-xl">
                                    {contract.counterparty.substring(0,2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{contract.counterparty}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Globe size={10}/> HQ: San Francisco, CA
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-dark-950 rounded border border-dark-800 text-center">
                                    <p className="text-[10px] text-slate-500">Active Contracts</p>
                                    <p className="text-lg font-bold text-white">3</p>
                                </div>
                                <div className="p-2 bg-dark-950 rounded border border-dark-800 text-center">
                                    <p className="text-[10px] text-slate-500">Total Spend</p>
                                    <p className="text-lg font-bold text-white">$450k</p>
                                </div>
                            </div>
                            <Button variant="secondary" className="w-full mt-4 text-xs">View Vendor Profile</Button>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SIGNATURE MODE COMPONENTS ---

const DraggableField: React.FC<{ label: string; icon: any; type: string }> = ({ label, icon: Icon, type }) => {
    return (
        <div 
            draggable 
            onDragStart={(e) => {
                e.dataTransfer.setData('field_type', type);
                e.dataTransfer.setData('field_label', label);
            }}
            className="flex items-center gap-3 p-3 bg-dark-900 border border-dark-700 rounded-lg cursor-grab active:cursor-grabbing hover:border-brand-500/50 hover:bg-brand-500/5 transition-all group"
        >
            <div className="p-1.5 bg-dark-800 rounded text-slate-400 group-hover:text-white group-hover:bg-brand-500 transition-colors">
                <Icon size={14} />
            </div>
            <span className="text-xs font-bold text-slate-300 group-hover:text-white">{label}</span>
        </div>
    );
};

const SignatureSetup: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [placedFields, setPlacedFields] = useState<{id: string, x: number, y: number, type: string, label: string}[]>([]);
    const docRef = useRef<HTMLDivElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('field_type');
        const label = e.dataTransfer.getData('field_label');
        if(!type || !docRef.current) return;

        const rect = docRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPlacedFields([...placedFields, { id: `f_${Date.now()}`, x, y, type, label }]);
    };

    return (
        <div className="flex h-full bg-dark-950 animate-in fade-in">
            {/* Tools Sidebar */}
            <div className="w-64 border-r border-dark-800 bg-dark-900 flex flex-col z-20 shadow-xl">
                <div className="p-5 border-b border-dark-800">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <PenTool size={16} className="text-brand-400"/> Signature Fields
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Drag fields onto the document.</p>
                </div>
                
                <div className="p-5 space-y-3 flex-1 overflow-y-auto">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Signer: Counterparty</div>
                    <DraggableField label="Signature" type="sign" icon={PenTool} />
                    <DraggableField label="Initials" type="initial" icon={Type} />
                    <DraggableField label="Date Signed" type="date" icon={Calendar} />
                    
                    <div className="h-px bg-dark-800 my-4"></div>
                    
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Signer: Internal</div>
                    <DraggableField label="Signature" type="sign" icon={PenTool} />
                    <DraggableField label="Name" type="text" icon={User} />
                    <DraggableField label="Title" type="text" icon={Briefcase} />
                </div>

                <div className="p-5 border-t border-dark-800 bg-dark-950/50">
                    <Button variant="primary" className="w-full shadow-lg shadow-brand-500/20" onClick={onComplete} disabled={placedFields.length === 0}>
                        Send Envelope <ArrowRight size={16} className="ml-2"/>
                    </Button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-dark-950/50 p-8 flex justify-center overflow-y-auto relative">
                <div 
                    ref={docRef}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="bg-white w-[816px] min-h-[1056px] shadow-2xl relative transition-transform origin-top"
                >
                    {/* Mock Content Background */}
                    <div className="absolute inset-0 p-16 opacity-30 pointer-events-none">
                        <div className="w-1/3 h-8 bg-slate-800 mb-8"></div>
                        <div className="space-y-4">
                            {Array.from({length: 20}).map((_, i) => (
                                <div key={i} className="w-full h-3 bg-slate-300 rounded"></div>
                            ))}
                        </div>
                    </div>

                    {/* Placed Fields */}
                    {placedFields.map(field => (
                        <div 
                            key={field.id}
                            className="absolute flex flex-col justify-center px-3 py-2 bg-yellow-100/80 border-2 border-yellow-500 border-dashed rounded cursor-move shadow-lg hover:scale-105 transition-transform"
                            style={{ left: field.x - 60, top: field.y - 20, width: 160, height: 50 }}
                        >
                            <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider flex items-center gap-1">
                                {field.type === 'sign' ? <PenTool size={10}/> : <Type size={10}/>} {field.label}
                            </span>
                            <div className="h-px bg-yellow-700/50 w-full mt-2"></div>
                            <button 
                                onClick={() => setPlacedFields(placedFields.filter(f => f.id !== field.id))}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                            >
                                <X size={12}/>
                            </button>
                        </div>
                    ))}

                    {placedFields.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-dark-900/80 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl border border-white/10 animate-bounce">
                                Drag signature fields here
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- ACTIVE MODE COMPONENTS ---

const ActiveContractDashboard: React.FC<{ contract: Contract }> = ({ contract }) => {
    const daysUntilRenewal = 45; // Mock calculation
    
    return (
        <div className="w-full bg-dark-900 border-b border-dark-800 animate-in slide-in-from-top-4">
            <div className="max-w-5xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity size={18} className="text-green-400"/> Contract Intelligence
                        </h2>
                        <p className="text-xs text-slate-500">Real-time monitoring of active terms.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="text-xs h-8"><Printer size={14} className="mr-2"/> Print Summary</Button>
                        <Button variant="primary" className="text-xs h-8"><RefreshCw size={14} className="mr-2"/> Sync ERP</Button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-dark-950 border border-dark-700 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full -mr-4 -mt-4 group-hover:scale-110 transition-transform"></div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Value</p>
                        <h3 className="text-2xl font-bold text-white font-mono">${contract.value.toLocaleString()}</h3>
                        <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1"><ArrowRight size={10} className="-rotate-45"/> On Budget</p>
                    </div>

                    <div className="p-4 bg-dark-950 border border-dark-700 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-full -mr-4 -mt-4 group-hover:scale-110 transition-transform"></div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Renewal In</p>
                        <h3 className="text-2xl font-bold text-white">{daysUntilRenewal} Days</h3>
                        <p className="text-[10px] text-yellow-400 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> Auto-Renews</p>
                    </div>

                    <div className="p-4 bg-dark-950 border border-dark-700 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full -mr-4 -mt-4 group-hover:scale-110 transition-transform"></div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Obligations</p>
                        <h3 className="text-2xl font-bold text-white">2 / 5</h3>
                        <p className="text-[10px] text-blue-400 mt-1 flex items-center gap-1"><CheckCircle2 size={10}/> Completed</p>
                    </div>

                    <div className="p-4 bg-dark-950 border border-dark-700 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full -mr-4 -mt-4 group-hover:scale-110 transition-transform"></div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Owner</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Avatar name={contract.owner} size="sm" />
                            <span className="text-sm font-bold text-white truncate">{contract.owner}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ObligationsPanel: React.FC<{ obligations: Obligation[] }> = ({ obligations }) => {
    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2 bg-dark-950">
            <CollapsibleSection title="Deliverables & Tasks" icon={CheckSquare} defaultOpen={true} rightElement={<Badge color="blue">{obligations.length}</Badge>}>
                <div className="space-y-3 mt-2">
                    {obligations.map(ob => (
                        <div key={ob.id} className="p-3 bg-dark-900 border border-dark-700 rounded-xl hover:border-brand-500/30 transition-all group">
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 p-1 rounded ${ob.status === 'Completed' ? 'bg-green-500 text-dark-900' : 'bg-dark-800 text-slate-500 border border-dark-600'}`}>
                                    <Check size={12} />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-xs font-bold ${ob.status === 'Completed' ? 'text-slate-500 line-through' : 'text-white'}`}>{ob.title}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className={`text-[10px] flex items-center gap-1 ${new Date(ob.dueDate) < new Date() && ob.status !== 'Completed' ? 'text-red-400' : 'text-slate-500'}`}>
                                            <Calendar size={10}/> {ob.dueDate}
                                        </span>
                                        <Badge color={ob.priority === 'High' ? 'red' : 'gray'} className="text-[9px] py-0 px-1.5">{ob.priority}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {obligations.length === 0 && <div className="text-center text-xs text-slate-500 py-4">No active obligations.</div>}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Financial Terms" icon={CreditCard} defaultOpen={true}>
                <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl space-y-3">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Payment Terms</span>
                        <span className="text-white font-mono">Net 45</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Penalty Rate</span>
                        <span className="text-white font-mono">1.5% / mo</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Renewal Cap</span>
                        <span className="text-white font-mono">5%</span>
                    </div>
                </div>
            </CollapsibleSection>
        </div>
    );
};

const NegotiationBanner: React.FC<{ isGuest: boolean }> = ({ isGuest }) => (
    <div className={`w-full px-6 py-2 flex justify-between items-center ${isGuest ? 'bg-orange-500/10 border-b border-orange-500/20' : 'bg-purple-500/10 border-b border-purple-500/20'}`}>
        <div className="flex items-center gap-2">
            {isGuest ? <Globe2 size={16} className="text-orange-400"/> : <Users size={16} className="text-purple-400"/>}
            <span className={`text-xs font-bold uppercase tracking-wider ${isGuest ? 'text-orange-400' : 'text-purple-400'}`}>
                {isGuest ? 'Guest Negotiation Portal' : 'Internal Team View'}
            </span>
        </div>
        {isGuest && <div className="text-xs text-orange-300/70">You are viewing as <strong>Acme Corp (Guest)</strong>. Internal notes are hidden.</div>}
    </div>
);

// --- MAIN COMPONENT ---

const ContractViewer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find Data
  const contract = MOCK_CONTRACTS.find(c => c.id === id) || MOCK_CONTRACTS[0];

  // State
  const [activeView, setActiveView] = useState<ViewTab>('document');
  const [lifecycleStage, setLifecycleStage] = useState<LifecycleStage>(contract.status as LifecycleStage || 'Draft');
  const [viewerMode, setViewerMode] = useState<ViewerMode>('Internal');
  const [ribbonTab, setRibbonTab] = useState('home');
  const [rightPanel, setRightPanel] = useState<'review' | 'history' | 'audit' | 'governance' | 'obligations'>('review');

  // Auto-set logic based on stage
  useEffect(() => {
      if (lifecycleStage === 'Sign') setActiveView('signature');
      else if (lifecycleStage === 'Active') {
          setActiveView('overview'); // Default to Overview for Active
          setRightPanel('obligations');
      } else {
          setActiveView('document');
          setRightPanel('review');
      }
  }, [lifecycleStage]);

  // Editor Hook (Simulated)
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Loading contract...' })],
    content: `<h1>${contract.type} Agreement</h1><p>Between <strong>Agreemetrix Inc.</strong> and <strong>${contract.counterparty}</strong>...</p>
    <p>This agreement is entered into on {{effective_date}}.</p>
    <h2>1. Services</h2>
    <p>Provider agrees to deliver services as outlined in Exhibit A.</p>
    <h2>2. Payment</h2>
    <p>Client shall pay all invoices within 30 days.</p>
    `,
    editable: viewerMode === 'Internal' && lifecycleStage !== 'Active' && lifecycleStage !== 'Sign', 
  });

  return (
    <div className={`h-[calc(100vh-8rem)] flex flex-col -m-6 bg-[#0F1115] text-slate-200 overflow-hidden border-t-4 ${viewerMode === 'Guest_Portal' ? 'border-orange-500' : 'border-transparent'}`}>
        
        {/* 1. GLOBAL HEADER */}
        <div className="h-16 bg-dark-950 border-b border-dark-700 flex items-center justify-between px-6 shrink-0 z-30 shadow-lg">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/repository')} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-white tracking-tight">{contract.title}</h1>
                        <Badge color={lifecycleStage === 'Active' ? 'green' : lifecycleStage === 'Negotiation' ? 'purple' : 'blue'}>{lifecycleStage}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                       <span className="font-mono opacity-70">{contract.id}</span>
                       <span>•</span>
                       <span className="flex items-center gap-1"><User size={10}/> {contract.counterparty}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {lifecycleStage !== 'Active' && lifecycleStage !== 'Sign' && (
                    <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-800 mr-4">
                        <button onClick={() => setViewerMode('Internal')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${viewerMode === 'Internal' ? 'bg-dark-800 text-white shadow' : 'text-slate-500'}`}>Internal</button>
                        <button onClick={() => setViewerMode('Guest_Portal')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${viewerMode === 'Guest_Portal' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-500'}`}>Simulate Guest</button>
                    </div>
                )}

                {lifecycleStage === 'Draft' && (
                    <Button variant="primary" className="h-9 text-xs shadow-lg shadow-brand-500/20" onClick={() => setLifecycleStage('Negotiation')}>
                        Send for Review <ArrowRight size={16} className="ml-2"/>
                    </Button>
                )}
                {lifecycleStage === 'Negotiation' && (
                    <Button variant="primary" className="h-9 text-xs shadow-lg shadow-brand-500/20" onClick={() => setLifecycleStage('Approval')}>
                        Submit for Approval <ArrowRight size={16} className="ml-2"/>
                    </Button>
                )}
                {lifecycleStage === 'Approval' && (
                    <Button variant="primary" className="h-9 text-xs shadow-lg shadow-brand-500/20" onClick={() => setLifecycleStage('Sign')}>
                        Prepare Signature <PenTool size={16} className="ml-2"/>
                    </Button>
                )}
                {lifecycleStage === 'Active' && (
                    <Button variant="secondary" className="h-9 text-xs">
                        <Download size={16} className="mr-2"/> Download Signed Copy
                    </Button>
                )}
            </div>
        </div>

        {/* 2. CONTEXT BAR */}
        <LifecycleRibbon currentStage={lifecycleStage} />
        {lifecycleStage === 'Negotiation' && <NegotiationBanner isGuest={viewerMode === 'Guest_Portal'} />}

        {/* 3. MAIN WORKSPACE */}
        <div className="flex-1 flex overflow-hidden relative">
            
            {/* LEFT: Navigation & Structure */}
            <div className="w-16 border-r border-dark-800 bg-dark-900 flex flex-col items-center py-4 gap-4 z-20 shrink-0">
                {[
                    { id: 'overview', icon: LayoutTemplate, label: 'Overview', disabled: false },
                    { id: 'document', icon: FileText, label: 'Editor', disabled: false },
                    { id: 'signature', icon: PenTool, label: 'Sign', disabled: lifecycleStage !== 'Sign' && lifecycleStage !== 'Active' },
                    { id: 'audit', icon: Shield, label: 'Audit', disabled: false },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        disabled={tab.disabled}
                        onClick={() => {
                            if(tab.id === 'audit') { setRightPanel('audit'); }
                            else { setActiveView(tab.id as ViewTab); }
                        }}
                        className={`p-3 rounded-xl transition-all group relative ${activeView === tab.id && rightPanel !== 'audit' ? 'bg-brand-500/20 text-brand-400' : 'text-slate-500 hover:text-white hover:bg-white/5'} ${tab.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title={tab.label}
                    >
                        <tab.icon size={20} />
                    </button>
                ))}
                <div className="h-px w-8 bg-dark-700 my-2"></div>
                <button onClick={() => setRightPanel('history')} className={`p-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 ${rightPanel === 'history' ? 'text-brand-400 bg-brand-500/10' : ''}`} title="History"><History size={20}/></button>
                {viewerMode === 'Internal' && <button onClick={() => setRightPanel('governance')} className={`p-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 ${rightPanel === 'governance' ? 'text-brand-400 bg-brand-500/10' : ''}`} title="Governance"><Scale size={20}/></button>}
                {lifecycleStage === 'Active' && <button onClick={() => setRightPanel('obligations')} className={`p-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 ${rightPanel === 'obligations' ? 'text-brand-400 bg-brand-500/10' : ''}`} title="Obligations"><CheckSquare size={20}/></button>}
            </div>

            {/* CENTER: Canvas */}
            <div className="flex-1 bg-dark-950 flex flex-col overflow-hidden relative">
                {activeView === 'overview' && <ContractOverview contract={contract} />}

                {activeView === 'document' && (
                    <>
                        {/* Ribbon only if Internal & Editing */}
                        {viewerMode === 'Internal' && lifecycleStage !== 'Active' && (
                            <EditorToolbar 
                                editor={editor} 
                                activeTab={ribbonTab as any} 
                                onTabChange={(t) => setRibbonTab(t)}
                                state={{zoom: 100, showRuler: true, showGrid: false, darkMode: false, trackChanges: true, redactionMode: false, viewMode: 'print'}}
                                actions={{ setZoom: ()=>{}, toggleRuler: ()=>{}, toggleGrid: ()=>{}, toggleDarkMode: ()=>{}, toggleTrackChanges: ()=>{}, toggleRedaction: ()=>{}, setViewMode: ()=>{}, addComment: ()=>{}, runGovernance: ()=>{}, exportDoc: ()=>{} }}
                            />
                        )}
                        
                        {/* Active Dashboard Header - Only show if in active stage AND not already in overview tab */}
                        {lifecycleStage === 'Active' && activeView === 'document' && <ActiveContractDashboard contract={contract} />}

                        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-dark-900/50" onClick={() => editor?.commands.focus()}>
                            <div className={`bg-white text-black shadow-2xl min-h-[1056px] w-[816px] transition-transform origin-top relative ${viewerMode === 'Guest_Portal' ? 'ring-8 ring-orange-500/20' : ''}`}>
                                {/* Watermark for Guest */}
                                {viewerMode === 'Guest_Portal' && (
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
                                        <div className="text-slate-100 text-9xl font-bold -rotate-45 opacity-50">EXTERNAL VIEW</div>
                                    </div>
                                )}
                                {/* Active Watermark */}
                                {lifecycleStage === 'Active' && (
                                    <div className="absolute top-12 right-12 border-4 border-green-600 text-green-600 p-2 rounded font-black text-xl opacity-80 rotate-12 pointer-events-none z-20">
                                        SIGNED & EXECUTED
                                    </div>
                                )}
                                <div className="relative z-10 p-16">
                                    <EditorContent editor={editor} className="prose prose-slate max-w-none focus:outline-none"/>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                
                {activeView === 'signature' && <SignatureSetup onComplete={() => { setLifecycleStage('Active'); setRightPanel('obligations'); setActiveView('overview'); }} />}
            </div>

            {/* RIGHT: Panels - Only show if NOT in overview (overview covers full width) */}
            {activeView !== 'overview' && (
                <div className="w-80 border-l border-dark-800 bg-dark-900 flex flex-col z-20 shrink-0 shadow-xl transition-all">
                    {rightPanel === 'review' && <ReviewPanel comments={viewerMode === 'Internal' ? [] : []} changes={[]} onAddComment={()=>{}} onAcceptChange={()=>{}} onRejectChange={()=>{}} />}
                    {rightPanel === 'audit' && <AuditLogPanel contract={contract} />}
                    {rightPanel === 'history' && <HistoryPanel />}
                    {rightPanel === 'governance' && viewerMode === 'Internal' && <GovernancePanel />}
                    {rightPanel === 'obligations' && <ObligationsPanel obligations={MOCK_OBLIGATIONS} />}
                </div>
            )}

        </div>
    </div>
  );
};

export default ContractViewer;