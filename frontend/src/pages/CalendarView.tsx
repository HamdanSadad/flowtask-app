import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import api from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import { CalendarWidget } from '../components/views/CalendarWidget';
import type { Task } from '../components/views/KanbanView';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';

const CalendarView = () => {
  const { token } = useAuth();
  const { fetchProjects } = useProjects();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaveTask = async (taskData: any) => {
    try {
      if (taskData.id) {
        const res = await api.put(`/tasks/${taskData.id}`, 
          taskData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        setTasks(tasks.map(t => t.id === taskData.id ? res.data : t));
        toast.success('Task updated');
      } else {
        const res = await api.post('/tasks', 
          taskData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        setTasks([res.data, ...tasks]);
        toast.success('Task created');
      }
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted');
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'DONE') return t.status === 'DONE';
    return t.status !== 'DONE';
  });

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col max-w-7xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarIcon className="text-blue-500" size={32} /> Global Schedule
            </h1>
            <p className="text-gray-500 mt-1">View tasks from all your projects.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-white border border-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
            >
              <option value="ALL">All Tasks</option>
              <option value="PENDING">Pending Only</option>
              <option value="DONE">Completed</option>
            </select>
            <button 
              onClick={() => { setTaskToEdit(null); setIsTaskModalOpen(true); }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus size={18} /> Add Event
            </button>
          </div>
        </header>

        <CalendarWidget 
          tasks={filteredTasks}
          onTaskClick={(t) => { setTaskToEdit(t); setIsTaskModalOpen(true); }}
          onSelectSlot={(dateStr) => {
            setTaskToEdit({ start_date: dateStr, deadline: dateStr } as any);
            setIsTaskModalOpen(true);
          }}
        />
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setTaskToEdit(null); }}
        onSubmit={handleSaveTask}
        onDelete={handleDeleteTask}
        initialData={taskToEdit}
      />
    </DashboardLayout>
  );
};

export default CalendarView;
