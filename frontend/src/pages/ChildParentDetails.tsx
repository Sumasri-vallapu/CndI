import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { ENDPOINTS } from "@/utils/api";

export default function ChildParentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const childId = location.state?.childId || localStorage.getItem("child_id");

  const [motherName, setMotherName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");

  const m_occupations = [
    "Home Maker",
    "Tailor",
    "Agricultural Labour",
    "Construction Labour",
    "Daily Wage Worker",
    "School Teacher",
    "Anganwadi Teacher",
    "DWCRA Member",
    "Factory Worker",
    "Expired",
    "Other",
  ];

  const f_occupations = [
    "Tailor",
    "Agricultural Labour",
    "Construction Labour",
    "Daily Wage Worker",
    "School Teacher",
    "Factory Worker",
    "Expired",
    "Plumber",
    "Electrician",
    "Driver",
    "Business",
    "Other",
  ];

  useEffect(() => {
    if (!childId) return;
    localStorage.setItem("child_id", childId);

    fetch(ENDPOINTS.GET_CHILD_PROFILE_BY_ID(childId))
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const d = data.data;
          setMotherName(d.mother_name || "");
          setFatherName(d.father_name || "");
          setMotherOccupation(d.mother_occupation || "");
          setFatherOccupation(d.father_occupation || "");
        }
      })
      .catch((err) => console.error("Failed to fetch child profile", err));
  }, [childId]);

  const handleSaveAndNext = async () => {
    const payload = {
      id: childId,
      mobile_number: localStorage.getItem("mobile_number"),
      mother_name: motherName,
      father_name: fatherName,
      mother_occupation: motherOccupation,
      father_occupation: fatherOccupation,
    };

    try {
      const response = await fetch(ENDPOINTS.SAVE_CHILD_PROFILE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        navigate("/child-learning-details", { state: { childId } });
      } else {
        alert("Failed to save parent details");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      {/* Top Nav */}
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button
          onClick={() => navigate("/child-educational-details", { state: { childId } })}
          className="text-walnut hover:text-earth flex items-center gap-2 text-base font-medium cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("mobile_number");
            navigate("/login");
          }}
          className="bg-walnut text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          Logout
        </button>
      </div>

      <StepIndicator
        currentStep={3}
        steps={["Personal Details", "Educational Details", "Parent or Guardian Details", "Learning Details"]}
      />

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        <div className="w-full max-w-3xl flex justify-center mb-2">
          <img src="/Images/organization_logo.png" alt="Logo" className="h-20 w-auto object-contain" />
        </div>

        <h2 className="text-xl font-bold text-walnut text-center">Parent/Guardian Details</h2>

        <div className="space-y-2">
          <Label htmlFor="mother_name">Mother's Name</Label>
          <Input
            id="mother_name"
            type="text"
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
            placeholder="Mother Name"
            className="signup-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mother_occupation">Mother's Occupation</Label>
          <Select value={motherOccupation} onValueChange={setMotherOccupation}>
            <SelectTrigger className="signup-input w-full">
              <SelectValue placeholder="Mother Occupation" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black">
              {m_occupations.map((occupation) => (
                <SelectItem key={occupation} value={occupation}>
                  {occupation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="father_name">Father's Name</Label>
          <Input
            id="father_name"
            type="text"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
            placeholder="Father Name"
            className="signup-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="father_occupation">Father's Occupation</Label>
          <Select value={fatherOccupation} onValueChange={setFatherOccupation}>
            <SelectTrigger className="signup-input w-full">
              <SelectValue placeholder="Father Occupation" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black">
              {f_occupations.map((occupation) => (
                <SelectItem key={occupation} value={occupation}>
                  {occupation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex justify-end pt-4">
          <button
            onClick={handleSaveAndNext}
            className="bg-walnut text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-earth"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
