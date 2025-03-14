import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DataConsent() {
  const navigate = useNavigate();

  const handleAgree = () => {
    // Add your logic here
    navigate('/child-protection-consent');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-walnut">
          Data Consent Agreement
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="mb-4">
              By proceeding, you agree to allow Yuva Chetana to collect and process your data in accordance with our privacy policy.
            </p>
            
            <Button 
              onClick={handleAgree}
              className="w-full bg-walnut text-white hover:bg-walnut/90"
            >
              I Agree
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 