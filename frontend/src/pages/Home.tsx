import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#5C258D] to-[#4389A2] text-white flex flex-col">

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex justify-start items-center">
            <div className="text-xl sm:text-2xl font-bold text-white">
              clearmyfile.com
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center flex-1 flex flex-col justify-center items-center pt-20 sm:pt-24">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
          Your Voice Matters
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-md mx-auto mb-8 sm:mb-12 px-4">
          Make your voice count
        </p>

        {/* CTA */}
        <div className="flex flex-col gap-4 justify-center w-full max-w-xs mx-auto">
          <button
            onClick={() => navigate('/signup')}
            className="bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold text-lg px-12 py-4 transition-all duration-200"
          >
            Create Account
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-white border-2 border-white font-semibold text-lg px-12 py-4 hover:bg-white/10 transition-all duration-200"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FFEB3B]/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#5C258D]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#4389A2]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
    </div>
  );
}
