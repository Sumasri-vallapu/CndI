import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { StepIndicator } from "@/components/ui/StepIndicator";

export default function ChildParentDetails() {
  const navigate = useNavigate();

  const [motherOccupation, setMotherOccupation] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");

  const occupations = [
    "Homemaker",
    "Farmer",
    "Laborer",
    "Private Job",
    "Government Job",
    "Self Employed",
    "Unemployed",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      {/* Top Nav */}
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button
          onClick={() => navigate("/child-learning-details")}
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

      {/* Step Indicator */}
      <StepIndicator
          currentStep={3}
          steps={["Personal Details", "Learning Details", "Parent or Guardian Details", "Educational Details"]}
        />

      {/* Form Section */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        
      {/* Logo */}
      <div className="w-full max-w-3xl flex justify-center mb-2">
        <img src="/Images/organization_logo.png" alt="Logo" className="h-20 w-auto object-contain" />
      </div>

        <h2 className="text-xl font-bold text-walnut text-center">Parent/Guardian Details</h2>

        {/* Mother's Name */}
        <div className="space-y-2">
          <Label htmlFor="mother_name">Mother's Name</Label>
          <Input
            id="mother_name"
            type="text"
            placeholder="Mother Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut"
          />
        </div>

        {/* Mother's Occupation */}
        <div className="space-y-2">
          <Label htmlFor="mother_occupation">Mother's Occupation</Label>
          <Select value={motherOccupation} onValueChange={setMotherOccupation}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut">
              <SelectValue placeholder="Mother Occupation" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {occupations.map((occupation) => (
                <SelectItem key={occupation} value={occupation}>
                  {occupation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Father's Name */}
        <div className="space-y-2">
          <Label htmlFor="father_name">Father's Name</Label>
          <Input
            id="father_name"
            type="text"
            placeholder="Father Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut"
          />
        </div>

        {/* Father's Occupation */}
        <div className="space-y-2">
          <Label htmlFor="father_occupation">Father's Occupation</Label>
          <Select value={fatherOccupation} onValueChange={setFatherOccupation}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut">
              <SelectValue placeholder="Father Occupation" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {occupations.map((occupation) => (
                <SelectItem key={occupation} value={occupation}>
                  {occupation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Next Button */}
        <div className="w-full flex justify-end pt-4">
          <button
            onClick={() => navigate("/child-educational-details")}
            className="bg-walnut text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-earth"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
