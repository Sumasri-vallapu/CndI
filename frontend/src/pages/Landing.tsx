import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="h-screen bg-[#27465C] flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className={`w-full py-3 px-4 md:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
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

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Subheading */}
          <h2 className={`text-base md:text-lg text-white opacity-90 mb-6 max-w-3xl mx-auto transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Discover 10,000+ industry-leading speakers. Simplify event planning, grow your network, and create inspiring experiences.
          </h2>
          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-3 justify-center items-center mb-6 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              onClick={() => navigate('/home')}
              className="bg-[#1a2f3a] text-white px-6 py-2.5 rounded-lg text-base font-medium hover:bg-[#0f1f26] transition-colors min-w-[180px]"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/find-speaker')}
              className="bg-white text-black px-6 py-2.5 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors min-w-[180px]"
            >
              Explore Speakers
            </button>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className={`max-w-6xl mx-auto mb-4 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white bg-opacity-10 rounded-xl p-3 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-opacity-20">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 4.586l2.293-2.293a1 1 0 011.414 1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Best Fit</h3>
              <p className="text-white opacity-80 text-xs">Find speakers that align with your event</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-3 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-opacity-20">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Quick Booking</h3>
              <p className="text-white opacity-80 text-xs">Book speakers in minutes</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-3 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-opacity-20">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Verified Experts</h3>
              <p className="text-white opacity-80 text-xs">Verified professionals with proven expertise</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center transform transition-all duration-300 hover:scale-110">
            <div className="text-xl font-black text-white mb-1">10,000+</div>
            <div className="text-white opacity-80 text-xs">Expert Speakers</div>
          </div>
          <div className="text-center transform transition-all duration-300 hover:scale-110">
            <div className="text-xl font-black text-white mb-1">500+</div>
            <div className="text-white opacity-80 text-xs">Events Hosted</div>
          </div>
          <div className="text-center transform transition-all duration-300 hover:scale-110">
            <div className="text-xl font-black text-white mb-1">50+</div>
            <div className="text-white opacity-80 text-xs">Industries</div>
          </div>
          <div className="text-center transform transition-all duration-300 hover:scale-110">
            <div className="text-xl font-black text-white mb-1">98%</div>
            <div className="text-white opacity-80 text-xs">Satisfaction Rate</div>
          </div>
        </div>
      </main>
    </div>
  );
}
