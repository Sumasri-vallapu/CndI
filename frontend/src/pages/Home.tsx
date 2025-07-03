import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#5C258D] to-[#4389A2] text-white flex flex-col">

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">
              clearmyfile.org
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-white border border-white font-semibold py-2 px-4 rounded hover:bg-white/10"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex-1 flex flex-col justify-center items-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          Your Voice Matters
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-12">
          Make your voice count
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold text-lg px-10 py-4 rounded"
          >
            Create Account
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-white border border-white font-semibold text-lg px-10 py-4 rounded hover:bg-white/10"
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
