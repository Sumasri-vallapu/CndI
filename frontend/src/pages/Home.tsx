import { useNavigate } from 'react-router-dom';

// Using local images from public folder
const speakerImages = [
  "/img1.png",
  "/img2.png", 
  "/img3.png",
  "/img4.png",
  "/img5.png",
  "/img6.png",
  "/img7.png",
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#27465C] flex flex-col font-['Roboto']">
      {/* Navigation */}
      <nav className="w-full py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-white text-3xl font-black">C&I</div>
            <div className="text-white text-sm">Connect and Inspire</div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/home')} className="text-white hover:opacity-80 font-medium">Home</button>
            <button onClick={() => navigate('/about')} className="text-white hover:opacity-80 font-medium">About Us</button>
            <button onClick={() => navigate('/contact')} className="text-white hover:opacity-80 font-medium">Contact us</button>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/host-login')}
                className="bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition-all duration-300 font-medium"
              >
                Host Sign in
              </button>
              <button 
                onClick={() => navigate('/speaker-login')}
                className="bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition-all duration-300 font-medium"
              >
                Speaker Sign in
              </button>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => navigate('/host-login')}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-all duration-300 font-medium text-sm"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Speaker Images Row */}
      <div className="flex justify-center items-end gap-2 sm:gap-4 mt-8 mb-8 px-4">
        {speakerImages.map((src, idx) => (
          <div
            key={idx}
            className="rounded-lg shadow-xl bg-gray-200 overflow-hidden transition-transform hover:scale-105 cursor-pointer"
            style={{
              width: idx === 0 || idx === 1 || idx === 5 || idx === 6 ? 'clamp(80px, 12vw, 120px)' : idx === 3 ? 'clamp(40px, 8vw, 60px)' : 'clamp(60px, 10vw, 90px)',
              height: idx === 0 || idx === 1 || idx === 5 || idx === 6 ? 'clamp(120px, 16vw, 160px)' : idx === 3 ? 'clamp(60px, 10vw, 80px)' : 'clamp(90px, 14vw, 120px)',
              marginTop: idx === 3 ? 'clamp(20px, 5vw, 40px)' : idx === 2 ? 'clamp(10px, 3vw, 20px)' : 0,
            }}
            onClick={() => navigate('/find-speaker')}
          >
            <img
              src={src}
              alt={`Speaker ${idx + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center text-center px-4 mb-8">
        <div className="text-white font-normal text-lg sm:text-xl mb-6 max-w-2xl">
          Access 10,000+ expert speakers across every industry.
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md">
          <button
            onClick={() => navigate('/find-speaker')}
            className="w-full sm:flex-1 rounded-lg px-6 py-3 bg-white text-black font-medium text-lg shadow-md hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
          >
            Find your next guest
          </button>
          <button
            onClick={() => navigate('/speaker-signup')}
            className="w-full sm:flex-1 rounded-lg px-6 py-3 bg-white text-black font-medium text-lg shadow-md hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
          >
            Get discovered as a speaker
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm shadow-lg">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 4.586l2.293-2.293a1 1 0 011.414 1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-white mb-3">Best Fit</h3>
            <p className="text-white opacity-80">Find speakers that perfectly align with your event's theme and audience</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm shadow-lg">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-white mb-3">Quick Booking</h3>
            <p className="text-white opacity-80">Streamlined process to connect and book speakers in minutes</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm shadow-lg">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-white mb-3">Verified Experts</h3>
            <p className="text-white opacity-80">All speakers are verified professionals with proven expertise</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="flex flex-col md:flex-row justify-center gap-8 px-4 mb-8">
        <div className="text-white text-base max-w-md text-center md:text-left">
          <span className="italic">"Easiest way to find inspiring speakers for our annual summit!"</span>
          <br />
          <span className="font-medium">— Event Host, 2025</span>
        </div>
        <div className="text-white text-base max-w-md text-center md:text-left">
          <span className="italic">"I connected with amazing events and grew my network."</span>
          <br />
          <span className="font-medium">— Guest Speaker</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto px-4 mb-12">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-black text-white mb-2">10,000+</div>
          <div className="text-white opacity-80 text-sm">Expert Speakers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-black text-white mb-2">500+</div>
          <div className="text-white opacity-80 text-sm">Events Hosted</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-black text-white mb-2">50+</div>
          <div className="text-white opacity-80 text-sm">Industries</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-black text-white mb-2">98%</div>
          <div className="text-white opacity-80 text-sm">Satisfaction Rate</div>
        </div>
      </div>
    </div>
  );
}