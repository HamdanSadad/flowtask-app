import { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import { X, Calendar as CalendarIcon, Tag, Folder, AlignLeft, Clock, Activity, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  onDelete?: (id: string) => void;
  initialData?: any;
  defaultProjectId?: string;
  defaultStatus?: string;
}

const TaskModal = ({ isOpen, onClose, onSubmit, onDelete, initialData, defaultProjectId, defaultStatus }: TaskModalProps) => {
  const { projects } = useProjects();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('BACKLOG');
  const [projectId, setProjectId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [startDate, setStartDate] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'MEDIUM');
      setStatus(initialData.status || 'BACKLOG');
      setProjectId(initialData.project_id || '');
      setDeadline(initialData.deadline ? format(new Date(initialData.deadline), "yyyy-MM-dd'T'HH:mm") : '');
      setStartDate(initialData.start_date ? format(new Date(initialData.start_date), "yyyy-MM-dd'T'HH:mm") : '');
      setLabels(initialData.labels || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus(defaultStatus || 'BACKLOG');
      setProjectId(defaultProjectId || '');
      setDeadline('');
      setStartDate('');
      setLabels([]);
    }
    setNewLabel('');
  }, [initialData, isOpen, defaultProjectId, defaultStatus]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    onSubmit({
      id: initialData?.id,
      title,
      description,
      priority,
      status,
      project_id: projectId || null,
      deadline: deadline || null,
      start_date: startDate || null,
      labels,
    });
  };

  const handleAddLabel = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newLabel.trim()) {
      e.preventDefault();
      if (!labels.includes(newLabel.trim())) {
        setLabels([...labels, newLabel.trim()]);
      }
      setNewLabel('');
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter(l => l !== labelToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4 transition-all">
      <div 
        className="bg-white md:rounded-2xl rounded-t-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white md:rounded-t-2xl rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <CheckSquare size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">{initialData ? 'Edit Task' : 'Create Issue'}</h3>
          </div>
          <div className="flex items-center gap-2">
            {initialData && onDelete && (
              <button 
                type="button" 
                onClick={() => onDelete(initialData.id)}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            )}
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 pb-24 md:pb-8">
          {/* Main Content Area (Left) */}
          <div className="flex-1 space-y-6">
            <div>
              <input
                type="text"
                autoFocus
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold border border-transparent hover:border-gray-200 focus:border-blue-500 rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder-gray-300"
                placeholder="Task title..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 px-3">
                <AlignLeft size={16} className="text-gray-400" /> Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 transition-all"
                placeholder="Add a more detailed description..."
              />
            </div>

            {/* Labels section */}
            <div className="space-y-2 px-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag size={16} className="text-gray-400" /> Tags / Labels
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {labels.map(label => (
                  <span key={label} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1 border border-gray-200">
                    {label}
                    <button type="button" onClick={() => removeLabel(label)} className="text-gray-400 hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={handleAddLabel}
                  className="text-sm bg-transparent border-none focus:ring-0 placeholder-gray-400 w-32 px-1"
                  placeholder="+ Add tag (Enter)"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="w-full md:w-72 flex flex-col gap-6 shrink-0">
            {/* Status & Priority */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <Activity size={14} /> Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium"
                >
                  <option value="BACKLOG">Backlog</option>
                  <option value="PENDING">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <Tag size={14} /> Priority
                </label>
                <div className="flex gap-2">
                  {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                        priority === p 
                          ? p === 'HIGH' ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' 
                            : p === 'MEDIUM' ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm' 
                            : 'bg-green-50 border-green-200 text-green-700 shadow-sm'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dates & Project */}
            <div className="space-y-5 px-1">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <Folder size={14} /> Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                >
                  <option value="">Inbox (None)</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <Clock size={14} /> Start Date
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <CalendarIcon size={14} /> Due Date
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm text-gray-700"
                />
              </div>
            </div>

            {/* Timestamps */}
            {initialData && initialData.created_at && (
              <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1 px-1">
                <p>Created {format(new Date(initialData.created_at), 'MMM d, yyyy h:mm a')}</p>
                <p>Updated {format(new Date(initialData.updated_at), 'MMM d, yyyy h:mm a')}</p>
              </div>
            )}
          </div>
          
          {/* Submit Button fixed at bottom for mobile, absolute for desktop or sticky */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-20">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30"
            >
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>

        <div className="hidden md:flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/50 md:rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
          >
            {initialData ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
