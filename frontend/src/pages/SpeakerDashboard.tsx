import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface EventRequest {
  id: string;
  hostName: string;
  hostCompany: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventType: 'keynote' | 'panel' | 'workshop' | 'fireside' | 'other';
  duration: string;
  location: string;
  audienceSize: string;
  compensation: string;
  status: 'pending' | 'accepted' | 'declined' | 'negotiating';
  receivedDate: string;
  message: string;
}

export default function SpeakerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar' | 'profile'>('requests');
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [speakerName, setSpeakerName] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Get speaker name from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setSpeakerName(user.first_name || 'Speaker');
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    const mockRequests: EventRequest[] = [
      {
        id: '1',
        hostName: 'John Smith',
        hostCompany: 'Tech Conference 2025',
        eventTitle: 'AI Revolution Summit',
        eventDate: '2025-03-15',
        eventTime: '10:00 AM',
        eventType: 'keynote',
        duration: '45 minutes',
        location: 'San Francisco Convention Center',
        audienceSize: '500-1000',
        compensation: '$8,000',
        status: 'pending',
        receivedDate: '2025-01-08',
        message: 'We would love to have you as our keynote speaker for our annual AI Summit. Your expertise in machine learning would be perfect for our audience of tech leaders.'
      },
      {
        id: '2',
        hostName: 'Sarah Johnson',
        hostCompany: 'Corporate Learning Hub',
        eventTitle: 'Future of Work Workshop',
        eventDate: '2025-02-28',
        eventTime: '2:00 PM',
        eventType: 'workshop',
        duration: '2 hours',
        location: 'Virtual Event',
        audienceSize: '50-100',
        compensation: '$3,500',
        status: 'accepted',
        receivedDate: '2025-01-05',
        message: 'Looking for an expert to conduct a hands-on workshop on AI implementation in the workplace.'
      },
      {
        id: '3',
        hostName: 'Mike Chen',
        hostCompany: 'StartupWeek',
        eventTitle: 'Panel Discussion: Tech Trends',
        eventDate: '2025-04-10',
        eventTime: '3:30 PM',
        eventType: 'panel',
        duration: '90 minutes',
        location: 'Innovation District, Boston',
        audienceSize: '200-300',
        compensation: '$2,500',
        status: 'negotiating',
        receivedDate: '2025-01-06',
        message: 'Would you be interested in joining a panel of tech leaders to discuss emerging trends in AI and machine learning?'
      }
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 500);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    navigate('/speaker-login');
  };

  const handleRequestAction = (requestId: string, action: 'accept' | 'decline' | 'negotiate') => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'negotiating' }
        : req
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'accepted': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'negotiating': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white">Speaking Requests</h2>
        <div className="text-white/70">
          {requests.filter(r => r.status === 'pending').length} pending requests
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-white text-lg">Loading requests...</div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.468L3 21l2.468-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-white mb-2">No requests yet</h3>
          <p className="text-white/80">Speaking requests from event organizers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-black text-white mb-2">{request.eventTitle}</h3>
                      <p className="text-white/80 mb-2">{request.hostCompany} • {request.hostName}</p>
                      <div className="flex items-center gap-4 text-sm text-white/70 mb-2">
                        <span>{request.eventDate}</span>
                        <span>{request.eventTime}</span>
                        <span>{request.duration}</span>
                        <span className="capitalize">{request.eventType}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-white/70">Location:</span>
                      <p className="text-white">{request.location}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Audience:</span>
                      <p className="text-white">{request.audienceSize}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Compensation:</span>
                      <p className="text-white">{request.compensation}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-white/90 italic">"{request.message}"</p>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleRequestAction(request.id, 'accept')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, 'negotiate')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Negotiate
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, 'decline')}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white">My Calendar</h2>
        <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Manage Availability
        </button>
      </div>

      {/* Calendar view - simplified for now */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div className="grid grid-cols-7 gap-4 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-white/70 font-medium py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 35 }, (_, i) => (
            <div
              key={i}
              className="aspect-square bg-white/10 rounded-lg p-2 text-center text-white hover:bg-white/20 cursor-pointer transition-colors"
            >
              {i < 31 ? i + 1 : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="text-xl font-black text-white mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {requests.filter(r => r.status === 'accepted').map(event => (
            <div key={event.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{event.eventTitle}</h4>
                <p className="text-white/70 text-sm">{event.eventDate} • {event.eventTime}</p>
              </div>
              <div className="text-green-300 text-sm font-medium">Confirmed</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#27465C] font-['Roboto']">
      {/* Navigation */}
      <nav className="w-full py-6 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-white text-3xl font-black">C&I</div>
            <div className="text-white text-sm">Connect and Inspire</div>
          </div>
          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#27465C]" />
                </div>
                <span className="text-white font-medium">{speakerName}</span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-black">{speakerName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {JSON.parse(localStorage.getItem('user') || '{}').email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab('profile');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/speaker/settings');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            {[
              { key: 'requests', label: 'Requests', icon: '📬' },
              { key: 'calendar', label: 'Calendar', icon: '📅' },
              { key: 'profile', label: 'Profile', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white">Profile Settings</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-white">Profile management coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}