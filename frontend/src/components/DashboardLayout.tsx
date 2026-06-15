import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { 
  LayoutDashboard, CheckSquare, Clock, Settings, LogOut, Plus, Menu, X, Edit2, Calendar, Layout,
  Folder, Briefcase, GraduationCap, Dumbbell, Coffee, Pizza, Book, Terminal, Music, Globe, Heart, Activity, Code, PenTool, Flame
} from 'lucide-react';

const AVAILABLE_ICONS: Record<string, React.FC<any>> = {
  Folder, Briefcase, GraduationCap, Dumbbell, Coffee, Pizza, Book, Terminal, Music, Globe, Heart, Activity, Code, PenTool, Flame
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const { projects, createProject, updateProject } = useProjects();
  const location = useLocation();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#3B82F6');
  const [newProjectIcon, setNewProjectIcon] = useState('Folder');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Kanban Board', href: '/app/board', icon: Layout },
    { name: 'Calendar', href: '/app/calendar', icon: Calendar },
    { name: 'History', href: '/app/history', icon: Clock },
    ...(user?.role === 'ADMIN' ? [{ name: 'Admin Panel', href: '/admin', icon: Settings }] : []),
  ];

  const openEditModal = (project: any) => {
    setEditingProjectId(project.id);
    setNewProjectName(project.name);
    setNewProjectColor(project.color || '#3B82F6');
    setNewProjectIcon(project.icon || 'Folder');
    setIsProjectModalOpen(true);
  };

  const openNewProjectModal = () => {
    setEditingProjectId(null);
    setNewProjectName('');
    setNewProjectColor('#3B82F6');
    setNewProjectIcon('Folder');
    setIsProjectModalOpen(true);
  };

  const handleAddOrEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;

    let success;
    if (editingProjectId) {
      success = await updateProject(editingProjectId, newProjectName, newProjectColor, newProjectIcon);
    } else {
      success = await createProject(newProjectName, newProjectColor, newProjectIcon);
    }

    if (success) {
      setIsProjectModalOpen(false);
      setNewProjectName('');
      setNewProjectIcon('Folder');
      setEditingProjectId(null);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <CheckSquare size={20} />
          </div>
          <span className="font-bold text-lg text-text">FlowTask</span>
        </Link>
        {/* Close button for mobile */}
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-1 px-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-400'} />
              {item.name}
            </Link>
          );
        })}
        
        <div className="mt-8 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projects</h3>
            <button 
              onClick={openNewProjectModal}
              className="text-gray-400 hover:text-primary transition-colors p-1"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {projects.map(project => {
              const ProjectIcon = project.icon && AVAILABLE_ICONS[project.icon] ? AVAILABLE_ICONS[project.icon] : null;
              return (
              <div key={project.id} className="group flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Link
                  to={`/app/project/${project.id}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 flex-1 overflow-hidden"
                >
                  {ProjectIcon ? (
                     <ProjectIcon size={16} style={{ color: project.color || '#3B82F6' }} />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: project.color || '#3B82F6' }}></div>
                  )}
                  <span className="truncate">{project.name}</span>
                </Link>
                <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.preventDefault(); openEditModal(project); }} className="p-1 text-gray-400 hover:text-primary">
                    <Edit2 size={14} />
                  </button>
                  {project._count && project._count.tasks > 0 && (
                    <span className="bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-full hidden sm:inline-block">
                      {project._count.tasks}
                    </span>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden flex" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-[80%] max-w-[300px] h-full bg-white flex flex-col" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 shrink-0 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-10">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg">
             <Menu size={24} />
           </button>
           <span className="font-bold text-lg text-text">FlowTask</span>
           <button onClick={logout} className="p-2 -mr-2 text-gray-600 hover:bg-gray-50 rounded-lg">
             <LogOut size={20} />
           </button>
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Add/Edit Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">{editingProjectId ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleAddOrEditProject} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Marketing Campaign"
                  />
                  <p className="text-xs text-gray-500 mt-1">Only letters, numbers, and spaces are allowed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(AVAILABLE_ICONS).map(iconName => {
                      const IconComponent = AVAILABLE_ICONS[iconName];
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setNewProjectIcon(iconName)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newProjectIcon === iconName ? 'bg-gray-900 text-white shadow-md scale-110' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                          <IconComponent size={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#475569', '#14B8A6'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewProjectColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${newProjectColor === color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-110'} transition-transform`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover"
                >
                  {editingProjectId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
