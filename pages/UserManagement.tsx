
import React, { useState } from 'react';
import { Card, Button, Input, Badge, Select, Switch, Avatar } from '../components/UIComponents';
import { MOCK_USERS, MOCK_DEPARTMENTS, MOCK_ROLES, MOCK_GROUPS, MOCK_ORGANIZATION, MOCK_PERMISSIONS } from '../mock/data';
import { User, UserRole, RoleDefinition, Permission, Department, UserGroup } from '../types';
import { 
  Users, Shield, Building, Briefcase, Settings, Plus, Search, 
  Filter, MoreVertical, Edit2, Trash2, CheckCircle, AlertTriangle, 
  Lock, Mail, Calendar, LayoutGrid, List, ChevronRight, UserPlus,
  Key, Users2, Layers, Globe, X, Save, CheckSquare, Download, Check,
  Link as LinkIcon, RefreshCw, Server, FileCode, ShieldCheck
} from 'lucide-react';

// --- TYPES & ENUMS FOR SSO ---
type SSOProvider = 'Okta' | 'AzureAD' | 'Google' | 'CustomSAML';

interface SSOConfig {
  enabled: boolean;
  provider: SSOProvider;
  entityId: string;
  ssoUrl: string;
  certificate: string;
  enforceSSO: boolean;
  jitProvisioning: boolean;
  defaultRole: UserRole;
  domains: { domain: string; verified: boolean }[];
  attributeMapping: {
    email: string;
    firstName: string;
    lastName: string;
    department: string;
  };
}

const INITIAL_SSO_CONFIG: SSOConfig = {
  enabled: false,
  provider: 'Okta',
  entityId: 'http://www.okta.com/exk123456',
  ssoUrl: 'https://dev-123456.okta.com/app/agreemetrix/sso/saml',
  certificate: '-----BEGIN CERTIFICATE-----\nMIIDtjCCAp6gAwIBAgIG...',
  enforceSSO: false,
  jitProvisioning: true,
  defaultRole: UserRole.VIEWER,
  domains: [
    { domain: 'pearsonspecter.com', verified: true },
    { domain: 'psl.legal', verified: false }
  ],
  attributeMapping: {
    email: 'user.email',
    firstName: 'user.firstName',
    lastName: 'user.lastName',
    department: 'user.department'
  }
};

// --- MODALS ---

const UserModal: React.FC<{ 
  user: Partial<User> | null; 
  onClose: () => void; 
  onSave: (user: Partial<User>) => void 
}> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<User>>(user || {
    name: '',
    email: '',
    role: UserRole.VIEWER,
    departmentId: '',
    status: 'Invited'
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-dark-900 w-full max-w-md rounded-2xl border border-dark-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
             <h3 className="text-lg font-bold text-white">{user?.id ? 'Edit User' : 'Invite New User'}</h3>
             <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
          </div>
          <div className="p-6 space-y-4">
             <Input 
                label="Full Name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. John Doe"
             />
             <Input 
                label="Email Address" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@company.com"
             />
             <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Role"
                  options={Object.values(UserRole).map(r => ({label: r, value: r}))}
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                />
                <Select 
                  label="Department"
                  options={MOCK_DEPARTMENTS.map(d => ({label: d.name, value: d.id}))}
                  value={formData.departmentId}
                  onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                />
             </div>
             <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                   <Switch checked={formData.status === 'Active'} onChange={(c) => setFormData({...formData, status: c ? 'Active' : 'Inactive'})} />
                   <span className="text-sm text-slate-300">Activate user immediately</span>
                </label>
             </div>
          </div>
          <div className="p-6 border-t border-dark-700 bg-dark-950/30 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose}>Cancel</Button>
             <Button variant="primary" onClick={() => onSave(formData)}>{user?.id ? 'Save Changes' : 'Send Invitation'}</Button>
          </div>
       </div>
    </div>
  );
};

const GroupModal: React.FC<{
  group: UserGroup | null;
  allUsers: User[];
  onClose: () => void;
  onSave: (group: UserGroup) => void;
}> = ({ group, allUsers, onClose, onSave }) => {
  const [formData, setFormData] = useState<UserGroup>(group || {
    id: `grp_${Date.now()}`,
    name: '',
    description: '',
    members: []
  });
  const [searchMember, setSearchMember] = useState('');

  const toggleMember = (userId: string) => {
     const current = formData.members;
     if (current.includes(userId)) {
        setFormData({...formData, members: current.filter(id => id !== userId)});
     } else {
        setFormData({...formData, members: [...current, userId]});
     }
  };

  const filteredUsers = allUsers.filter(u => u.name.toLowerCase().includes(searchMember.toLowerCase()) || u.email.toLowerCase().includes(searchMember.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-dark-900 w-full max-w-2xl rounded-2xl border border-dark-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
          <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400"><Users2 size={20}/></div>
                <div>
                   <h3 className="text-lg font-bold text-white">{group?.id ? 'Edit Group' : 'Create New Group'}</h3>
                   <p className="text-xs text-slate-500">Groups allow for team-based assignment and visibility.</p>
                </div>
             </div>
             <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
             <div className="grid grid-cols-1 gap-4">
                <Input 
                   label="Group Name" 
                   value={formData.name} 
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   placeholder="e.g. US Legal Team"
                />
                <Input 
                   label="Description" 
                   value={formData.description} 
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   placeholder="Purpose of this group..."
                />
             </div>

             <div>
                <div className="flex justify-between items-center mb-3">
                   <h4 className="text-xs font-bold text-slate-500 uppercase">Add Members ({formData.members.length})</h4>
                   <div className="relative w-48">
                      <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500"/>
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="w-full bg-dark-950 border border-dark-700 rounded-lg py-1.5 pl-8 pr-2 text-xs text-white focus:border-brand-500 outline-none"
                        value={searchMember}
                        onChange={(e) => setSearchMember(e.target.value)}
                      />
                   </div>
                </div>
                
                <div className="border border-dark-700 rounded-xl bg-dark-950/50 overflow-hidden h-64 overflow-y-auto custom-scrollbar">
                   {filteredUsers.map(user => {
                      const isSelected = formData.members.includes(user.id);
                      return (
                         <div 
                            key={user.id} 
                            onClick={() => toggleMember(user.id)}
                            className={`flex items-center justify-between p-3 border-b border-dark-800 cursor-pointer transition-colors ${isSelected ? 'bg-brand-500/10' : 'hover:bg-white/5'}`}
                         >
                            <div className="flex items-center gap-3">
                               <Avatar size="sm" name={user.name} />
                               <div>
                                  <p className={`text-sm font-medium ${isSelected ? 'text-brand-400' : 'text-white'}`}>{user.name}</p>
                                  <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-600'}`}>
                               {isSelected && <Check size={14} />}
                            </div>
                         </div>
                      )
                   })}
                </div>
             </div>
          </div>

          <div className="p-6 border-t border-dark-700 bg-dark-950/30 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose}>Cancel</Button>
             <Button variant="primary" onClick={() => onSave(formData)}>Save Group</Button>
          </div>
       </div>
    </div>
  );
};

const RoleModal: React.FC<{
  role: RoleDefinition | null;
  onClose: () => void;
  onSave: (role: RoleDefinition) => void;
}> = ({ role, onClose, onSave }) => {
  const [formData, setFormData] = useState<RoleDefinition>(role || {
    id: `role_${Date.now()}`,
    name: '',
    description: '',
    isSystem: false,
    usersCount: 0,
    permissions: []
  });

  const togglePermission = (permKey: string) => {
    const current = formData.permissions;
    if (current.includes(permKey)) {
      setFormData({...formData, permissions: current.filter(p => p !== permKey)});
    } else {
      setFormData({...formData, permissions: [...current, permKey]});
    }
  };

  // Group permissions by module
  const permissionsByModule = MOCK_PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-dark-900 w-full max-w-2xl rounded-2xl border border-dark-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-950/50">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400"><Shield size={20}/></div>
                <div>
                   <h3 className="text-lg font-bold text-white">{role?.id ? 'Configure Role' : 'Create New Role'}</h3>
                   <p className="text-xs text-slate-500">Define access levels and capabilities.</p>
                </div>
             </div>
             <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
             <div className="space-y-4">
                <Input 
                   label="Role Name" 
                   value={formData.name} 
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   placeholder="e.g. Compliance Officer"
                />
                <Input 
                   label="Description" 
                   value={formData.description} 
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   placeholder="What does this role do?"
                />
             </div>

             <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 border-b border-white/5 pb-2">Permissions</h4>
                <div className="space-y-6">
                   {Object.entries(permissionsByModule).map(([module, perms]) => (
                      <div key={module}>
                         <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> {module}
                         </h5>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {perms.map(perm => {
                               const isSelected = formData.permissions.includes(perm.key);
                               return (
                                  <div 
                                    key={perm.id}
                                    onClick={() => togglePermission(perm.key)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-brand-500/10 border-brand-500/50' : 'bg-dark-950 border-dark-700 hover:border-slate-500'}`}
                                  >
                                     <div className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-600'}`}>
                                           {isSelected && <Check size={14} />}
                                        </div>
                                        <div>
                                           <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{perm.name}</p>
                                           <p className="text-xs text-slate-500 mt-0.5 leading-tight">{perm.description}</p>
                                        </div>
                                     </div>
                                  </div>
                               )
                            })}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="p-6 border-t border-dark-700 bg-dark-950/30 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose}>Cancel</Button>
             <Button variant="primary" onClick={() => onSave(formData)}>Save Configuration</Button>
          </div>
       </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'departments' | 'groups' | 'org'>('users');
  const [users, setUsers] = useState(MOCK_USERS);
  const [roles, setRoles] = useState(MOCK_ROLES);
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [ssoConfig, setSsoConfig] = useState<SSOConfig>(INITIAL_SSO_CONFIG);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Modal States
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);

  // Bulk Selection
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Filter Users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handlers
  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const handleUserSelection = (userId: string) => {
     if (selectedUsers.includes(userId)) {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
     } else {
        setSelectedUsers([...selectedUsers, userId]);
     }
  };

  const handleSelectAll = () => {
     if (selectedUsers.length === filteredUsers.length) {
        setSelectedUsers([]);
     } else {
        setSelectedUsers(filteredUsers.map(u => u.id));
     }
  };

  const handleSaveUser = (userData: Partial<User>) => {
     if (userData.id) {
        setUsers(users.map(u => u.id === userData.id ? { ...u, ...userData } as User : u));
     } else {
        const newUser: User = {
           id: `u_${Date.now()}`,
           ...userData as User,
           lastLogin: 'Never',
           groups: []
        };
        setUsers([...users, newUser]);
     }
     setShowUserModal(false);
     setEditingUser(null);
  };

  const handleSaveRole = (roleData: RoleDefinition) => {
      if (roles.find(r => r.id === roleData.id)) {
          setRoles(roles.map(r => r.id === roleData.id ? roleData : r));
      } else {
          setRoles([...roles, roleData]);
      }
      setShowRoleModal(false);
      setEditingRole(null);
  };

  const handleSaveGroup = (groupData: UserGroup) => {
      if (groups.find(g => g.id === groupData.id)) {
          setGroups(groups.map(g => g.id === groupData.id ? groupData : g));
      } else {
          setGroups([...groups, groupData]);
      }
      setShowGroupModal(false);
      setEditingGroup(null);
  };

  const handleDeleteGroup = (groupId: string) => {
     setGroups(groups.filter(g => g.id !== groupId));
  };

  const handleTestSSO = () => {
      setIsTestRunning(true);
      setTestStatus('idle');
      setTimeout(() => {
          setIsTestRunning(false);
          setTestStatus('success');
      }, 2000);
  };

  // --- SUB-COMPONENTS ---

  const renderUsersTab = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
       {/* Stats Row */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
             <div className="p-3 rounded-lg bg-brand-500/10 text-brand-400"><Users size={24}/></div>
             <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Total Users</p>
                <h3 className="text-2xl font-bold text-white">{users.length}</h3>
             </div>
          </div>
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
             <div className="p-3 rounded-lg bg-green-500/10 text-green-400"><CheckCircle size={24}/></div>
             <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Active</p>
                <h3 className="text-2xl font-bold text-white">{users.filter(u => u.status === 'Active').length}</h3>
             </div>
          </div>
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
             <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400"><Mail size={24}/></div>
             <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Invited</p>
                <h3 className="text-2xl font-bold text-white">{users.filter(u => u.status === 'Invited').length}</h3>
             </div>
          </div>
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
             <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400"><Key size={24}/></div>
             <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Licenses Used</p>
                <h3 className="text-2xl font-bold text-white">{MOCK_ORGANIZATION.licenseUsed} / {MOCK_ORGANIZATION.licenseCount}</h3>
             </div>
          </div>
       </div>

       {/* Toolbar */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-dark-900/50 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-4 flex-1 w-full">
             {selectedUsers.length > 0 ? (
                <div className="flex items-center gap-4 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-lg w-full animate-in slide-in-from-left-2">
                   <span className="text-sm font-bold text-brand-400">{selectedUsers.length} Selected</span>
                   <div className="h-4 w-px bg-brand-500/30"></div>
                   <button className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2"><Trash2 size={14}/> Delete</button>
                   <button className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2"><Lock size={14}/> Deactivate</button>
                   <div className="flex-1"></div>
                   <button onClick={() => setSelectedUsers([])} className="text-xs text-slate-500 hover:text-white"><X size={16}/></button>
                </div>
             ) : (
                <>
                   <div className="relative max-w-md w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <Input 
                         placeholder="Search users..." 
                         className="pl-10 bg-dark-950 h-10"
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                      />
                   </div>
                   <Select 
                      options={[{label: 'All Roles', value: 'All'}, ...roles.map(r => ({label: r.name, value: r.id}))]} 
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-48 h-10"
                   />
                   <Button variant="secondary" className="h-10"><Filter size={16} className="mr-2"/> Filters</Button>
                </>
             )}
          </div>
          <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-brand-500/20 h-10" onClick={() => { setEditingUser(null); setShowUserModal(true); }}>
             <UserPlus size={16}/> Invite User
          </Button>
       </div>

       {/* Users Table */}
       <Card noPadding>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-dark-950 text-slate-500 text-xs uppercase font-semibold">
                   <tr>
                      <th className="px-6 py-3 w-10">
                         <input type="checkbox" checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} onChange={handleSelectAll} className="rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-offset-dark-900" />
                      </th>
                      <th className="px-6 py-3">User Profile</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Last Login</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {filteredUsers.map(user => (
                      <tr key={user.id} className={`hover:bg-white/5 transition-colors group ${selectedUsers.includes(user.id) ? 'bg-brand-500/5' : ''}`}>
                         <td className="px-6 py-4">
                            <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleUserSelection(user.id)} className="rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-offset-dark-900" />
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <Avatar name={user.name} />
                               <div>
                                  <p className="font-bold text-white">{user.name}</p>
                                  <p className="text-xs text-slate-500">{user.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <Badge color="blue">{user.role}</Badge>
                         </td>
                         <td className="px-6 py-4 text-slate-300">
                            {departments.find(d => d.id === user.departmentId)?.name || '-'}
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <Switch checked={user.status === 'Active'} onChange={() => handleStatusToggle(user.id)} className="scale-75"/>
                               <span className={`text-xs font-medium ${user.status === 'Active' ? 'text-green-400' : 'text-slate-500'}`}>{user.status}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-xs font-mono">
                            {user.lastLogin}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => { setEditingUser(user); setShowUserModal(true); }} className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white" title="Edit"><Edit2 size={14}/></button>
                               <button className="p-1.5 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-500" title="Delete"><Trash2 size={14}/></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
          {filteredUsers.length === 0 && (
             <div className="p-12 text-center text-slate-500">
                <Users size={48} className="mx-auto mb-4 opacity-20"/>
                <p>No users found matching your search.</p>
             </div>
          )}
       </Card>
    </div>
  );

  const renderRolesTab = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-start">
          <div>
             <h3 className="text-lg font-bold text-white">Roles & Permissions</h3>
             <p className="text-slate-400 text-sm">Manage granular access control across the platform.</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2" onClick={() => { setEditingRole(null); setShowRoleModal(true); }}>
             <Plus size={16}/> Create Role
          </Button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {roles.map(role => (
             <Card key={role.id} className="relative overflow-hidden group flex flex-col hover:-translate-y-1 transition-transform duration-300" noPadding>
                <div className="p-5 border-b border-white/5 bg-dark-950/50">
                   <div className="flex justify-between items-start mb-2">
                      <Shield size={24} className={role.isSystem ? 'text-slate-500' : 'text-brand-400'} />
                      {role.isSystem && <Badge color="gray">System</Badge>}
                   </div>
                   <h4 className="text-lg font-bold text-white mb-1">{role.name}</h4>
                   <p className="text-xs text-slate-500 h-8 line-clamp-2">{role.description}</p>
                </div>
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-end">
                   <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                      <span className="text-slate-400">Users Assigned</span>
                      <span className="text-white font-bold">{role.usersCount}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Permissions</span>
                      <span className="text-white font-bold">{role.permissions.length}</span>
                   </div>
                   <Button variant="secondary" className="w-full text-xs mt-2" onClick={() => { setEditingRole(role); setShowRoleModal(true); }}>Configure Permissions</Button>
                </div>
             </Card>
          ))}
       </div>

       {/* Permissions Matrix Preview */}
       <Card title="Permissions Matrix Overview" noPadding>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left text-slate-400">
                <thead className="bg-dark-950 text-xs uppercase font-bold text-slate-500 sticky top-0 z-10">
                   <tr>
                      <th className="px-6 py-3 border-b border-white/5 bg-dark-950">Permission Module</th>
                      {roles.map(role => (
                         <th key={role.id} className="px-6 py-3 border-b border-white/5 text-center bg-dark-950">{role.name}</th>
                      ))}
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {MOCK_PERMISSIONS.map(perm => (
                      <tr key={perm.id} className="hover:bg-white/5 transition-colors">
                         <td className="px-6 py-3">
                            <div className="font-medium text-white">{perm.name}</div>
                            <div className="text-xs text-slate-500">{perm.description}</div>
                         </td>
                         {roles.map(role => (
                            <td key={role.id} className="px-6 py-3 text-center">
                               <div className="flex justify-center">
                                  {role.permissions.includes(perm.key) ? (
                                     <CheckCircle size={18} className="text-green-500" />
                                  ) : (
                                     <div className="w-4 h-4 rounded-full border-2 border-dark-700"></div>
                                  )}
                               </div>
                            </td>
                         ))}
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </Card>
    </div>
  );

  const renderOrgTab = () => (
    <div className="max-w-5xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
       <Card title="Organization Profile">
          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="w-32 h-32 bg-dark-950 border border-dark-700 rounded-2xl flex items-center justify-center text-slate-600 relative group cursor-pointer overflow-hidden">
                <Building size={48} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity backdrop-blur-sm">Change Logo</div>
             </div>
             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <Input label="Organization Name" defaultValue={MOCK_ORGANIZATION.name} />
                <Input label="Primary Domain" defaultValue={MOCK_ORGANIZATION.domain} disabled />
                <Input label="Contact Email" defaultValue={MOCK_ORGANIZATION.primaryContactEmail} />
                <Select label="Subscription Tier" options={[{label: 'Starter', value: 'Starter'}, {label: 'Growth', value: 'Growth'}, {label: 'Enterprise', value: 'Enterprise'}]} defaultValue={MOCK_ORGANIZATION.subscriptionTier} disabled />
                <div className="md:col-span-2">
                   <Input label="Headquarters Address" defaultValue={MOCK_ORGANIZATION.address} />
                </div>
             </div>
          </div>
          <div className="mt-8 flex justify-end pt-6 border-t border-white/5">
             <Button variant="primary" className="shadow-lg shadow-brand-500/20"><Save size={16} className="mr-2"/> Save Changes</Button>
          </div>
       </Card>

       {/* Complete SSO Configuration */}
       <Card title="Single Sign-On (SSO) Configuration">
           <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl">
                 <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${ssoConfig.enabled ? 'bg-green-500/20 text-green-400' : 'bg-dark-800 text-slate-500'}`}>
                       <ShieldCheck size={24}/>
                    </div>
                    <div>
                       <h4 className="font-bold text-white">SAML 2.0 Authentication</h4>
                       <p className="text-sm text-slate-400">Manage access via your identity provider.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${ssoConfig.enabled ? 'text-green-400' : 'text-slate-500'}`}>{ssoConfig.enabled ? 'Active' : 'Disabled'}</span>
                    <Switch checked={ssoConfig.enabled} onChange={(c) => setSsoConfig({...ssoConfig, enabled: c})} />
                 </div>
              </div>

              {ssoConfig.enabled && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 animate-in fade-in duration-300">
                     {/* Left: Main Config */}
                     <div className="lg:col-span-7 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Identity Provider</label>
                            <div className="grid grid-cols-4 gap-3">
                               {['Okta', 'AzureAD', 'Google', 'CustomSAML'].map((p) => (
                                  <button 
                                    key={p} 
                                    onClick={() => setSsoConfig({...ssoConfig, provider: p as SSOProvider})}
                                    className={`p-3 rounded-lg border text-center text-xs font-bold transition-all ${ssoConfig.provider === p ? 'bg-brand-500/10 border-brand-500 text-brand-400' : 'bg-dark-950 border-dark-700 text-slate-400 hover:border-slate-500'}`}
                                  >
                                     {p}
                                  </button>
                               ))}
                            </div>
                        </div>

                        <Input 
                           label="IdP Entity ID" 
                           value={ssoConfig.entityId} 
                           onChange={(e) => setSsoConfig({...ssoConfig, entityId: e.target.value})}
                           placeholder="https://www.okta.com/..."
                        />
                        <Input 
                           label="Single Sign-On URL (ACS)" 
                           value={ssoConfig.ssoUrl} 
                           onChange={(e) => setSsoConfig({...ssoConfig, ssoUrl: e.target.value})}
                           placeholder="https://idp.example.com/sso/saml"
                        />
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">X.509 Certificate</label>
                           <textarea 
                              className="w-full h-24 bg-dark-950 border border-dark-700 rounded-lg p-3 text-xs font-mono text-slate-300 focus:border-brand-500 outline-none resize-none"
                              value={ssoConfig.certificate}
                              onChange={(e) => setSsoConfig({...ssoConfig, certificate: e.target.value})}
                           />
                        </div>

                        <div className="p-4 bg-dark-950 rounded-xl border border-dark-700 space-y-4">
                            <h5 className="text-sm font-bold text-white flex items-center gap-2"><Server size={14}/> Provisioning Settings</h5>
                            <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-300">Just-in-Time (JIT) Provisioning</span>
                               <Switch checked={ssoConfig.jitProvisioning} onChange={(c) => setSsoConfig({...ssoConfig, jitProvisioning: c})} />
                            </div>
                            <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-300">Enforce SSO (Disable Password Login)</span>
                               <Switch checked={ssoConfig.enforceSSO} onChange={(c) => setSsoConfig({...ssoConfig, enforceSSO: c})} />
                            </div>
                        </div>
                     </div>

                     {/* Right: Mapping & Testing */}
                     <div className="lg:col-span-5 space-y-6">
                         <div className="bg-dark-950 border border-dark-700 rounded-xl p-5">
                            <h5 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><FileCode size={14}/> Attribute Mapping</h5>
                            <div className="space-y-3">
                               {Object.entries(ssoConfig.attributeMapping).map(([key, val]) => (
                                  <div key={key} className="flex items-center gap-2">
                                     <span className="w-24 text-xs text-slate-500 uppercase font-bold">{key}</span>
                                     <span className="text-slate-600">=</span>
                                     <input 
                                        className="flex-1 bg-dark-900 border border-dark-800 rounded px-2 py-1.5 text-xs text-white font-mono focus:border-brand-500 outline-none"
                                        value={val}
                                        onChange={(e) => setSsoConfig({...ssoConfig, attributeMapping: {...ssoConfig.attributeMapping, [key]: e.target.value}})}
                                     />
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div className="bg-dark-950 border border-dark-700 rounded-xl p-5">
                             <h5 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Globe size={14}/> Domain Verification</h5>
                             <div className="space-y-2">
                                {ssoConfig.domains.map((d, i) => (
                                   <div key={i} className="flex items-center justify-between p-2 bg-dark-900 rounded border border-dark-800">
                                      <span className="text-sm text-slate-300">{d.domain}</span>
                                      {d.verified ? 
                                         <Badge color="green" className="flex items-center gap-1"><Check size={10}/> Verified</Badge> : 
                                         <Badge color="yellow">Pending DNS</Badge>
                                      }
                                   </div>
                                ))}
                                <button className="text-xs text-brand-400 hover:text-white flex items-center gap-1 mt-2"><Plus size={12}/> Add Domain</button>
                             </div>
                         </div>

                         <div className="pt-4 border-t border-dark-700">
                             <Button 
                                variant="secondary" 
                                className={`w-full mb-3 ${testStatus === 'success' ? 'border-green-500/50 text-green-400 bg-green-500/10' : ''}`}
                                onClick={handleTestSSO}
                                disabled={isTestRunning}
                             >
                                {isTestRunning ? <RefreshCw size={14} className="animate-spin mr-2"/> : testStatus === 'success' ? <CheckCircle size={14} className="mr-2"/> : <LinkIcon size={14} className="mr-2"/>}
                                {isTestRunning ? 'Testing Connection...' : testStatus === 'success' ? 'Connection Verified' : 'Test SSO Connection'}
                             </Button>
                             <Button variant="primary" className="w-full">Save Configuration</Button>
                         </div>
                     </div>
                  </div>
              )}
           </div>
       </Card>
    </div>
  );

  const renderDepartmentsTab = () => (
     <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
           <div>
              <h3 className="text-lg font-bold text-white">Departments</h3>
              <p className="text-slate-400 text-sm">Organize users into functional units for reporting and workflows.</p>
           </div>
           <Button variant="primary" className="flex items-center gap-2"><Plus size={16}/> Add Department</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {departments.map(dept => (
              <Card key={dept.id} className="group hover:border-brand-500/30 transition-all cursor-pointer hover:-translate-y-1 duration-300">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-dark-950 rounded-lg border border-dark-700 text-slate-400 group-hover:text-white group-hover:bg-dark-800 transition-colors">
                       <Briefcase size={20} />
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-slate-500 bg-dark-900 px-2 py-1 rounded">{dept.memberCount} Members</span>
                    </div>
                 </div>
                 <h4 className="text-lg font-bold text-white mb-2">{dept.name}</h4>
                 <p className="text-xs text-slate-500 mb-4 h-10 line-clamp-2">{dept.description}</p>
                 
                 <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="text-xs text-slate-500 font-bold uppercase">Head</div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                       <span className="text-sm text-slate-300">{users.find(u => u.id === dept.headId)?.name || 'Unassigned'}</span>
                       <Avatar size="sm" name={users.find(u => u.id === dept.headId)?.name || 'U'} />
                    </div>
                 </div>
              </Card>
           ))}
           
           {/* Add New Placeholder */}
           <button className="border-2 border-dashed border-dark-700 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all duration-300 min-h-[200px]">
              <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mb-4">
                <Plus size={24} />
              </div>
              <span className="font-bold">Create Department</span>
           </button>
        </div>
     </div>
  );

  const renderGroupsTab = () => (
     <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
           <div>
              <h3 className="text-lg font-bold text-white">User Groups</h3>
              <p className="text-slate-400 text-sm">Create cross-functional teams for specific projects or regions.</p>
           </div>
           <Button variant="primary" className="flex items-center gap-2" onClick={() => { setEditingGroup(null); setShowGroupModal(true); }}>
               <Plus size={16}/> Create Group
           </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {groups.map(group => (
              <div key={group.id} className="bg-dark-900 border border-dark-700 rounded-xl p-6 hover:border-brand-500/30 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-16 bg-brand-500/5 rounded-full blur-2xl -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 
                 <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-white group-hover:bg-blue-500 transition-colors"><Users2 size={20}/></div>
                       <div>
                           <h4 className="text-lg font-bold text-white">{group.name}</h4>
                           <span className="text-xs text-slate-500">{group.members.length} Members</span>
                       </div>
                    </div>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => { setEditingGroup(group); setShowGroupModal(true); }}
                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                            title="Edit Group"
                        >
                            <Edit2 size={14}/>
                        </button>
                        <button 
                            onClick={() => handleDeleteGroup(group.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete Group"
                        >
                            <Trash2 size={14}/>
                        </button>
                    </div>
                 </div>
                 
                 <p className="text-sm text-slate-400 mb-6 h-10 line-clamp-2 relative z-10">{group.description}</p>
                 
                 <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                    <div className="flex -space-x-2 overflow-hidden pl-2">
                       {group.members.slice(0, 4).map(mid => (
                          <div key={mid} className="w-8 h-8 rounded-full border-2 border-dark-900 bg-dark-800 transition-transform hover:scale-110 hover:z-10" title={users.find(u => u.id === mid)?.name}>
                             <Avatar size="sm" name={users.find(u => u.id === mid)?.name || 'U'} className="w-full h-full text-[10px]"/>
                          </div>
                       ))}
                       {group.members.length > 4 && (
                          <div className="w-8 h-8 rounded-full border-2 border-dark-900 bg-dark-800 flex items-center justify-center text-[9px] text-slate-400 font-bold">+{group.members.length - 4}</div>
                       )}
                       <button 
                            onClick={() => { setEditingGroup(group); setShowGroupModal(true); }}
                            className="w-8 h-8 rounded-full border-2 border-dark-900 bg-dark-800 flex items-center justify-center text-[10px] text-slate-500 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-colors ml-2 z-10"
                        >
                          <Plus size={12}/>
                       </button>
                    </div>
                 </div>
              </div>
           ))}
           
           {/* New Group Card */}
           <button 
                onClick={() => { setEditingGroup(null); setShowGroupModal(true); }}
                className="border-2 border-dashed border-dark-700 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all duration-300 min-h-[200px]"
           >
              <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mb-4 shadow-lg">
                <Plus size={24} />
              </div>
              <span className="font-bold">Create New Group</span>
           </button>
        </div>
     </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">User Management</h2>
        <p className="text-slate-400">Manage users, roles, organization settings, and access controls.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto">
         <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'users' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-400 hover:text-white'}`}
         >
            <Users size={16}/> Users
         </button>
         <button 
            onClick={() => setActiveTab('roles')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'roles' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-400 hover:text-white'}`}
         >
            <Shield size={16}/> Roles & Permissions
         </button>
         <button 
            onClick={() => setActiveTab('departments')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'departments' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-400 hover:text-white'}`}
         >
            <Building size={16}/> Departments
         </button>
         <button 
            onClick={() => setActiveTab('groups')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'groups' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-400 hover:text-white'}`}
         >
            <Users2 size={16}/> Groups
         </button>
         <button 
            onClick={() => setActiveTab('org')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'org' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-400 hover:text-white'}`}
         >
            <Settings size={16}/> Organization
         </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10 pr-2">
         {activeTab === 'users' && renderUsersTab()}
         {activeTab === 'roles' && renderRolesTab()}
         {activeTab === 'departments' && renderDepartmentsTab()}
         {activeTab === 'groups' && renderGroupsTab()}
         {activeTab === 'org' && renderOrgTab()}
      </div>

      {/* Modals */}
      {showUserModal && <UserModal user={editingUser} onClose={() => setShowUserModal(false)} onSave={handleSaveUser} />}
      {showRoleModal && <RoleModal role={editingRole} onClose={() => setShowRoleModal(false)} onSave={handleSaveRole} />}
      {showGroupModal && <GroupModal group={editingGroup} allUsers={users} onClose={() => setShowGroupModal(false)} onSave={handleSaveGroup} />}
    </div>
  );
};

export default UserManagement;