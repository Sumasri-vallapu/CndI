import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const PRIMARY_GRADIENT = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)";
const SECONDARY_GRADIENT = "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold" style={{ color: '#7c3aed' }}>
              clearmyfile.org
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                style={{ background: PRIMARY_GRADIENT }}
                className="text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              clearmyfile.org
            </span>
          </h1>
          <p className="text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            make your voice count
          </p>
        </div>
        
        {/* CTA Section */}
        <div className="text-center mb-20">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 text-lg font-semibold text-white"
              style={{ background: PRIMARY_GRADIENT }}
            >
              Create Account
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              className="px-8 py-4 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  );
}