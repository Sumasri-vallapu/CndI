import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Floating Dashboard Link Button
 * Appears on all pages for authenticated users
 * Navigates to the appropriate dashboard based on user type
 */
export default function DashboardLink() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and get their type
    const token = localStorage.getItem('access_token');
    const storedUserType = localStorage.getItem('userType');

    if (token && storedUserType) {
      setUserType(storedUserType);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  const handleDashboardClick = () => {
    if (userType === 'speaker') {
      navigate('/speaker/dashboard');
    } else if (userType === 'host') {
      navigate('/host/dashboard');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={handleDashboardClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-[#27465C] to-[#1e3a4a] text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 z-50 flex items-center space-x-2 font-bold group"
      aria-label="Go to Dashboard"
    >
      <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      <span className="hidden sm:inline">Dashboard</span>
    </button>
  );
}
