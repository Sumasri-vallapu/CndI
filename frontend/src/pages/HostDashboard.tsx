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
  ChevronDown
} from 'lucide-react';

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  upcomingEvents: number;
  completedEvents: number;
  rating: number;
  totalRatings: number;
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
    totalRatings: 156
  });
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
                SpeakEasy
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
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            Welcome back, {hostName}!
          </h1>
          <p className="text-white/80">Here's what's happening with your speaking opportunities.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-black text-black">{stats.totalRequests}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-[#27465C]" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-black text-black">{stats.pendingRequests}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-black text-black">{stats.upcomingEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-black text-black">{stats.rating}</p>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-500">({stats.totalRatings})</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-[#27465C]" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => navigate('/host/profile/edit')}
            className="bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <button 
            onClick={() => navigate('/host/requests')}
            className="bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>View Requests</span>
          </button>

          <button 
            onClick={() => navigate('/host/availability')}
            className="bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Calendar</span>
          </button>

          <button 
            onClick={() => navigate('/host/settings')}
            className="bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-black">Recent Requests</h2>
              <Link 
                to="/host/requests" 
                className="text-[#27465C] hover:text-[#1e3a4a] font-medium text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {recentRequests.map((request) => (
              <div key={request.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-black">{request.eventTitle}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Organizer: {request.organizerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Event Date: {new Date(request.eventDate).toLocaleDateString()} • 
                      Requested: {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-[#27465C] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    {request.status === 'pending' && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
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
    </div>
  );
};

export default HostDashboard;