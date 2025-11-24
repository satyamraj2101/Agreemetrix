
import React, { useState } from 'react';
import { 
    FileText, Filter, MessageCircle, CheckCircle2, ThumbsUp, ShieldAlert, 
    Sparkles, ArrowRight, Workflow, List, AlertTriangle, Scale, Check, X, 
    Activity, Plus, Search, MoreVertical, RotateCcw, Clock, Braces, 
    Type, Hash, Calendar, GripVertical, BookOpen, Tag, FileCode, Link as LinkIcon,
    Trash2, Edit2, Save, GitBranch, ChevronDown
} from 'lucide-react';
import { Input, Button, CollapsibleSection, Select } from './EditorUI';
import { Badge, Avatar } from '../UIComponents';
import { Editor } from '@tiptap/react';
import { MOCK_CLAUSES, MOCK_VARIABLES, MOCK_VERSIONS } from '../../mock/data';

// --- TYPES ---
export interface OutlineItem {
    text: string;
    level: number;
    pos: number;
}

interface PanelProps {
    editor?: Editor | null;
    data?: any;
    onClose?: () => void;
}

export const StructurePanel: React.FC<PanelProps & { outline: OutlineItem[] }> = ({ editor, outline }) => (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 bg-dark-950">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <CollapsibleSection title="Document Outline" icon={List} defaultOpen={true}>
                <div className="space-y-1 mt-2">
                    {outline.length > 0 ? outline.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => {
                                if (editor) {
                                    editor.chain().focus().setTextSelection({ from: item.pos, to: item.pos }).run();
                                }
                            }} 
                            className="w-full text-left py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 truncate flex items-center gap-2 group transition-colors"
                            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                        >
                            <div className="w-1 h-1 bg-dark-700 rounded-full group-hover:bg-brand-500 transition-colors shrink-0"></div>
                            <span className="truncate">{item.text}</span>
                        </button>
                    )) : (
                        <div className="text-center text-xs text-slate-500 py-4 italic">No structure detected.</div>
                    )}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Metadata" icon={FileCode} defaultOpen={true}>
                <div className="bg-dark-900 p-3 rounded-lg border border-dark-700">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Author</span> <span className="text-slate-200">Harvey S.</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Created</span> <span className="text-slate-200">Oct 12, 2023</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Version</span> <span className="text-brand-400 font-bold">2.2 (Draft)</span>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>
        </div>
    </div>
);

export const VariablesPanel: React.FC<{ editor: Editor | null }> = ({ editor }) => {
    const [search, setSearch] = useState('');

    const insertVariable = (key: string) => {
        if (editor) {
            editor.chain().focus().insertContent(`<span class="variable" data-id="${key}" style="background-color: rgba(20, 184, 166, 0.2); padding: 0 4px; border-radius: 4px; border: 1px solid rgba(20, 184, 166, 0.4); color: #14b8a6; font-family: monospace;">{{${key}}}</span> `).run();
        }
    };

    const filteredVars = MOCK_VARIABLES.filter(v => 
        v.label.toLowerCase().includes(search.toLowerCase()) || 
        v.key.toLowerCase().includes(search.toLowerCase())
    );

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'date': return <Calendar size={12}/>;
            case 'number': 
            case 'currency': return <Hash size={12}/>;
            case 'select': return <List size={12}/>;
            default: return <Type size={12}/>;
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 bg-dark-950">
            <div className="p-4 border-b border-dark-800 shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Variables</h4>
                    <button className="text-xs text-brand-400 hover:text-white flex items-center gap-1"><Plus size={12}/> New</button>
                </div>
                <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                    <input 
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg py-1.5 pl-8 pr-2 text-xs text-white focus:border-brand-500 outline-none"
                        placeholder="Search variables..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <CollapsibleSection title="Defined Variables" icon={Braces} defaultOpen={true}>
                    <div className="space-y-1">
                        {filteredVars.map((v, i) => (
                            <div key={v.key} className="group flex items-center justify-between p-2 rounded-lg hover:bg-dark-900 border border-transparent hover:border-dark-700 transition-all cursor-default">
                                <div className="flex items-start gap-3 overflow-hidden">
                                    <div className="mt-0.5 text-slate-500 bg-dark-800 p-1.5 rounded border border-dark-700">
                                        {getTypeIcon(v.type)}
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <span className="text-xs font-bold text-slate-200 truncate">{v.label}</span>
                                        <span className="text-[10px] font-mono text-slate-500 truncate">{`{{${v.key}}}`}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => insertVariable(v.key)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 rounded transition-all"
                                    title="Insert Variable"
                                >
                                    <Plus size={14}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
};

export const ClausesPanel: React.FC<{ editor: Editor | null }> = ({ editor }) => {
    const [search, setSearch] = useState('');
    
    const insertClause = (clause: any) => {
        if (editor) {
            editor.chain().focus().insertContent(`
                <div class="clause-block" style="margin: 1em 0; padding: 1em; background: rgba(30, 41, 59, 0.5); border-left: 3px solid #64748b; border-radius: 4px;">
                    <p><strong>${clause.name}</strong></p>
                    <p>${clause.content}</p>
                </div>
                <p></p>
            `).run();
        }
    };

    const filteredClauses = MOCK_CLAUSES.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 bg-dark-950">
            <div className="p-4 border-b border-dark-800 shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Clause Library</h4>
                    <button className="text-xs text-brand-400 hover:text-white flex items-center gap-1"><BookOpen size={12}/> Manage</button>
                </div>
                <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                    <input 
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg py-1.5 pl-8 pr-2 text-xs text-white focus:border-brand-500 outline-none"
                        placeholder="Search playbook..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <CollapsibleSection title="Playbook Clauses" icon={BookOpen} defaultOpen={true}>
                    <div className="space-y-3">
                        {filteredClauses.map((clause) => (
                            <div key={clause.id} className="bg-dark-900 border border-dark-700 rounded-xl p-3 hover:border-brand-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-white">{clause.name}</span>
                                    <Badge color="gray" className="text-[9px] px-1.5">{clause.category}</Badge>
                                </div>
                                <p className="text-[10px] text-slate-400 line-clamp-3 mb-3 italic leading-relaxed">
                                    "{clause.content}"
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1">
                                        {clause.riskLevel === 'High' && <Badge color="red" className="text-[9px] py-0">High Risk</Badge>}
                                    </div>
                                    <button 
                                        onClick={() => insertClause(clause)}
                                        className="text-[10px] font-bold bg-dark-800 hover:bg-brand-500 hover:text-white text-slate-300 px-2 py-1 rounded border border-dark-700 hover:border-brand-500 transition-colors flex items-center gap-1"
                                    >
                                        <Plus size={10}/> Insert
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
};

export const HistoryPanel: React.FC = () => {
    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 bg-dark-950">
            <CollapsibleSection title="Version Timeline" icon={Clock} defaultOpen={true}>
                <div className="relative pl-4 border-l border-dark-800 space-y-8 mt-2">
                    {MOCK_VERSIONS.map((version, i) => (
                        <div key={version.id} className="relative group">
                            <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-dark-950 ${i === 0 ? 'bg-brand-500' : 'bg-dark-600 group-hover:bg-slate-400'} transition-colors`}></div>
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-bold ${i === 0 ? 'text-white' : 'text-slate-300'}`}>{version.name}</span>
                                    {i === 0 && <Badge color="brand" className="text-[8px] py-0 px-1">Current</Badge>}
                                </div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <Clock size={10}/> {version.date}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Avatar name={version.author} size="sm" className="w-4 h-4 text-[8px]"/>
                                    <span className="text-[10px] text-slate-400">{version.author}</span>
                                </div>
                                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {i !== 0 && (
                                        <button className="px-2 py-1 bg-dark-800 border border-dark-700 rounded text-[10px] text-slate-300 hover:text-white hover:border-slate-500 transition-colors flex items-center gap-1">
                                            <RotateCcw size={10}/> Restore
                                        </button>
                                    )}
                                    <button className="px-2 py-1 bg-dark-800 border border-dark-700 rounded text-[10px] text-slate-300 hover:text-white hover:border-slate-500 transition-colors">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CollapsibleSection>
        </div>
    );
};

export const ReviewPanel: React.FC<{ 
    comments: any[], 
    changes: any[], 
    onAddComment: () => void,
    onAcceptChange: (id: string) => void,
    onRejectChange: (id: string) => void
}> = ({ comments, changes, onAddComment, onAcceptChange, onRejectChange }) => {
    const [reviewSubTab, setReviewSubTab] = useState<'comments' | 'tracking' | 'approvals'>('comments');

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2 bg-dark-950">
            {/* Sub Tabs */}
            <div className="flex border-b border-dark-800 bg-dark-900/50 shrink-0">
                <button onClick={() => setReviewSubTab('comments')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${reviewSubTab === 'comments' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-500 hover:text-slate-300'}`}>Comments</button>
                <button onClick={() => setReviewSubTab('tracking')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${reviewSubTab === 'tracking' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-500 hover:text-slate-300'}`}>Changes</button>
                <button onClick={() => setReviewSubTab('approvals')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${reviewSubTab === 'approvals' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-500 hover:text-slate-300'}`}>Approvals</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {reviewSubTab === 'comments' && (
                    <CollapsibleSection title="Active Discussions" icon={MessageCircle} defaultOpen={true} rightElement={<Badge color="blue">{comments.length}</Badge>}>
                        <div className="space-y-4">
                            <div className="flex gap-2 mb-2">
                                <Input placeholder="Filter comments..." className="h-8 text-xs bg-dark-900"/>
                                <Button variant="secondary" className="h-8 w-8 p-0"><Filter size={14}/></Button>
                            </div>
                            <Button variant="secondary" onClick={() => onAddComment()} className="w-full text-xs mb-4">+ Add Comment</Button>
                            
                            {comments.map(comment => (
                                <div key={comment.id} className={`p-3 bg-dark-900 border ${comment.resolved ? 'border-dark-800 opacity-60' : 'border-dark-700 hover:border-brand-500/50'} rounded-xl group transition-all`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar name={comment.user} size="sm" className="w-6 h-6 text-[9px]"/>
                                            <span className="text-xs font-bold text-white">{comment.user}</span>
                                        </div>
                                        <span className="text-[9px] text-slate-500">{comment.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-300 mb-2">{comment.text}</p>
                                    {comment.category && <Badge color={comment.category === 'Risk' ? 'red' : 'blue'} className="mb-2 text-[9px] px-1 py-0">{comment.category}</Badge>}
                                    <div className="flex gap-2 mt-2 pt-2 border-t border-dark-800 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <button className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"><MessageCircle size={10}/> Reply</button>
                                        <button className="text-[10px] text-slate-400 hover:text-green-400 flex items-center gap-1"><CheckCircle2 size={10}/> Resolve</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsibleSection>
                )}

                {reviewSubTab === 'tracking' && (
                    <CollapsibleSection title="Redlines" icon={Activity} defaultOpen={true} rightElement={<Badge color="yellow">{changes.filter(c => c.status === 'pending').length}</Badge>}>
                        <div className="space-y-4">
                            {changes.filter(c => c.status === 'pending').length === 0 && <div className="text-center text-xs text-slate-500 py-4">No pending changes.</div>}
                            {changes.filter(c => c.status === 'pending').map(change => (
                                <div key={change.id} className="p-3 bg-dark-900 border border-dark-700 rounded-xl hover:border-yellow-500/50 transition-all group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${change.type === 'delete' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{change.type}</span>
                                        <span className="text-9px text-slate-500">{change.user}</span>
                                    </div>
                                    <p className="text-xs text-white font-serif italic my-2 border-l-2 border-dark-700 pl-2">"{change.content}"</p>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => onAcceptChange(change.id)} className="flex-1 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded text-[10px] font-bold transition-colors">Accept</button>
                                        <button onClick={() => onRejectChange(change.id)} className="flex-1 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-[10px] font-bold transition-colors">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsibleSection>
                )}

                {reviewSubTab === 'approvals' && (
                    <div className="space-y-0">
                        <CollapsibleSection title="Workflow Status" icon={Workflow} defaultOpen={true}>
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center mb-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-400"><ThumbsUp size={18}/></div>
                                <h4 className="text-sm font-bold text-white">Ready for Review</h4>
                                <p className="text-xs text-blue-200/70 mt-1">All critical clauses checked.</p>
                                <Button variant="primary" className="w-full mt-3 text-xs h-8">Start Approval Workflow</Button>
                            </div>
                        </CollapsibleSection>
                        
                        <CollapsibleSection title="Approvers" icon={CheckCircle2} defaultOpen={true}>
                            <div className="space-y-2">
                                {['Legal Team', 'CFO (Value > 100k)', 'Compliance'].map((role, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-dark-900 rounded border border-dark-800">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                                            <span className="text-xs text-slate-300">{role}</span>
                                        </div>
                                        <span className="text-[9px] text-slate-500">{i === 0 ? 'Approved' : 'Pending'}</span>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>
                    </div>
                )}
            </div>
        </div>
    );
};

export const CompliancePanel: React.FC<{ score?: number }> = ({ score = 85 }) => (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2 bg-dark-950">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <CollapsibleSection title="Policy Check" icon={ShieldAlert} defaultOpen={true}>
                <div className={`p-4 rounded-xl border ${score < 50 ? 'bg-red-500/10 border-red-500/20' : score < 80 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                    <div className={`flex items-center gap-2 font-bold text-xs mb-2 ${score < 50 ? 'text-red-400' : score < 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                        <ShieldAlert size={14}/> Score
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white">{score}%</span>
                        <span className={`text-xs mb-1 ${score < 50 ? 'text-red-300' : score < 80 ? 'text-yellow-300' : 'text-green-300'}`}>Compliance</span>
                    </div>
                    <div className="w-full bg-dark-900 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className={`h-full w-[${score}%] ${score < 50 ? 'bg-red-500' : score < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${score}%`}}></div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Deviations" icon={Scale} defaultOpen={true} rightElement={<Badge color="yellow">1 Issue</Badge>}>
                <div className="space-y-3">
                    <div className="p-3 bg-dark-900 border border-yellow-500/30 rounded-xl">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-yellow-500">Liability Cap</span>
                            <Badge color="yellow" className="text-[9px] px-1 py-0">Medium Risk</Badge>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-2">Current text allows for unlimited liability in specific cases, deviating from the standard 2x cap.</p>
                        <button className="w-full py-1.5 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded text-[10px] text-white transition-colors">View Playbook Standard</button>
                    </div>
                    <div className="p-3 bg-dark-900 border border-dark-700 rounded-xl opacity-60">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-green-500">Governing Law</span>
                            <Badge color="green" className="text-[9px] px-1 py-0">Match</Badge>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>
        </div>
    </div>
);

export const AIPanel: React.FC<{ editor?: Editor | null }> = ({ editor }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSummarize = () => {
        if (!editor) return;
        setIsGenerating(true);
        setTimeout(() => {
            const text = editor.getText().slice(0, 300) + '...';
            setSummary(`This document appears to be a standard commercial agreement. Key terms involve mutual indemnification, a 30-day payment cycle, and governance under New York law. (Based on: "${text}")`);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2 bg-dark-950">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <CollapsibleSection title="AI Assistant" icon={Sparkles} defaultOpen={true}>
                    <div className="bg-gradient-to-br from-purple-900/20 to-dark-900 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs mb-3">
                            <Sparkles size={14}/> Analysis Tools
                        </div>
                        <div className="space-y-2">
                            <button 
                                onClick={handleSummarize}
                                className="w-full flex items-center justify-between p-2 bg-dark-950/50 hover:bg-purple-500/20 border border-purple-500/20 rounded transition-colors group"
                            >
                                <span className="text-xs text-slate-300 group-hover:text-white">Summarize Contract</span>
                                <ArrowRight size={12} className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
                            </button>
                            <button className="w-full flex items-center justify-between p-2 bg-dark-950/50 hover:bg-purple-500/20 border border-purple-500/20 rounded transition-colors group">
                                <span className="text-xs text-slate-300 group-hover:text-white">Detect Missing Clauses</span>
                                <ArrowRight size={12} className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
                            </button>
                            <button className="w-full flex items-center justify-between p-2 bg-dark-950/50 hover:bg-purple-500/20 border border-purple-500/20 rounded transition-colors group">
                                <span className="text-xs text-slate-300 group-hover:text-white">Explain Selected Text</span>
                                <ArrowRight size={12} className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
                            </button>
                        </div>
                    </div>
                    {isGenerating && <div className="mt-4 text-xs text-brand-400 animate-pulse">Generating summary...</div>}
                    {summary && (
                        <div className="mt-4 p-3 bg-dark-900 border border-dark-700 rounded-lg text-xs text-slate-300 italic">
                            {summary}
                        </div>
                    )}
                </CollapsibleSection>

                <CollapsibleSection title="Suggestions" icon={MessageCircle} defaultOpen={true}>
                    <div className="p-3 bg-dark-900 border border-dark-700 rounded-xl">
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Rewrite Suggestion</p>
                        <p className="text-xs text-slate-300 italic mb-2">"The Supplier shall indemnify the Customer..."</p>
                        <div className="flex gap-2">
                            <button className="flex-1 py-1 bg-brand-500 hover:bg-brand-400 text-white rounded text-[10px] font-bold transition-colors">Apply</button>
                            <button className="flex-1 py-1 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded text-[10px] font-bold transition-colors">Dismiss</button>
                        </div>
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
};

export const LogicPanel: React.FC<{ rules?: any[], onUpdateRules?: (r: any[]) => void }> = ({ rules = [], onUpdateRules = (_r: any[]) => {} }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});

    const handleAddNew = () => {
        setFormData({
            id: '',
            name: '',
            field: '',
            operator: 'equals',
            value: '',
            actionType: 'insert_clause',
            actionTarget: '',
            actionValue: ''
        });
        setEditingId('new');
    };

    const handleEdit = (rule: any) => {
        setFormData({ ...rule });
        setEditingId(rule.id);
    };

    const handleSave = () => {
        if (!formData.name) return; 
        if (editingId === 'new') {
            onUpdateRules([...rules, { ...formData, id: `r_${Date.now()}` }]);
        } else {
            onUpdateRules(rules.map(r => r.id === editingId ? formData : r));
        }
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        onUpdateRules(rules.filter(r => r.id !== id));
        if(editingId === id) setEditingId(null);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2 bg-dark-950">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Configuration Header */}
                <CollapsibleSection title="Logic Config" icon={Workflow} defaultOpen={true}>
                    <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl text-center">
                        <Workflow size={24} className="mx-auto text-slate-500 mb-2"/>
                        <h4 className="text-sm font-bold text-white">Logic Configuration</h4>
                        <p className="text-xs text-slate-500 mt-1">Define conditional logic for dynamic document generation.</p>
                    </div>
                </CollapsibleSection>
                
                {/* Editing Form */}
                {editingId && (
                    <div className="p-4 bg-dark-900 border-b border-dark-800 animate-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-3">
                            <h5 className="text-xs font-bold text-white uppercase">{editingId === 'new' ? 'New Rule' : 'Edit Rule'}</h5>
                            <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-white"><X size={14}/></button>
                        </div>
                        <div className="space-y-3">
                            <Input label="Rule Name" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} placeholder="e.g. High Value Approval"/>
                            
                            <div className="p-3 bg-dark-950 rounded-lg border border-dark-800 space-y-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Condition (IF)</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <Select className="col-span-1 text-[10px]" options={MOCK_VARIABLES.map(v => ({label: v.label, value: v.key}))} value={formData.field} onChange={(e: any) => setFormData({...formData, field: e.target.value})} />
                                    <Select className="col-span-1 text-[10px]" options={[{label:'Equals', value:'equals'}, {label:'>', value:'greater_than'}, {label:'<', value:'less_than'}, {label:'Contains', value:'contains'}]} value={formData.operator} onChange={(e: any) => setFormData({...formData, operator: e.target.value})} />
                                    <Input className="col-span-1 text-[10px] h-8" placeholder="Value" value={formData.value} onChange={(e: any) => setFormData({...formData, value: e.target.value})} />
                                </div>
                            </div>

                            <div className="p-3 bg-dark-950 rounded-lg border border-dark-800 space-y-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Action (THEN)</p>
                                <Select 
                                    className="text-[10px]" 
                                    options={[
                                        {label:'Insert Clause', value:'insert_clause'}, 
                                        {label:'Set Variable', value:'set_variable'}, 
                                        {label:'Require Approval', value:'require_approval'}, 
                                        {label:'Show Warning', value:'show_warning'}
                                    ]} 
                                    value={formData.actionType} 
                                    onChange={(e: any) => setFormData({...formData, actionType: e.target.value, actionTarget: ''})} 
                                />
                                
                                {formData.actionType === 'insert_clause' ? (
                                    <Select 
                                        className="text-[10px]" 
                                        options={[{label: 'Select Clause...', value: ''}, ...MOCK_CLAUSES.map(c => ({label: c.name, value: c.name}))]} 
                                        value={formData.actionTarget} 
                                        onChange={(e: any) => setFormData({...formData, actionTarget: e.target.value})} 
                                    />
                                ) : (
                                    <Input className="text-[10px] h-8" placeholder={formData.actionType === 'require_approval' ? 'Role Name' : 'Value / Message'} value={formData.actionTarget} onChange={(e: any) => setFormData({...formData, actionTarget: e.target.value})} />
                                )}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="secondary" className="flex-1 text-xs h-7" onClick={() => setEditingId(null)}>Cancel</Button>
                                <Button variant="primary" className="flex-1 text-xs h-7" onClick={handleSave}>Save Rule</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rules List */}
                <CollapsibleSection title="Defined Rules" icon={List} defaultOpen={true}>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="text-xs font-bold text-slate-500 uppercase">Defined Rules</h5>
                            <button 
                                onClick={handleAddNew}
                                className="text-[10px] text-brand-400 hover:underline flex items-center gap-1"
                            >
                                <Plus size={10}/> Add Rule
                            </button>
                        </div>
                        
                        {rules.length === 0 && (
                            <div className="text-center py-4 text-xs text-slate-500 italic border-2 border-dashed border-dark-800 rounded-lg">
                                No rules defined.
                            </div>
                        )}

                        {rules.map((rule) => (
                            <div key={rule.id} className="p-3 bg-dark-900 border border-dark-700 rounded-xl group hover:border-brand-500/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-white">{rule.name}</span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(rule)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Edit2 size={12}/></button>
                                        <button onClick={() => handleDelete(rule.id)} className="p-1 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400"><Trash2 size={12}/></button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 font-mono bg-dark-950 px-2 py-1 rounded border border-dark-800 truncate">
                                        IF <span className="text-yellow-500">{rule.field}</span> {rule.operator === 'greater_than' ? '>' : rule.operator === 'contains' ? '⊃' : '=='} <span className="text-white">{rule.value}</span>
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 pl-1">
                                        <ArrowRight size={10} className="text-brand-500"/>
                                        <span className="uppercase font-bold text-[9px]">{rule.actionType ? rule.actionType.replace('_', ' ') : 'ACTION'}:</span>
                                        <span className="text-slate-300 truncate">{rule.actionTarget}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
};

export const GovernancePanel: React.FC = () => (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2 bg-dark-950">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Status Header */}
            <CollapsibleSection title="Governance Status" icon={Scale} defaultOpen={true}>
                <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                            <Scale size={18}/>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Governance Check</h4>
                            <p className="text-[10px] text-slate-500">Last scan: 2 mins ago</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <Badge color="green" className="flex-1 justify-center">Passed: 12</Badge>
                        <Badge color="red" className="flex-1 justify-center">Failed: 1</Badge>
                    </div>
                </div>
            </CollapsibleSection>

            {/* Violations List */}
            <CollapsibleSection title="Violations Detected" icon={AlertTriangle} defaultOpen={true} rightElement={<Badge color="red">1</Badge>}>
                <div className="space-y-3">
                    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <div className="flex items-start gap-2 mb-2">
                            <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5"/>
                            <span className="text-xs font-bold text-white">Clause Lock Violation</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-2">
                            The "Indemnification" clause has been modified but is marked as <strong>Hard Locked</strong> in the playbook.
                        </p>
                        <div className="flex gap-2">
                            <button className="flex-1 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-[10px] font-bold transition-colors flex items-center justify-center gap-1">
                                <RotateCcw size={10}/> Revert
                            </button>
                            <button className="flex-1 py-1 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded text-[10px] font-bold transition-colors">
                                Request Exception
                            </button>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            {/* Activity Log */}
            <CollapsibleSection title="Audit Trail" icon={Activity} defaultOpen={false}>
                <div className="space-y-0 relative">
                    <div className="absolute left-1.5 top-2 bottom-2 w-px bg-dark-800"></div>
                    {[
                        {action: "Contract Created", user: "Harvey S.", time: "2h ago", icon: Activity},
                        {action: "Approval Requested", user: "Mike R.", time: "1h ago", icon: CheckCircle2},
                        {action: "Clause Deviation", user: "System", time: "10m ago", icon: AlertTriangle, color: "text-red-400"}
                    ].map((log, i) => (
                        <div key={i} className="flex items-center gap-3 py-2 relative">
                            <div className={`w-3 h-3 rounded-full border-2 border-dark-950 bg-dark-700 z-10 ${log.color || 'text-slate-500'}`}></div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-slate-300">{log.action}</p>
                                <p className="text-[9px] text-slate-500">{log.user} • {log.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CollapsibleSection>
        </div>
    </div>
);
