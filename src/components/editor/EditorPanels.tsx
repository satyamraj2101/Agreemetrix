
import React, { useState } from 'react';
import { FileText, Filter, MessageCircle, CheckCircle2, ThumbsUp, ShieldAlert, Sparkles, ArrowRight, Workflow, List, AlertTriangle, Scale, Check, X, Activity } from 'lucide-react';
import { Input, Button, Badge, Avatar } from '../UIComponents';
import { Editor } from '@tiptap/react';

// --- TYPES ---
interface PanelProps {
    editor?: Editor | null;
    data?: any;
    onClose?: () => void;
}

export const StructurePanel: React.FC<PanelProps & { outline: string[] }> = ({ editor, outline }) => (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4">
        <div className="p-4 border-b border-dark-800 flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Document Outline</h4>
            <button className="text-xs text-brand-400 hover:text-white" onClick={() => editor?.commands.focus()}>Refresh</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {outline.length > 0 ? outline.map((h, i) => (
                <button key={i} onClick={() => { /* Scroll logic */ }} className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 truncate flex items-center gap-2 group transition-colors">
                    <div className="w-1.5 h-1.5 bg-dark-700 rounded-full group-hover:bg-brand-500 transition-colors"></div>
                    {h}
                </button>
            )) : (
                <div className="p-4 text-center text-xs text-slate-500">No headings detected. Use H1-H3 to build structure.</div>
            )}
        </div>
        <div className="p-4 border-t border-dark-800">
            <div className="bg-dark-900 p-3 rounded-lg border border-dark-700">
                <h5 className="text-xs font-bold text-white mb-2 flex items-center gap-2"><FileText size={12} className="text-brand-400"/> Metadata</h5>
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
        </div>
    </div>
);

export const ReviewPanel: React.FC<{ 
    comments: any[], 
    changes: any[], 
    onAddComment: () => void 
}> = ({ comments, changes, onAddComment }) => {
    const [reviewSubTab, setReviewSubTab] = useState<'comments' | 'tracking' | 'approvals'>('comments');

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2">
            {/* Sub Tabs */}
            <div className="flex border-b border-dark-800 bg-dark-900/50">
                <button onClick={() => setReviewSubTab('comments')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${reviewSubTab === 'comments' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-500 hover:text-slate-300'}`}>Comments</button>
                <button onClick={() => setReviewSubTab('tracking')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${reviewSubTab === 'tracking' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-500 hover:text-slate-300'}`}>Changes</button>
                <button onClick={() => setReviewSubTab('approvals')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${reviewSubTab === 'approvals' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-500 hover:text-slate-300'}`}>Approvals</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {reviewSubTab === 'comments' && (
                    <div className="space-y-4">
                        <div className="flex gap-2 mb-2">
                            <Input placeholder="Filter comments..." className="h-8 text-xs bg-dark-900"/>
                            <Button variant="secondary" className="h-8 w-8 p-0"><Filter size={14}/></Button>
                        </div>
                        <Button variant="secondary" onClick={onAddComment} className="w-full text-xs mb-4">+ Add Comment</Button>
                        
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
                )}

                {reviewSubTab === 'tracking' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="text-xs font-bold text-slate-500 uppercase">Pending Changes</h5>
                            <Badge color="yellow">{changes.filter(c => c.status === 'pending').length}</Badge>
                        </div>
                        {changes.filter(c => c.status === 'pending').map(change => (
                            <div key={change.id} className="p-3 bg-dark-900 border border-dark-700 rounded-xl hover:border-yellow-500/50 transition-all group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${change.type === 'delete' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{change.type}</span>
                                    <span className="text-[9px] text-slate-500">{change.user}</span>
                                </div>
                                <p className="text-xs text-white font-serif italic my-2 border-l-2 border-dark-700 pl-2">"{change.content}"</p>
                                <div className="flex gap-2 mt-2">
                                    <button className="flex-1 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded text-[10px] font-bold transition-colors">Accept</button>
                                    <button className="flex-1 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-[10px] font-bold transition-colors">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {reviewSubTab === 'approvals' && (
                    <div className="space-y-6">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-400"><ThumbsUp size={18}/></div>
                            <h4 className="text-sm font-bold text-white">Ready for Review</h4>
                            <p className="text-xs text-blue-200/70 mt-1">All critical clauses checked.</p>
                            <Button variant="primary" className="w-full mt-3 text-xs h-8">Start Approval Workflow</Button>
                        </div>
                        
                        <div>
                            <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Required Approvers</h5>
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const CompliancePanel: React.FC = () => (
    <div className="flex flex-col h-full p-4 animate-in fade-in slide-in-from-right-2 space-y-6">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs mb-2">
                <ShieldAlert size={14}/> Policy Check
            </div>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">85%</span>
                <span className="text-xs text-red-300 mb-1">Compliance Score</span>
            </div>
            <div className="w-full bg-dark-900 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-red-500 w-[85%]"></div>
            </div>
        </div>

        <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Deviation Detected</h5>
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
        </div>
    </div>
);

export const AIPanel: React.FC = () => (
    <div className="flex flex-col h-full p-4 animate-in fade-in slide-in-from-right-2 space-y-6">
        <div className="bg-gradient-to-br from-purple-900/20 to-dark-900 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs mb-3">
                <Sparkles size={14}/> AI Analysis
            </div>
            <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-2 bg-dark-950/50 hover:bg-purple-500/20 border border-purple-500/20 rounded transition-colors group">
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

        <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Active Suggestions</h5>
            <div className="p-3 bg-dark-900 border border-dark-700 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Rewrite Suggestion</p>
                <p className="text-xs text-slate-300 italic mb-2">"The Supplier shall indemnify the Customer..."</p>
                <div className="flex gap-2">
                    <button className="flex-1 py-1 bg-brand-500 hover:bg-brand-400 text-white rounded text-[10px] font-bold transition-colors">Apply</button>
                    <button className="flex-1 py-1 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded text-[10px] font-bold transition-colors">Dismiss</button>
                </div>
            </div>
        </div>
    </div>
);

export const LogicPanel: React.FC = () => (
    <div className="flex flex-col h-full p-4 animate-in fade-in slide-in-from-right-2 space-y-6">
        <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl text-center">
            <Workflow size={24} className="mx-auto text-slate-500 mb-2"/>
            <h4 className="text-sm font-bold text-white">Logic Configuration</h4>
            <p className="text-xs text-slate-500 mt-1">Define conditional logic for clauses and variables.</p>
        </div>
        
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
                <h5 className="text-xs font-bold text-slate-500 uppercase">Rules</h5>
                <button className="text-[10px] text-brand-400 hover:underline">+ Add Rule</button>
            </div>
            <div className="p-3 bg-dark-900 border border-dark-700 rounded-xl">
                <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-white">Payment Terms</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">IF value {'>'} 50k THEN Net 45</p>
            </div>
        </div>
    </div>
);

export const GovernancePanel: React.FC = () => (
    <div className="flex flex-col h-full p-4 animate-in fade-in slide-in-from-right-2 space-y-6">
        {/* Status Header */}
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

        {/* Violations List */}
        <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Violations Detected</h5>
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
                            <Workflow size={10}/> Revert
                        </button>
                        <button className="flex-1 py-1 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded text-[10px] font-bold transition-colors">
                            Request Exception
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Activity Log */}
        <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Audit Trail</h5>
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
        </div>
    </div>
);
