import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navigation */}
      <nav className="bg-white border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl md:text-3xl font-bold text-[#49a741]">
              ClearMyFile
            </div>
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/login')}
                className="py-1 px-3 rounded bg-[#49a741] text-white font-medium shadow hover:bg-[#3e9238] transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-[#49a741] mb-4 sm:mb-6 md:mb-8 leading-tight">
            Your Voice Matters
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center items-center max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => navigate('/signup')}
              className="rounded px-6 py-2 bg-[#49a741] text-white font-medium shadow hover:bg-[#3e9238] focus:outline-none focus:ring-2 focus:ring-[#49a741] focus:ring-offset-2 transition w-full sm:w-auto"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="rounded px-6 py-2 bg-white text-[#49a741] border-2 border-[#49a741] font-medium shadow hover:bg-[#49a741] hover:text-white transition w-full sm:w-auto"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
