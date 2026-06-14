import React from 'react';
import type { Task } from './KanbanView';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
}

export const ListView: React.FC<ListViewProps> = ({ tasks, onTaskClick, onToggleStatus }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500 max-w-sm">Create a task to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-6">
      {tasks.map(task => {
        const isDone = task.status === 'DONE';
        let deadlineColor = 'text-gray-500';
        let deadlineText = '';
        if (task.deadline) {
          const date = new Date(task.deadline);
          deadlineText = format(date, 'MMM d, yyyy h:mm a');
          if (!isDone) {
            if (isPast(date) && !isToday(date)) deadlineColor = 'text-red-500 font-bold';
            else if (isToday(date)) deadlineColor = 'text-orange-500 font-bold';
          }
        }

        const priorityColor = task.priority === 'HIGH' ? 'border-l-red-500' : task.priority === 'MEDIUM' ? 'border-l-orange-500' : 'border-l-green-500';

        return (
          <div 
            key={task.id} 
            onClick={() => onTaskClick(task)}
            className={`group bg-white p-5 rounded-xl shadow-sm flex items-start gap-4 transition-all duration-200 cursor-pointer hover:shadow-md border-y border-r border-gray-200 border-l-4 ${priorityColor} hover:border-r-blue-400 hover:border-y-blue-400 ${isDone ? 'border-gray-200 bg-gray-50/50 opacity-70' : ''}`}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleStatus(task); }}
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
                {task.labels && task.labels.map(label => (
                  <span key={label} className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                    {label}
                  </span>
                ))}
                
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
          </div>
        );
      })}
    </div>
  );
};
