import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { ENDPOINTS } from "@/utils/api";

export default function ChildEduDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const childId = location.state?.childId || localStorage.getItem("child_id");

  const [schoolName, setSchoolName] = useState("");
  const [typeOfSchool, setTypeOfSchool] = useState("");
  const [childClass, setChildClass] = useState("");
  const [admissionStatus, setAdmissionStatus] = useState("");

  useEffect(() => {
    if (!childId) {
      alert("Child ID missing. Redirecting to profile.");
      navigate("/children-profile");
      return;
    }

    fetch(`${ENDPOINTS.GET_CHILD_PROFILE_BY_ID(childId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const d = data.data;
          setSchoolName(d.school_name || "");
          setTypeOfSchool(d.type_of_school || "");
          setChildClass(d.child_class || "");
          setAdmissionStatus(d.admission_status || "");
        }
      })
      .catch((err) => console.error("Failed to load child data", err));
  }, [childId]);

  const handleNext = async () => {
    if (!childId) return;

    const fellowMobile = localStorage.getItem("mobile_number");

    const payload = {
      id: childId,
      mobile_number: fellowMobile,
      school_name: schoolName,
      type_of_school: typeOfSchool,
      child_class: childClass,
      admission_status: admissionStatus
    };

    try {
      const res = await fetch(`${ENDPOINTS.SAVE_CHILD_PROFILE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok && result.status === "success") {
        navigate("/child-parent-details", { state: { childId } });
      } else {
        alert("Failed to save educational details");
        console.error("Error details:", result);
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      {/* Top Nav */}
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button
          onClick={() => navigate("/child-personal-details", { state: { childId } })}
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
        currentStep={2}
        steps={["Personal Details", "Educational Details", "Parent or Guardian Details", "Learning Details"]}
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
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="School Name"
            className="signup-input"
          />
        </div>

        {/* Type of School */}
        <div className="space-y-2">
          <Label>Type of School</Label>
          <Select value={typeOfSchool} onValueChange={setTypeOfSchool}>
            <SelectTrigger className="signup-input w-full">
              <SelectValue placeholder="Select type of the school" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black">
              {["GOVERNMENT", "PRIVATE", "TWPS", "ASHRAM", "OTHER"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Class */}
        <div className="space-y-2">
          <Label>Class</Label>
          <Select value={childClass} onValueChange={setChildClass}>
            <SelectTrigger className="signup-input w-full">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black">
              {["out_of_school", "3", "4", "5", "6", "7", "8", "Other"].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Admission Status */}
        <div className="space-y-2">
          <Label>Admission Status</Label>
          <Select value={admissionStatus} onValueChange={setAdmissionStatus}>
            <SelectTrigger className="signup-input w-full">
              <SelectValue placeholder="Select the status" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black">
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DROPPED OUT">Dropped out</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-end pt-4">
          <button
            onClick={handleNext}
            className="bg-walnut text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-earth"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
