import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Award,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Plus,
  X
} from 'lucide-react';

interface SocialMedia {
  platform: string;
  url: string;
}

interface Expertise {
  id: number;
  topic: string;
}

const HostProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    organization: 'Stanford Medical Center',
    title: 'Chief Medical Officer',
    bio: 'Dr. Sarah Johnson is a renowned healthcare leader with over 15 years of experience in medical innovation and digital health transformation. She has led groundbreaking research in AI applications for healthcare and has been a keynote speaker at numerous international conferences.',
    website: 'https://sarahjohnson-md.com',
    yearsSpeaking: '10',
    languages: ['English', 'Spanish'],
    industry: 'Healthcare'
  });

  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/sarahjohnson' },
    { platform: 'Twitter', url: 'https://twitter.com/sarahjohnsonmd' }
  ]);

  const [expertise, setExpertise] = useState<Expertise[]>([
    { id: 1, topic: 'Healthcare Innovation' },
    { id: 2, topic: 'AI in Medicine' },
    { id: 3, topic: 'Digital Health' },
    { id: 4, topic: 'Medical Leadership' }
  ]);

  const [newExpertise, setNewExpertise] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('/api/placeholder/120/120');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSocialMedia = () => {
    setSocialMedia(prev => [...prev, { platform: '', url: '' }]);
  };

  const updateSocialMedia = (index: number, field: 'platform' | 'url', value: string) => {
    setSocialMedia(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeSocialMedia = (index: number) => {
    setSocialMedia(prev => prev.filter((_, i) => i !== index));
  };

  const addExpertise = () => {
    if (newExpertise.trim()) {
      setExpertise(prev => [...prev, { id: Date.now(), topic: newExpertise.trim() }]);
      setNewExpertise('');
    }
  };

  const removeExpertise = (id: number) => {
    setExpertise(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/host/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#27465C]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/host/dashboard')}
              className="flex items-center text-gray-600 hover:text-black mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-black text-black">Edit Profile</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-black text-black mb-4">Profile Photo</h2>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <img
                  className="w-24 h-24 rounded-full object-cover"
                  src={imagePreview}
                  alt="Profile"
                />
              </div>
              <div>
                <label className="bg-white border border-gray-300 text-black font-medium py-2 px-4 rounded-lg hover:bg-gray-50 cursor-pointer inline-flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-black text-black mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                  placeholder="City, State/Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                >
                  <option value="Healthcare">Healthcare</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-black text-black mb-4">Professional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Organization
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biography
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                  placeholder="Tell us about your background, expertise, and speaking experience..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                    placeholder="https://your-website.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Speaking Experience
                  </label>
                  <input
                    type="number"
                    value={formData.yearsSpeaking}
                    onChange={(e) => handleInputChange('yearsSpeaking', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Areas of Expertise */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-black text-black mb-4">Areas of Expertise</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {expertise.map((item) => (
                  <div key={item.id} className="bg-[#27465C] text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                    <span>{item.topic}</span>
                    <button
                      type="button"
                      onClick={() => removeExpertise(item.id)}
                      className="text-white/80 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add expertise area"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                />
                <button
                  type="button"
                  onClick={addExpertise}
                  className="bg-[#27465C] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a4a] flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-black text-black mb-4">Social Media</h2>
            <div className="space-y-4">
              {socialMedia.map((item, index) => (
                <div key={index} className="flex space-x-2">
                  <select
                    value={item.platform}
                    onChange={(e) => updateSocialMedia(index, 'platform', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                  >
                    <option value="">Select Platform</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => updateSocialMedia(index, 'url', e.target.value)}
                    placeholder="Profile URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialMedia(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addSocialMedia}
                className="text-[#27465C] hover:text-[#1e3a4a] font-medium flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Media</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/host/dashboard')}
              className="px-6 py-3 border border-gray-300 text-black font-medium rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black font-medium px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostProfileEdit;