import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ENDPOINTS } from "@/utils/api";

export default function ChildProtectionConsent() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber || "9999999999"; // Fallback for testing
  
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
      const response = await fetch(ENDPOINTS.UPDATE_CHILD_PROTECTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_number: mobileNumber
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update child protection consent');
      }
      
      // Navigate to data protection consent page on success
      navigate('/data-protection-consent', { state: { mobileNumber } });
    } catch (error) {
      console.error('Error submitting child protection consent:', error);
      alert('Failed to submit consent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] px-6 py-6 flex flex-col items-center">
      {/* ✅ Navigation Bar */}
      <div className="w-full flex items-center justify-between max-w-3xl py-4">
        <button onClick={() => navigate(-1)} className="text-walnut hover:text-earth">
          <ArrowLeft size={24} />
        </button>
        <button onClick={() => navigate("/login")} className="bg-walnut text-white px-3 py-1 rounded-md text-xs md:text-sm">
          Logout
        </button>
      </div>

      {/* ✅ Page Title */}
      <h1 className="text-2xl font-bold text-center text-walnut mb-6">
        Undertaking for Child Protection Policy
      </h1>

      {/* ✅ Content Section */}
      <div className="max-w-3xl bg-white p-6 rounded-lg shadow-lg space-y-4">
        <p>
          I hereby declare that I am voluntarily engaging in activities involving children as part of 
          the <b>Bose Fellowship program</b>, an initiative of the NGO <b>Bharat Dekho</b>.
        </p>
        <p>
          I acknowledge that the protection and well-being of children are of the highest priority. 
          I agree to comply with the <b>Child Protection Policy</b> and all related guidelines issued 
          by the concerned authorities.
        </p>

        {/* ✅ Key Points List */}
        <div className="bg-gray-50 p-5 rounded-lg space-y-2">
          {[
            "I have never been convicted of or charged with any offense related to child abuse, exploitation, or endangerment.",
            "I will act in the best interests of children and provide a safe and supportive environment for them at all times.",
            "I will not participate in or tolerate any form of violence, neglect, exploitation, discrimination, or abuse against children.",
            "I will respect and protect the confidentiality of sensitive information about children and their families that I may encounter during my voluntary work.",
            "I will immediately report any concerns regarding child safety or any violations of the Child Protection Policy to the designated authority within the organization/program.",
            "I will maintain professional and appropriate boundaries in all interactions with children and will not engage in any conduct that could be deemed inappropriate or harmful.",
            "I will follow the organization's code of conduct and ethical standards in all my engagements with children.",
            "I understand that non-compliance with these commitments may result in the termination of my volunteer service and could lead to legal consequences as per applicable laws."
          ].map((point, index) => (
            <p key={index} className="text-sm text-gray-700">
              <b>{index + 1}.</b> {point}
            </p>
          ))}
        </div>

        {/* ✅ Agreement Section */}
        <div className="space-y-4">
          <p className="text-gray-700">
            I affirm that all the information provided in this declaration is true and correct to the best of my knowledge.
            I understand that any false statement or breach of these commitments may lead to disciplinary action against me.
          </p>

          {/* ✅ Auto-Filled Fields */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><b>Full Name:</b> {fellowName}</p>
            <p><b>Place:</b> {place}</p>
            <p><b>Date:</b> {currentDate}</p>
          </div>

          {/* ✅ Acknowledgment Checkbox */}
          <div className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              id="agree" 
              className="w-5 h-5 text-walnut border-gray-300 rounded"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)} 
            />
            <label htmlFor="agree" className="text-gray-700">
              I acknowledge that I have read, understood, and agree to abide by the terms outlined in this self-declaration.
            </label>
          </div>

          {/* ✅ Submit Button */}
          <Button 
            onClick={handleAgree}
            disabled={isSubmitting}
            className="w-full bg-walnut text-white hover:bg-walnut/90 py-3 rounded-lg shadow-md"
          >
            {isSubmitting ? "Submitting..." : "I Agree"}
          </Button>
        </div>
      </div>
    </div>
  );
}
