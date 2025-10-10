import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
  const [isVisible, setIsVisible] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Rotate positions every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationIndex((prev) => (prev + 1) % speakerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Get size and position styling for each position (3D convex/arc style)
  const getPositionStyle = (position: number) => {
    // Center position (3) is largest, edges are smallest
    const sizeScale = [0.55, 0.7, 0.85, 1, 0.85, 0.7, 0.55];
    const scale = sizeScale[position];

    // 3D rotation for depth effect (rotate Y-axis)
    const rotateY = [40, 25, 10, 0, -10, -25, -40];

    // Translate Z for depth (move center forward)
    const translateZ = [-60, -30, -10, 0, -10, -30, -60];

    // Translate X for horizontal spacing
    const translateX = [-15, -8, -3, 0, 3, 8, 15];

    // Calculate margin top for arc effect
    const marginTopValues = [70, 45, 20, 0, 20, 45, 70];

    return {
      width: `clamp(${60 * scale}px, ${13 * scale}vw, ${150 * scale}px)`,
      height: `clamp(${80 * scale}px, ${17 * scale}vw, ${190 * scale}px)`,
      marginTop: `clamp(${marginTopValues[position] * 0.5}px, ${marginTopValues[position] * 0.15}vw, ${marginTopValues[position]}px)`,
      transform: `
        perspective(1200px)
        rotateY(${rotateY[position]}deg)
        translateZ(${translateZ[position]}px)
        translateX(${translateX[position]}%)
        scale(${position === 3 ? 1.05 : 1})
      `,
      zIndex: Math.round((1 - Math.abs(position - 3) / 3) * 10),
    };
  };

  return (
    <div className="min-h-screen bg-[#27465C] flex flex-col font-['Roboto']">
      {/* Navigation */}
      <nav className={`w-full py-3 px-4 md:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-white text-2xl font-bold">C&I</div>
            <div className="text-white text-xs">Connect and Inspire</div>
          </div>
          <div className="hidden md:flex items-center gap-6">
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
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => navigate('/host-login')}
              className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-100 transition-all font-medium text-sm"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Speaker Images Row - 3D Convex Carousel */}
      <div
        className="flex justify-center items-end gap-1 sm:gap-2 mt-8 mb-8 px-4 relative"
        style={{
          perspective: '1500px',
          perspectiveOrigin: 'center center',
          transformStyle: 'preserve-3d'
        }}
      >
        {speakerImages.map((src, idx) => {
          // Calculate current position for this image
          const currentPosition = (idx + rotationIndex) % 7;
          const positionStyle = getPositionStyle(currentPosition);

          // Calculate distance from center for shadow intensity
          const distanceFromCenter = Math.abs(currentPosition - 3);

          return (
            <div
              key={idx}
              className={`rounded-xl overflow-hidden hover:scale-105 cursor-pointer relative ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{
                ...positionStyle,
                transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
                order: currentPosition,
                transformStyle: 'preserve-3d',
                boxShadow: currentPosition === 3
                  ? '0 25px 50px rgba(0,0,0,0.6), 0 10px 20px rgba(0,0,0,0.4)'
                  : `0 ${15 - distanceFromCenter * 3}px ${30 - distanceFromCenter * 5}px rgba(0,0,0,0.7)`,
                border: currentPosition === 3 ? '3px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.1)',
              }}
              onClick={() => navigate('/find-speaker')}
            >
              <img
                src={src}
                alt={`Speaker ${idx + 1}`}
                className="object-cover w-full h-full"
                style={{
                  filter: currentPosition === 3 ? 'brightness(1.15) contrast(1.1)' : 'brightness(0.95) contrast(1)',
                }}
              />
              {/* Gradient overlay for depth and shadow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: currentPosition === 3
                    ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)'
                    : `linear-gradient(to bottom, rgba(0,0,0,${0.15 + distanceFromCenter * 0.08}) 0%, rgba(0,0,0,${0.25 + distanceFromCenter * 0.1}) 100%)`,
                }}
              />
              {/* Highlight on center image */}
              {currentPosition === 3 && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className={`flex flex-col items-center text-center px-4 mb-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-white font-normal text-base md:text-lg mb-6 max-w-2xl">
          Access 10,000+ expert speakers across every industry.
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full max-w-md">
          <button
            onClick={() => navigate('/find-speaker')}
            className="w-full sm:flex-1 rounded-lg px-4 py-2 bg-white text-black font-medium text-sm shadow-md hover:bg-gray-100 transition-all hover:shadow-lg"
          >
            Find your next guest
          </button>
          <button
            onClick={() => navigate('/speaker-signup')}
            className="w-full sm:flex-1 rounded-lg px-4 py-2 bg-white text-black font-medium text-sm shadow-md hover:bg-gray-100 transition-all hover:shadow-lg"
          >
            Get discovered as a speaker
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className={`max-w-6xl mx-auto px-4 mb-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

      {/* Testimonials */}
      <div className={`flex flex-col md:flex-row justify-center gap-8 px-4 mb-8 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-white text-base max-w-md text-center md:text-left transform transition-all duration-300 hover:scale-105">
          <span className="italic">"Easiest way to find inspiring speakers for our annual summit!"</span>
          <br />
          <span className="font-medium">— Event Host, 2025</span>
        </div>
        <div className="text-white text-base max-w-md text-center md:text-left transform transition-all duration-300 hover:scale-105">
          <span className="italic">"I connected with amazing events and grew my network."</span>
          <br />
          <span className="font-medium">— Guest Speaker</span>
        </div>
      </div>

      {/* Statistics */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4 mb-12 transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
    </div>
  );
}