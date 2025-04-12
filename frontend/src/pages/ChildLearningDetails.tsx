import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
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

export default function ChildLearningDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const childId = location.state?.childId || localStorage.getItem("child_id");

  const [speakingLevel, setSpeakingLevel] = useState("");
  const [readingLevel, setReadingLevel] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!childId) return;

    localStorage.setItem("child_id", childId.toString());

    fetch(`${ENDPOINTS.GET_CHILD_PROFILE_BY_ID(childId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          const d = data.data;
          setSpeakingLevel(d.speaking_level || "");
          setReadingLevel(d.reading_level || "");
          if (d.child_photo_s3_url) {
            setPhotoPreviewUrl(d.child_photo_s3_url);
          }
        }
      })
      .catch(err => console.error("Error loading child learning data", err));
  }, [childId]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!childId) {
      alert("Missing child ID");
      return;
    }

    const uploadPayload = {
      speaking_level: speakingLevel,
      reading_level: readingLevel,
    };

    if (photo) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Photo = reader.result;
        await saveData({ ...uploadPayload, child_photo_s3_url: base64Photo });
      };
      reader.readAsDataURL(photo);
    } else {
      await saveData(uploadPayload);
    }
  };

  const saveData = async (payload: any) => {
    try {
      const res = await fetch(ENDPOINTS.SAVE_CHILD_PROFILE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: childId,
          mobile_number: localStorage.getItem("mobile_number"), // ✅ REQUIRED by backend
          ...payload,
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === "success") {
        alert("Child profile submitted!");
        navigate("/view-child-profile");
      } else {
        console.error("Server error:", result);
        alert("Failed to save learning details");
      }
    } catch (err) {
      console.error("Error submitting child profile", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button
          onClick={() => navigate("/child-parent-details", { state: { childId } })}
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
        steps={["Personal Details", "Educational Details", "Parent or Guardian Details", "Learning Details"]}
      />

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        <div className="w-full max-w-3xl flex justify-center mb-2">
          <img src="/Images/organization_logo.png" alt="Logo" className="h-20 w-auto object-contain" />
        </div>

        <h2 className="text-xl font-bold text-walnut text-center">Child Learning Details</h2>

        <div className="space-y-2">
          <Label>Child's Speaking Level</Label>
          <Select value={speakingLevel} onValueChange={setSpeakingLevel}>
            <SelectTrigger className="signup-input w-full">
              <SelectValue placeholder="Select Speaking level of child" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black">
              <SelectItem value="BEGINNER">Basic</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Proficient</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Child’s Reading Level</Label>
          <Select value={readingLevel} onValueChange={setReadingLevel}>
            <SelectTrigger className="signup-input w-full">
              <SelectValue placeholder="Select Reading level of child" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black">
              <SelectItem value="BEGINNER">Basic</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Proficient</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Upload Child Photo</Label>
          <label htmlFor="photo-upload">
            <div className="w-full h-32 border border-gray-300 bg-gray-100 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-200 transition-all">
              {photoPreviewUrl ? (
                <img src={photoPreviewUrl} alt="Uploaded" className="h-full object-cover rounded-md" />
              ) : (
                <Upload className="h-6 w-6 text-gray-500" />
              )}
            </div>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        <div className="w-full flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            className="bg-walnut text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-earth"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
