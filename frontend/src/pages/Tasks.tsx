import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Tasks() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Add your logic here
    navigate('/data-consent');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-walnut">
          Required Tasks
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="mb-4">
              Complete the required tasks to proceed with registration.
            </p>
            
            <Button 
              onClick={handleSubmit}
              className="w-full bg-walnut text-white hover:bg-walnut/90"
            >
              Submit Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 