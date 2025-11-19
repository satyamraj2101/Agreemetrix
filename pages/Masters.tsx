import React from 'react';
import { Card, Button, Badge } from '../components/UIComponents';
import { Database, Edit3, Plus } from 'lucide-react';

const Masters: React.FC = () => {
  const mastersGroups = [
    { 
      title: 'Contract Types', 
      items: ['NDA', 'MSA', 'SOW', 'Licensing Agreement', 'Vendor Agreement']
    },
    { 
      title: 'Jurisdictions', 
      items: ['New York', 'California', 'Delaware', 'United Kingdom', 'Singapore', 'India']
    },
    { 
      title: 'Payment Terms', 
      items: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Upon Receipt']
    },
    {
      title: 'Industries',
      items: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Master Data</h2>
          <p className="text-sm text-slate-400">Configure dropdown lists and system taxonomies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {mastersGroups.map((group, idx) => (
            <Card key={idx} title={group.title} action={<Button variant="ghost" className="text-xs h-6 w-6 p-0 rounded-full border border-slate-600 hover:border-brand-400 hover:text-brand-400"><Plus size={14}/></Button>}>
               <div className="flex flex-wrap gap-2">
                  {group.items.map(item => (
                     <div key={item} className="group flex items-center gap-2 px-3 py-1.5 bg-dark-950 border border-dark-700 rounded-full text-xs text-slate-300 hover:border-brand-500/50 transition-colors">
                        {item}
                        <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-opacity">
                           <Edit3 size={10} />
                        </button>
                     </div>
                  ))}
               </div>
            </Card>
         ))}
      </div>

      <div className="p-6 rounded-xl bg-brand-900/10 border border-brand-500/20 flex items-center gap-4">
         <div className="p-3 bg-brand-500/20 rounded-lg text-brand-400">
            <Database size={24} />
         </div>
         <div>
            <h4 className="font-bold text-brand-100">Admin Note</h4>
            <p className="text-sm text-brand-200/60">Changes made to master data will immediately affect all dropdowns in the Workflow Builder and Intake Forms.</p>
         </div>
      </div>
    </div>
  );
};

export default Masters;