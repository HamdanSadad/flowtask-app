import React, { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { Task } from './KanbanView';
import { Search } from 'lucide-react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarWidgetProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onSelectSlot: (dateStr: string) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ tasks, onTaskClick, onSelectSlot }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(typeof window !== 'undefined' && window.innerWidth < 640 ? 'agenda' : 'month');
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery
    ? tasks.filter(t => {
        const q = searchQuery.toLowerCase();
        return t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q));
      }).filter(t => t.start_date || t.deadline)
    : [];

  const events = tasks
    .filter(t => t.start_date || t.deadline)
    .map(t => {
      const start = t.start_date ? new Date(t.start_date) : new Date(t.deadline!);
      const end = t.deadline ? new Date(t.deadline) : new Date(t.start_date!);
      return {
        id: t.id,
        title: t.title,
        start,
        end,
        allDay: true,
        resource: t
      };
    });

  const eventStyleGetter = (event: any) => {
    const task = event.resource as Task;
    let backgroundColor = '#3B82F6'; // default blue
    
    if (task.status === 'DONE') backgroundColor = '#10B981'; // green
    else if (task.priority === 'HIGH') backgroundColor = '#EF4444'; // red
    else if (task.priority === 'MEDIUM') backgroundColor = '#F59E0B'; // orange

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: task.status === 'DONE' ? 0.6 : 1,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '2px 6px'
      }
    };
  };

  return (
    <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[600px] h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full sm:w-64 z-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
          />
          {searchQuery && (
            <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50 py-1">
              {searchResults.length === 0 ? (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">No matches found</li>
              ) : (
                searchResults.map(t => {
                  const dateText = t.start_date ? format(new Date(t.start_date), 'MMM d, yyyy') : format(new Date(t.deadline!), 'MMM d, yyyy');
                  return (
                    <li 
                      key={t.id}
                      onClick={() => {
                        const targetDate = t.start_date ? new Date(t.start_date) : new Date(t.deadline!);
                        setCurrentDate(targetDate);
                        onTaskClick(t);
                        setSearchQuery('');
                      }}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex flex-col"
                    >
                      <span className="text-sm font-semibold text-gray-900 truncate">{t.title}</span>
                      <span className="text-xs text-gray-500">{dateText}</span>
                    </li>
                  )
                })
              )}
            </ul>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-semibold text-gray-500 whitespace-nowrap">Jump to:</label>
          <input 
            type="month" 
            value={format(currentDate, 'yyyy-MM')}
            onChange={(e) => {
              if (e.target.value) {
                const [year, month] = e.target.value.split('-');
                setCurrentDate(new Date(parseInt(year), parseInt(month) - 1, 1));
              }
            }}
            className="w-full sm:w-auto px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-700 transition-all cursor-pointer"
          />
        </div>
      </div>
      
      <div className="flex-1 min-h-[500px]">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          date={currentDate}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          view={currentView}
          onView={(newView) => setCurrentView(newView)}
          views={['month', 'week', 'agenda']}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => {
            onTaskClick(event.resource);
          }}
          popup
          selectable
          onSelectSlot={(slotInfo) => {
            const dateStr = format(slotInfo.start, 'yyyy-MM-dd');
            onSelectSlot(dateStr);
          }}
        />
      </div>
    </div>
  );
};
