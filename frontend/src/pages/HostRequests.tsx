import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Building,
  DollarSign,
  Briefcase,
  ChevronDown,
  Check,
  TrendingUp,
  AlertCircle,
  Home
} from 'lucide-react';

interface SpeakingRequest {
  id: number;
  organizerName: string;
  organizerEmail: string;
  organizerCompany: string;
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  eventTime: string;
  eventDuration: string;
  location: string;
  eventType: string;
  audience: string;
  audienceSize: number;
  budget: string;
  requirements: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  requestDate: string;
  urgency: 'low' | 'medium' | 'high';
}

const HostRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SpeakingRequest[]>([
    {
      id: 1,
      organizerName: "Michael Chen",
      organizerEmail: "michael.chen@techsummit.com",
      organizerCompany: "Tech Summit 2024",
      eventTitle: "AI in Healthcare: Future Perspectives",
      eventDescription: "A comprehensive discussion on how artificial intelligence is transforming healthcare delivery, from diagnostics to personalized treatment plans.",
      eventDate: "2024-09-15",
      eventTime: "2:00 PM",
      eventDuration: "45 minutes",
      location: "San Francisco Convention Center",
      eventType: "Conference Keynote",
      audience: "Healthcare professionals, tech leaders",
      audienceSize: 500,
      budget: "$5,000 - $7,500",
      requirements: "Wireless microphone, presentation clicker, stage lighting",
      status: 'pending',
      requestDate: "2024-09-01",
      urgency: 'high'
    },
    {
      id: 2,
      organizerName: "Dr. Jennifer Martinez",
      organizerEmail: "j.martinez@ucsf.edu",
      organizerCompany: "University of California San Francisco",
      eventTitle: "Innovation in Medical Technology",
      eventDescription: "A presentation for medical students on the latest innovations in medical technology and their impact on patient care.",
      eventDate: "2024-09-22",
      eventTime: "10:00 AM",
      eventDuration: "60 minutes",
      location: "UCSF Parnassus Campus",
      eventType: "Educational Seminar",
      audience: "Medical students, faculty",
      audienceSize: 150,
      budget: "$2,000 - $3,000",
      requirements: "Projector, microphone, Q&A session",
      status: 'accepted',
      requestDate: "2024-08-28",
      urgency: 'medium'
    },
    {
      id: 3,
      organizerName: "Sarah Thompson",
      organizerEmail: "sarah@healthleaders.org",
      organizerCompany: "Healthcare Leaders Forum",
      eventTitle: "Digital Transformation in Medicine",
      eventDescription: "Exploring how digital technologies are revolutionizing healthcare operations and patient experiences.",
      eventDate: "2024-10-05",
      eventTime: "3:30 PM",
      eventDuration: "30 minutes",
      location: "Virtual Event",
      eventType: "Panel Discussion",
      audience: "Healthcare executives",
      audienceSize: 300,
      budget: "$3,500 - $5,000",
      requirements: "High-quality camera, stable internet, quiet environment",
      status: 'pending',
      requestDate: "2024-08-30",
      urgency: 'low'
    },
    {
      id: 4,
      organizerName: "Robert Kim",
      organizerEmail: "rkim@medtech-expo.com",
      organizerCompany: "MedTech Expo 2024",
      eventTitle: "The Future of Telemedicine",
      eventDescription: "Discussing the evolution of telemedicine and its role in making healthcare more accessible.",
      eventDate: "2024-08-20",
      eventTime: "11:00 AM",
      eventDuration: "40 minutes",
      location: "Los Angeles Convention Center",
      eventType: "Workshop",
      audience: "Healthcare providers, patients",
      audienceSize: 200,
      budget: "$4,000 - $6,000",
      requirements: "Interactive presentation setup, wireless mic",
      status: 'completed',
      requestDate: "2024-08-01",
      urgency: 'medium'
    }
  ]);

  const [filteredRequests, setFilteredRequests] = useState<SpeakingRequest[]>(requests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<SpeakingRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.organizerCompany.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/40';
      case 'accepted': return 'bg-green-500/20 text-green-700 border border-green-500/40';
      case 'declined': return 'bg-red-500/20 text-red-700 border border-red-500/40';
      case 'completed': return 'bg-blue-500/20 text-blue-700 border border-blue-500/40';
      default: return 'bg-gray-500/20 text-gray-700 border border-gray-500/40';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high': return { color: 'bg-red-500', text: 'Urgent', icon: <AlertCircle className="w-3 h-3" /> };
      case 'medium': return { color: 'bg-yellow-500', text: 'Medium', icon: <Clock className="w-3 h-3" /> };
      case 'low': return { color: 'bg-green-500', text: 'Low', icon: <TrendingUp className="w-3 h-3" /> };
      default: return { color: 'bg-gray-500', text: 'Normal', icon: null };
    }
  };

  const handleStatusUpdate = (requestId: number, newStatus: 'accepted' | 'declined') => {
    setRequests(prev => prev.map(request =>
      request.id === requestId ? { ...request, status: newStatus } : request
    ));
  };

  const viewRequestDetails = (request: SpeakingRequest) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'text-white', count: requests.length },
    { value: 'pending', label: 'Pending', color: 'text-yellow-400', count: requests.filter(r => r.status === 'pending').length },
    { value: 'accepted', label: 'Accepted', color: 'text-green-400', count: requests.filter(r => r.status === 'accepted').length },
    { value: 'declined', label: 'Declined', color: 'text-red-400', count: requests.filter(r => r.status === 'declined').length },
    { value: 'completed', label: 'Completed', color: 'text-blue-400', count: requests.filter(r => r.status === 'completed').length }
  ];

  const selectedOption = statusOptions.find(opt => opt.value === statusFilter) || statusOptions[0];

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-[#27465C] font-['Roboto']">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#27465C] to-[#1e3a4a] shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/host/dashboard')}
                  className="flex items-center text-white/80 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Dashboard</span>
                </button>
              </div>
              <Link to="/" className="text-white/80 hover:text-white transition-colors">
                <Home className="w-5 h-5" />
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Speaking Requests</h1>
            <p className="text-white/80">Manage and respond to your speaking opportunities</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-white/70 text-xs mb-1">Total Requests</div>
              <div className="text-xl font-black text-white">{stats.total}</div>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/30">
              <div className="text-yellow-200 text-xs mb-1">Pending</div>
              <div className="text-xl font-black text-yellow-100">{stats.pending}</div>
            </div>
            <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
              <div className="text-green-200 text-xs mb-1">Accepted</div>
              <div className="text-xl font-black text-green-100">{stats.accepted}</div>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30">
              <div className="text-blue-200 text-xs mb-1">Completed</div>
              <div className="text-xl font-black text-blue-100">{stats.completed}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-5 border border-white/20">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Search by event, organizer, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 focus:outline-none transition-all"
              />
            </div>
            {/* Custom Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full sm:w-56 px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl flex items-center justify-between hover:bg-white/30 transition-all duration-200 focus:outline-none focus:border-white/50"
              >
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-white/80" />
                  <span className={`font-bold ${selectedOption.color}`}>
                    {selectedOption.label}
                  </span>
                  <span className="text-white/60 text-sm">({selectedOption.count})</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-white/80 transition-transform duration-200 ${
                    showDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />

                  {/* Dropdown List */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e3a4a] border-2 border-white/20 rounded-xl shadow-2xl z-20 overflow-hidden">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setShowDropdown(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors duration-150 ${
                          statusFilter === option.value ? 'bg-white/20' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${option.color}`}>
                            {option.label}
                          </span>
                          <span className="text-white/60 text-sm">({option.count})</span>
                        </div>
                        {statusFilter === option.value && (
                          <Check className="w-5 h-5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const urgency = getUrgencyBadge(request.urgency);
            return (
              <div key={request.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <h3 className="text-lg md:text-xl font-black text-gray-900">{request.eventTitle}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        {request.urgency === 'high' && (
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${urgency.color} text-white`}>
                            {urgency.icon}
                            <span>{urgency.text}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3 leading-relaxed text-sm">{request.eventDescription}</p>
                    </div>
                  </div>

                  {/* Event Details Grid */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-blue-500 rounded-lg">
                          <Building className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Company</div>
                          <div className="font-bold text-gray-900 text-sm">{request.organizerCompany}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-green-500 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Date</div>
                          <div className="font-bold text-gray-900 text-sm">{new Date(request.eventDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-purple-500 rounded-lg">
                          <MapPin className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Location</div>
                          <div className="font-bold text-gray-900 text-sm">{request.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-orange-500 rounded-lg">
                          <Users className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Audience</div>
                          <div className="font-bold text-gray-900 text-sm">{request.audienceSize} attendees</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-indigo-500 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Time & Duration</div>
                          <div className="font-bold text-gray-900 text-sm">{request.eventTime} • {request.eventDuration}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-emerald-500 rounded-lg">
                          <DollarSign className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Budget</div>
                          <div className="font-bold text-gray-900 text-sm">{request.budget}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      Requested by <span className="font-bold text-gray-900">{request.organizerName}</span> on {new Date(request.requestDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewRequestDetails(request)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-lg font-bold transition-colors text-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'accepted')}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold transition-all transform hover:-translate-y-0.5 shadow-lg text-sm"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'declined')}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg font-bold transition-all transform hover:-translate-y-0.5 shadow-lg text-sm"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRequests.length === 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg border border-white/20">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">No requests found</h3>
              <p className="text-white/80 text-sm">
                {searchTerm || statusFilter !== 'all'
                  ? "No requests match your current filters. Try adjusting your search."
                  : "You don't have any speaking requests yet. They'll appear here when you receive them."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="sticky top-0 bg-gradient-to-r from-[#27465C] to-[#1e3a4a] px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Request Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{selectedRequest.eventTitle}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{selectedRequest.eventDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-black text-gray-900 mb-3 flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Event Information</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-gray-500 text-xs">Date</div>
                        <div className="font-bold text-gray-900 text-sm">{new Date(selectedRequest.eventDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-3.5 h-3.5 mr-2 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-gray-500 text-xs">Time & Duration</div>
                        <div className="font-bold text-gray-900 text-sm">{selectedRequest.eventTime} • {selectedRequest.eventDuration}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-gray-500 text-xs">Location</div>
                        <div className="font-bold text-gray-900 text-sm">{selectedRequest.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="w-3.5 h-3.5 mr-2 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-gray-500 text-xs">Audience Size</div>
                        <div className="font-bold text-gray-900 text-sm">{selectedRequest.audienceSize} attendees</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-black text-gray-900 mb-3 flex items-center space-x-2 text-sm">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span>Organizer Information</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Name</div>
                      <div className="font-bold text-gray-900 text-sm">{selectedRequest.organizerName}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Email</div>
                      <div className="font-bold text-gray-900 text-sm">{selectedRequest.organizerEmail}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Company</div>
                      <div className="font-bold text-gray-900 text-sm">{selectedRequest.organizerCompany}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <h4 className="font-black text-gray-900 mb-3 flex items-center space-x-2 text-sm">
                  <Briefcase className="w-4 h-4 text-green-600" />
                  <span>Event Details</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Event Type</div>
                    <div className="font-bold text-gray-900 text-sm">{selectedRequest.eventType}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Budget</div>
                    <div className="font-bold text-gray-900 text-sm">{selectedRequest.budget}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-gray-500 text-xs mb-1">Target Audience</div>
                    <div className="font-bold text-gray-900 text-sm">{selectedRequest.audience}</div>
                  </div>
                </div>
              </div>

              {selectedRequest.requirements && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-black text-gray-900 mb-2 flex items-center space-x-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span>Special Requirements</span>
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">{selectedRequest.requirements}</p>
                </div>
              )}

              {selectedRequest.status === 'pending' && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedRequest.id, 'accepted');
                      setShowDetails(false);
                    }}
                    className="flex-1 bg-green-600 text-white font-black py-3 px-5 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-1 shadow-lg text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept Request</span>
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedRequest.id, 'declined');
                      setShowDetails(false);
                    }}
                    className="flex-1 bg-red-600 text-white font-black py-3 px-5 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-1 shadow-lg text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline Request</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostRequests;
