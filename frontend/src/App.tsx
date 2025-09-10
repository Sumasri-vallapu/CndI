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
import Contact from './pages/Contact';
import SpeakerProfile from './pages/SpeakerProfile';
import SpeakerDashboard from './pages/SpeakerDashboard';
import Landing from './pages/Landing';
import HostDashboard from './pages/HostDashboard';
import HostProfileEdit from './pages/HostProfileEdit';
import HostRequests from './pages/HostRequests';
import HostAvailability from './pages/HostAvailability';
import SpeakerCalendar from './pages/SpeakerCalendar';
import PaymentFlow from './pages/PaymentFlow';
import HostMessaging from './pages/HostMessaging';
import SendSpeakerRequest from './pages/SendSpeakerRequest';

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
        <Route path="/speaker/:speakerId" element={<SpeakerProfile />} />
        <Route path="/event-details/:speakerId" element={<EventDetails />} />
        <Route path="/organizer-info/:speakerId" element={<OrganizerInfo />} />
        <Route path="/speaker-requirements/:speakerId" element={<SpeakerRequirements />} />
        <Route path="/compensation/:speakerId" element={<Compensation />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/protected" element={<Protected />} />
        
        {/* Host Dashboard and Management Routes */}
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route path="/host/profile/edit" element={<HostProfileEdit />} />
        <Route path="/host/requests" element={<HostRequests />} />
        <Route path="/host/availability" element={<HostAvailability />} />
        <Route path="/host/messages" element={<HostMessaging />} />
        <Route path="/host/messages/:conversationId" element={<HostMessaging />} />
        
        {/* Speaker Dashboard and Management Routes */}
        <Route path="/speaker/dashboard" element={<SpeakerDashboard />} />
        <Route path="/speaker/calendar/:speakerId" element={<SpeakerCalendar />} />
        <Route path="/send-request/:speakerId" element={<SendSpeakerRequest />} />
        <Route path="/payment/:eventId" element={<PaymentFlow />} />
      </Routes>
    </BrowserRouter>
  );
}
