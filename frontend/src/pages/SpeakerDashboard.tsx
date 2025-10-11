import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  MessageSquare,
  Award,
  Star,
  Activity,
  Sparkles,
  ArrowUpRight,
  Eye,
  BarChart3
} from 'lucide-react';

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

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  upcomingEvents: number;
  completedEvents: number;
  totalEarnings: number;
  averageRating: number;
  responseRate: number;
  monthlyGrowth: number;
}

interface ActivityItem {
  id: number;
  type: 'request' | 'accepted' | 'completed' | 'payment';
  title: string;
  description: string;
  time: string;
  icon: 'message' | 'check' | 'star' | 'dollar';
}

export default function SpeakerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'calendar'>('overview');
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [speakerName, setSpeakerName] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [stats] = useState<DashboardStats>({
    totalRequests: 47,
    pendingRequests: 5,
    acceptedRequests: 3,
    upcomingEvents: 3,
    completedEvents: 28,
    totalEarnings: 85000,
    averageRating: 4.9,
    responseRate: 92,
    monthlyGrowth: 18.5
  });

  const [activityFeed] = useState<ActivityItem[]>([
    {
      id: 1,
      type: 'request',
      title: 'New speaking request',
      description: 'AI Revolution Summit invited you',
      time: '10 minutes ago',
      icon: 'message'
    },
    {
      id: 2,
      type: 'accepted',
      title: 'Request accepted',
      description: 'You accepted Future of Work Workshop',
      time: '2 hours ago',
      icon: 'check'
    },
    {
      id: 3,
      type: 'completed',
      title: 'Event completed',
      description: 'Tech Trends Panel finished with 5-star rating',
      time: '1 day ago',
      icon: 'star'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment received',
      description: '$3,500 from Corporate Learning Hub',
      time: '2 days ago',
      icon: 'dollar'
    }
  ]);

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
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'accepted': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'negotiating': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'keynote': return 'bg-purple-100 text-purple-700';
      case 'panel': return 'bg-blue-100 text-blue-700';
      case 'workshop': return 'bg-green-100 text-green-700';
      case 'fireside': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Requests */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            <div className="px-4 py-3 bg-gradient-to-r from-[#27465C] to-[#1e3a4a]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white mb-0.5">Speaking Requests</h3>
                  <p className="text-white/80 text-xs">Speaking opportunities waiting for you</p>
                </div>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="bg-white text-[#27465C] hover:bg-gray-100 font-medium text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {requests.slice(0, 3).map((request) => (
                <div key={request.id} className="bg-gray-50 rounded-lg p-4 mb-3 hover:bg-gray-100 transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-black text-gray-900 group-hover:text-[#27465C] transition-colors">
                          {request.eventTitle}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1.5">{request.hostCompany} • {request.hostName}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{request.eventDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{request.duration}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full ${getEventTypeColor(request.eventType)}`}>
                          {request.eventType}
                        </span>
                      </div>
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleRequestAction(request.id, 'accept')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors text-xs flex items-center justify-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, 'negotiate')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors text-xs flex items-center justify-center space-x-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Discuss</span>
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, 'decline')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors text-xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-4 border border-gray-200">
            <div className="px-4 py-3 bg-gradient-to-r from-[#27465C] to-[#1e3a4a]">
              <h3 className="text-lg font-black text-white mb-0.5">Recent Activity</h3>
              <p className="text-white/80 text-xs">Your recent updates</p>
            </div>
            <div className="p-3 max-h-[500px] overflow-y-auto">
              <div className="space-y-3">
                {activityFeed.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-2 group">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                      activity.icon === 'message' ? 'bg-yellow-100' :
                      activity.icon === 'check' ? 'bg-green-100' :
                      activity.icon === 'star' ? 'bg-purple-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.icon === 'message' && <MessageSquare className="w-4 h-4 text-yellow-600" />}
                      {activity.icon === 'check' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.icon === 'star' && <Star className="w-4 h-4 text-purple-600 fill-purple-600" />}
                      {activity.icon === 'dollar' && <DollarSign className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#27465C] transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{activity.time}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-1.5 text-xs font-medium text-[#27465C] hover:bg-gray-50 rounded-lg transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white">Speaking Requests</h2>
          <p className="text-white/80 mt-1">Manage all your speaking opportunities</p>
        </div>
        <div className="text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
          <span className="font-bold text-xl">{requests.filter(r => r.status === 'pending').length}</span>
          <span className="text-sm ml-2">pending</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl">
          <div className="text-white text-lg">Loading requests...</div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">No requests yet</h3>
          <p className="text-white/80 text-lg">Speaking requests from event organizers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-2xl font-black text-gray-900">{request.eventTitle}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-bold ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getEventTypeColor(request.eventType)}`}>
                          {request.eventType.charAt(0).toUpperCase() + request.eventType.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium mb-3 flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{request.hostCompany} • {request.hostName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-5 bg-gray-50 rounded-xl p-4">
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium">Date & Time</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{request.eventDate}</p>
                      <p className="text-xs text-gray-600">{request.eventTime}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Duration</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{request.duration}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-medium">Location</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{request.location}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-medium">Audience</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{request.audienceSize}</p>
                    </div>
                  </div>

                  <div className="mb-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4">
                    <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-black text-green-600">{request.compensation}</span>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRequestAction(request.id, 'accept')}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center space-x-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, 'negotiate')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center space-x-2"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span>Negotiate</span>
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, 'decline')}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center space-x-2"
                        >
                          <XCircle className="w-5 h-5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </div>
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
        <div>
          <h2 className="text-3xl font-black text-white">My Calendar</h2>
          <p className="text-white/80 mt-1">View and manage your speaking schedule</p>
        </div>
        <button
          onClick={() => navigate('/host/availability')}
          className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-0.5"
        >
          Manage Availability
        </button>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-[#27465C] to-[#1e3a4a]">
          <h3 className="text-xl font-black text-white mb-1">Upcoming Events</h3>
          <p className="text-white/80 text-sm">Your confirmed speaking engagements</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {requests.filter(r => r.status === 'accepted').map(event => (
              <div key={event.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 border-l-4 border-green-500 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-gray-900 mb-2 group-hover:text-[#27465C] transition-colors">
                      {event.eventTitle}
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{event.eventDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.eventTime} • {event.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-600">Compensation</p>
                      <p className="text-xl font-black text-green-600">{event.compensation}</p>
                    </div>
                    <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#27465C] font-['Roboto']">
      {/* Navigation */}
      <nav className="w-full py-6 px-4 md:px-8 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-white text-3xl font-black">C&I</div>
            <div className="text-white/80 text-sm">Connect and Inspire</div>
          </div>
          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 hover:bg-white/10 rounded-xl px-4 py-2 transition-all"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-[#27465C]" />
                </div>
                <span className="text-white font-bold hidden md:block">{speakerName}</span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[100]">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-black">{speakerName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {JSON.parse(localStorage.getItem('user') || '{}').email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab('overview');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/speaker/settings');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 font-bold"
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

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Welcome Section - Always visible */}
        <div className="mb-3 relative">
          <h1 className="text-base md:text-lg font-black text-white mb-0.5">
            Welcome back, {speakerName}!
          </h1>
          <p className="text-white/80 text-xs">Here's what's happening with your speaking opportunities today.</p>
        </div>

        {/* Stats Cards - Always visible */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {/* Pending Requests Card */}
          <div className="bg-white rounded-lg p-2.5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="p-1 bg-[#27465C] rounded">
                <Clock className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-xs font-bold text-gray-700">Pending Requests</h3>
            </div>
            <p className="text-xl font-black text-[#27465C] text-center">{stats.pendingRequests}</p>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-white rounded-lg p-2.5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="p-1 bg-[#27465C] rounded">
                <Calendar className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-xs font-bold text-gray-700">Upcoming Events</h3>
            </div>
            <p className="text-xl font-black text-[#27465C] text-center">{stats.upcomingEvents}</p>
          </div>

          {/* Completed Events Card */}
          <div className="bg-white rounded-lg p-2.5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="p-1 bg-[#27465C] rounded">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-xs font-bold text-gray-700">Completed Events</h3>
            </div>
            <p className="text-xl font-black text-[#27465C] text-center">{stats.completedEvents}</p>
          </div>

          {/* Total Earnings Card */}
          <div className="bg-white rounded-lg p-2.5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="p-1 bg-[#27465C] rounded">
                <DollarSign className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-xs font-bold text-gray-700">Total Earnings</h3>
            </div>
            <p className="text-xl font-black text-[#27465C] text-center">${stats.totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
            {[
              { key: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
              { key: 'requests', label: 'Requests', icon: <MessageSquare className="w-4 h-4" /> },
              { key: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all duration-300 text-sm ${
                  activeTab === tab.key
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'calendar' && renderCalendar()}
      </div>
    </div>
  );
}
