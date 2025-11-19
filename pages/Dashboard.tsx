
import React from 'react';
import { Card, Button, Badge } from '../components/UIComponents';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, Legend
} from 'recharts';
import { 
  TrendingUp, Clock, FileText, AlertTriangle, CheckCircle2, 
  ArrowUpRight, ArrowDownRight, Calendar, MoreHorizontal, FileWarning,
  Activity, DollarSign, Hourglass, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MOCK DATA ---

const KPI_DATA = [
  { 
    title: 'Active Contracts', 
    value: '1,248', 
    change: '+12%', 
    trend: 'up', 
    icon: FileText, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/20' 
  },
  { 
    title: 'Pipeline Value', 
    value: '$4.2M', 
    change: '+8%', 
    trend: 'up', 
    icon: DollarSign, 
    color: 'text-green-400', 
    bg: 'bg-green-500/10', 
    border: 'border-green-500/20' 
  },
  { 
    title: 'Avg Cycle Time', 
    value: '14 Days', 
    change: '-2 days', 
    trend: 'down', // down is good for time
    icon: Clock, 
    color: 'text-purple-400', 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-500/20' 
  },
  { 
    title: 'Critical Risks', 
    value: '12', 
    change: '+3', 
    trend: 'up', // up is bad for risk
    icon: AlertTriangle, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/20' 
  },
];

const STAGE_DATA = [
  { name: 'Draft', count: 45, fill: '#64748b' },
  { name: 'Review', count: 32, fill: '#3b82f6' },
  { name: 'Negotiation', count: 28, fill: '#8b5cf6' },
  { name: 'Approval', count: 18, fill: '#eab308' },
  { name: 'Signature', count: 12, fill: '#14b8a6' },
];

const TREND_DATA = [
  { month: 'Jan', created: 40, signed: 24 },
  { month: 'Feb', created: 30, signed: 28 },
  { month: 'Mar', created: 45, signed: 35 },
  { month: 'Apr', created: 50, signed: 42 },
  { month: 'May', created: 65, signed: 48 },
  { month: 'Jun', created: 60, signed: 55 },
];

const EXPIRY_DATA = [
  { name: '0-30 Days', value: 15, color: '#ef4444' },
  { name: '31-60 Days', value: 25, color: '#f97316' },
  { name: '61-90 Days', value: 45, color: '#eab308' },
  { name: '90+ Days', value: 120, color: '#22c55e' },
];

const TASKS = [
  { id: 1, title: 'Approve MSA with Acme Corp', due: 'Today', type: 'Approval', priority: 'High' },
  { id: 2, title: 'Review Redlines - TechFlow', due: 'Tomorrow', type: 'Review', priority: 'Medium' },
  { id: 3, title: 'Sign NDA - Global Logistics', due: 'In 2 days', type: 'Signature', priority: 'Low' },
  { id: 4, title: 'Update Renewal Terms - Stratos', due: 'Overdue', type: 'Renewal', priority: 'Critical' },
];

const RECENT_ACTIVITY = [
  { id: 1, user: 'Harvey Specter', action: 'approved', target: 'Acme MSA', time: '10 mins ago', icon: CheckCircle2, color: 'text-green-500' },
  { id: 2, user: 'Mike Ross', action: 'commented on', target: 'TechFlow License', time: '1 hour ago', icon: MoreHorizontal, color: 'text-blue-500' },
  { id: 3, user: 'System', action: 'flagged risk in', target: 'Vendor Agreement', time: '3 hours ago', icon: AlertTriangle, color: 'text-red-500' },
  { id: 4, user: 'Rachel Zane', action: 'created', target: 'New Employee Contract', time: '5 hours ago', icon: FileText, color: 'text-purple-500' },
];

// --- COMPONENT ---

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      {/* Executive Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white tracking-tight">Executive Overview</h1>
           <p className="text-slate-400">Welcome back, Harvey. You have <span className="text-brand-400 font-bold">4 pending tasks</span> requiring attention.</p>
        </div>
        <div className="flex gap-3">
           <div className="hidden md:flex items-center px-3 py-1.5 bg-dark-900 border border-dark-700 rounded-lg text-sm text-slate-400 gap-2">
              <Calendar size={14}/> <span>Last 30 Days</span>
           </div>
           <Button variant="primary" className="shadow-lg shadow-brand-500/20">+ New Contract</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi, idx) => (
          <div key={idx} className={`p-5 rounded-xl bg-dark-900/60 border backdrop-blur-sm flex items-start justify-between hover:translate-y-[-2px] transition-transform duration-300 ${kpi.border}`}>
             <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
                <div className="flex items-center gap-1 text-xs">
                   {kpi.trend === 'up' ? <ArrowUpRight size={14} className={kpi.change.includes('+') ? 'text-green-400' : 'text-red-400'} /> : <ArrowDownRight size={14} className={kpi.change.includes('-') ? 'text-green-400' : 'text-red-400'} />}
                   <span className={kpi.change.includes('+') || (kpi.trend === 'down' && kpi.change.includes('-')) ? 'text-green-400' : 'text-red-400'}>{kpi.change}</span>
                   <span className="text-slate-500 ml-1">vs last month</span>
                </div>
             </div>
             <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={20} />
             </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Pipeline & Trends */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
           
           {/* Charts Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Contract Pipeline" className="h-80">
                 <div className="h-full w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={STAGE_DATA} layout="vertical" margin={{left: 0, right: 20, bottom: 20}}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{fontSize: 11}} width={70} />
                          <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} 
                          />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                            {STAGE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </Card>

              <Card title="Velocity Trend" className="h-80">
                 <div className="h-full w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={TREND_DATA} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                          <defs>
                             <linearGradient id="colorSigned" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                             </linearGradient>
                             <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="month" stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                          <YAxis stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                          <Area type="monotone" dataKey="created" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCreated)" strokeWidth={2} name="Created" />
                          <Area type="monotone" dataKey="signed" stroke="#14b8a6" fillOpacity={1} fill="url(#colorSigned)" strokeWidth={2} name="Signed" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </Card>
           </div>

           {/* Action Center Table */}
           <Card title="Action Center" action={<Button variant="ghost" className="text-xs">View All Tasks</Button>} noPadding>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm text-slate-400">
                    <thead className="text-xs uppercase bg-dark-950 text-slate-500 font-semibold border-b border-white/5">
                       <tr>
                          <th className="px-6 py-3">Task</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Due Date</th>
                          <th className="px-6 py-3">Priority</th>
                          <th className="px-6 py-3 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {TASKS.map(task => (
                          <tr key={task.id} className="hover:bg-white/5 transition-colors group">
                             <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-2">
                                {task.priority === 'Critical' && <AlertTriangle size={14} className="text-red-500" />}
                                {task.title}
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-xs">
                                   {task.type === 'Approval' ? <UserCheck size={14} className="text-blue-400" /> : 
                                    task.type === 'Renewal' ? <Activity size={14} className="text-orange-400" /> :
                                    <FileText size={14} className="text-slate-400" />}
                                   {task.type}
                                </div>
                             </td>
                             <td className="px-6 py-4 text-xs">
                                <Badge color={task.due === 'Overdue' ? 'red' : task.due === 'Today' ? 'yellow' : 'gray'}>{task.due}</Badge>
                             </td>
                             <td className="px-6 py-4">
                                <span className={`text-xs font-bold ${task.priority === 'High' || task.priority === 'Critical' ? 'text-red-400' : 'text-slate-500'}`}>
                                   {task.priority}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <Button variant="secondary" className="h-7 text-xs px-3">Open</Button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>

        </div>

        {/* Right Column: Intelligence & Feed */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           
           {/* Renewal Radar */}
           <Card title="Renewal Radar" className="h-[340px]">
              <div className="h-full flex flex-col items-center justify-center -mt-2">
                 <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                       <Pie
                          data={EXPIRY_DATA}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                       >
                          {EXPIRY_DATA.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="w-full space-y-3 px-4">
                    {EXPIRY_DATA.map((item, i) => (
                       <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                             <span className="text-slate-400">{item.name}</span>
                          </div>
                          <span className="text-white font-bold">{item.value} Contracts</span>
                       </div>
                    ))}
                 </div>
              </div>
           </Card>

           {/* Recent Activity */}
           <Card title="Live Feed" className="h-auto">
              <div className="space-y-6 relative">
                 {/* Timeline Line */}
                 <div className="absolute left-3.5 top-2 bottom-2 w-px bg-dark-700"></div>
                 
                 {RECENT_ACTIVITY.map(activity => (
                    <div key={activity.id} className="relative flex gap-4">
                       <div className={`w-8 h-8 rounded-full bg-dark-900 border border-dark-700 flex items-center justify-center z-10 shrink-0 ${activity.color}`}>
                          <activity.icon size={14} />
                       </div>
                       <div>
                          <p className="text-sm text-slate-300">
                             <span className="font-bold text-white hover:underline cursor-pointer">{activity.user}</span> {activity.action} <span className="font-medium text-brand-400 hover:underline cursor-pointer">{activity.target}</span>
                          </p>
                          <span className="text-xs text-slate-500 mt-1 block">{activity.time}</span>
                       </div>
                    </div>
                 ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-xs text-slate-500">View All History</Button>
           </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
