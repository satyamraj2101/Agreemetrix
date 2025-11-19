import React from 'react';
import { Card, Button, Input, Badge } from '../components/UIComponents';
import { MOCK_PARTIES } from '../mock/data';
import { Search, Download, Plus, MapPin, FileText, TrendingUp, AlertCircle } from 'lucide-react';

const Parties: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Counterparties</h2>
          <p className="text-sm text-slate-400">Manage vendors, customers, and partners.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex items-center gap-2"><Download size={16} /> Export</Button>
          <Button variant="primary" className="flex items-center gap-2"><Plus size={16} /> Add Party</Button>
        </div>
      </div>

      <Card noPadding>
        <div className="p-4 border-b border-white/5 flex gap-4 items-center">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <Input placeholder="Search by name, region..." className="pl-10" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-dark-900 text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Party Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Active Contracts</th>
                <th className="px-6 py-4">Total Value</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {MOCK_PARTIES.map((party) => (
                <tr key={party.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200">{party.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">ID: {party.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={party.type === 'Customer' ? 'green' : party.type === 'Vendor' ? 'blue' : 'gray'}>
                      {party.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <MapPin size={14} className="text-slate-600" />
                       {party.region}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-600" />
                        {party.activeContracts}
                     </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-300">
                    ${party.totalValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${party.riskScore > 50 ? 'bg-red-500' : party.riskScore > 20 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                       <span className={party.riskScore > 50 ? 'text-red-400' : 'text-slate-400'}>{party.riskScore}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" className="text-xs h-8">View Profile</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Parties;