import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { ENDPOINTS } from "@/utils/api";

export default function DataProtectionConsent() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber; // Fallback for testing
  
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fellowName = "John Doe"; // Replace with actual fellow name from state/context
  const place = "Hyderabad, Telangana"; // Replace with actual location from state/context
  const currentDate = new Date().toISOString().split("T")[0]; // Auto-fill current date

  const handleAgree = async () => {
    if (!isAgreed) {
      alert("Please check the acknowledgment box to proceed");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(ENDPOINTS.UPDATE_DATA_CONSENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_number: mobileNumber
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update data protection consent');
      }
      
      // Navigate to final UI page on success
      navigate('/final-ui', { state: { mobileNumber } });
    } catch (error) {
      console.error('Error submitting data protection consent:', error);
      alert('Failed to submit consent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FAFAF5] px-5 py-6">
      {/* ✅ Navigation Bar */}
      <div className="w-full flex items-center justify-between max-w-md mb-6">
        <button onClick={() => navigate(-1)} className="text-walnut hover:text-earth flex items-center gap-2">
          <ArrowLeft size={20} />
          <span className="text-base font-medium">Back</span>
        </button>
        <button onClick={() => navigate("/login")} className="bg-walnut text-white px-4 py-2 rounded-lg text-sm">
          Logout
        </button>
      </div>

      {/* ✅ Title */}
      <h1 className="text-3xl font-bold text-walnut mb-4 text-center leading-tight">
        Data Protection & Privacy Agreement
      </h1>

      {/* ✅ Content Section */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-5">
        <p className="text-gray-800 text-sm leading-relaxed">
          As a <strong>volunteer</strong> with Bharat Dekho under the <strong>Bose Fellowship program</strong>, I acknowledge that I will be handling <strong>sensitive student data</strong> while conducting educational activities in various villages.
          I agree to comply with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and other applicable laws to ensure data privacy and security.
        </p>

        {/* ✅ Key Points with Icons */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          {[
            "I will collect student information only for educational purposes and in strict compliance with organizational policies.",
            "I will store, access, and use data in a <strong>secure manner</strong> and ensure it is not misused or leaked.",
            "I will <strong>not share, sell, or distribute</strong> any collected data to unauthorized persons or third parties.",
            "I will ensure <strong>consent</strong> is obtained from parents/guardians before collecting any personal student information.",
            "I will follow all <strong>data retention and deletion</strong> policies as mandated by Bharat Dekho and legal requirements.",
            "I will immediately report any <strong>data breach, unauthorized access, or misuse</strong> of student data to the concerned authority.",
            "I understand that any <strong>violation</strong> of data protection policies may result in the <strong>termination of my volunteer position</strong> and may lead to legal consequences.",
          ].map((point, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-earth" />
              <p className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: point }} />
            </div>
          ))}
        </div>

        {/* ✅ Agreement Section */}
        <div className="space-y-3">
          <p className="text-gray-700 text-sm">
            I confirm that I have read and understood the <strong>Data Protection & Privacy</strong> guidelines and agree to handle student data responsibly.
          </p>

          {/* ✅ Auto-Filled Fields */}
          <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
            <p><span className="font-semibold">Full Name:</span> {fellowName}</p>
            <p><span className="font-semibold">Place:</span> {place}</p>
            <p><span className="font-semibold">Date:</span> {currentDate}</p>
          </div>

          {/* ✅ Acknowledgment Checkbox */}
          <div className="flex items-start space-x-3">
            <input 
              type="checkbox" 
              id="agree" 
              className="w-5 h-5 text-walnut border-gray-300 rounded"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)} 
            />
            <label htmlFor="agree" className="text-gray-700 text-sm leading-tight">
              I acknowledge that I have read, understood, and agree to abide by the terms outlined in this declaration.
            </label>
          </div>

          {/* ✅ Submit Button */}
          <Button 
            onClick={handleAgree}
            disabled={isSubmitting}
            className="w-full bg-walnut text-white hover:bg-walnut/90 py-3 rounded-lg text-lg font-medium"
          >
            {isSubmitting ? "Submitting..." : "I Agree"}
          </Button>
        </div>
      </div>
    </div>
  );
}
