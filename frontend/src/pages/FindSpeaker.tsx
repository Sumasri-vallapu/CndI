import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const speakers = [
  {
    id: 1,
    name: "Elon Musk",
    title: "entrepreneur",
    subtitle: "motivational speaker",
    description: "Elon Musk is currently CEO of three companies: Tesla, SpaceX, and xAI.",
    image: "/img1.png",
    location: "Austin, TX",
    organization: "Tesla, SpaceX",
    industry: "Technology",
    language: "English",
    availability: "Available"
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "entrepreneur",
    subtitle: "motivational speaker", 
    description: "Elon Musk is currently CEO of three companies: Tesla, SpaceX, and xAI.",
    image: "/img2.png",
    location: "San Francisco, CA",
    organization: "Meta",
    industry: "Technology",
    language: "English",
    availability: "Available"
  },
  {
    id: 3,
    name: "Dr. James Wilson",
    title: "entrepreneur",
    subtitle: "motivational speaker",
    description: "Elon Musk is currently CEO of three companies: Tesla, SpaceX, and xAI.",
    image: "/img3.png",
    location: "New York, NY",
    organization: "Medical Center",
    industry: "Healthcare",
    language: "English",
    availability: "Busy"
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    title: "entrepreneur",
    subtitle: "motivational speaker",
    description: "Elon Musk is currently CEO of three companies: Tesla, SpaceX, and xAI.",
    image: "/img4.png",
    location: "Miami, FL",
    organization: "Finance Corp",
    industry: "Finance",
    language: "Spanish",
    availability: "Available"
  },
  {
    id: 5,
    name: "David Kim",
    title: "entrepreneur",
    subtitle: "motivational speaker",
    description: "Elon Musk is currently CEO of three companies: Tesla, SpaceX, and xAI.",
    image: "/img5.png",
    location: "Seattle, WA",
    organization: "Amazon",
    industry: "Technology",
    language: "Korean",
    availability: "Available"
  },
  {
    id: 6,
    name: "Lisa Thompson",
    title: "entrepreneur", 
    subtitle: "motivational speaker",
    description: "Elon Musk is currently CEO of three companies: Tesla, SpaceX, and xAI.",
    image: "/img6.png",
    location: "Chicago, IL",
    organization: "Consulting Group",
    industry: "Consulting",
    language: "English",
    availability: "Busy"
  }
];

const filterOptions = {
  location: ["All", "Austin, TX", "San Francisco, CA", "New York, NY", "Miami, FL", "Seattle, WA", "Chicago, IL"],
  organization: ["All", "Tesla, SpaceX", "Meta", "Medical Center", "Finance Corp", "Amazon", "Consulting Group"],
  industry: ["All", "Technology", "Healthcare", "Finance", "Consulting"],
  language: ["All", "English", "Spanish", "Korean"],
  availability: ["All", "Available", "Busy"]
};

export default function FindSpeaker() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: 'All',
    organization: 'All',
    industry: 'All',
    language: 'All',
    availability: 'All'
  });

  const filteredSpeakers = speakers.filter(speaker => {
    const matchesSearch = speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         speaker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         speaker.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = filters.location === 'All' || speaker.location === filters.location;
    const matchesOrganization = filters.organization === 'All' || speaker.organization === filters.organization;
    const matchesIndustry = filters.industry === 'All' || speaker.industry === filters.industry;
    const matchesLanguage = filters.language === 'All' || speaker.language === filters.language;
    const matchesAvailability = filters.availability === 'All' || speaker.availability === filters.availability;

    return matchesSearch && matchesLocation && matchesOrganization && 
           matchesIndustry && matchesLanguage && matchesAvailability;
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSpeakerSelect = (speakerId: number) => {
    navigate(`/event-details/${speakerId}`);
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
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        <h1 className="text-white text-2xl font-bold mb-8">Find Speaker</h1>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
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
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(filterOptions).map(([filterType, options]) => (
              <select
                key={filterType}
                value={filters[filterType as keyof typeof filters]}
                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                className="px-4 py-2 rounded-full bg-white text-black border-none focus:outline-none focus:ring-2 focus:ring-white/20 capitalize cursor-pointer"
              >
                {options.map(option => (
                  <option key={option} value={option}>
                    {filterType === 'organization' && option !== 'All' 
                      ? option.split(',')[0] // Show only first organization for brevity
                      : option
                    }
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {/* Speaker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpeakers.map(speaker => (
            <div
              key={speaker.id}
              onClick={() => handleSpeakerSelect(speaker.id)}
              className="bg-white rounded-2xl p-6 shadow-xl cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-black font-bold text-lg mb-2">{speaker.name}</h3>
                
                <div className="mb-3">
                  <div className="text-gray-600 font-medium text-sm mb-1">{speaker.title}</div>
                  <div className="text-gray-600 font-medium text-sm">{speaker.subtitle}</div>
                </div>
                
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{speaker.industry}</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{speaker.language}</span>
                </div>
                
                <div className="mb-3 text-gray-500 text-sm">
                  📍 {speaker.location}
                </div>
                
                <div className="mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    speaker.availability === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {speaker.availability}
                  </span>
                </div>
                
                <p className="text-gray-700 text-xs leading-relaxed">
                  {speaker.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredSpeakers.length === 0 && (
          <div className="text-center text-white py-12">
            <p className="text-lg mb-2">No speakers found</p>
            <p className="text-sm opacity-75">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}