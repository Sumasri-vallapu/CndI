import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowLeft,
  Star,
  Building
} from 'lucide-react';

interface Speaker {
  id: number;
  user_name: string;
  user_email: string;
  bio: string;
  expertise: string;
  speaking_topics: string;
  experience_years: number;
  hourly_rate: number;
  availability_status: string;
  profile_image: string;
  average_rating: number;
}

interface AvailabilitySlot {
  id: number;
  date: string;
  is_available: boolean;
  notes: string;
}

interface Event {
  id: number;
  title: string;
  event_date: string;
  duration_minutes: number;
  status: string;
  location: string;
  organizer_name: string;
  budget_range: string;
}

const SpeakerCalendar: React.FC = () => {
  const { speakerId } = useParams<{ speakerId: string }>();
  const navigate = useNavigate();
  
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSpeaker({
        id: 1,
        user_name: "Dr. Sarah Johnson",
        user_email: "sarah.johnson@medical.com",
        bio: "Leading expert in AI applications in healthcare with over 15 years of experience in medical technology innovation.",
        expertise: "healthcare",
        speaking_topics: "AI in Healthcare, Medical Technology, Digital Health, Telemedicine",
        experience_years: 15,
        hourly_rate: 500,
        availability_status: "available",
        profile_image: "",
        average_rating: 4.8
      });

      // Generate mock availability data
      const mockAvailability: AvailabilitySlot[] = [];
      const today = new Date();
      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        mockAvailability.push({
          id: i,
          date: date.toISOString().split('T')[0],
          is_available: Math.random() > 0.3, // 70% available
          notes: Math.random() > 0.8 ? "Busy with conference" : ""
        });
      }
      setAvailability(mockAvailability);

      // Mock upcoming events
      setEvents([
        {
          id: 1,
          title: "AI in Healthcare Conference",
          event_date: "2024-09-15T14:00:00Z",
          duration_minutes: 45,
          status: "confirmed",
          location: "San Francisco Convention Center",
          organizer_name: "Tech Summit 2024",
          budget_range: "$5,000 - $7,500"
        },
        {
          id: 2,
          title: "Medical Innovation Seminar",
          event_date: "2024-09-22T10:00:00Z",
          duration_minutes: 60,
          status: "accepted",
          location: "UCSF Campus",
          organizer_name: "University of California",
          budget_range: "$2,000 - $3,000"
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [speakerId]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (date: string) => {
    const slot = availability.find(slot => slot.date === date);
    return slot?.is_available || false;
  };

  const hasEvent = (date: string) => {
    return events.some(event => event.event_date.split('T')[0] === date);
  };

  const getDateClass = (date: string, day: number) => {
    const today = new Date();
    const isToday = formatDate(today) === date;
    const isPast = new Date(date) < today;
    const available = isDateAvailable(date);
    const hasEventOnDate = hasEvent(date);
    
    let baseClass = "h-10 w-10 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ";
    
    if (isPast) {
      baseClass += "text-gray-400 cursor-not-allowed ";
    } else if (isToday) {
      baseClass += "bg-[#27465C] text-white font-bold ";
    } else if (hasEventOnDate) {
      baseClass += "bg-blue-100 text-blue-800 font-medium border-2 border-blue-300 ";
    } else if (available) {
      baseClass += "bg-green-100 text-green-800 hover:bg-green-200 ";
    } else {
      baseClass += "bg-red-100 text-red-800 ";
    }
    
    if (selectedDate === date) {
      baseClass += "ring-2 ring-[#27465C] ring-offset-2 ";
    }
    
    return baseClass;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = formatDate(date);
      
      days.push(
        <div
          key={day}
          className={getDateClass(dateString, day)}
          onClick={() => setSelectedDate(dateString)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handleBookRequest = () => {
    if (!selectedDate) {
      alert('Please select a date first');
      return;
    }
    navigate(`/event-details/${speakerId}?date=${selectedDate}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#27465C] flex items-center justify-center">
        <div className="text-white text-lg">Loading speaker calendar...</div>
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="min-h-screen bg-[#27465C] flex items-center justify-center">
        <div className="text-white text-lg">Speaker not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#27465C]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-black mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-black text-black">Speaker Calendar</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Speaker Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#27465C] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-black text-black mb-1">{speaker.user_name}</h2>
              <p className="text-gray-600 mb-2">{speaker.expertise}</p>
              <div className="flex items-center justify-center space-x-1 mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{speaker.average_rating}</span>
                <span className="text-gray-500 text-sm">rating</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-sm">
                <Building className="w-4 h-4 mr-2 text-gray-400" />
                <span>{speaker.experience_years} years experience</span>
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                <span>${speaker.hourly_rate}/hour</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-black mb-2">Bio</h3>
              <p className="text-sm text-gray-600">{speaker.bio}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-black mb-2">Speaking Topics</h3>
              <div className="flex flex-wrap gap-2">
                {speaker.speaking_topics.split(',').map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {topic.trim()}
                  </span>
                ))}
              </div>
            </div>

            {selectedDate && (
              <button
                onClick={handleBookRequest}
                className="w-full bg-[#27465C] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1e3a4a] transition-colors"
              >
                Request Booking for {new Date(selectedDate).toLocaleDateString()}
              </button>
            )}
          </div>

          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-black">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center space-x-4 mb-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                  <span>Unavailable</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                  <span>Booked Event</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#27465C] rounded mr-2"></div>
                  <span>Today</span>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-black text-black mb-4">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                {isDateAvailable(selectedDate) ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Available for booking</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      This speaker is available on this date. Click "Request Booking" to proceed.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center text-red-800">
                      <XCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Not available</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      This speaker is not available on this date. Please select another date.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        {events.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-black text-black mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-black mb-2">{event.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          <span>{event.organizer_name}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      event.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakerCalendar;