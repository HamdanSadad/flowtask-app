import React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Plus, Calendar, AlertCircle, MessageSquare } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'BACKLOG' | 'PENDING' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline: string | null;
  start_date: string | null;
  labels: string[];
  project_id: string | null;
  created_at: string;
  updated_at: string;
}

const COLUMNS: Record<string, { title: string, color: string }> = {
  BACKLOG: { title: 'Backlog', color: 'bg-gray-100 text-gray-700' },
  PENDING: { title: 'To Do', color: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { title: 'In Progress', color: 'bg-orange-100 text-orange-700' },
  DONE: { title: 'Done', color: 'bg-green-100 text-green-700' }
};

interface KanbanViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskMove: (taskId: string, newStatus: string) => void;
  onNewTaskClick: (defaultStatus: string) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({ tasks, onTaskClick, onTaskMove, onNewTaskClick }) => {
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    onTaskMove(draggableId, destination.droppableId);
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden pb-6 h-full w-full custom-scrollbar">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 sm:gap-6 h-full w-max px-4 sm:px-1">
          {Object.keys(COLUMNS).map((columnId) => {
            const columnTasks = tasks.filter(t => t.status === columnId);
            
            return (
              <div key={columnId} className="w-[280px] sm:w-[320px] shrink-0 flex flex-col bg-gray-50/80 rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full max-h-[80vh]">
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white/50">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md ${COLUMNS[columnId].color}`}>
                      {COLUMNS[columnId].title}
                    </span>
                    <span className="text-sm font-semibold text-gray-400 bg-gray-200 px-2 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => onNewTaskClick(columnId)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => {
                        let deadlineColor = 'text-gray-400';
                        let deadlineText = '';
                        if (task.deadline) {
                          const date = new Date(task.deadline);
                          deadlineText = format(date, 'MMM d, h:mm a');
                          if (task.status !== 'DONE') {
                            if (isPast(date) && !isToday(date)) deadlineColor = 'text-red-600 bg-red-50';
                            else if (isToday(date)) deadlineColor = 'text-orange-600 bg-orange-50';
                          }
                        }

                        const priorityColor = task.priority === 'HIGH' ? 'border-l-red-500' : task.priority === 'MEDIUM' ? 'border-l-orange-500' : 'border-l-green-500';

                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => onTaskClick(task)}
                                className={`bg-white p-4 rounded-xl shadow-md border-y border-r border-gray-200 border-l-4 ${priorityColor} transition-all duration-200 cursor-pointer hover:border-r-blue-400 hover:border-y-blue-400 hover:shadow-lg ${
                                  snapshot.isDragging ? 'shadow-2xl rotate-2 z-50 scale-105 border-blue-500' : ''
                                } ${task.status === 'DONE' ? 'opacity-60 bg-gray-50' : ''}`}
                              >
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {task.labels && task.labels.map(label => (
                                    <span key={label} className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                                      {label}
                                    </span>
                                  ))}
                                  {task.priority === 'HIGH' && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-md uppercase tracking-wider">High</span>
                                  )}
                                  {task.priority === 'MEDIUM' && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md uppercase tracking-wider">Medium</span>
                                  )}
                                  {task.priority === 'LOW' && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-md uppercase tracking-wider">Low</span>
                                  )}
                                </div>
                                
                                <h4 className={`text-sm sm:text-base font-bold mb-2 leading-snug ${task.status === 'DONE' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                  {task.title}
                                </h4>

                                <div className="flex items-center justify-between mt-3 text-gray-400">
                                  <div className="flex items-center gap-3">
                                    {task.description && (
                                      <div className="flex items-center gap-1 text-xs" title="Has description">
                                        <MessageSquare size={12} />
                                      </div>
                                    )}
                                    {deadlineText && (
                                      <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${deadlineColor}`}>
                                        {isPast(new Date(task.deadline!)) && task.status !== 'DONE' && !isToday(new Date(task.deadline!)) ? <AlertCircle size={12} /> : <Calendar size={12} />}
                                        <span className="font-medium">{deadlineText}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
