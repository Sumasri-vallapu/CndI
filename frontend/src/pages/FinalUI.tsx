import { useLocation } from 'react-router-dom';

export default function FinalUI() {
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-walnut">
          Welcome to Yuva Chetana
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-center text-lg">
              Registration Complete! Welcome to the platform.
            </p>
            {mobileNumber && (
              <p className="text-center text-gray-600 mt-2">
                Registered Mobile: {mobileNumber}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 