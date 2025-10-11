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

export default function OrganizerInfo() {
  const navigate = useNavigate();
  const { speakerId } = useParams();
  const [activeTab, setActiveTab] = useState('Organizer Info');
  const [formData, setFormData] = useState({
    organizerName: 'Mukundh Guptha',
    emailAddress: 'mukundhguptha@gmail.com',
    phoneNumber: '',
    organizationName: '',
    organizationType: '',
    websiteUrl: '',
    socialMediaHandles: '',
    organizationAddress: '',
    taxId: '',
    organizationSize: '',
    previousEvents: '',
    marketingBudget: ''
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
    navigate(`/speaker-requirements/${speakerId}`);
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
            {/* Organizer Name */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Organizer Name</label>
              <input
                type="text"
                value={formData.organizerName}
                onChange={(e) => handleInputChange('organizerName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-gray-100"
              />
            </div>

            {/* Email Address */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-gray-100"
              />
            </div>

            {/* Phone Number */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20"
              />
            </div>

            {/* Organization Name */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Organization Name</label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                placeholder="Enter organization name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20"
              />
            </div>

            {/* Organization Type */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Organization Type</label>
              <select
                value={formData.organizationType}
                onChange={(e) => handleInputChange('organizationType', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select type</option>
                <option value="corporation">Corporation</option>
                <option value="non-profit">Non-Profit Organization</option>
                <option value="educational">Educational Institution</option>
                <option value="government">Government Agency</option>
                <option value="startup">Startup</option>
                <option value="association">Professional Association</option>
                <option value="foundation">Foundation</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Organization Size */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Organization Size</label>
              <select
                value={formData.organizationSize}
                onChange={(e) => handleInputChange('organizationSize', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>

            {/* Website URL */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Website URL</label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20"
              />
            </div>

            {/* Tax ID/EIN */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Tax ID / EIN</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="Tax identification number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20"
              />
            </div>

            {/* Marketing Budget */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Marketing Budget</label>
              <select
                value={formData.marketingBudget}
                onChange={(e) => handleInputChange('marketingBudget', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select budget range</option>
                <option value="under-5k">Under $5,000</option>
                <option value="5k-15k">$5,000 - $15,000</option>
                <option value="15k-50k">$15,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k+">$100,000+</option>
              </select>
            </div>

            {/* Organization Address */}
            <div className="md:col-span-2">
              <label className="block text-black font-medium mb-2">Organization Address</label>
              <textarea
                value={formData.organizationAddress}
                onChange={(e) => handleInputChange('organizationAddress', e.target.value)}
                placeholder="Complete address including city, state, and zip code"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 resize-none"
              />
            </div>

            {/* Social Media Handles */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Social Media</label>
              <textarea
                value={formData.socialMediaHandles}
                onChange={(e) => handleInputChange('socialMediaHandles', e.target.value)}
                placeholder="LinkedIn, Twitter, Facebook, Instagram handles"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 resize-none"
              />
            </div>

            {/* Previous Events Experience */}
            <div className="md:col-span-3">
              <label className="block text-black font-medium mb-2">Previous Events Experience</label>
              <textarea
                value={formData.previousEvents}
                onChange={(e) => handleInputChange('previousEvents', e.target.value)}
                placeholder="Describe previous events organized, speaker experiences, event sizes, etc."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 resize-none"
              />
            </div>
          </div>

          {/* Book Speaker Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleNext}
              variant="dark"
              size="lg"
              className="px-8 py-3 font-medium"
            >
              Next: Speaker Requirements
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}