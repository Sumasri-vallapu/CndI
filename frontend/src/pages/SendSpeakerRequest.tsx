import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Building,
  Mail,
  Phone,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  Star,
  User,
  Loader2
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

interface EventRequest {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  duration: string;
  location: string;
  eventType: string;
  audience: string;
  audienceSize: number;
  budgetMin: number;
  budgetMax: number;
  requirements: string;
  organizerName: string;
  organizerEmail: string;
  organizerCompany: string;
  organizerPhone: string;
}

const SendSpeakerRequest: React.FC = () => {
  const { speakerId } = useParams<{ speakerId: string }>();
  const navigate = useNavigate();
  
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [currentStep, setCurrentStep] = useState<'event' | 'organizer' | 'review' | 'sending' | 'success'>(    'event');
  const [eventRequest, setEventRequest] = useState<EventRequest>({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    duration: '60',
    location: '',
    eventType: 'conference',
    audience: '',
    audienceSize: 50,
    budgetMin: 1000,
    budgetMax: 5000,
    requirements: '',
    organizerName: '',
    organizerEmail: '',
    organizerCompany: '',
    organizerPhone: ''
  });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventTypes = [
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'keynote', label: 'Keynote' },
    { value: 'panel', label: 'Panel Discussion' },
    { value: 'training', label: 'Training Session' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    const fetchSpeaker = async () => {
      if (!speakerId) return;

      try {
        setLoading(true);
        const response = await fetch(ENDPOINTS.SPEAKER_DETAIL(parseInt(speakerId)));

        if (!response.ok) {
          throw new Error('Failed to fetch speaker');
        }

        const data = await response.json();
        setSpeaker(data);
      } catch (error) {
        console.error('Error fetching speaker:', error);
        setError('Failed to load speaker information');
      } finally {
        setLoading(false);
      }
    };

    fetchSpeaker();
  }, [speakerId]);

  const handleInputChange = (field: keyof EventRequest, value: string | number) => {
    setEventRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateEventStep = () => {
    const { title, description, eventDate, eventTime, location, audience, audienceSize } = eventRequest;
    return title.trim() && description.trim() && eventDate && eventTime && 
           location.trim() && audience.trim() && audienceSize > 0;
  };

  const validateOrganizerStep = () => {
    const { organizerName, organizerEmail, organizerCompany } = eventRequest;
    return organizerName.trim() && organizerEmail.trim() && organizerCompany.trim();
  };

  const sendRequest = async () => {
    if (!speaker) return;

    setCurrentStep('sending');
    setSending(true);
    setError(null);

    try {
      // Combine date and time into datetime for backend
      const eventDateTime = `${eventRequest.eventDate}T${eventRequest.eventTime}:00`;

      const payload = {
        speaker: speaker.id,
        title: eventRequest.title,
        description: eventRequest.description,
        event_date: eventDateTime,
        duration_minutes: parseInt(eventRequest.duration),
        location: eventRequest.location,
        event_type: eventRequest.eventType,
        audience: eventRequest.audience,
        audience_size: eventRequest.audienceSize,
        budget_min: eventRequest.budgetMin,
        budget_max: eventRequest.budgetMax,
        requirements: eventRequest.requirements,
        organizer_name: eventRequest.organizerName,
        organizer_email: eventRequest.organizerEmail,
        organizer_company: eventRequest.organizerCompany,
        organizer_phone: eventRequest.organizerPhone,
        status: 'pending'
      };

      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(ENDPOINTS.EVENTS, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send request');
      }

      setSending(false);
      setCurrentStep('success');
    } catch (error: any) {
      console.error('Error sending request:', error);
      setError(error.message || 'Failed to send request. Please try again.');
      setSending(false);
      setCurrentStep('review');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#27465C] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (error && !speaker) {
    return (
      <div className="min-h-screen bg-[#27465C] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <div className="text-white text-lg">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100"
          >
            Go Back
          </button>
        </div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-black mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-black text-black">Send Speaking Request</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep !== 'success' && (
          <>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                {['event', 'organizer', 'review'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step 
                        ? 'bg-[#27465C] text-white' 
                        : ['event', 'organizer', 'review'].indexOf(currentStep) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {['event', 'organizer', 'review'].indexOf(currentStep) > index ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 2 && (
                      <div className={`w-16 h-1 mx-2 ${
                        ['event', 'organizer', 'review'].indexOf(currentStep) > index 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-20 mt-2">
                <span className="text-xs text-white">Event Details</span>
                <span className="text-xs text-white">Organizer Info</span>
                <span className="text-xs text-white">Review</span>
              </div>
            </div>

            {/* Speaker Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-black text-black mb-4">Speaking Request for:</h2>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#27465C] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-black">{speaker.user_name}</h3>
                  <p className="text-gray-600">{speaker.expertise} • {speaker.experience_years} years experience</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{speaker.average_rating}</span>
                    <span className="text-sm text-gray-500">rating</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{formatCurrency(speaker.hourly_rate)}/hour</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Event Details Step */}
        {currentStep === 'event' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-black text-black mb-6">Event Details</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={eventRequest.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter event title"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Event Type *
                  </label>
                  <select
                    value={eventRequest.eventType}
                    onChange={(e) => handleInputChange('eventType', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300 bg-white"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Event Description *
                </label>
                <textarea
                  value={eventRequest.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the event, topics to be covered, and objectives"
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={eventRequest.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={eventRequest.eventTime}
                    onChange={(e) => handleInputChange('eventTime', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={eventRequest.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300 bg-white"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Event Location *
                </label>
                <input
                  type="text"
                  value={eventRequest.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., San Francisco Convention Center, Virtual Event, etc."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Target Audience *
                  </label>
                  <input
                    type="text"
                    value={eventRequest.audience}
                    onChange={(e) => handleInputChange('audience', e.target.value)}
                    placeholder="e.g., Healthcare professionals, Tech leaders, Students"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Expected Audience Size *
                  </label>
                  <input
                    type="number"
                    value={eventRequest.audienceSize}
                    onChange={(e) => handleInputChange('audienceSize', parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Budget Range - Minimum ($)
                  </label>
                  <input
                    type="number"
                    value={eventRequest.budgetMin}
                    onChange={(e) => handleInputChange('budgetMin', parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Budget Range - Maximum ($)
                  </label>
                  <input
                    type="number"
                    value={eventRequest.budgetMax}
                    onChange={(e) => handleInputChange('budgetMax', parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Special Requirements or Notes
                </label>
                <textarea
                  value={eventRequest.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Any special equipment, accessibility needs, or other requirements"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setCurrentStep('organizer')}
                disabled={!validateEventStep()}
                className="bg-[#27465C] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#1e3a4a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Organizer Information Step */}
        {currentStep === 'organizer' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-black text-black mb-6">Organizer Information</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={eventRequest.organizerName}
                    onChange={(e) => handleInputChange('organizerName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={eventRequest.organizerEmail}
                    onChange={(e) => handleInputChange('organizerEmail', e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Organization/Company *
                  </label>
                  <input
                    type="text"
                    value={eventRequest.organizerCompany}
                    onChange={(e) => handleInputChange('organizerCompany', e.target.value)}
                    placeholder="Enter organization name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={eventRequest.organizerPhone}
                    onChange={(e) => handleInputChange('organizerPhone', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-[#27465C] transition-all duration-200 hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep('event')}
                className="bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('review')}
                disabled={!validateOrganizerStep()}
                className="bg-[#27465C] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#1e3a4a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Review Request
              </button>
            </div>
          </div>
        )}

        {/* Review Step */}
        {currentStep === 'review' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-black text-black mb-6">Review Your Request</h2>
            
            <div className="space-y-6">
              {/* Event Summary */}
              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-black mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Event Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Title:</span> {eventRequest.title}</div>
                  <div><span className="font-medium">Type:</span> {eventTypes.find(t => t.value === eventRequest.eventType)?.label}</div>
                  <div><span className="font-medium">Date:</span> {new Date(eventRequest.eventDate).toLocaleDateString()}</div>
                  <div><span className="font-medium">Time:</span> {eventRequest.eventTime}</div>
                  <div><span className="font-medium">Duration:</span> {eventRequest.duration} minutes</div>
                  <div><span className="font-medium">Location:</span> {eventRequest.location}</div>
                  <div><span className="font-medium">Audience:</span> {eventRequest.audience}</div>
                  <div><span className="font-medium">Audience Size:</span> {eventRequest.audienceSize}</div>
                  <div><span className="font-medium">Budget:</span> {formatCurrency(eventRequest.budgetMin)} - {formatCurrency(eventRequest.budgetMax)}</div>
                </div>
                <div className="mt-3">
                  <span className="font-medium">Description:</span>
                  <p className="text-sm text-gray-600 mt-1">{eventRequest.description}</p>
                </div>
                {eventRequest.requirements && (
                  <div className="mt-3">
                    <span className="font-medium">Requirements:</span>
                    <p className="text-sm text-gray-600 mt-1">{eventRequest.requirements}</p>
                  </div>
                )}
              </div>

              {/* Organizer Summary */}
              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-black mb-3 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Organizer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Name:</span> {eventRequest.organizerName}</div>
                  <div><span className="font-medium">Email:</span> {eventRequest.organizerEmail}</div>
                  <div><span className="font-medium">Organization:</span> {eventRequest.organizerCompany}</div>
                  {eventRequest.organizerPhone && (
                    <div><span className="font-medium">Phone:</span> {eventRequest.organizerPhone}</div>
                  )}
                </div>
              </div>

              {/* Important Notice */}
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Request Terms</p>
                  <ul className="space-y-1 text-xs">
                    <li>• The speaker will receive your request and can accept, decline, or respond with questions</li>
                    <li>• You will be notified via email about the speaker's response</li>
                    <li>• Payment is only required after the speaker accepts your request</li>
                    <li>• All communication will happen through our messaging system</li>
                  </ul>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start p-4 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep('organizer')}
                className="bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Back
              </button>
              <button
                onClick={sendRequest}
                disabled={sending}
                className="bg-[#27465C] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#1e3a4a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Sending State */}
        {currentStep === 'sending' && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 border-4 border-[#27465C] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-black text-black mb-2">Sending Your Request</h2>
            <p className="text-gray-600">Please wait while we send your speaking request to {speaker.user_name}...</p>
          </div>
        )}

        {/* Success State */}
        {currentStep === 'success' && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">Request Sent Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your speaking request has been sent to {speaker.user_name}. You will receive an email notification when they respond.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-black mb-2">What happens next?</h3>
              <div className="text-sm space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#27465C] rounded-full mr-3"></div>
                  <span>The speaker will review your request within 24-48 hours</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#27465C] rounded-full mr-3"></div>
                  <span>You'll receive an email notification with their response</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#27465C] rounded-full mr-3"></div>
                  <span>If accepted, you can proceed with payment and event coordination</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/host/dashboard')}
                className="bg-[#27465C] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#1e3a4a] transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/find-speaker')}
                className="bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Find More Speakers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendSpeakerRequest;