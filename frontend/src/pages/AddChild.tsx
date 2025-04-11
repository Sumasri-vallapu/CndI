import { ArrowLeft } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { useNavigate } from "react-router-dom";

export default function AddChild() {
  const navigate = useNavigate();

  const actions = [
    { label: "Personal Information", onClick: () => navigate("/child-personal-details") },
    { label: "Learning Details", onClick: () => navigate("/child-learning-details") },
    { label: "Parent/Guardian Information", onClick: () => console.log("Go to Guardian Info") },
    { label: "Educational Information", onClick: () => console.log("Go to Educational Info") },
  ];

  const handleLogout = () => {
    localStorage.removeItem("mobile_number");
    localStorage.removeItem("profile_photo");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      {/* Top Navigation */}
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button
          onClick={() => navigate("/children-profile")}
          className="text-walnut hover:text-earth flex items-center gap-2 text-base font-medium cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button
          onClick={handleLogout}
          className="bg-walnut text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Main Section */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="text-2xl font-bold text-center text-walnut mb-6">Add Child</h2>

        <div className="space-y-4">
          {actions.map((action) => (
            <ActionCard key={action.label} label={action.label} onClick={action.onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
