import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { ENDPOINTS } from "@/utils/api";
import { getLoggedInMobile } from "@/utils/session";
import type { FellowDetails, FellowDetailsResponse } from "@/types/fellow";

export default function ChildProtectionConsent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fellowDetails, setFellowDetails] = useState<FellowDetails | null>(null);

  // Get mobile number from multiple sources
  const mobileNumber = location.state?.mobileNumber || getLoggedInMobile();

  useEffect(() => {
    const fetchFellowDetails = async () => {
      if (!mobileNumber) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(ENDPOINTS.GET_FELLOW_CONSENT_DETAILS(mobileNumber));
        if (!response.ok) throw new Error("Failed to fetch fellow details");
        
        const result: FellowDetailsResponse = await response.json();
        if (result.status === "success") {
          setFellowDetails(result.data);
        }
      } catch (error) {
        console.error("Error fetching fellow details:", error);
      }
    };

    fetchFellowDetails();
  }, [mobileNumber, navigate]);

  const handleAgree = async () => {
    if (!mobileNumber || !isAgreed) {
      alert("Please check the acknowledgment box to proceed");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(ENDPOINTS.UPDATE_CHILD_PROTECTION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: mobileNumber }),
      });

      if (!response.ok) throw new Error("Failed to update consent");

      navigate("/data-protection-consent", { state: { mobileNumber } });
    } catch (error) {
      console.error("Error updating consent:", error);
      alert("Failed to submit consent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F4F1E3] px-6 space-y-6">
      {/* Navigation Bar - stays outside */}
      <div className="w-full flex items-center justify-between max-w-3xl py-4">
        <button onClick={() => navigate(-1)} className="text-walnut hover:text-earth flex items-center gap-2">
          <ArrowLeft size={20} />
          <span className="text-base font-medium">Back</span>
        </button>
        <button onClick={() => navigate("/login")} className="bg-walnut text-white px-4 py-2 rounded-lg text-sm">
          Logout
        </button>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Logo and Title Section - Matching Register.tsx */}
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/Images/organization_logo.png" 
            alt="Logo" 
            className="h-16 w-auto object-contain mb-4" 
            loading="eager" 
          />
          <h2 className="text-2xl font-bold text-walnut">Child Protection Policy</h2>
        </div>

        {/* ✅ Content Section */}
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-5">
          <p className="text-gray-800 text-sm leading-relaxed">
            I hereby declare that I am voluntarily engaging in activities involving children as part of 
            the <strong>Bose Fellowship program</strong>, an initiative of the NGO <strong>Bharat Dekho</strong>.
          </p>
          <p className="text-gray-800 text-sm leading-relaxed">
            I acknowledge that the protection and well-being of children are of the highest priority. 
            I agree to comply with the <strong>Child Protection Policy</strong> and all related guidelines issued 
            by the concerned authorities.
          </p>

          {/* ✅ Key Points with Icons */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {[
              "I have never been <strong>convicted of or charged</strong> with any offense related to child abuse, exploitation, or endangerment.",
              "I will act in the <strong>best interests of children</strong> and provide a safe and supportive environment for them at all times.",
              "I will <strong>not participate in or tolerate</strong> any form of violence, neglect, exploitation, discrimination, or abuse against children.",
              "I will respect and protect the <strong>confidentiality</strong> of sensitive information about children and their families that I may encounter during my voluntary work.",
              "I will <strong>immediately report</strong> any concerns regarding child safety or any violations of the Child Protection Policy to the designated authority within the organization/program.",
              "I will maintain <strong>professional and appropriate boundaries</strong> in all interactions with children and will not engage in any conduct that could be deemed inappropriate or harmful.",
              "I will follow the organization's <strong>code of conduct</strong> and ethical standards in all my engagements with children.",
              "I understand that <strong>non-compliance</strong> with these commitments may result in the <strong>termination</strong> of my volunteer service and could lead to legal consequences as per applicable laws."
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
              I affirm that all the information provided in this declaration is true and correct to the best of my knowledge.
              I understand that any false statement or breach of these commitments may lead to disciplinary action against me.
            </p>

            {/* ✅ Auto-Filled Fields */}
            <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
              <p><span className="font-semibold">Full Name:</span> {fellowDetails?.full_name}</p>
              <p><span className="font-semibold">Place:</span> {fellowDetails?.place}</p>
              <p><span className="font-semibold">Date:</span> {fellowDetails?.current_date}</p>
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
                I acknowledge that I have read, understood, and agree to abide by the terms outlined in this self-declaration.
              </label>
            </div>

            {/* ✅ Submit Button */}
            <Button 
              onClick={handleAgree}
              className="w-full bg-walnut text-white hover:bg-walnut/90 py-3 rounded-lg text-lg font-medium"
            >
              I Agree
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
