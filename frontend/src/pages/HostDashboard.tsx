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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 relative">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Welcome back, {hostName}!
          </h1>
          <p className="text-white/80 text-base md:text-lg">Here's what's happening with your speaking opportunities today.</p>
        </div>

        {/* Enhanced Stats Cards with Visual Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Pending Requests Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-yellow-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-yellow-500 rounded-xl shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-xs font-medium text-yellow-700 bg-yellow-200 px-2 py-1 rounded-full">
                <Activity className="w-3 h-3" />
                <span>Urgent</span>
              </div>
            </div>
            <p className="text-sm font-medium text-yellow-700 mb-1">Pending Requests</p>
            <p className="text-3xl font-black text-yellow-900 mb-2">{stats.pendingRequests}</p>
            <p className="text-xs text-yellow-600">Requires your attention</p>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-xl shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-xs font-medium text-green-700">
                <ArrowUpRight className="w-3 h-3" />
                <span>+{stats.monthlyGrowth}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-green-700 mb-1">Upcoming Events</p>
            <p className="text-3xl font-black text-green-900 mb-2">{stats.upcomingEvents}</p>
            <p className="text-xs text-green-600">Next 30 days</p>
          </div>

          {/* Completed Events Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-xl shadow-md">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-blue-900">{stats.rating}</span>
              </div>
            </div>
            <p className="text-sm font-medium text-blue-700 mb-1">Completed Events</p>
            <p className="text-3xl font-black text-blue-900 mb-2">{stats.completedEvents}</p>
            <p className="text-xs text-blue-600">{stats.totalRatings} ratings received</p>
          </div>

          {/* Total Earnings Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-500 rounded-xl shadow-md">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-xs font-medium text-purple-700">
                <TrendingUp className="w-3 h-3" />
                <span>{stats.responseRate}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-purple-700 mb-1">Total Earnings</p>
            <p className="text-3xl font-black text-purple-900 mb-2">${stats.totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-purple-600">All time earnings</p>
          </div>
        </div>

        {/* Quick Actions with Icons */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-lg font-black text-white mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/find-speaker')}
              className="bg-white text-black font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex flex-col items-center justify-center space-y-2"
            >
              <Users className="w-5 h-5" />
              <span className="text-sm">Find Speakers</span>
            </button>

            <button
              onClick={() => navigate('/host/requests')}
              className="bg-white text-black font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex flex-col items-center justify-center space-y-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">My Requests</span>
            </button>

            <button
              onClick={() => navigate('/host/messages')}
              className="bg-white text-black font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex flex-col items-center justify-center space-y-2 relative"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">Messages</span>
              {stats.pendingRequests > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => navigate('/host/profile/edit')}
              className="bg-white text-black font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex flex-col items-center justify-center space-y-2"
            >
              <User className="w-5 h-5" />
              <span className="text-sm">My Profile</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Requests - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-[#27465C] to-[#1e3a4a] border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white mb-1">Recent Requests</h2>
                    <p className="text-white/80 text-sm">Manage your speaking opportunities</p>
                  </div>
                  <Link
                    to="/host/requests"
                    className="bg-white text-[#27465C] hover:bg-gray-100 font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {recentRequests.map((request) => (
                  <div key={request.id} className="px-6 py-5 hover:bg-gray-50 transition-all duration-200 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-black text-black text-lg group-hover:text-[#27465C] transition-colors">{request.eventTitle}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)} shadow-sm`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">
                            {request.organizerName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-[#27465C] hover:bg-gray-100 rounded-lg transition-all">
                          <Eye className="w-5 h-5" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <XCircle className="w-5 h-5" />
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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-4">
              <div className="px-6 py-4 bg-gradient-to-r from-[#27465C] to-[#1e3a4a] border-b border-white/10">
                <h3 className="text-lg font-black text-white mb-1">Recent Activity</h3>
                <p className="text-white/80 text-xs">Your latest updates</p>
              </div>
              <div className="p-4 max-h-[600px] overflow-y-auto">
                <div className="space-y-4">
                  {activityFeed.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-3 group">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        activity.icon === 'request' ? 'bg-yellow-100' :
                        activity.icon === 'check' ? 'bg-green-100' :
                        activity.icon === 'calendar' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        {activity.icon === 'request' && <Clock className="w-5 h-5 text-yellow-600" />}
                        {activity.icon === 'check' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {activity.icon === 'calendar' && <Calendar className="w-5 h-5 text-blue-600" />}
                        {activity.icon === 'star' && <Star className="w-5 h-5 text-purple-600 fill-purple-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#27465C] transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{activity.time}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Activity Link */}
                <button className="w-full mt-4 py-2 text-sm font-medium text-[#27465C] hover:bg-gray-50 rounded-lg transition-colors">
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