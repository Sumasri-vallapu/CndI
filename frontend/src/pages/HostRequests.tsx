import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Briefcase
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-500';
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
            <h1 className="text-2xl font-black text-black">Speaking Requests</h1>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests by event, organizer, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className={`bg-white rounded-lg shadow-sm ${getUrgencyColor(request.urgency)}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-black text-black">{request.eventTitle}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      {request.urgency === 'high' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{request.eventDescription}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    <span>{request.organizerCompany}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(request.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{request.audienceSize} attendees</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{request.eventTime} • {request.eventDuration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{request.eventType}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{request.budget}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Requested by <span className="font-medium">{request.organizerName}</span> on {new Date(request.requestDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => viewRequestDetails(request)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-[#27465C] hover:text-[#1e3a4a] font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'accepted')}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'declined')}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-black text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? "No requests match your current filters." 
                  : "You don't have any speaking requests yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-black">Request Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-black"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-black text-black mb-2">{selectedRequest.eventTitle}</h3>
                  <p className="text-gray-600">{selectedRequest.eventDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-black mb-2">Event Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{new Date(selectedRequest.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedRequest.eventTime} • {selectedRequest.eventDuration}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedRequest.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedRequest.audienceSize} attendees</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-black mb-2">Organizer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {selectedRequest.organizerName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {selectedRequest.organizerEmail}
                      </div>
                      <div>
                        <span className="font-medium">Company:</span> {selectedRequest.organizerCompany}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-black mb-2">Event Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Event Type:</span> {selectedRequest.eventType}
                    </div>
                    <div>
                      <span className="font-medium">Budget:</span> {selectedRequest.budget}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Audience:</span> {selectedRequest.audience}
                    </div>
                  </div>
                </div>

                {selectedRequest.requirements && (
                  <div>
                    <h4 className="font-bold text-black mb-2">Special Requirements</h4>
                    <p className="text-sm text-gray-600">{selectedRequest.requirements}</p>
                  </div>
                )}

                {selectedRequest.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedRequest.id, 'accepted');
                        setShowDetails(false);
                      }}
                      className="flex-1 bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept Request</span>
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedRequest.id, 'declined');
                        setShowDetails(false);
                      }}
                      className="flex-1 bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline Request</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostRequests;