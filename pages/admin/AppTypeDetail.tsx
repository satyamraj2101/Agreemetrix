
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, Badge, Switch, Avatar } from '../../components/UIComponents';
import { MOCK_APP_TYPES, MOCK_TABLES, MOCK_TEMPLATES, MOCK_ROLES, MOCK_EMAIL_TEMPLATES, INITIAL_STAGES, MOCK_GROUPS, MOCK_USERS } from '../../mock/data';
import { ApplicationType, FieldDefinition, FormSection, AppTypeNotification, AppTypeActionConfig, AttachmentRule, StorageConfig, AppTypePermissionConfig } from '../../types';
import { 
  ArrowLeft, Save, Check, Play, Eye, LayoutTemplate, GitBranch, FileText, 
  Bell, Zap, Calendar, Paperclip, Shield, History, MoreVertical, Plus, 
  Trash2, GripVertical, Edit2, ChevronRight, AlertTriangle, Search, Layers,
  Copy, Maximize2, Download, RotateCcw, ChevronDown, Settings, Code, MousePointer,
  X, Type, Hash, List, User, Mail, Bot, Sparkles, Globe, Webhook, Command,
  HardDrive, Folder, File, UploadCloud, Lock, Users
} from 'lucide-react';

// --- SIMULATION ENGINE ---
const SimulationPanel: React.FC<{ appType: ApplicationType; onClose: () => void }> = ({ appType, onClose }) => {
    const [inputs, setInputs] = useState<Record<string, any>>({});
    const [result, setResult] = useState<any>(null);

    const runSimulation = () => {
        // Mock logic execution
        const matchedTemplate = appType.templateRules.find(r => {
            // Extremely simple eval mock
            if (r.conditionExpression.includes('EU') && inputs['region'] === 'EU') return true;
            if (r.conditionExpression.includes('Value > 50000') && Number(inputs['value']) > 50000) return true;
            return false;
        }) || appType.templateRules[0];

        setResult({
            template: matchedTemplate ? MOCK_TEMPLATES.find(t => t.id === matchedTemplate.templateId)?.name : 'Default Template',
            workflow: 'Global Enterprise Procurement',
            notifications: ['Approval Request - Manager', 'Receipt Confirmation'],
            approvers: Number(inputs['value']) > 100000 ? ['CFO', 'Legal'] : ['Legal'],
            logs: [
                'Input validated successfully',
                `Evaluated ${appType.templateRules.length} template rules`,
                `Match found: Rule #${matchedTemplate?.priority || 0}`,
                'Workflow initiated: wf_global_procurement'
            ]
        });
    };

    return (
        <div className="fixed inset-y-0 right-0 w-[500px] bg-dark-950 border-l border-dark-700 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right">
            <div className="p-4 border-b border-dark-700 bg-dark-900 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2"><Play size={16} className="text-green-400"/> Sandbox Simulator</h3>
                <button onClick={onClose}><X size={20} className="text-slate-500 hover:text-white"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Test Inputs</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Value" type="number" onChange={e => setInputs({...inputs, value: e.target.value})} />
                        <Select label="Region" options={[{label:'US', value:'US'}, {label:'EU', value:'EU'}]} onChange={e => setInputs({...inputs, region: e.target.value})} />
                        <Select label="Department" options={[{label:'Sales', value:'Sales'}, {label:'IT', value:'IT'}]} onChange={e => setInputs({...inputs, dept: e.target.value})} />
                    </div>
                    <Button variant="primary" className="w-full" onClick={runSimulation}>Run Logic Trace</Button>
                </div>

                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl space-y-3">
                            <div className="flex justify-between border-b border-dark-800 pb-2">
                                <span className="text-xs text-slate-400">Selected Template</span>
                                <span className="text-xs font-bold text-white">{result.template}</span>
                            </div>
                            <div className="flex justify-between border-b border-dark-800 pb-2">
                                <span className="text-xs text-slate-400">Workflow Route</span>
                                <span className="text-xs font-bold text-blue-400">{result.workflow}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-400">Approvers</span>
                                <div className="flex gap-1">
                                    {result.approvers.map((a: string) => <Badge key={a} color="purple">{a}</Badge>)}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-black/30 p-3 rounded-lg border border-dark-800 font-mono text-[10px] text-slate-400 space-y-1">
                            {result.logs.map((log: string, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <span className="text-slate-600">{i+1}.</span>
                                    <span>{log}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- TAB COMPONENTS ---

const PermissionsPanel: React.FC<{ 
    appType: ApplicationType; 
    onChange: (updated: ApplicationType) => void; 
}> = ({ appType, onChange }) => {
    const permissions = appType.permissions || { 
        initiation: { accessLevel: 'internal', allowedRoleIds: [], allowedGroupIds: [] },
        visibility: { defaultScope: 'requester', additionalRoleIds: [] },
        managers: [] 
    };

    const updatePermissions = (newPerms: Partial<AppTypePermissionConfig>) => {
        onChange({ ...appType, permissions: { ...permissions, ...newPerms } });
    };

    const toggleAllowedRole = (roleId: string) => {
        const current = permissions.initiation.allowedRoleIds;
        const updated = current.includes(roleId) 
            ? current.filter(id => id !== roleId)
            : [...current, roleId];
        updatePermissions({ initiation: { ...permissions.initiation, allowedRoleIds: updated } });
    };

    const toggleAllowedGroup = (groupId: string) => {
        const current = permissions.initiation.allowedGroupIds;
        const updated = current.includes(groupId)
            ? current.filter(id => id !== groupId)
            : [...current, groupId];
        updatePermissions({ initiation: { ...permissions.initiation, allowedGroupIds: updated } });
    };

    const toggleAdditionalViewer = (roleId: string) => {
        const current = permissions.visibility.additionalRoleIds;
        const updated = current.includes(roleId)
            ? current.filter(id => id !== roleId)
            : [...current, roleId];
        updatePermissions({ visibility: { ...permissions.visibility, additionalRoleIds: updated } });
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 overflow-y-auto h-full custom-scrollbar">
            {/* Initiation Access */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20"><Play size={18}/></div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Initiation Access</h3>
                        <p className="text-xs text-slate-400">Who can start a new request of this type?</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    {['public', 'internal', 'restricted'].map((level) => (
                        <div 
                            key={level}
                            onClick={() => updatePermissions({ initiation: { ...permissions.initiation, accessLevel: level as any } })}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${permissions.initiation.accessLevel === level ? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/20' : 'bg-dark-900 border-dark-700 hover:border-dark-500'}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-white capitalize">{level}</span>
                                {permissions.initiation.accessLevel === level && <Check size={16} className="text-blue-400"/>}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {level === 'public' && "Allow external users to submit via public link (e.g. Vendor Portal)."}
                                {level === 'internal' && "Any authenticated user in the organization can submit."}
                                {level === 'restricted' && "Only specific roles or groups can initiate."}
                            </p>
                        </div>
                    ))}
                </div>

                {permissions.initiation.accessLevel === 'restricted' && (
                    <div className="p-6 bg-dark-900 border border-dark-700 rounded-xl space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Allowed Roles</label>
                            <div className="flex flex-wrap gap-2">
                                {MOCK_ROLES.map(role => (
                                    <button
                                        key={role.id}
                                        onClick={() => toggleAllowedRole(role.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${permissions.initiation.allowedRoleIds.includes(role.id) ? 'bg-blue-500 text-white border-blue-500' : 'bg-dark-950 text-slate-400 border-dark-700 hover:border-slate-500'}`}
                                    >
                                        {role.name}
                                        {permissions.initiation.allowedRoleIds.includes(role.id) && <X size={12} className="ml-1"/>}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Allowed Groups</label>
                            <div className="flex flex-wrap gap-2">
                                {MOCK_GROUPS.map(group => (
                                    <button
                                        key={group.id}
                                        onClick={() => toggleAllowedGroup(group.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${permissions.initiation.allowedGroupIds.includes(group.id) ? 'bg-purple-500 text-white border-purple-500' : 'bg-dark-950 text-slate-400 border-dark-700 hover:border-slate-500'}`}
                                    >
                                        <Users size={12}/> {group.name}
                                        {permissions.initiation.allowedGroupIds.includes(group.id) && <X size={12} className="ml-1"/>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="h-px bg-dark-800"></div>

            {/* Visibility Scope */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400 border border-green-500/20"><Eye size={18}/></div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Data Visibility</h3>
                        <p className="text-xs text-slate-400">Who can see active requests once created?</p>
                    </div>
                </div>

                <div className="p-6 bg-dark-900 border border-dark-700 rounded-xl space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Default Scope</label>
                        <div className="flex bg-dark-950 p-1 rounded-lg border border-dark-800 w-fit">
                            {[
                                { id: 'requester', label: 'Requester & Approvers Only' },
                                { id: 'department', label: 'Entire Department' },
                                { id: 'global', label: 'All Internal Users' }
                            ].map(scope => (
                                <button
                                    key={scope.id}
                                    onClick={() => updatePermissions({ visibility: { ...permissions.visibility, defaultScope: scope.id as any } })}
                                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${permissions.visibility.defaultScope === scope.id ? 'bg-green-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {scope.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 italic">
                            * Admins and assigned approvers always have access regardless of this setting.
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Privileged Viewers (Always Visible)</label>
                        <div className="flex flex-wrap gap-2">
                            {MOCK_ROLES.filter(r => !r.isSystem).map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => toggleAdditionalViewer(role.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${permissions.visibility.additionalRoleIds.includes(role.id) ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-dark-950 text-slate-400 border-dark-700 hover:border-slate-500'}`}
                                >
                                    {role.name}
                                    {permissions.visibility.additionalRoleIds.includes(role.id) && <Check size={12}/>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px bg-dark-800"></div>

            {/* Management */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20"><Settings size={18}/></div>
                    <div>
                        <h3 className="text-lg font-bold text-white">App Administration</h3>
                        <p className="text-xs text-slate-400">Users allowed to edit this configuration.</p>
                    </div>
                </div>

                <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
                    {permissions.managers.map(userId => {
                        const user = MOCK_USERS.find(u => u.id === userId);
                        if (!user) return null;
                        return (
                            <div key={userId} className="flex items-center justify-between p-4 border-b border-dark-800 last:border-0">
                                <div className="flex items-center gap-3">
                                    <Avatar name={user.name} size="md"/>
                                    <div>
                                        <p className="text-sm font-bold text-white">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.role}</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 text-xs"
                                    onClick={() => updatePermissions({ managers: permissions.managers.filter(id => id !== userId) })}
                                >
                                    Remove
                                </Button>
                            </div>
                        )
                    })}
                    <div className="p-4 bg-dark-950/50">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                            <input 
                                type="text" 
                                placeholder="Search users to add as admin..." 
                                className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-brand-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AttachmentStoragePanel: React.FC<{ 
    appType: ApplicationType; 
    onChange: (updated: ApplicationType) => void; 
}> = ({ appType, onChange }) => {
    const [selection, setSelection] = useState<{type: 'rule' | 'storage', id?: string}>({ type: 'storage' });
    const [localRules, setLocalRules] = useState<AttachmentRule[]>(appType.attachmentRules || []);
    const [localStorage, setLocalStorage] = useState<StorageConfig>(appType.storageConfig || {
        provider: 'SharePoint', basePath: '/', pathPattern: '{{year}}/', namingConvention: '{{id}}', autoArchive: false
    });

    const handleAddRule = () => {
        const newRule: AttachmentRule = {
            id: `att_${Date.now()}`,
            label: 'New Attachment',
            key: 'new_att',
            required: false,
            acceptedTypes: ['.pdf'],
            maxSizeMB: 10
        };
        const newRules = [...localRules, newRule];
        setLocalRules(newRules);
        setSelection({ type: 'rule', id: newRule.id });
        onChange({ ...appType, attachmentRules: newRules });
    };

    const handleUpdateRule = (updated: AttachmentRule) => {
        const newRules = localRules.map(r => r.id === updated.id ? updated : r);
        setLocalRules(newRules);
        onChange({ ...appType, attachmentRules: newRules });
    };

    const handleDeleteRule = (id: string) => {
        const newRules = localRules.filter(r => r.id !== id);
        setLocalRules(newRules);
        setSelection({ type: 'storage' });
        onChange({ ...appType, attachmentRules: newRules });
    };

    const handleUpdateStorage = (updated: Partial<StorageConfig>) => {
        const newConfig = { ...localStorage, ...updated };
        setLocalStorage(newConfig);
        onChange({ ...appType, storageConfig: newConfig });
    };

    const getActiveRule = () => localRules.find(r => r.id === selection.id);

    return (
        <div className="flex h-full bg-dark-950">
            {/* Left Sidebar */}
            <div className="w-80 border-r border-dark-800 bg-dark-900 flex flex-col">
                <div className="p-4 border-b border-dark-800 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Upload Requirements</h4>
                    <button onClick={handleAddRule} className="text-xs text-brand-400 hover:text-white flex items-center gap-1"><Plus size={12}/> New</button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {localRules.map(rule => (
                        <div 
                            key={rule.id}
                            onClick={() => setSelection({ type: 'rule', id: rule.id })}
                            className={`p-3 rounded-lg cursor-pointer border transition-all ${selection.type === 'rule' && selection.id === rule.id ? 'bg-brand-500/10 border-brand-500/50 ring-1 ring-brand-500/20' : 'bg-dark-950 border-dark-700 hover:border-dark-500'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-bold ${selection.type === 'rule' && selection.id === rule.id ? 'text-white' : 'text-slate-300'}`}>{rule.label}</span>
                                {rule.required && <Badge color="red" className="text-[9px]">Req</Badge>}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-2">
                                <Paperclip size={10}/> {rule.acceptedTypes.length} Types • {rule.maxSizeMB} MB
                            </div>
                        </div>
                    ))}
                    
                    <div className="mt-4 pt-4 border-t border-dark-800">
                        <div 
                            onClick={() => setSelection({ type: 'storage' })}
                            className={`p-3 rounded-lg cursor-pointer border transition-all flex items-center gap-3 ${selection.type === 'storage' ? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/20' : 'bg-dark-950 border-dark-700 hover:border-dark-500'}`}
                        >
                            <div className="p-2 rounded-lg bg-dark-900 text-blue-400 border border-dark-800">
                                <HardDrive size={16}/>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Post-Execution Storage</h4>
                                <p className="text-[10px] text-slate-500">Archival & Path Settings</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Config Area */}
            <div className="flex-1 bg-dark-950 flex flex-col">
                {selection.type === 'rule' && getActiveRule() && (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2">
                        <div className="p-5 border-b border-dark-800 flex justify-between items-center bg-dark-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400 border border-brand-500/20">
                                    <UploadCloud size={18}/>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">{getActiveRule()?.label}</h3>
                                    <p className="text-xs text-slate-500">Attachment Configuration</p>
                                </div>
                            </div>
                            <Button variant="danger" onClick={() => handleDeleteRule(selection.id!)} className="h-8 text-xs"><Trash2 size={14}/> Delete</Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 max-w-3xl space-y-6 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <Input label="Display Label" value={getActiveRule()?.label} onChange={(e) => handleUpdateRule({...getActiveRule()!, label: e.target.value})} />
                                <Input label="System Key" value={getActiveRule()?.key} onChange={(e) => handleUpdateRule({...getActiveRule()!, key: e.target.value})} className="font-mono text-slate-400 bg-dark-900"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Instructions / Description</label>
                                <textarea 
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-sm text-white h-20 resize-none focus:border-brand-500 outline-none"
                                    value={getActiveRule()?.description || ''}
                                    onChange={(e) => handleUpdateRule({...getActiveRule()!, description: e.target.value})}
                                    placeholder="Instructions for the user uploading this file..."
                                />
                            </div>
                            
                            <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-dark-800 pb-2">Validation Rules</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300">Mandatory Upload</span>
                                    <Switch checked={getActiveRule()!.required} onChange={(c) => handleUpdateRule({...getActiveRule()!, required: c})} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Max File Size (MB)</label>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range" min="1" max="50" 
                                            value={getActiveRule()!.maxSizeMB} 
                                            onChange={(e) => handleUpdateRule({...getActiveRule()!, maxSizeMB: parseInt(e.target.value)})}
                                            className="flex-1 h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                        />
                                        <span className="text-sm font-mono text-brand-400 w-12 text-right">{getActiveRule()!.maxSizeMB} MB</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Accepted Extensions</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['.pdf', '.docx', '.xlsx', '.jpg', '.png'].map(ext => (
                                            <button
                                                key={ext}
                                                onClick={() => {
                                                    const types = getActiveRule()!.acceptedTypes;
                                                    const newTypes = types.includes(ext) ? types.filter(t => t !== ext) : [...types, ext];
                                                    handleUpdateRule({...getActiveRule()!, acceptedTypes: newTypes});
                                                }}
                                                className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${getActiveRule()!.acceptedTypes.includes(ext) ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'bg-dark-950 border-dark-700 text-slate-500 hover:border-slate-500'}`}
                                            >
                                                {ext}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Input 
                                    label="Filename Pattern (Regex)" 
                                    placeholder="e.g. ^[A-Z]{3}-\d{4}.*" 
                                    value={getActiveRule()?.filenamePattern || ''} 
                                    onChange={(e) => handleUpdateRule({...getActiveRule()!, filenamePattern: e.target.value})}
                                    className="font-mono text-xs"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {selection.type === 'storage' && (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2">
                        <div className="p-5 border-b border-dark-800 flex justify-between items-center bg-dark-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                                    <HardDrive size={18}/>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Storage Configuration</h3>
                                    <p className="text-xs text-slate-500">Final Document Archival</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 max-w-3xl space-y-8 custom-scrollbar">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-blue-400 uppercase flex items-center gap-2"><Folder size={14}/> Provider Settings</h4>
                                <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl">
                                    <Select 
                                        label="Storage Provider" 
                                        options={[{label: 'SharePoint Online', value: 'SharePoint'}, {label: 'Amazon S3', value: 'S3'}, {label: 'Google Drive', value: 'GoogleDrive'}, {label: 'Azure Blob', value: 'AzureBlob'}]}
                                        value={localStorage.provider}
                                        onChange={(e) => handleUpdateStorage({provider: e.target.value as any})}
                                        className="mb-4"
                                    />
                                    <Input label="Base Path / Bucket" value={localStorage.basePath} onChange={(e) => handleUpdateStorage({basePath: e.target.value})} className="font-mono text-xs" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-blue-400 uppercase flex items-center gap-2"><Settings size={14}/> Path Generation</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Dynamic Path Pattern</label>
                                        <div className="flex gap-2 mb-2">
                                            {['{{year}}', '{{month}}', '{{counterparty}}', '{{type}}', '{{department}}'].map(v => (
                                                <button 
                                                    key={v}
                                                    onClick={() => handleUpdateStorage({pathPattern: localStorage.pathPattern + v + '/'})}
                                                    className="px-2 py-1 bg-dark-800 border border-dark-700 rounded text-[10px] text-slate-400 hover:text-white hover:border-slate-500 transition-colors font-mono"
                                                >
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                        <Input value={localStorage.pathPattern} onChange={(e) => handleUpdateStorage({pathPattern: e.target.value})} className="font-mono text-xs text-yellow-300" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">File Naming Convention</label>
                                        <Input value={localStorage.namingConvention} onChange={(e) => handleUpdateStorage({namingConvention: e.target.value})} className="font-mono text-xs text-yellow-300" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex gap-4 items-center">
                                <div className="p-3 bg-dark-950 rounded-lg border border-dark-800 text-slate-400">
                                    <File size={24}/>
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-xs font-bold text-blue-300 uppercase mb-1">Live Preview</h5>
                                    <p className="text-sm font-mono text-slate-300 break-all">
                                        {localStorage.basePath.replace(/\/$/, '')}/{localStorage.pathPattern.replace('{{year}}', '2024').replace('{{month}}', '05').replace('{{counterparty}}', 'AcmeCorp').replace('{{type}}', 'MSA').replace('{{department}}', 'Sales')}{localStorage.namingConvention.replace('{{id}}', 'CTR-1023').replace('{{type}}', 'MSA').replace('{{version}}', '1.0')}.pdf
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-blue-400 uppercase flex items-center gap-2"><History size={14}/> Lifecycle</h4>
                                <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-300">Auto-Archive Expired Contracts</span>
                                        <Switch checked={localStorage.autoArchive} onChange={(c) => handleUpdateStorage({autoArchive: c})} />
                                    </div>
                                    {localStorage.autoArchive && (
                                        <div className="flex items-center gap-3 animate-in slide-in-from-top-2">
                                            <span className="text-xs text-slate-500">Retention Period:</span>
                                            <div className="flex items-center gap-2">
                                                <Input type="number" className="w-20 h-8 text-xs" value={localStorage.retentionPeriodDays || 365} onChange={(e) => handleUpdateStorage({retentionPeriodDays: parseInt(e.target.value)})} />
                                                <span className="text-xs text-slate-300">Days</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const VisualFormBuilder: React.FC<{ 
    sections: FormSection[], 
    fields: FieldDefinition[], 
    onUpdate: (s: FormSection[], f: FieldDefinition[]) => void 
}> = ({ sections, fields, onUpdate }) => {
    const [activeField, setActiveField] = useState<FieldDefinition | null>(null);
    const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

    const addField = () => {
        const newField: FieldDefinition = {
            id: `f_${Date.now()}`,
            name: 'New Field',
            key: `field_${Date.now()}`,
            type: 'text',
            source: 'custom',
            required: false,
            unique: false,
            sectionId: sections[0]?.id,
            width: 'full'
        };
        onUpdate(sections, [...fields, newField]);
        setActiveField(newField);
    };

    const updateField = (id: string, data: Partial<FieldDefinition>) => {
        onUpdate(sections, fields.map(f => f.id === id ? { ...f, ...data } : f));
        if (activeField?.id === id) setActiveField({ ...activeField, ...data });
    };

    return (
        <div className="flex h-full gap-0 bg-dark-950">
            {/* Sidebar Palette */}
            <div className="w-64 border-r border-dark-800 bg-dark-900 flex flex-col">
                <div className="p-4 border-b border-dark-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Component Library</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { icon: Type, label: 'Text' }, { icon: Hash, label: 'Number' },
                            { icon: Calendar, label: 'Date' }, { icon: List, label: 'Select' },
                            { icon: Paperclip, label: 'File' }, { icon: User, label: 'User' }
                        ].map((tool, i) => (
                            <button key={i} onClick={addField} className="flex flex-col items-center justify-center p-3 bg-dark-900 border border-dark-700 hover:border-brand-500/50 hover:bg-brand-500/5 rounded-lg transition-all group">
                                <tool.icon size={16} className="text-slate-400 group-hover:text-brand-400 mb-1"/>
                                <span className="text-[10px] text-slate-300">{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Form Structure</h4>
                    <div className="space-y-2">
                        {sections.map(section => (
                            <div key={section.id} className="border border-dark-700 rounded-lg bg-dark-950 overflow-hidden">
                                <div className="p-2 bg-dark-800 text-xs font-bold text-slate-300 flex justify-between items-center">
                                    {section.title}
                                    <Settings size={12} className="text-slate-500 cursor-pointer hover:text-white"/>
                                </div>
                                <div className="p-1 space-y-0.5">
                                    {fields.filter(f => f.sectionId === section.id).map(f => (
                                        <div 
                                            key={f.id}
                                            onClick={() => setActiveField(f)}
                                            className={`px-2 py-1.5 text-xs rounded cursor-pointer flex items-center gap-2 ${activeField?.id === f.id ? 'bg-brand-500/20 text-brand-300' : 'hover:bg-white/5 text-slate-400'}`}
                                        >
                                            <GripVertical size={10}/> {f.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Button variant="secondary" className="w-full text-xs mt-2">+ Add Section</Button>
                    </div>
                </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 bg-dark-950 flex flex-col relative">
                <div className="h-12 border-b border-dark-800 flex items-center justify-between px-4">
                    <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-700">
                        <button onClick={() => setPreviewMode('edit')} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${previewMode === 'edit' ? 'bg-dark-800 text-white shadow' : 'text-slate-500'}`}>Editor</button>
                        <button onClick={() => setPreviewMode('preview')} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${previewMode === 'preview' ? 'bg-dark-800 text-white shadow' : 'text-slate-500'}`}>Preview</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="text-slate-500 hover:text-white"><RotateCcw size={16}/></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    <div className="w-full max-w-3xl bg-dark-900 border border-dark-700 rounded-xl shadow-2xl p-8 min-h-[600px]">
                        <div className="border-b border-dark-700 pb-6 mb-6">
                            <h2 className="text-2xl font-bold text-white">New Request</h2>
                            <p className="text-slate-400 text-sm">Please fill out the details below to initiate the process.</p>
                        </div>

                        <div className="space-y-8">
                            {sections.map(section => (
                                <div key={section.id} className="space-y-4">
                                    <h3 className="text-sm font-bold text-brand-400 uppercase tracking-wider border-b border-dark-800 pb-2">{section.title}</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        {fields.filter(f => f.sectionId === section.id).map(f => (
                                            <div 
                                                key={f.id} 
                                                className={`relative group ${f.width === 'full' ? 'col-span-2' : 'col-span-1'}`}
                                                onClick={() => setActiveField(f)}
                                            >
                                                {previewMode === 'edit' && (
                                                    <div className={`absolute -inset-2 rounded-lg border-2 border-dashed pointer-events-none transition-colors ${activeField?.id === f.id ? 'border-brand-500 bg-brand-500/5' : 'border-transparent group-hover:border-dark-600'}`}></div>
                                                )}
                                                <Input 
                                                    label={f.name + (f.required ? ' *' : '')} 
                                                    placeholder={f.placeholder || 'Enter value...'} 
                                                    disabled={previewMode === 'edit'}
                                                    className={previewMode === 'edit' ? 'pointer-events-none' : ''}
                                                />
                                                {previewMode === 'edit' && (
                                                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1 bg-dark-800 rounded text-slate-400 hover:text-white border border-dark-600"><Edit2 size={12}/></button>
                                                        <button className="p-1 bg-dark-800 rounded text-slate-400 hover:text-red-400 border border-dark-600"><Trash2 size={12}/></button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {fields.filter(f => f.sectionId === section.id).length === 0 && (
                                            <div className="col-span-2 py-8 border-2 border-dashed border-dark-800 rounded-lg text-center text-xs text-slate-600">
                                                Drop fields here
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Panel */}
            {activeField && (
                <div className="w-72 bg-dark-900 border-l border-dark-700 flex flex-col shadow-xl z-10">
                    <div className="p-4 border-b border-dark-800 flex justify-between items-center">
                        <span className="font-bold text-white text-sm">Field Properties</span>
                        <button onClick={() => setActiveField(null)}><X size={16} className="text-slate-500 hover:text-white"/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-5">
                        <Input label="Label" value={activeField.name} onChange={(e) => updateField(activeField.id, {name: e.target.value})} />
                        <Input label="API Key" value={activeField.key} onChange={(e) => updateField(activeField.id, {key: e.target.value})} className="font-mono text-xs" />
                        <Input label="Placeholder" value={activeField.placeholder} onChange={(e) => updateField(activeField.id, {placeholder: e.target.value})} />
                        
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Layout</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => updateField(activeField.id, {width: 'half'})} className={`p-2 border rounded text-xs text-center ${activeField.width !== 'full' ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'border-dark-700 text-slate-400'}`}>Half Width</button>
                                <button onClick={() => updateField(activeField.id, {width: 'full'})} className={`p-2 border rounded text-xs text-center ${activeField.width === 'full' ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'border-dark-700 text-slate-400'}`}>Full Width</button>
                            </div>
                        </div>

                        <div className="p-3 bg-dark-950 rounded-lg border border-dark-800 space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase block">Validation</label>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">Required</span>
                                <Switch checked={activeField.required} onChange={(c) => updateField(activeField.id, {required: c})} />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">Unique</span>
                                <Switch checked={activeField.unique} onChange={(c) => updateField(activeField.id, {unique: c})} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Visibility (RBAC)</label>
                            <div className="space-y-2">
                                {['Sales', 'Legal', 'Guest'].map(role => (
                                    <div key={role} className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">{role}</span>
                                        <select className="bg-dark-950 border border-dark-700 rounded px-1 py-0.5 text-slate-300 outline-none">
                                            <option>Read/Write</option>
                                            <option>Read Only</option>
                                            <option>Hidden</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const NotificationStudio: React.FC<{ notifications: AppTypeNotification[] }> = ({ notifications }) => {
    return (
        <div className="h-full flex gap-6">
            <div className="w-1/3 flex flex-col gap-4">
                <Button variant="secondary" className="w-full"><Plus size={14} className="mr-2"/> Add Notification</Button>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {notifications.map(notif => (
                        <div key={notif.id} className="p-4 bg-dark-900 border border-dark-700 hover:border-brand-500/50 rounded-xl cursor-pointer transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-slate-400"/>
                                    <span className="font-bold text-white text-sm">{notif.name}</span>
                                </div>
                                <Switch checked={notif.active} onChange={()=>{}} className="scale-75"/>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                <Zap size={12}/> Trigger: <span className="text-slate-300 uppercase">{notif.trigger}</span>
                            </div>
                            <div className="flex gap-1">
                                {notif.channels.map(c => (
                                    <Badge key={c} color="gray" className="text-[9px]">{c}</Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="flex-1 bg-dark-900 border border-dark-700 rounded-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-dark-950 flex justify-between items-center">
                    <h4 className="font-bold text-white">Edit Template: Approval Request</h4>
                    <div className="flex gap-2">
                        <Button variant="ghost" className="text-xs">Test Send</Button>
                        <Button variant="primary" className="text-xs">Save</Button>
                    </div>
                </div>
                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Subject Line" defaultValue="Action Required: Approval for {{contract.name}}" />
                        <Select label="Recipient" options={[{label:'Contract Owner', value:'owner'}, {label:'Approver', value:'approver'}]} />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Email Body (HTML)</label>
                        <div className="h-64 bg-dark-950 border border-dark-700 rounded-lg p-4 font-mono text-sm text-slate-300">
                            Hello {'{{recipient.name}}'},<br/><br/>
                            A new contract requires your approval.<br/>
                            <strong>Contract:</strong> {'{{contract.name}}'}<br/>
                            <strong>Value:</strong> {'{{contract.value}}'}<br/><br/>
                            <span className="text-blue-400">Click here to review</span>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
                        <Bot size={20} className="text-blue-400 shrink-0"/>
                        <div>
                            <h5 className="text-sm font-bold text-blue-100">AI Optimization</h5>
                            <p className="text-xs text-blue-200/70">This subject line has a 15% lower open rate than average. Try: "Review Needed: {'{{contract.name}}'}"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionsMatrix: React.FC<{ actions: AppTypeActionConfig[] }> = ({ actions: initialActions }) => {
    const [actions, setActions] = useState<AppTypeActionConfig[]>(initialActions);
    const [selectedAction, setSelectedAction] = useState<AppTypeActionConfig | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = () => {
        const newAction: AppTypeActionConfig = {
            actionKey: `ACT_${Date.now()}`,
            label: 'New Action',
            enabled: true,
            allowedRoles: [],
            stage: 'Draft',
            type: 'workflow',
            config: {}
        };
        setActions([...actions, newAction]);
        setSelectedAction(newAction);
        setIsCreating(true);
    };

    const updateAction = (updatedAction: AppTypeActionConfig) => {
        setActions(actions.map(a => a.actionKey === updatedAction.actionKey ? updatedAction : a));
        setSelectedAction(updatedAction);
    };

    const deleteAction = (key: string) => {
        setActions(actions.filter(a => a.actionKey !== key));
        if (selectedAction?.actionKey === key) setSelectedAction(null);
    };

    return (
        <div className="h-full flex gap-0 bg-dark-950">
            {/* List Pane */}
            <div className="w-80 flex flex-col border-r border-dark-800 bg-dark-900">
                <div className="p-4 border-b border-dark-800">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase">Available Actions</h4>
                        <button onClick={handleCreate} className="text-xs text-brand-400 hover:text-white flex items-center gap-1"><Plus size={12}/> New</button>
                    </div>
                    <Input placeholder="Filter actions..." className="h-8 text-xs bg-dark-950"/>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {actions.map(action => (
                        <div 
                            key={action.actionKey} 
                            onClick={() => setSelectedAction(action)}
                            className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedAction?.actionKey === action.actionKey ? 'bg-brand-500/10 border-brand-500/50 ring-1 ring-brand-500/20' : 'bg-dark-950 border-dark-700 hover:border-dark-500'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-bold ${selectedAction?.actionKey === action.actionKey ? 'text-white' : 'text-slate-300'}`}>{action.label}</span>
                                <Switch checked={action.enabled} onChange={() => updateAction({...action, enabled: !action.enabled})} className="scale-75"/>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                {action.type === 'workflow' && <GitBranch size={10} className="text-blue-400"/>}
                                {action.type === 'webhook' && <Webhook size={10} className="text-purple-400"/>}
                                {action.type === 'form' && <FileText size={10} className="text-yellow-400"/>}
                                <span>{action.type.toUpperCase()}</span>
                                <span className="w-1 h-1 bg-dark-600 rounded-full"></span>
                                <span className="truncate">{action.stage}</span>
                            </div>
                        </div>
                    ))}
                    {actions.length === 0 && <div className="text-center text-xs text-slate-500 py-8">No actions configured.</div>}
                </div>
            </div>

            {/* Config Pane */}
            <div className="flex-1 bg-dark-950 flex flex-col">
                {selectedAction ? (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2">
                        <div className="p-5 border-b border-dark-800 flex justify-between items-center bg-dark-900/50">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${selectedAction.type === 'workflow' ? 'bg-blue-500/20 text-blue-400' : selectedAction.type === 'webhook' ? 'bg-purple-500/20 text-purple-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {selectedAction.type === 'workflow' ? <GitBranch size={18}/> : selectedAction.type === 'webhook' ? <Webhook size={18}/> : <FileText size={18}/>}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">{selectedAction.label}</h3>
                                    <p className="text-xs text-slate-500 font-mono">{selectedAction.actionKey}</p>
                                </div>
                            </div>
                            <Button variant="danger" onClick={() => deleteAction(selectedAction.actionKey)} className="h-8 text-xs"><Trash2 size={14}/> Delete</Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 max-w-3xl space-y-8 custom-scrollbar">
                            {/* General Settings */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-brand-400 uppercase flex items-center gap-2"><Settings size={14}/> General Configuration</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <Input label="Action Label" value={selectedAction.label} onChange={(e) => updateAction({...selectedAction, label: e.target.value})} />
                                    <Input label="Action Key" value={selectedAction.actionKey} disabled className="font-mono text-slate-500 bg-dark-900"/>
                                    <Select 
                                        label="Action Type" 
                                        options={[{label: 'Trigger Workflow', value: 'workflow'}, {label: 'Call Webhook', value: 'webhook'}, {label: 'Open Form', value: 'form'}]}
                                        value={selectedAction.type}
                                        onChange={(e) => updateAction({...selectedAction, type: e.target.value as any})}
                                    />
                                    <Select 
                                        label="Stage Availability" 
                                        options={INITIAL_STAGES.map(s => ({label: s.name, value: s.name}))}
                                        value={selectedAction.stage}
                                        onChange={(e) => updateAction({...selectedAction, stage: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Permissions */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-brand-400 uppercase flex items-center gap-2"><Shield size={14}/> Access Control</h4>
                                <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl">
                                    <label className="text-xs font-bold text-slate-500 mb-3 block">Allowed Roles</label>
                                    <div className="flex flex-wrap gap-2">
                                        {MOCK_ROLES.map(role => {
                                            const isAllowed = selectedAction.allowedRoles.includes(role.id);
                                            return (
                                                <button
                                                    key={role.id}
                                                    onClick={() => {
                                                        const newRoles = isAllowed 
                                                            ? selectedAction.allowedRoles.filter(r => r !== role.id)
                                                            : [...selectedAction.allowedRoles, role.id];
                                                        updateAction({...selectedAction, allowedRoles: newRoles});
                                                    }}
                                                    className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${isAllowed ? 'bg-blue-500 text-white border-blue-500' : 'bg-dark-950 text-slate-400 border-dark-700 hover:border-slate-500'}`}
                                                >
                                                    {role.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Type Specific Config */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-brand-400 uppercase flex items-center gap-2">
                                    {selectedAction.type === 'workflow' ? <GitBranch size={14}/> : selectedAction.type === 'webhook' ? <Webhook size={14}/> : <LayoutTemplate size={14}/>}
                                    {selectedAction.type === 'workflow' ? 'Workflow Target' : selectedAction.type === 'webhook' ? 'Endpoint Details' : 'Form Configuration'}
                                </h4>
                                <div className="p-6 bg-dark-900 border border-dark-700 rounded-xl">
                                    {selectedAction.type === 'workflow' && (
                                        <div className="space-y-4">
                                            <Select label="Select Workflow to Trigger" options={[{label: 'Global Procurement', value: 'wf_proc'}, {label: 'Legal Review', value: 'wf_legal'}]} />
                                            <p className="text-xs text-slate-500">This workflow will be instantiated as a sub-process linked to the current contract.</p>
                                        </div>
                                    )}
                                    {selectedAction.type === 'webhook' && (
                                        <div className="space-y-4">
                                            <Input label="Target URL" placeholder="https://api.external.com/hook..." />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Select label="Method" options={[{label:'POST', value:'POST'}, {label:'GET', value:'GET'}]} />
                                                <Input label="Auth Secret (Optional)" type="password" />
                                            </div>
                                        </div>
                                    )}
                                    {selectedAction.type === 'form' && (
                                        <div className="space-y-4">
                                            <Select label="Form Definition" options={[{label: 'Upload New Version', value: 'upload'}, {label: 'Request Exception', value: 'exception'}]} />
                                            <Switch checked={true} onChange={()=>{}} /> <span className="text-xs text-slate-300">Require Validation</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-dark-800 bg-dark-900/50 flex justify-end">
                            <Button variant="primary" className="shadow-lg shadow-brand-500/20"><Save size={16} className="mr-2"/> Save Action</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-dark-950">
                        <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center mb-4 border border-dark-800">
                            <Command size={32} className="opacity-50"/>
                        </div>
                        <p className="text-sm">Select an action to configure or create new.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const AppTypeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [appType, setAppType] = useState<ApplicationType | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
      // Mock Data Loader
      const mockData: ApplicationType = MOCK_APP_TYPES.find(a => a.id === id) || MOCK_APP_TYPES[0];
      setAppType(mockData);
  }, [id]);

  if (!appType) return null;

  return (
    <div className="h-full flex flex-col bg-dark-950">
      {/* 1. Top Bar */}
      <div className="h-16 border-b border-dark-700 bg-dark-900 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/application-types')} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
            </button>
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-white">{appType.name}</h1>
                    <Badge color={appType.status === 'Published' ? 'green' : 'yellow'}>{appType.status}</Badge>
                    <span className="text-xs font-mono text-slate-500 bg-dark-950 px-2 py-0.5 rounded border border-dark-800">v2.1</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{appType.key}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex bg-dark-950 p-1 rounded-lg border border-dark-800 mr-4">
                <button className="px-3 py-1 text-xs font-bold text-white bg-dark-800 rounded shadow-sm">Draft</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-white transition-colors">Live</button>
            </div>
            <Button variant="secondary" onClick={() => setShowSimulator(true)}>
                <Play size={14} className="mr-2"/> Simulator
            </Button>
            <Button variant="primary" className="shadow-lg shadow-brand-500/20">
                <Save size={16} className="mr-2"/> Publish v2.2
            </Button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-dark-700 bg-dark-900/50 px-6 overflow-x-auto shrink-0">
          {[
              { id: 'overview', icon: Eye, label: 'Overview' },
              { id: 'form', icon: LayoutTemplate, label: 'Intake Form' },
              { id: 'files', icon: Paperclip, label: 'Files & Storage' },
              { id: 'workflow', icon: GitBranch, label: 'Workflow' },
              { id: 'logic', icon: Code, label: 'Logic & Templates' },
              { id: 'notifications', icon: Bell, label: 'Notifications' },
              { id: 'actions', icon: Zap, label: 'Actions Matrix' },
              { id: 'permissions', icon: Shield, label: 'Permissions' },
              { id: 'history', icon: History, label: 'Version History' },
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-400 hover:text-white hover:border-dark-600'}`}
              >
                  <tab.icon size={16}/> {tab.label}
              </button>
          ))}
      </div>

      {/* 3. Main Workspace */}
      <div className="flex-1 overflow-hidden relative">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
              <div className="p-8 max-w-5xl mx-auto space-y-8 overflow-y-auto h-full custom-scrollbar">
                  <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2 space-y-6">
                          <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                              <h3 className="text-lg font-bold text-white mb-4">Metadata</h3>
                              <div className="grid grid-cols-2 gap-6">
                                  <Input label="Name" value={appType.name} onChange={()=>{}} />
                                  <Input label="Key" value={appType.key} disabled className="font-mono text-slate-500 bg-dark-950" />
                                  <div className="col-span-2">
                                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Description</label>
                                      <textarea className="w-full bg-dark-950 border border-dark-700 rounded-lg p-3 text-sm text-white h-24 resize-none" value={appType.description} readOnly />
                                  </div>
                              </div>
                          </div>
                          
                          <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                              <h3 className="text-lg font-bold text-white mb-4">Configuration Health</h3>
                              <div className="space-y-3">
                                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                      <div className="flex items-center gap-3">
                                          <Check size={18} className="text-green-400"/>
                                          <span className="text-sm text-green-200">Intake Form Valid</span>
                                      </div>
                                      <Button variant="ghost" className="text-xs h-6">View</Button>
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                      <div className="flex items-center gap-3">
                                          <AlertTriangle size={18} className="text-yellow-400"/>
                                          <span className="text-sm text-yellow-200">Missing Default Template Fallback</span>
                                      </div>
                                      <Button variant="ghost" className="text-xs h-6 text-yellow-400 hover:text-yellow-300">Fix</Button>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="space-y-6">
                          <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Analytics</h3>
                              <div className="space-y-4">
                                  <div>
                                      <p className="text-2xl font-bold text-white">142</p>
                                      <p className="text-xs text-slate-500">Requests (30d)</p>
                                  </div>
                                  <div>
                                      <p className="text-2xl font-bold text-white">4.2 Days</p>
                                      <p className="text-xs text-slate-500">Avg Cycle Time</p>
                                  </div>
                                  <div className="h-px bg-dark-800"></div>
                                  <Button variant="secondary" className="w-full text-xs">View Detailed Analytics</Button>
                              </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-purple-900/20 to-dark-900 border border-purple-500/30 rounded-xl p-6">
                              <div className="flex items-center gap-2 mb-3 text-purple-400">
                                  <Sparkles size={16}/>
                                  <span className="text-xs font-bold uppercase">AI Insight</span>
                              </div>
                              <p className="text-xs text-purple-200/80 leading-relaxed">
                                  This application type has a 20% higher rejection rate at the "Legal Review" stage compared to others. Consider adding a pre-approval step.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* Form Builder Tab */}
          {activeTab === 'form' && (
              <VisualFormBuilder 
                  sections={appType.intakeForm.sections}
                  fields={appType.intakeForm.fields}
                  onUpdate={(s, f) => setAppType({...appType, intakeForm: {...appType.intakeForm, sections: s, fields: f}})}
              />
          )}

          {/* Files & Storage Tab */}
          {activeTab === 'files' && (
              <AttachmentStoragePanel 
                  appType={appType} 
                  onChange={(updated) => setAppType(updated)} 
              />
          )}

          {/* Workflow Tab */}
          {activeTab === 'workflow' && (
              <div className="h-full flex flex-col items-center justify-center bg-dark-950 text-slate-500">
                  <div className="text-center max-w-md">
                      <GitBranch size={48} className="mx-auto mb-4 opacity-20"/>
                      <h3 className="text-xl font-bold text-white mb-2">Workflow Mapper</h3>
                      <p className="text-sm mb-6">Visualize and connect this application type to specific workflow definitions.</p>
                      <div className="flex items-center gap-2 bg-dark-900 p-2 rounded-lg border border-dark-800 mb-6 text-left">
                          <div className="p-2 bg-blue-500/10 rounded text-blue-400"><Layers size={20}/></div>
                          <div className="flex-1">
                              <p className="text-xs font-bold text-white">Mapped Workflow</p>
                              <p className="text-xs text-slate-400">Global Enterprise Procurement v2</p>
                          </div>
                          <Button variant="ghost" className="text-xs">Change</Button>
                      </div>
                      <Button variant="primary" onClick={() => window.open('/#/workflow-ai/wf_global_procurement', '_blank')}>Open Workflow Designer <Maximize2 size={14} className="ml-2"/></Button>
                  </div>
              </div>
          )}

          {/* Logic Tab */}
          {activeTab === 'logic' && (
              <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                  <div className="max-w-4xl mx-auto space-y-6">
                      <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-white">Template Selection Rules</h3>
                          <Button variant="secondary"><Plus size={14} className="mr-2"/> Add Rule</Button>
                      </div>
                      
                      {appType.templateRules.map((rule, i) => (
                          <div key={rule.id} className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex gap-4 items-start hover:border-brand-500/30 transition-all">
                              <div className="w-6 h-6 rounded-full bg-dark-800 flex items-center justify-center text-xs font-bold text-slate-500 mt-1">{rule.priority}</div>
                              <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-3">
                                      <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-1 rounded border border-brand-500/20">IF</span>
                                      <code className="text-sm text-slate-200 font-mono bg-dark-950 px-2 py-1 rounded border border-dark-800 flex-1">{rule.conditionExpression}</code>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">THEN USE</span>
                                      <div className="flex items-center gap-2 text-sm text-white font-bold bg-dark-950 px-3 py-1.5 rounded border border-dark-800">
                                          <FileText size={14} className="text-slate-400"/>
                                          {MOCK_TEMPLATES.find(t => t.id === rule.templateId)?.name}
                                      </div>
                                  </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                  <Button variant="ghost" className="h-8 w-8 p-0"><Edit2 size={14}/></Button>
                                  <Button variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300"><Trash2 size={14}/></Button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
              <NotificationStudio notifications={appType.notifications} />
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
              <ActionsMatrix actions={appType.actions} />
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
              <PermissionsPanel 
                  appType={appType} 
                  onChange={(updated) => setAppType(updated)} 
              />
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
              <div className="p-8 max-w-4xl mx-auto">
                  <div className="relative border-l border-dark-800 pl-8 space-y-8">
                      {[
                          { ver: '2.1', date: '2 hours ago', user: 'Admin', note: 'Added region field to intake form', current: true },
                          { ver: '2.0', date: '1 day ago', user: 'Legal Ops', note: 'Updated workflow mapping' },
                          { ver: '1.0', date: '1 month ago', user: 'System', note: 'Initial creation' }
                      ].map((h, i) => (
                          <div key={h.ver} className="relative group">
                              <div className={`absolute -left-[39px] top-1 w-5 h-5 rounded-full border-4 border-dark-950 ${h.current ? 'bg-brand-500' : 'bg-dark-700'}`}></div>
                              <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 hover:border-brand-500/30 transition-all">
                                  <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-3">
                                          <span className="text-lg font-bold text-white">v{h.ver}</span>
                                          {h.current && <Badge color="green">Live</Badge>}
                                      </div>
                                      <span className="text-xs text-slate-500">{h.date}</span>
                                  </div>
                                  <p className="text-sm text-slate-300 mb-3">{h.note}</p>
                                  <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-xs text-slate-500">
                                          <Avatar name={h.user} size="sm"/> {h.user}
                                      </div>
                                      <div className="flex gap-2">
                                          <Button variant="secondary" className="text-xs h-7">View Config</Button>
                                          {!h.current && <Button variant="ghost" className="text-xs h-7 flex items-center gap-1"><RotateCcw size={12}/> Rollback</Button>}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

      </div>

      {/* Simulator Overlay */}
      {showSimulator && <SimulationPanel appType={appType} onClose={() => setShowSimulator(false)} />}
    </div>
  );
};

export default AppTypeDetail;
