import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { StepIndicator } from "@/components/ui/StepIndicator";

export default function ChildEduDetails() {
  const navigate = useNavigate();
  const [typeOfSchool, setTypeOfSchool] = useState("");
  const [childClass, setChildClass] = useState("");
  const [admissionStatus, setAdmissionStatus] = useState("");

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      {/* Top Nav */}
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button
          onClick={() => navigate("/child-parent-details")}
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
          currentStep={4}
          steps={["Personal Details", "Learning Details", "Parent or Guardian Details", "Educational Details"]}
        />

      {/* Form Section */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
       
      {/* Logo */}
      <div className="w-full max-w-3xl flex justify-center mb-2">
        <img src="/Images/organization_logo.png" alt="Logo" className="h-20 w-auto object-contain" />
      </div>
        <h2 className="text-xl font-bold text-walnut text-center">Child Educational Details</h2>

        {/* School Name */}
        <div className="space-y-2">
          <Label htmlFor="school_name">School Name</Label>
          <Input
            id="school_name"
            type="text"
            placeholder="School Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut"
          />
        </div>

        {/* Type of School */}
        <div className="space-y-2">
          <Label>Type of School</Label>
          <Select value={typeOfSchool} onValueChange={setTypeOfSchool}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut">
              <SelectValue placeholder="Select type of the school" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="GOVERNMENT">Government</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
              <SelectItem value="AIDED">Aided</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Class */}
        <div className="space-y-2">
          <Label>Class</Label>
          <Select value={childClass} onValueChange={setChildClass}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="1">1st</SelectItem>
              <SelectItem value="2">2nd</SelectItem>
              <SelectItem value="3">3rd</SelectItem>
              <SelectItem value="4">4th</SelectItem>
              <SelectItem value="5">5th</SelectItem>
              <SelectItem value="6">6th</SelectItem>
              <SelectItem value="7">7th</SelectItem>
              <SelectItem value="8">8th</SelectItem>
              <SelectItem value="9">9th</SelectItem>
              <SelectItem value="10">10th</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Admission Status */}
        <div className="space-y-2">
          <Label>Admission Status</Label>
          <Select value={admissionStatus} onValueChange={setAdmissionStatus}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut">
              <SelectValue placeholder="Select the status" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="ADMITTED">Admitted</SelectItem>
              <SelectItem value="NOT_ADMITTED">Not Admitted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-end pt-4">
          <button
            onClick={() => alert("Child Profile Submitted!")}
            className="bg-walnut text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-earth"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
