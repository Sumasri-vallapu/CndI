import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import { ENDPOINTS } from '../utils/api';

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

// Custom Dropdown Component for white background
const FilterDropdown = ({ label, options, value, onChange, displayLabel }: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  displayLabel?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonLabel = displayLabel || label;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 pr-10 rounded-full bg-white text-black border-none focus:outline-none focus:ring-2 focus:ring-white/50 capitalize cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="font-medium">
          {value === 'All' ? buttonLabel : value}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto min-w-[200px]">
            <button
              onClick={() => {
                onChange('All');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 text-left ${
                value === 'All' ? 'bg-gray-100' : ''
              }`}
            >
              <span className="font-medium text-gray-800 capitalize">All {buttonLabel}</span>
              {value === 'All' && <Check className="w-4 h-4 text-[#27465C]" />}
            </button>
            {options.slice(1).map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 text-left ${
                  value === option ? 'bg-gray-100' : ''
                }`}
              >
                <span className="font-medium text-gray-800">
                  {option}
                </span>
                {value === option && <Check className="w-4 h-4 text-[#27465C]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function FindSpeaker() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    expertise: 'All',
    availability: 'All',
    experience: 'All',
    priceRange: 'All',
    location: 'All',
    language: 'All',
    industry: 'All'
  });

  const fetchSpeakers = useCallback(async () => {
    try {
      setLoading(true);

      // Build query params from filters
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (filters.expertise !== 'All') params.append('expertise', filters.expertise);
      if (filters.availability !== 'All') params.append('availability', filters.availability);
      if (filters.experience !== 'All') params.append('experience', filters.experience);
      if (filters.priceRange !== 'All') params.append('priceRange', filters.priceRange);
      if (filters.location !== 'All') params.append('location', filters.location);
      if (filters.language !== 'All') params.append('language', filters.language);
      if (filters.industry !== 'All') params.append('industry', filters.industry);

      const url = `${ENDPOINTS.SPEAKERS}${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch speakers');
      const data = await response.json();
      // Handle paginated response from Django REST Framework
      setSpeakers(Array.isArray(data) ? data : (data.results || []));
      setError('');
    } catch (err) {
      setError('Failed to load speakers. Please try again later.');
      console.error('Error fetching speakers:', err);
      setSpeakers([]); // Ensure speakers is always an array
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters]);

  // Fetch speakers from backend with filters
  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSpeakers();
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(debounceTimer);
  }, [fetchSpeakers]); // Re-fetch when fetchSpeakers changes

  // We need to fetch all speakers once to get filter options
  // This is a separate fetch to populate dropdowns
  const [allSpeakersForFilters, setAllSpeakersForFilters] = useState<Speaker[]>([]);

  useEffect(() => {
    // Fetch all speakers once on mount to populate filter options
    const fetchAllSpeakers = async () => {
      try {
        const response = await fetch(ENDPOINTS.SPEAKERS);
        if (response.ok) {
          const data = await response.json();
          setAllSpeakersForFilters(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (err) {
        console.error('Error fetching speakers for filters:', err);
      }
    };
    fetchAllSpeakers();
  }, []);

  // Generate filter options from all speakers (not filtered results)
  const filterOptions = {
    expertise: ['All', ...Array.from(new Set(allSpeakersForFilters.map(s => s.expertise).filter(Boolean)))],
    availability: ['All', 'available', 'busy', 'unavailable'],
    experience: ['All', '0-5 years', '6-10 years', '11-15 years', '16-20 years', '20+ years'],
    priceRange: ['All', '$0-$2,500', '$2,500-$5,000', '$5,000-$10,000', '$10,000+'],
    location: ['All', ...Array.from(new Set(allSpeakersForFilters.map(s => s.location).filter(Boolean)))],
    language: ['All', ...Array.from(new Set(
      allSpeakersForFilters.flatMap(s => s.languages ? s.languages.split(',').map(l => l.trim()) : [])
    ))],
    industry: ['All', ...Array.from(new Set(allSpeakersForFilters.map(s => s.industry).filter(Boolean)))]
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSpeakerSelect = (speakerId: number) => {
    navigate(`/speaker/${speakerId}`);
  };

  return (
    <div className="min-h-screen bg-[#27465C]">
      {/* Navigation */}
      <nav className="w-full py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <div className="text-white text-2xl font-bold">C&I</div>
            <div className="text-white text-xs">Connect and Inspire</div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="text-white hover:opacity-80 text-sm">Home</button>
            <button onClick={() => navigate('/about')} className="text-white hover:opacity-80 text-sm">About Us</button>
            <button onClick={() => navigate('/contact')} className="text-white hover:opacity-80 text-sm">Contact us</button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/host-login')}
                className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-100 transition-all font-medium text-sm"
              >
                Host Sign in
              </button>
              <button
                onClick={() => navigate('/speaker-login')}
                className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-100 transition-all font-medium text-sm"
              >
                Speaker Sign in
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8 pt-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search speakers..."
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3">
              <FilterDropdown
                label="industry"
                displayLabel="Industry"
                options={filterOptions.industry}
                value={filters.industry}
                onChange={(value) => handleFilterChange('industry', value)}
              />
              <FilterDropdown
                label="location"
                displayLabel="Location"
                options={filterOptions.location}
                value={filters.location}
                onChange={(value) => handleFilterChange('location', value)}
              />
              <FilterDropdown
                label="language"
                displayLabel="Language"
                options={filterOptions.language}
                value={filters.language}
                onChange={(value) => handleFilterChange('language', value)}
              />
              <FilterDropdown
                label="availability"
                displayLabel="Availability"
                options={filterOptions.availability}
                value={filters.availability}
                onChange={(value) => handleFilterChange('availability', value)}
              />
              <FilterDropdown
                label="priceRange"
                displayLabel="Price Range"
                options={filterOptions.priceRange}
                value={filters.priceRange}
                onChange={(value) => handleFilterChange('priceRange', value)}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              onClick={fetchSpeakers}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Speaker Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers.map(speaker => (
              <div
                key={speaker.id}
                onClick={() => handleSpeakerSelect(speaker.id)}
                className="bg-white rounded-2xl p-6 shadow-xl cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg bg-gray-200">
                    {speaker.profile_image ? (
                      <img
                        src={speaker.profile_image}
                        alt={speaker.user_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500">
                        {speaker.user_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <h3 className="text-black font-bold text-lg mb-2">{speaker.user_name}</h3>

                  <div className="mb-3">
                    <div className="text-gray-600 font-medium text-sm capitalize">{speaker.expertise || 'Speaker'}</div>
                    <div className="text-gray-500 text-xs">{speaker.experience_years} years experience</div>
                  </div>

                  <div className="mb-3 flex flex-wrap justify-center gap-2">
                    {speaker.expertise && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                        {speaker.expertise}
                      </span>
                    )}
                    {speaker.industry && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {speaker.industry}
                      </span>
                    )}
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      speaker.availability_status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {speaker.availability_status}
                    </span>
                  </div>

                  {speaker.location && (
                    <div className="mb-2 text-gray-500 text-xs flex items-center justify-center gap-1">
                      <span>📍</span>
                      <span>{speaker.location}</span>
                    </div>
                  )}

                  {speaker.languages && (
                    <div className="mb-3 text-gray-500 text-xs flex items-center justify-center gap-1">
                      <span>🗣️</span>
                      <span>{speaker.languages}</span>
                    </div>
                  )}

                  {speaker.average_rating > 0 && (
                    <div className="mb-3 flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{speaker.average_rating.toFixed(1)}</span>
                    </div>
                  )}

                  <p className="text-gray-700 text-xs leading-relaxed line-clamp-3">
                    {speaker.bio || 'Professional speaker ready to inspire your audience.'}
                  </p>

                  {speaker.hourly_rate && (
                    <div className="mt-3 text-sm font-semibold text-[#27465C]">
                      ${speaker.hourly_rate}/hour
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && !error && speakers.length === 0 && (
          <div className="text-center text-white py-6">
            <p className="text-lg mb-2">No speakers found</p>
            <p className="text-sm opacity-75">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}