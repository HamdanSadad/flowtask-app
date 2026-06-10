import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import toast from 'react-hot-toast';
import { Clock, PlusCircle, RefreshCw, Trash2, Edit3, LogIn, LogOut } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryItem {
  id: string;
  type: string;
  detail: string | null;
  timestamp: string;
  task: { title: string } | null;
}

const History = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (error) {
      toast.error('Failed to load activity history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const handleDeleteItem = async (id: string) => {
    try {
      await api.delete(`/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(history.filter(item => item.id !== id));
      toast.success('Record deleted');
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all history?')) return;
    try {
      await api.delete('/history/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory([]);
      toast.success('History cleared');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'created': return <PlusCircle size={20} className="text-green-500" />;
      case 'status_changed': return <RefreshCw size={20} className="text-blue-500" />;
      case 'deleted': return <Trash2 size={20} className="text-red-500" />;
      case 'updated': return <Edit3 size={20} className="text-orange-500" />;
      case 'login': return <LogIn size={20} className="text-purple-500" />;
      case 'logout': return <LogOut size={20} className="text-gray-500" />;
      default: return <Clock size={20} className="text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity History</h1>
            <p className="text-gray-500 mt-2">Track everything that happens in your workspace.</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Trash2 size={16} /> Clear History
            </button>
          )}
        </header>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No activity recorded yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((item) => (
                <div key={item.id} className="p-4 sm:px-6 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                  <div className="mt-1 bg-white p-2 rounded-full border border-gray-100 shadow-sm">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.detail || 'System Action'}
                    </p>
                    {item.task && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Task: {item.task.title}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default History;
