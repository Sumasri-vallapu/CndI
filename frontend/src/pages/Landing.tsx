import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#27465C] flex flex-col">
      {/* Navigation */}
      <nav className="w-full py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <div className="text-white text-3xl font-bold">C&I</div>
            <div className="text-white text-sm">Connect and Inspire</div>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/home')} className="text-white hover:opacity-80">Home</button>
            <button onClick={() => navigate('/about')} className="text-white hover:opacity-80">About Us</button>
            <a href="#" className="text-white hover:opacity-80">Contact us</a>
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
            Connect & Inspire
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-white opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover 10,000+ industry-leading speakers. Simplify event planning, grow your network, and create inspiring experiences.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-[#1a2f3a] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#0f1f26] transition-colors min-w-[200px]"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/find-speaker')}
              className="bg-white text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors min-w-[200px]"
            >
              Explore Speakers
            </button>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">Perfect Match</h3>
              <p className="text-white opacity-80">Find speakers that perfectly align with your event's theme and audience</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">Quick Booking</h3>
              <p className="text-white opacity-80">Streamlined process to connect and book speakers in minutes</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-white mb-3">Verified Experts</h3>
              <p className="text-white opacity-80">All speakers are verified professionals with proven expertise</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-black text-white mb-2">10,000+</div>
            <div className="text-white opacity-80">Expert Speakers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-white mb-2">500+</div>
            <div className="text-white opacity-80">Events Hosted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-white mb-2">50+</div>
            <div className="text-white opacity-80">Industries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-white mb-2">98%</div>
            <div className="text-white opacity-80">Satisfaction Rate</div>
          </div>
        </div>
      </main>
    </div>
  );
}