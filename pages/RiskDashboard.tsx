import React from 'react';
import { Card, Badge, Button } from '../components/UIComponents';
import { MOCK_RISKS } from '../mock/data';
import { ShieldAlert, Calendar, CheckSquare, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const RiskDashboard: React.FC = () => {
  const riskData = [
    { name: 'Critical', value: 12, color: '#ef4444' },
    { name: 'High', value: 25, color: '#f97316' },
    { name: 'Medium', value: 45, color: '#eab308' },
    { name: 'Low', value: 18, color: '#22c55e' },
  ];

  const categoryData = [
    { name: 'Indemnity', count: 34 },
    { name: 'Liability', count: 28 },
    { name: 'GDPR', count: 15 },
    { name: 'Payment', count: 12 },
    { name: 'Termination', count: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Risk & Obligations</h2>
          <p className="text-sm text-slate-400">Monitor contract compliance and potential exposure.</p>
        </div>
        <Button variant="primary">Generate Risk Report</Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
         {/* Top Stats */}
         <div className="col-span-12 md:col-span-3">
            <Card noPadding className="h-full bg-gradient-to-br from-red-900/20 to-dark-900 border-red-500/20">
               <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3 text-red-500">
                     <ShieldAlert size={24} />
                  </div>
                  <span className="text-4xl font-bold text-white mb-1">12</span>
                  <span className="text-sm text-red-400 uppercase tracking-wider font-bold">Critical Risks</span>
               </div>
            </Card>
         </div>
         <div className="col-span-12 md:col-span-5">
            <Card title="Risk Distribution" className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{left: 20}}>
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{fontSize: 11}} width={80} />
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                     <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </Card>
         </div>
         <div className="col-span-12 md:col-span-4">
            <Card title="Severity Breakdown" className="h-64">
               <div className="flex items-center justify-center h-full">
                  <ResponsiveContainer width="100%" height={160}>
                     <PieChart>
                        <Pie data={riskData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                           {riskData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                           ))}
                        </Pie>
                        <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}} itemStyle={{color: '#fff'}} />
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 text-xs">
                     {riskData.map(d => (
                        <div key={d.name} className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                           <span className="text-slate-300">{d.name}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </Card>
         </div>

         {/* Risk Table */}
         <div className="col-span-12">
            <Card title="Active Alerts & Obligations" noPadding>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                     <thead className="text-xs uppercase bg-dark-900 text-slate-500 border-b border-white/5">
                        <tr>
                           <th className="px-6 py-3">Risk Description</th>
                           <th className="px-6 py-3">Contract Ref</th>
                           <th className="px-6 py-3">Severity</th>
                           <th className="px-6 py-3">Due Date</th>
                           <th className="px-6 py-3">Status</th>
                           <th className="px-6 py-3">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {MOCK_RISKS.map(risk => (
                           <tr key={risk.id} className="hover:bg-white/5">
                              <td className="px-6 py-4">
                                 <div className="font-medium text-slate-200">{risk.description}</div>
                              </td>
                              <td className="px-6 py-4 font-mono text-xs text-brand-400">{risk.contractId}</td>
                              <td className="px-6 py-4">
                                 <Badge color={risk.severity === 'Critical' ? 'red' : risk.severity === 'High' ? 'yellow' : 'blue'}>
                                    {risk.severity}
                                 </Badge>
                              </td>
                              <td className="px-6 py-4 flex items-center gap-2">
                                 <Calendar size={14} /> {risk.dueDate}
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`text-xs font-bold ${risk.status === 'Open' ? 'text-red-400' : 'text-green-400'}`}>
                                    {risk.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                 <Button variant="ghost" className="text-xs h-8">Resolve <ArrowUpRight size={12} className="ml-1"/></Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default RiskDashboard;