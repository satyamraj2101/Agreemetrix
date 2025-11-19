import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Input, Button } from '../components/UIComponents';
import { MOCK_CONTRACTS } from '../mock/data';
import { ContractStatus } from '../types';
import { Filter, Search, Download, FileText } from 'lucide-react';

const getStatusColor = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.SIGNED: return 'green';
    case ContractStatus.REVIEW: return 'blue';
    case ContractStatus.APPROVAL: return 'yellow';
    case ContractStatus.DRAFT: return 'gray';
    case ContractStatus.EXPIRED: return 'red';
    default: return 'gray';
  }
};

const Repository: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Search contracts, parties..." className="pl-10" />
          </div>
          <Button variant="secondary" className="flex items-center gap-2">
            <Filter size={16} /> Filter
          </Button>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <Download size={16} /> Export
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Contract Title</th>
                <th className="px-6 py-4">Counterparty</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CONTRACTS.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <Link to={`/contract/${contract.id}`} className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded group-hover:bg-indigo-100 transition-colors">
                         <FileText size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 hover:text-brand-600">{contract.title}</div>
                        <div className="text-xs text-slate-400">{contract.id}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">{contract.counterparty}</td>
                  <td className="px-6 py-4">{contract.type}</td>
                  <td className="px-6 py-4 font-mono text-slate-700">
                    {contract.value > 0 ? `$${contract.value.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={getStatusColor(contract.status)}>{contract.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            contract.riskScore > 75 ? 'bg-red-500' : 
                            contract.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`} 
                          style={{width: `${contract.riskScore}%`}}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{contract.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{contract.owner}</td>
                  <td className="px-6 py-4 text-slate-500">{contract.renewalDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
           <span>Showing 1-5 of 1,248 contracts</span>
           <div className="flex gap-2">
             <Button variant="secondary" disabled>Previous</Button>
             <Button variant="secondary">Next</Button>
           </div>
        </div>
      </Card>
    </div>
  );
};

export default Repository;
