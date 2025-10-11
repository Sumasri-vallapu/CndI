import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const speakers = [
  {
    id: 1,
    name: "Elon Musk",
    image: "/img1.png"
  },
  {
    id: 2, 
    name: "Sarah Chen",
    image: "/img2.png"
  },
  {
    id: 3,
    name: "Dr. James Wilson", 
    image: "/img3.png"
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    image: "/img4.png"
  },
  {
    id: 5,
    name: "David Kim",
    image: "/img5.png"
  },
  {
    id: 6,
    name: "Lisa Thompson",
    image: "/img6.png"
  }
];

export default function EventDetails() {
  const navigate = useNavigate();
  const { speakerId } = useParams();
  const [activeTab, setActiveTab] = useState('Event Details');
  const [formData, setFormData] = useState({
    eventTitle: 'Shilpa Kala Pradharshana',
    location: '',
    eventType: '',
    date: '',
    mode: '',
    audienceSize: '',
    targetAudience: '',
    sessionStartTime: '',
    sessionEndTime: ''
  });

  const speaker = speakers.find(s => s.id === parseInt(speakerId || '1'));

  const tabs = ['Event Details', 'Organizer Info', 'Speaker Requirements', 'Compensation'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookSpeaker = () => {
    navigate(`/organizer-info/${speakerId}`);
  };

  return (
    <div className="min-h-screen bg-[#27465C]">
      {/* Navigation */}
      <nav className="w-full py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <div className="text-white text-3xl font-bold">C&I</div>
            <div className="text-white text-sm">Connect and Inspire</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8">
        <h1 className="text-white text-2xl font-bold mb-8">Book Speaker - {activeTab}</h1>

        {/* Speaker Info */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
              <img 
                src={speaker?.image || "/img1.png"} 
                alt={speaker?.name || "Speaker"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white text-lg font-medium">
              You are booking {speaker?.name || "Elon Musk"}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white rounded-t-2xl p-2 mb-0 shadow-lg">
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => {
              const isCompleted = tabs.indexOf(activeTab) > index;
              const isCurrent = activeTab === tab;
              
              return (
                <div
                  key={tab}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    isCompleted
                      ? 'text-black'
                      : isCurrent
                      ? 'text-black'
                      : 'text-gray-400'
                  }`}
                >
                  {tab}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-b-2xl rounded-t-none p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Event Title */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Event Title</label>
              <input
                type="text"
                value={formData.eventTitle}
                onChange={(e) => handleInputChange('eventTitle', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-gray-100"
              />
            </div>

            {/* Location */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Search / Locate on Map"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20"
              />
            </div>

            {/* Target Audience */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Target Audience</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select audience</option>
                <option value="students">Students</option>
                <option value="professionals">Professionals</option>
                <option value="entrepreneurs">Entrepreneurs</option>
                <option value="general">General Public</option>
              </select>
            </div>

            {/* Event Type */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => handleInputChange('eventType', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select type</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="webinar">Webinar</option>
              </select>
            </div>

            {/* Mode */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => handleInputChange('mode', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select mode</option>
                <option value="in-person">In Person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Session Start Time */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Session Start Time</label>
              <input
                type="time"
                value={formData.sessionStartTime}
                onChange={(e) => handleInputChange('sessionStartTime', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20"
              />
            </div>

            {/* Date */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Date</label>
              <select
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select date</option>
                <option value="2024-12-01">December 1, 2024</option>
                <option value="2024-12-15">December 15, 2024</option>
                <option value="2025-01-15">January 15, 2025</option>
                <option value="2025-02-15">February 15, 2025</option>
              </select>
            </div>

            {/* Audience Size */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Audience Size</label>
              <input
                type="text"
                value={formData.audienceSize}
                onChange={(e) => handleInputChange('audienceSize', e.target.value)}
                placeholder="Expected attendees"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20"
              />
            </div>

            {/* Session End Time */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Session End Time</label>
              <input
                type="time"
                value={formData.sessionEndTime}
                onChange={(e) => handleInputChange('sessionEndTime', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20"
              />
            </div>
          </div>

          {/* Book Speaker Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleBookSpeaker}
              variant="dark"
              size="lg"
              className="px-8 py-3 font-medium"
            >
              Next: Organizer Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}