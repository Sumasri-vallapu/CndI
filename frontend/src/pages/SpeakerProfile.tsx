import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ENDPOINTS } from '../utils/api';
import { Loader2 } from 'lucide-react';

interface Speaker {
  id: number;
  user_name: string;
  user_email: string;
  bio: string;
  expertise: string;
  speaking_topics: string;
  experience_years: number;
  hourly_rate: number | null;
  availability_status: string;
  profile_image: string;
  website: string;
  social_media: any;
  average_rating: number;
  location: string;
  languages: string;
  industry: string;
}

export default function SpeakerProfile() {
  const navigate = useNavigate();
  const { speakerId } = useParams<{ speakerId: string }>();
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [loading, setLoading] = useState(true);

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
        setSpeaker(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeaker();
  }, [speakerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#27465C] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="min-h-screen bg-[#27465C] flex items-center justify-center">
        <div className="text-white text-xl">Speaker not found</div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-400'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-[#27465C] font-['Roboto']">
      {/* Navigation */}
      <nav className="w-full py-6 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-white text-3xl font-black">C&I</div>
            <div className="text-white text-sm">Connect and Inspire</div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/find-speaker')}
              className="text-white hover:opacity-80 font-medium"
            >
              ← Back to Search
            </button>
            <button 
              onClick={() => navigate('/host-login')}
              className="bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition-all duration-300 font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={speaker.profile_image || '/img2.png'}
                alt={speaker.user_name}
                className="w-48 h-48 rounded-2xl object-cover shadow-xl"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{speaker.user_name}</h1>
                  <h2 className="text-xl sm:text-2xl text-white/90 font-medium mb-2 capitalize">{speaker.expertise}</h2>
                  <p className="text-white/80 mb-2">{speaker.industry}</p>
                  <p className="text-white/70 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {speaker.location || 'Location not specified'}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">{renderStars(speaker.average_rating)}</div>
                    <span className="text-white font-medium">{speaker.average_rating.toFixed(1)}</span>
                    <span className="text-white/70">(Rating)</span>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="bg-white/20 px-3 py-1 rounded-full">
                      <span className="text-white">{speaker.experience_years}+ years experience</span>
                    </div>
                    {speaker.hourly_rate && (
                      <div className="bg-white/20 px-3 py-1 rounded-full">
                        <span className="text-white">${speaker.hourly_rate}/hour</span>
                      </div>
                    )}
                    <div className={`px-3 py-1 rounded-full ${
                      speaker.availability_status === 'available' ? 'bg-green-500/20 text-green-300' :
                      speaker.availability_status === 'busy' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      <span className="capitalize">{speaker.availability_status}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 min-w-[200px]">
                  <button
                    onClick={() => navigate(`/send-request/${speaker.id}`)}
                    className="w-full bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
                  >
                    Send Request
                  </button>
                  <button
                    onClick={() => navigate(`/speaker/calendar/${speaker.id}`)}
                    className="w-full bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50 font-medium py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    View Calendar
                  </button>
                  <button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 font-medium py-3 px-6 rounded-lg transition-all duration-300">
                    Save Speaker
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-black text-white mb-4">About</h3>
              <p className="text-white/80 leading-relaxed">{speaker.bio}</p>
            </div>

            {/* Speaking Topics */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-black text-white mb-4">Speaking Topics</h3>
              <div className="flex flex-wrap gap-3">
                {speaker.speaking_topics.split(',').map((topic, index) => (
                  <span
                    key={index}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    {topic.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            {speaker.languages && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-black text-white mb-4">Languages</h3>
                <div className="flex flex-wrap gap-3">
                  {speaker.languages.split(',').map((language, index) => (
                    <span
                      key={index}
                      className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      {language.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Availability */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-black text-white mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Status</span>
                  <span className={`px-2 py-1 rounded text-sm capitalize ${
                    speaker.availability_status === 'available' ? 'bg-green-500/20 text-green-300' :
                    speaker.availability_status === 'busy' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {speaker.availability_status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Response time</span>
                  <span className="text-white/80">Within 24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Notice period</span>
                  <span className="text-white/80">2 weeks</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-black text-white mb-4">Quick Contact</h3>
              <p className="text-white/80 text-sm mb-4">
                Ready to book {speaker.user_name.split(' ')[0]} for your event? Send a request with your event details.
              </p>
              <button
                onClick={() => navigate(`/send-request/${speaker.id}`)}
                className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Similar Speakers */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-black text-white mb-4">Similar Speakers</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
                    <img
                      src={`/img${i + 2}.png`}
                      alt={`Speaker ${i}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">Dr. Expert {i}</div>
                      <div className="text-white/70 text-xs">AI Specialist</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}