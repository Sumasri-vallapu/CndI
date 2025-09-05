import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UnifiedSignup from './pages/UnifiedSignup';
import Login from './pages/Login';
import HostLogin from './pages/HostLogin';
import HostSignup from './pages/HostSignup';
import SpeakerLogin from './pages/SpeakerLogin';
import SpeakerSignup from './pages/SpeakerSignup';
import Welcome from './pages/Welcome';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordOtp from './pages/ResetPasswordOtp';
import ResetPasswordNew from './pages/ResetPasswordNew';
import FindSpeaker from './pages/FindSpeaker';
import EventDetails from './pages/EventDetails';
import OrganizerInfo from './pages/OrganizerInfo';
import SpeakerRequirements from './pages/SpeakerRequirements';
import Compensation from './pages/Compensation';
import AboutUs from './pages/AboutUs';
import Landing from './pages/Landing';

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
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        
        {/* Legacy auth routes - keeping for backward compatibility */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<UnifiedSignup />} />
        
        {/* New role-based auth routes */}
        <Route path="/host-login" element={<HostLogin />} />
        <Route path="/host-signup" element={<HostSignup />} />
        <Route path="/speaker-login" element={<SpeakerLogin />} />
        <Route path="/speaker-signup" element={<SpeakerSignup />} />
        
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password-otp" element={<ResetPasswordOtp />} />
        <Route path="/reset-password-new" element={<ResetPasswordNew />} />
        <Route path="/find-speaker" element={<FindSpeaker />} />
        <Route path="/event-details/:speakerId" element={<EventDetails />} />
        <Route path="/organizer-info/:speakerId" element={<OrganizerInfo />} />
        <Route path="/speaker-requirements/:speakerId" element={<SpeakerRequirements />} />
        <Route path="/compensation/:speakerId" element={<Compensation />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/protected" element={<Protected />} />
      </Routes>
    </BrowserRouter>
  );
}
