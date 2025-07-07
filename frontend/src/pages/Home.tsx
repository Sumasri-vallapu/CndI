import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navigation */}
      <nav className="bg-white border-b-2 border-gray-100">
        <div className="container-main">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl md:text-3xl font-bold text-black">
              ClearMyFile
            </div>
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/login')}
                className="btn-secondary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="container-main text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-4 sm:mb-6 md:mb-8 leading-tight">
            Your Voice Matters
          </h1>

          {/* CTA Buttons with 1cm gap and shorter width */}
          <div className="flex flex-col sm:flex-row gap-[38px] justify-center items-center max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary w-full sm:w-auto px-6 py-2"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary w-full sm:w-auto px-6 py-2"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
