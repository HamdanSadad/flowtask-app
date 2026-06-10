import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import api from '../lib/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, CheckCircle2, Circle, Calendar, Folder, CheckSquare } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline: string | null;
  project_id: string | null;
}

const Dashboard = () => {
  const { token, user } = useAuth();
  const { projects, fetchProjects, deleteProject } = useProjects();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('project');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

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
  }, [projectId]);

  const filteredTasks = projectId 
    ? tasks.filter(t => t.project_id === projectId)
    : tasks;

  const handleSaveTask = async (taskData: any) => {
    try {
      if (taskData.id) {
        // Update
        const res = await api.put(`/tasks/${taskData.id}`, 
          taskData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        setTasks(tasks.map(t => t.id === taskData.id ? res.data : t));
        toast.success('Task updated');
      } else {
        // Create
        const payload = { ...taskData };
        if (projectId && !payload.project_id) {
          payload.project_id = projectId; // Default to current project if viewing one
        }
        const res = await api.post('/tasks', 
          payload,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        setTasks([res.data, ...tasks]);
        toast.success('Task created');
      }
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
      fetchProjects(); // Update project counts
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'DONE' ? 'PENDING' : 'DONE';
    try {
      await api.put(`/tasks/${task.id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const stats = {
    total: filteredTasks.length,
    completed: filteredTasks.filter(t => t.status === 'DONE').length,
    pending: filteredTasks.filter(t => t.status !== 'DONE').length
  };

  const activeProject = projects.find(p => p.id === projectId);

  const handleDeleteProject = async () => {
    if (!activeProject) return;
    if (!window.confirm(`Are you sure you want to delete the project "${activeProject.name}"? All tasks inside it will also be removed.`)) return;
    
    const success = await deleteProject(activeProject.id);
    if (success) {
      navigate('/app/dashboard');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            {activeProject ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activeProject.color || '#3B82F6' }}></div>
                  <h1 className="text-3xl font-bold text-gray-900">{activeProject.name}</h1>
                  <button 
                    onClick={handleDeleteProject}
                    className="ml-2 text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">Good to see you, {user?.name?.split(' ')[0]}! 👋</h1>
            )}
            <p className="text-gray-500 mt-1">You have {stats.pending} tasks to complete here.</p>
          </div>
          <button 
            onClick={() => { setTaskToEdit(null); setIsTaskModalOpen(true); }}
            className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-primary-hover shadow-lg shadow-blue-500/30 transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <Plus size={20} /> New Task
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900">{stats.total}</span>
            <span className="text-sm font-medium text-gray-500 mt-1">Total Tasks</span>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-blue-600">{stats.completed}</span>
            <span className="text-sm font-medium text-blue-600 mt-1">Completed</span>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-orange-600">{stats.pending}</span>
            <span className="text-sm font-medium text-orange-600 mt-1">In Progress</span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-500 max-w-sm mx-auto">There are no tasks here yet. Click the "New Task" button to create one.</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const project = projects.find(p => p.id === task.project_id);
              const isDone = task.status === 'DONE';
              
              let deadlineColor = 'text-gray-500';
              let deadlineText = '';
              if (task.deadline) {
                const date = new Date(task.deadline);
                deadlineText = format(date, 'MMM d, yyyy');
                if (!isDone) {
                  if (isPast(date) && !isToday(date)) deadlineColor = 'text-red-500 font-bold';
                  else if (isToday(date)) deadlineColor = 'text-orange-500 font-bold';
                }
              }

              return (
                <div 
                  key={task.id} 
                  className={`group bg-white p-5 rounded-2xl border flex items-start gap-4 transition-all hover:shadow-md ${isDone ? 'border-gray-100 bg-gray-50/50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <button 
                    onClick={() => toggleTaskStatus(task)}
                    className="mt-0.5 text-gray-300 hover:text-green-500 transition-colors shrink-0"
                  >
                    {isDone ? <CheckCircle2 className="text-green-500" size={26} /> : <Circle size={26} />}
                  </button>
                  
                  <div className={`flex-1 min-w-0 ${isDone ? 'opacity-60' : ''}`}>
                    <h3 className={`font-semibold text-lg truncate ${isDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {project && !projectId && (
                        <div className="flex items-center gap-1.5 text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                          <Folder size={12} style={{ color: project.color || '#3B82F6' }} />
                          {project.name}
                        </div>
                      )}
                      
                      {task.deadline && (
                        <div className={`flex items-center gap-1.5 text-xs bg-gray-50 px-2.5 py-1 rounded-md ${deadlineColor}`}>
                          <Calendar size={12} />
                          {deadlineText}
                        </div>
                      )}

                      <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wide ${
                        task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 
                        task.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setTaskToEdit(task); setIsTaskModalOpen(true); }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Edit Task"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setTaskToEdit(null); }}
        onSubmit={handleSaveTask}
        initialData={taskToEdit}
        defaultProjectId={projectId || ''}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
