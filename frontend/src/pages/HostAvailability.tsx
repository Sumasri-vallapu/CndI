import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

interface DayAvailability {
  day: string;
  available: boolean;
  timeSlots: TimeSlot[];
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'speaking' | 'busy';
}

const HostAvailability: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  
  const [weeklyAvailability, setWeeklyAvailability] = useState<DayAvailability[]>([
    {
      day: 'Monday',
      available: true,
      timeSlots: [
        { id: 1, startTime: '09:00', endTime: '12:00' },
        { id: 2, startTime: '14:00', endTime: '17:00' }
      ]
    },
    {
      day: 'Tuesday',
      available: true,
      timeSlots: [
        { id: 3, startTime: '10:00', endTime: '16:00' }
      ]
    },
    {
      day: 'Wednesday',
      available: false,
      timeSlots: []
    },
    {
      day: 'Thursday',
      available: true,
      timeSlots: [
        { id: 4, startTime: '09:00', endTime: '18:00' }
      ]
    },
    {
      day: 'Friday',
      available: true,
      timeSlots: [
        { id: 5, startTime: '09:00', endTime: '15:00' }
      ]
    },
    {
      day: 'Saturday',
      available: false,
      timeSlots: []
    },
    {
      day: 'Sunday',
      available: false,
      timeSlots: []
    }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
    {
      id: 1,
      title: "AI in Healthcare Conference",
      date: "2024-09-15",
      time: "2:00 PM",
      duration: "45 min",
      type: 'speaking'
    },
    {
      id: 2,
      title: "Medical Students Seminar",
      date: "2024-09-22",
      time: "10:00 AM",
      duration: "60 min",
      type: 'speaking'
    },
    {
      id: 3,
      title: "Personal Appointment",
      date: "2024-09-18",
      time: "3:00 PM",
      duration: "120 min",
      type: 'busy'
    }
  ]);

  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlot>({
    id: 0,
    startTime: '',
    endTime: ''
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0];
    return upcomingEvents.filter(event => event.date === dateStr);
  };

  const isAvailableDay = (dayName: string) => {
    const dayAvail = weeklyAvailability.find(d => d.day === dayName);
    return dayAvail?.available || false;
  };

  const getDayName = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const toggleDayAvailability = (day: string) => {
    setWeeklyAvailability(prev => prev.map(d => 
      d.day === day ? { ...d, available: !d.available } : d
    ));
  };

  const addTimeSlot = (day: string) => {
    if (!newTimeSlot.startTime || !newTimeSlot.endTime) return;
    
    const updatedSlot = {
      ...newTimeSlot,
      id: Date.now()
    };

    setWeeklyAvailability(prev => prev.map(d => 
      d.day === day 
        ? { ...d, timeSlots: [...d.timeSlots, updatedSlot] }
        : d
    ));

    setNewTimeSlot({ id: 0, startTime: '', endTime: '' });
    setShowTimeSlotModal(false);
    setEditingDay(null);
  };

  const removeTimeSlot = (day: string, slotId: number) => {
    setWeeklyAvailability(prev => prev.map(d => 
      d.day === day 
        ? { ...d, timeSlots: d.timeSlots.filter(slot => slot.id !== slotId) }
        : d
    ));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="min-h-screen bg-[#27465C]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/host/dashboard')}
              className="flex items-center text-gray-600 hover:text-black mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-black text-black">Manage Availability</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Weekly Availability Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-black text-black mb-4">Weekly Availability</h2>
              <div className="space-y-4">
                {weeklyAvailability.map((dayAvail) => (
                  <div key={dayAvail.day} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-black">{dayAvail.day}</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={dayAvail.available}
                          onChange={() => toggleDayAvailability(dayAvail.day)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#27465C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27465C]"></div>
                      </label>
                    </div>
                    
                    {dayAvail.available && (
                      <div className="space-y-2">
                        {dayAvail.timeSlots.map((slot) => (
                          <div key={slot.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <span className="text-sm text-gray-700">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <button
                              onClick={() => removeTimeSlot(dayAvail.day, slot.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => {
                            setEditingDay(dayAvail.day);
                            setShowTimeSlotModal(true);
                          }}
                          className="w-full text-left text-sm text-[#27465C] hover:text-[#1e3a4a] font-medium flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add time slot</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-black text-black mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-[#27465C] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1e3a4a] flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Availability</span>
                </button>
                <button className="w-full border border-gray-300 text-black font-medium py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Block Time Off</span>
                </button>
              </div>
            </div>
          </div>

          {/* Calendar and Events */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-black">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="p-2"></div>;
                  }

                  const events = getEventsForDate(day);
                  const dayName = getDayName(day);
                  const isToday = today.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                  const isAvailable = isAvailableDay(dayName);

                  return (
                    <div key={day} className={`p-2 min-h-[80px] border rounded-lg ${
                      isToday ? 'bg-[#27465C] text-white' : 
                      isAvailable ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className={`text-sm font-medium ${isToday ? 'text-white' : 'text-black'}`}>
                        {day}
                      </div>
                      <div className="mt-1 space-y-1">
                        {events.map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${
                              event.type === 'speaking' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-200 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-200 rounded"></div>
                  <span>Speaking Event</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-200 rounded"></div>
                  <span>Busy</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-black text-black mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        event.type === 'speaking' 
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-black">{event.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()} at {event.time} • {event.duration}
                        </p>
                      </div>
                    </div>
                    {event.type === 'speaking' && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Confirmed</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Slot Modal */}
      {showTimeSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-black">Add Time Slot</h3>
              <button
                onClick={() => {
                  setShowTimeSlotModal(false);
                  setEditingDay(null);
                  setNewTimeSlot({ id: 0, startTime: '', endTime: '' });
                }}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={newTimeSlot.startTime}
                  onChange={(e) => setNewTimeSlot(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={newTimeSlot.endTime}
                  onChange={(e) => setNewTimeSlot(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowTimeSlotModal(false);
                    setEditingDay(null);
                    setNewTimeSlot({ id: 0, startTime: '', endTime: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-black font-medium rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingDay && addTimeSlot(editingDay)}
                  className="flex-1 bg-[#27465C] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#1e3a4a]"
                >
                  Add Time Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostAvailability;