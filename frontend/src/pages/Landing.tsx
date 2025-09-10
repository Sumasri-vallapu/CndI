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
            <button onClick={() => navigate('/contact')} className="text-white hover:opacity-80">Contact us</button>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/host-login')}
                className="bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                Host Sign in
              </button>
              <button 
                onClick={() => navigate('/speaker-login')}
                className="bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                Speaker Sign in
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
        <div className="max-w-4xl mx-auto">          
          {/* Subheading */}
          <h2 className="text-lg md:text-xl lg:text-2xl text-white opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover 10,000+ industry-leading speakers. Simplify event planning, grow your network, and create inspiring experiences.
          </h2>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/home')}
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
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 4.586l2.293-2.293a1 1 0 011.414 1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Best Fit</h3>
              <p className="text-white opacity-80">Find speakers that perfectly align with your event's theme and audience</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quick Booking</h3>
              <p className="text-white opacity-80">Streamlined process to connect and book speakers in minutes</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
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
