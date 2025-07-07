import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name: string;
}

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      // If user data is corrupted, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-gray-100">
        <div className="container-main">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-black">
              ClearMyFile
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-bold hidden sm:block">
                {user.name || user.email}
              </span>
              <button 
                onClick={handleLogout}
                className="btn-secondary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="container-main max-w-4xl text-center">
          {/* Welcome Message */}
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6">
                Welcome to ClearMyFile
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 font-bold mb-4">
                Hello, {user.name || 'User'}!
              </p>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                You have successfully logged into your ClearMyFile account. 
                We're here to help you with secure and reliable document verification services.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-2">Document Services</h3>
                <p className="text-blue-700">Upload and verify your important documents securely</p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-green-800 mb-2">Secure Platform</h3>
                <p className="text-green-700">Your data is protected with enterprise-grade security</p>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-purple-800 mb-2">24/7 Support</h3>
                <p className="text-purple-700">Get help whenever you need it from our support team</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <button className="btn-primary px-8 py-3">
                Get Started
              </button>
              <button className="btn-secondary px-8 py-3">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;