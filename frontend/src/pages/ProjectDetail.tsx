import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import api from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import { KanbanView, type Task } from '../components/views/KanbanView';
import { CalendarWidget } from '../components/views/CalendarWidget';
import { ListView } from '../components/views/ListView';
import { Plus, LayoutList, Layout, Calendar as CalendarIcon, Folder, Trash2,
  Briefcase, GraduationCap, Dumbbell, Coffee, Pizza, Book, Terminal, Music, Globe, Heart, Activity, Code, PenTool, Flame
} from 'lucide-react';

const AVAILABLE_ICONS: Record<string, React.FC<any>> = {
  Folder, Briefcase, GraduationCap, Dumbbell, Coffee, Pizza, Book, Terminal, Music, Globe, Heart, Activity, Code, PenTool, Flame
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const { projects, fetchProjects, deleteProject } = useProjects();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'LIST' | 'BOARD' | 'CALENDAR'>('LIST');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<string>('BACKLOG');

  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (!id) return;
    const fetchProjectTasks = async () => {
      try {
        const res = await api.get('/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allTasks: Task[] = res.data;
        setTasks(allTasks.filter(t => t.project_id === id));
      } catch (error) {
        toast.error('Failed to load project tasks');
      }
    };
    fetchProjectTasks();
  }, [id, token]);

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <Folder size={64} className="mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p>The project you are looking for does not exist or was deleted.</p>
        </div>
      </DashboardLayout>
    );
  }

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
        const payload = { ...taskData, project_id: id };
        const res = await api.post('/tasks', 
          payload,
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

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t.id !== taskId));
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
      // Re-fetch to revert optimistic UI if failed
      const res = await api.get('/tasks', { headers: { Authorization: `Bearer ${token}` }});
      setTasks(res.data.filter((t: any) => t.project_id === id));
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'DONE' ? 'PENDING' : 'DONE';
    handleTaskMove(task.id, newStatus);
  };

  const handleDeleteProject = async () => {
    if (!window.confirm(`Are you sure you want to delete the project "${project.name}"? All tasks inside it will also be removed.`)) return;
    const success = await deleteProject(project.id);
    if (success) {
      navigate('/app/dashboard');
    }
  };

  const openNewTask = (status: string = 'BACKLOG') => {
    setDefaultStatus(status);
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const ProjectIcon = project.icon && AVAILABLE_ICONS[project.icon] ? AVAILABLE_ICONS[project.icon] : Folder;

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col max-w-7xl mx-auto">
        {/* Project Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: project.color || '#3B82F6' }}>
                <ProjectIcon size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
                <p className="text-gray-500 font-medium text-sm mt-1">{tasks.length} tasks in this project</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDeleteProject}
                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Delete Project"
              >
                <Trash2 size={20} />
              </button>
              <button 
                onClick={() => openNewTask()}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                <Plus size={18} /> Add Task
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('LIST')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'LIST' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutList size={16} /> List
            </button>
            <button
              onClick={() => setActiveTab('BOARD')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'BOARD' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Layout size={16} /> Board
            </button>
            <button
              onClick={() => setActiveTab('CALENDAR')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'CALENDAR' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <CalendarIcon size={16} /> Calendar
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'LIST' && (
            <div className="h-full overflow-y-auto">
              <ListView 
                tasks={tasks} 
                onTaskClick={(t) => { setTaskToEdit(t); setIsTaskModalOpen(true); }}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          )}
          {activeTab === 'BOARD' && (
            <KanbanView 
              tasks={tasks}
              onTaskClick={(t) => { setTaskToEdit(t); setIsTaskModalOpen(true); }}
              onTaskMove={handleTaskMove}
              onNewTaskClick={openNewTask}
            />
          )}
          {activeTab === 'CALENDAR' && (
            <CalendarWidget 
              tasks={tasks}
              onTaskClick={(t) => { setTaskToEdit(t); setIsTaskModalOpen(true); }}
              onSelectSlot={(dateStr) => {
                setTaskToEdit({ start_date: dateStr, deadline: dateStr } as any);
                setIsTaskModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setTaskToEdit(null); }}
        onSubmit={handleSaveTask}
        onDelete={handleDeleteTask}
        initialData={taskToEdit}
        defaultProjectId={id}
        defaultStatus={defaultStatus}
      />
    </DashboardLayout>
  );
};

export default ProjectDetail;
