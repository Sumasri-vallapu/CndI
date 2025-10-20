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

export default function SpeakerRequirements() {
  const navigate = useNavigate();
  const { speakerId } = useParams();
  const [activeTab, setActiveTab] = useState('Speaker Requirements');
  const [formData, setFormData] = useState({
    sessionDuration: '',
    presentationFormat: '',
    topicPreferences: '',
    technicalRequirements: '',
    accessibilityNeeds: '',
    specialRequests: '',
    travelAccommodation: '',
    diningPreferences: '',
    emergencyContact: ''
  });

  const speaker = speakers.find(s => s.id === parseInt(speakerId || '1'));

  const tabs = ['Event Details', 'Organizer Info', 'Speaker Requirements', 'Compensation'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    navigate(`/compensation/${speakerId}`);
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
            {/* Session Duration */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Session Duration</label>
              <select
                value={formData.sessionDuration}
                onChange={(e) => handleInputChange('sessionDuration', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select duration</option>
                <option value="30min">30 minutes</option>
                <option value="45min">45 minutes</option>
                <option value="60min">1 hour</option>
                <option value="90min">1.5 hours</option>
                <option value="2hr">2 hours</option>
                <option value="halfday">Half day</option>
                <option value="fullday">Full day</option>
              </select>
            </div>

            {/* Presentation Format */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Presentation Format</label>
              <select
                value={formData.presentationFormat}
                onChange={(e) => handleInputChange('presentationFormat', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select format</option>
                <option value="keynote">Keynote Speech</option>
                <option value="workshop">Interactive Workshop</option>
                <option value="panel">Panel Discussion</option>
                <option value="fireside">Fireside Chat</option>
                <option value="qa">Q&A Session</option>
                <option value="masterclass">Masterclass</option>
              </select>
            </div>

            {/* Topic Preferences */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Topic Preferences</label>
              <input
                type="text"
                value={formData.topicPreferences}
                onChange={(e) => handleInputChange('topicPreferences', e.target.value)}
                placeholder="Specific topics or themes"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20"
              />
            </div>

            {/* Technical Requirements */}
            <div className="md:col-span-2">
              <label className="block text-black font-medium mb-2">Technical Requirements</label>
              <textarea
                value={formData.technicalRequirements}
                onChange={(e) => handleInputChange('technicalRequirements', e.target.value)}
                placeholder="AV equipment, microphone, projector, lighting, etc."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 resize-none"
              />
            </div>

            {/* Travel Accommodation */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Travel & Accommodation</label>
              <select
                value={formData.travelAccommodation}
                onChange={(e) => handleInputChange('travelAccommodation', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select option</option>
                <option value="provided">We will provide</option>
                <option value="reimbursed">We will reimburse</option>
                <option value="speaker">Speaker will arrange</option>
                <option value="notneeded">Not needed (local)</option>
              </select>
            </div>

            {/* Accessibility Needs */}
            <div className="md:col-span-2">
              <label className="block text-black font-medium mb-2">Accessibility Needs</label>
              <textarea
                value={formData.accessibilityNeeds}
                onChange={(e) => handleInputChange('accessibilityNeeds', e.target.value)}
                placeholder="Any accessibility requirements or accommodations needed"
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 resize-none"
              />
            </div>

            {/* Dining Preferences */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Dining Preferences</label>
              <select
                value={formData.diningPreferences}
                onChange={(e) => handleInputChange('diningPreferences', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="glutenfree">Gluten-free</option>
                <option value="halal">Halal</option>
                <option value="kosher">Kosher</option>
                <option value="nopreference">No preference</option>
                <option value="other">Other (specify in special requests)</option>
              </select>
            </div>

            {/* Emergency Contact */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Emergency Contact</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Name and phone number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20"
              />
            </div>

            {/* Special Requests */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Special Requests</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Any additional requirements or requests"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 resize-none"
              />
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleNext}
              variant="dark"
              size="lg"
              className="px-8 py-3 font-medium"
            >
              Next: Compensation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}