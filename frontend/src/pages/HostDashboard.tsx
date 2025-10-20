import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Calendar,
  MessageSquare,
  Settings,
  Bell,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Edit3,
  Eye,
  LogOut,
  ChevronDown,
  DollarSign,
  Award,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  upcomingEvents: number;
  completedEvents: number;
  rating: number;
  totalRatings: number;
  monthlyGrowth: number;
  totalEarnings: number;
  responseRate: number;
}

interface ActivityItem {
  id: number;
  type: 'request' | 'response' | 'booking' | 'completion';
  title: string;
  description: string;
  time: string;
  icon: 'request' | 'check' | 'calendar' | 'star';
}

interface RecentRequest {
  id: number;
  organizerName: string;
  eventTitle: string;
  eventDate: string;
  status: 'pending' | 'accepted' | 'declined';
  requestDate: string;
}

const HostDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hostName, setHostName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 24,
    pendingRequests: 3,
    upcomingEvents: 2,
    completedEvents: 18,
    rating: 4.8,
    totalRatings: 156,
    monthlyGrowth: 12.5,
    totalEarnings: 45000,
    responseRate: 95
  });

  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([
    {
      id: 1,
      type: 'request',
      title: 'New speaking request',
      description: 'Tech Summit 2024 sent you a request',
      time: '5 minutes ago',
      icon: 'request'
    },
    {
      id: 2,
      type: 'booking',
      title: 'Event confirmed',
      description: 'Innovation in Medical Technology was confirmed',
      time: '2 hours ago',
      icon: 'calendar'
    },
    {
      id: 3,
      type: 'response',
      title: 'Request accepted',
      description: 'You accepted Healthcare Leaders Forum request',
      time: '1 day ago',
      icon: 'check'
    },
    {
      id: 4,
      type: 'completion',
      title: 'Event completed',
      description: 'AI in Healthcare workshop finished successfully',
      time: '2 days ago',
      icon: 'star'
    }
  ]);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([
    {
      id: 1,
      organizerName: "Tech Summit 2024",
      eventTitle: "AI in Healthcare: Future Perspectives",
      eventDate: "2024-09-15",
      status: 'pending',
      requestDate: "2024-09-01"
    },
    {
      id: 2,
      organizerName: "University of California",
      eventTitle: "Innovation in Medical Technology",
      eventDate: "2024-09-22",
      status: 'accepted',
      requestDate: "2024-08-28"
    },
    {
      id: 3,
      organizerName: "Healthcare Leaders Forum",
      eventTitle: "Digital Transformation in Medicine",
      eventDate: "2024-10-05",
      status: 'pending',
      requestDate: "2024-08-30"
    }
  ]);

  useEffect(() => {
    // In a real app, this would fetch from API
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setHostName(user.first_name || 'Host');
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    navigate('/host-login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#27465C]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-black text-black">
                C&I
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-black">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#27465C] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-black font-medium">{hostName}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-black">{hostName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {JSON.parse(localStorage.getItem('user') || '{}').email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/host/profile/edit');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/host/settings');
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6 relative">
          <h1 className="text-lg md:text-xl font-black text-white mb-1">
            Welcome back, {hostName}!
          </h1>
          <p className="text-white/80 text-sm">Here's what's happening with your speaking opportunities today.</p>
        </div>

        {/* Stats Cards - Redesigned */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {/* Pending Requests Card */}
          <div className="bg-white rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-0.5">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-[#27465C] rounded-lg shadow-sm">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xs font-bold text-gray-700">Pending Requests</h3>
            </div>
            <p className="text-2xl font-black text-[#27465C] text-center mt-1">{stats.pendingRequests}</p>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-white rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-0.5">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-[#27465C] rounded-lg shadow-sm">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xs font-bold text-gray-700">Upcoming Events</h3>
            </div>
            <p className="text-2xl font-black text-[#27465C] text-center mt-1">{stats.upcomingEvents}</p>
          </div>

          {/* Completed Events Card */}
          <div className="bg-white rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-0.5">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-[#27465C] rounded-lg shadow-sm">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xs font-bold text-gray-700">Completed Events</h3>
            </div>
            <p className="text-2xl font-black text-[#27465C] text-center mt-1">{stats.completedEvents}</p>
          </div>

          {/* Total Earnings Card */}
          <div className="bg-white rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-0.5">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-[#27465C] rounded-lg shadow-sm">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xs font-bold text-gray-700">Total Earnings</h3>
            </div>
            <p className="text-2xl font-black text-[#27465C] text-center mt-1">${stats.totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Requests - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
              <div className="px-4 py-3 bg-gradient-to-r from-[#27465C] to-[#1e3a4a] border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white mb-0.5">Speaking Requests</h2>
                    <p className="text-white/80 text-xs">Manage your speaking opportunities</p>
                  </div>
                  <Link
                    to="/host/requests"
                    className="bg-white text-[#27465C] hover:bg-gray-100 font-medium text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {recentRequests.map((request) => (
                  <div key={request.id} className="px-4 py-3 hover:bg-gray-50 transition-all duration-200 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-black text-black text-sm group-hover:text-[#27465C] transition-colors">{request.eventTitle}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 mb-1.5">
                          <User className="w-3 h-3 text-gray-400" />
                          <p className="text-xs font-medium text-gray-700">
                            {request.organizerName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(request.eventDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Requested {new Date(request.requestDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button className="p-1.5 text-gray-400 hover:text-[#27465C] hover:bg-gray-100 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-4 border border-gray-200">
              <div className="px-4 py-3 bg-gradient-to-r from-[#27465C] to-[#1e3a4a] border-b border-white/10">
                <h3 className="text-lg font-black text-white mb-0.5">Recent Activity</h3>
                <p className="text-white/80 text-xs">Your latest updates</p>
              </div>
              <div className="p-3 max-h-[500px] overflow-y-auto">
                <div className="space-y-3">
                  {activityFeed.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-2 group">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                        activity.icon === 'request' ? 'bg-yellow-100' :
                        activity.icon === 'check' ? 'bg-green-100' :
                        activity.icon === 'calendar' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        {activity.icon === 'request' && <Clock className="w-4 h-4 text-yellow-600" />}
                        {activity.icon === 'check' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {activity.icon === 'calendar' && <Calendar className="w-4 h-4 text-blue-600" />}
                        {activity.icon === 'star' && <Star className="w-4 h-4 text-purple-600 fill-purple-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 group-hover:text-[#27465C] transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center space-x-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{activity.time}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Activity Link */}
                <button className="w-full mt-3 py-1.5 text-xs font-medium text-[#27465C] hover:bg-gray-50 rounded-lg transition-colors">
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;