import { useEffect, useState } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { ENDPOINTS } from "@/utils/api";
import { validateMobileNumber, getMobileErrorMessage } from "@/utils/validation";

interface LocationOption {
  id: string;
  name: string;
}

export default function ChildPersonalDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const childId = location.state?.childId || localStorage.getItem("child_id");

  const [gender, setGender] = useState("");
  const [caste, setCaste] = useState("");
  const [parentMobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [dob, setDob] = useState("");
  const [fullName, setFullName] = useState("");

  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [mandals, setMandals] = useState<LocationOption[]>([]);
  const [villages, setVillages] = useState<LocationOption[]>([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  useEffect(() => {
    if (!childId) return;
    fetch(`${ENDPOINTS.GET_CHILD_PROFILE_BY_ID(childId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          const d = data.data;
          setFullName(d.full_name || "");
          setGender(d.gender || "");
          setCaste(d.caste_category || "");
          setDob(d.date_of_birth || "");
          setMobileNumber(d.parent_mobile_number || "");
          setSelectedState(d.state?.toString() || "");
          setSelectedDistrict(d.district?.toString() || "");
          setSelectedMandal(d.mandal?.toString() || "");
          setSelectedVillage(d.village?.toString() || "");
        }
      })
      .catch(err => console.error("Failed to fetch child data", err));
  }, [childId]);

  useEffect(() => {
    fetch(ENDPOINTS.GET_STATES)
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error("Failed to fetch states", err));
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${selectedState}`)
        .then((res) => res.json())
        .then((data) => setDistricts(data))
        .catch((err) => console.error("Failed to fetch districts", err));
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${selectedDistrict}`)
        .then((res) => res.json())
        .then((data) => setMandals(data))
        .catch((err) => console.error("Failed to fetch mandals", err));
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedMandal) {
      fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${selectedMandal}`)
        .then((res) => res.json())
        .then((data) => setVillages(data))
        .catch((err) => console.error("Failed to fetch grampanchayats", err));
    }
  }, [selectedMandal]);

  // ✅ Re-fetch dropdowns if state/district/mandal already selected
  useEffect(() => {
    if (selectedState && districts.length === 0) {
      fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${selectedState}`)
        .then(res => res.json())
        .then(data => setDistricts(data));
    }
    if (selectedDistrict && mandals.length === 0) {
      fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${selectedDistrict}`)
        .then(res => res.json())
        .then(data => setMandals(data));
    }
    if (selectedMandal && villages.length === 0) {
      fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${selectedMandal}`)
        .then(res => res.json())
        .then(data => setVillages(data));
    }
  }, [selectedState, selectedDistrict, selectedMandal]);

  const handleMobileChange = (value: string) => {
    setMobileNumber(value);
    setMobileError(getMobileErrorMessage(value));
  };

  const handleSaveAndNext = async () => {
    const payload = {
      parent_mobile_number: parentMobileNumber,
      full_name: fullName,
      gender,
      caste_category: caste,
      date_of_birth: dob,
      state: selectedState,
      district: selectedDistrict,
      mandal: selectedMandal,
      village: selectedVillage,
      mobile_number: localStorage.getItem("mobile_number"),
    };

    try {
      const res = await fetch(ENDPOINTS.SAVE_CHILD_PROFILE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok && result.status === "success") {
        const newChildId = result.data.id;
        localStorage.setItem("child_id", newChildId.toString());
        navigate("/child-educational-details", { state: { childId: newChildId } });
      } else {
        alert("Failed to save child details");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button onClick={() => navigate("/children-profile")} className="text-walnut hover:text-earth flex items-center gap-2 text-base font-medium">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button onClick={() => { localStorage.removeItem("mobile_number"); navigate("/login"); }} className="bg-walnut text-white px-4 py-2 rounded-lg text-sm">
          Logout
        </button>
      </div>

      <StepIndicator currentStep={1} steps={["Personal Details", "Educational Details", "Parent or Guardian Details", "Learning Details"]} />

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        <div className="w-full flex justify-center mb-2">
          <img src="/Images/organization_logo.png" alt="Logo" className="h-20 w-auto object-contain" />
        </div>

        <h2 className="text-xl font-bold text-walnut text-center">Child Personal Information</h2>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Child name" className="signup-input" />
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="signup-input w-full"><SelectValue placeholder="Select Gender" /></SelectTrigger>
            <SelectContent className="w-full bg-white text-black border border-gray-300 shadow-md z-50">
              {["MALE", "FEMALE", "OTHER"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Caste Category</Label>
          <Select value={caste} onValueChange={setCaste}>
            <SelectTrigger className="signup-input w-full"><SelectValue placeholder="Select Caste" /></SelectTrigger>
            <SelectContent className="w-full bg-white text-black border border-gray-300 shadow-md z-50">
              {["ST", "SC", "BC", "OBC", "OC", "MUSLIM", "CHRISTIAN", "OTHER"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="signup-input" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile_number">Parent Mobile Number</Label>
          <Input
            id="mobile_number"
            type="text"
            value={parentMobileNumber}
            onChange={(e) => handleMobileChange(e.target.value)}
            className={`signup-input ${!validateMobileNumber(parentMobileNumber) && parentMobileNumber ? "border-red-500" : ""}`}
          />
          {!validateMobileNumber(parentMobileNumber) && parentMobileNumber && (
            <p className="text-red-500 text-sm">{mobileError}</p>
          )}
        </div>

        {[{ label: "State", val: selectedState, set: setSelectedState, opts: states },
          { label: "District", val: selectedDistrict, set: setSelectedDistrict, opts: districts },
          { label: "Mandal", val: selectedMandal, set: setSelectedMandal, opts: mandals },
          { label: "Village", val: selectedVillage, set: setSelectedVillage, opts: villages }
        ].map(({ label, val, set, opts }) => (
          <div className="space-y-2" key={label}>
            <Label>{label}</Label>
            <Select value={val} onValueChange={set}>
              <SelectTrigger className="signup-input w-full">
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent className="w-full bg-white text-black border border-gray-300 shadow-md z-50">
                {opts.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <div className="w-full flex justify-end pt-4">
          <button onClick={handleSaveAndNext} className="bg-walnut text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-earth">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}