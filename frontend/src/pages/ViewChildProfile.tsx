import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/utils/api";

interface ChildProfile {
  id: number;
  full_name: string;
  gender: string;
  caste_category: string;
  school_name: string;
  child_class: string;
  speaking_level: string;
}

export default function ViewChildProfile() {
  const navigate = useNavigate();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const fellowMobile = localStorage.getItem("mobile_number") || "";

  useEffect(() => {
    if (!fellowMobile) return;

    fetch(ENDPOINTS.GET_CHILDREN_FOR_FELLOW(fellowMobile))
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.data)) {
          setChildren(data.data);
        } else {
          setChildren([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch children profiles", err);
        setChildren([]);
      });
  }, [fellowMobile]);

  const handleEdit = (childId: number) => {
    navigate("/child-personal-details", { state: { childId } });
  };

  const handleLogout = () => {
    localStorage.removeItem("mobile_number");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      {/* Top Nav */}
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button
          onClick={() => navigate("/children-profile")}
          className="text-walnut hover:text-earth flex items-center gap-2 text-base font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button onClick={handleLogout} className="bg-walnut text-white px-4 py-2 rounded-lg text-sm">
          Logout
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        <h2 className="text-2xl font-bold text-center text-walnut mb-6">Saved Child Profiles</h2>

        {children.length === 0 ? (
          <p className="text-center text-sm text-gray-500">No child profile found. Please add one.</p>
        ) : (
          <div className="space-y-4">
            {children.map((child) => (
              <Card key={child.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-walnut">{child.full_name}</p>
                  <p className="text-sm text-gray-700">
                    Gender: {child.gender} | Class: {child.child_class} | School: {child.school_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Caste: {child.caste_category} | Speaking Level: {child.speaking_level}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(child.id)}>
                  <Pencil size={20} />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
