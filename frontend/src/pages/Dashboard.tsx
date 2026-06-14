import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Target, Trophy, TrendingUp, CheckCircle, Activity } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { token } = useAuth();
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, historyRes] = await Promise.all([
          api.get('/tasks', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/history', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setTasks(tasksRes.data);
        setHistory(historyRes.data.slice(0, 5)); // Only latest 5
      } catch (error) {
        console.error('Failed to load dashboard data');
      }
    };
    fetchData();
  }, [token]);

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  
  const overdueTasks = tasks.filter(t => 
    t.status !== 'DONE' && 
    t.deadline && 
    new Date(t.deadline) < new Date(new Date().setHours(0,0,0,0))
  ).length;


  // Chart Data: Completion Trend (Last 7 Days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      dateStr: format(d, 'yyyy-MM-dd'),
      display: format(d, 'MMM d'),
      completed: 0,
      created: 0
    };
  });

  tasks.forEach(t => {
    if (t.status === 'DONE' && t.updated_at) {
      const dStr = t.updated_at.split('T')[0];
      const day = last7Days.find(day => day.dateStr === dStr);
      if (day) day.completed += 1;
    }
    if (t.created_at) {
      const dStr = t.created_at.split('T')[0];
      const day = last7Days.find(day => day.dateStr === dStr);
      if (day) day.created += 1;
    }
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your tasks today.</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target size={20} />
              </div>
              <span className="text-2xl font-black text-gray-900">{totalTasks}</span>
            </div>
            <p className="text-sm font-semibold text-gray-500">Total Tasks</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-green-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle size={20} />
              </div>
              <span className="text-2xl font-black text-green-600">{completedTasks}</span>
            </div>
            <p className="text-sm font-semibold text-gray-500">Completed</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-orange-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity size={20} />
              </div>
              <span className="text-2xl font-black text-orange-600">{inProgressTasks}</span>
            </div>
            <p className="text-sm font-semibold text-gray-500">In Progress</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-red-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={20} className="rotate-180" />
              </div>
              <span className="text-2xl font-black text-red-600">{overdueTasks}</span>
            </div>
            <p className="text-sm font-semibold text-gray-500">Overdue</p>
          </div>
        </div>

        {/* Charts & Achievements Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Task Activity (Last 7 Days)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7Days} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="display" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Line type="monotone" name="Completed" dataKey="completed" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Created" dataKey="created" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Goals & Achievements */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-md text-white relative overflow-hidden">
              <div className="absolute -right-6 -top-6 opacity-20">
                <Trophy size={120} />
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Weekly Goal</h3>
              <p className="text-blue-100 text-sm mb-6 relative z-10">Complete 10 tasks this week</p>
              
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Progress</span>
                  <span>{completedTasks > 10 ? 10 : completedTasks} / 10</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min((completedTasks / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[230px]">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Completion Rate</h3>
              <div className="flex-1 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: completionRate }, { value: 100 - completionRate }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#10B981" />
                      <Cell fill="#f3f4f6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-black text-gray-900">{completionRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <Link to="/app/history" className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</Link>
          </div>
          
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity found.</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    item.type === 'created' ? 'bg-blue-100 text-blue-600' :
                    item.type === 'deleted' ? 'bg-red-100 text-red-600' :
                    item.type === 'status_changed' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Activity size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.detail}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{format(new Date(item.timestamp), 'MMM d, h:mm a')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
