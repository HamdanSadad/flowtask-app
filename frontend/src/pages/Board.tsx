import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import api from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import { KanbanView, type Task } from '../components/views/KanbanView';
import { Layout } from 'lucide-react';

const Board = () => {
  const { token } = useAuth();
  const { fetchProjects } = useProjects();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<string>('BACKLOG');

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
        toast.success('Task created successfully');
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

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` }});
    } catch (error) {
      toast.error('Failed to move task. Refreshing...');
      fetchTasks();
    }
  };

  const openNewTask = (status: string) => {
    setDefaultStatus(status);
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Layout className="text-blue-500" size={32} /> Global Board
            </h1>
            <p className="text-gray-500 mt-1">Manage all your tasks across all projects.</p>
          </div>
        </header>

        <KanbanView 
          tasks={tasks}
          onTaskClick={(t) => { setTaskToEdit(t); setIsTaskModalOpen(true); }}
          onTaskMove={handleTaskMove}
          onNewTaskClick={openNewTask}
        />
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setTaskToEdit(null); }}
        onSubmit={handleSaveTask}
        onDelete={handleDeleteTask}
        initialData={taskToEdit}
        defaultStatus={defaultStatus}
      />
    </DashboardLayout>
  );
};

export default Board;
