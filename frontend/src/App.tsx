import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import UnifiedSignup from './pages/UnifiedSignup';
import EmailVerification from './pages/EmailVerification';
import SetPassword from './pages/SetPassword';
import CompleteProfile from './pages/CompleteProfile';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import Protected from './pages/Protected';
import ForgotPassword from './pages/ForgotPassword';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Unified signup flow */}
        <Route path="/signup" element={<UnifiedSignup />} />
        {/* Legacy routes for backward compatibility */}
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/signup-old" element={<Signup />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/protected" element={<Protected />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
