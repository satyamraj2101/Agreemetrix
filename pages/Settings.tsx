import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../components/UIComponents';
import { User, Lock, Bell, Mail, Globe, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Lock },
    { id: 'email', label: 'Email Templates', icon: Mail },
    { id: 'regional', label: 'Regional Settings', icon: Globe },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white tracking-wide">System Settings</h2>
      
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="col-span-12 md:col-span-3 space-y-1">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                 activeTab === tab.id 
                   ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' 
                   : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
               }`}
             >
               <tab.icon size={18} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="col-span-12 md:col-span-9">
          <Card>
             {activeTab === 'profile' && (
               <div className="space-y-6">
                 <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Profile Settings</h3>
                 <div className="grid grid-cols-2 gap-6">
                   <Input label="Full Name" defaultValue="Harvey Specter" />
                   <Input label="Email Address" defaultValue="harvey@agreemetrix.ai" disabled />
                   <Input label="Job Title" defaultValue="Senior Partner" />
                   <Select label="Department" options={[{label: 'Legal', value: 'legal'}, {label: 'Sales', value: 'sales'}]} defaultValue="legal" />
                 </div>
                 <div className="pt-4">
                    <Button variant="primary" className="flex items-center gap-2"><Save size={16}/> Save Changes</Button>
                 </div>
               </div>
             )}
             
             {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                     {['Contract Assigned to Me', 'Approval Required', 'Contract Signed', 'Risk Alert Detected'].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-dark-950 rounded border border-dark-700">
                           <span className="text-slate-300 text-sm">{item}</span>
                           <div className="flex gap-4">
                              <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                                 <input type="checkbox" className="rounded bg-dark-800 border-dark-600 text-brand-500 focus:ring-offset-dark-950" defaultChecked /> Email
                              </label>
                              <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                                 <input type="checkbox" className="rounded bg-dark-800 border-dark-600 text-brand-500 focus:ring-offset-dark-950" defaultChecked={i < 2} /> Slack
                              </label>
                           </div>
                        </div>
                     ))}
                  </div>
                </div>
             )}
             
             {/* Placeholders for other tabs */}
             {['security', 'email', 'regional'].includes(activeTab) && (
               <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                 <Globe size={48} className="mb-4 opacity-20" />
                 <p>Settings for {activeTab} are not configured in this demo.</p>
               </div>
             )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;