import { ArrowLeft } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import { useNavigate } from "react-router-dom";

export default function ChildrenProfile() {
  const navigate = useNavigate();

  const actions = [
    { label: "Add Child Profile", onClick: () => navigate("/child-personal-details") },
    { label: "View Child Profile", onClick: () => navigate("/view-child") },
  ];

  const handleLogout = () => {
    localStorage.removeItem("mobile_number");
    localStorage.removeItem("profile_photo");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      {/* Back & Logout Buttons */}
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button onClick={() => navigate("/main")} className="text-walnut hover:text-earth flex items-center gap-2">
          <ArrowLeft size={20} />
          <span className="text-base font-medium">Back</span>
        </button>
        <button onClick={handleLogout} className="bg-walnut text-white px-4 py-2 rounded-lg text-sm">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-8">
        <h2 className="text-2xl font-bold text-center text-walnut mb-6">Children Profile</h2>

        <div className="space-y-4">
          {actions.map((action) => (
            <ActionCard key={action.label} label={action.label} onClick={action.onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
