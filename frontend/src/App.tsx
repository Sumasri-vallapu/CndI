import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UnifiedSignup from './pages/UnifiedSignup';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordOtp from './pages/ResetPasswordOtp';
import ResetPasswordNew from './pages/ResetPasswordNew';

// Simple Protected component for testing
const Protected = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Welcome!</h1>
        <p className="text-gray-600">You have successfully signed up!</p>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<UnifiedSignup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password-otp" element={<ResetPasswordOtp />} />
        <Route path="/reset-password-new" element={<ResetPasswordNew />} />
        <Route path="/protected" element={<Protected />} />
      </Routes>
    </BrowserRouter>
  );
}
