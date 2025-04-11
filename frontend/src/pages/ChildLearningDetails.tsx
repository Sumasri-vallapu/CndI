import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { StepIndicator } from "@/components/ui/StepIndicator";

export default function ChildLearningDetails() {
  const navigate = useNavigate();
  const [speakingLevel, setSpeakingLevel] = useState("");
  const [readingLevel, setReadingLevel] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      {/* Top Nav */}
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button
          onClick={() => navigate("/child-personal-details")}
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
          steps={["Personal Details", "Learning Details", "Parent or Guardian Details", "Educational Details"]}
        />
      {/* Form Section */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
       
       {/* Logo */}
      <div className="w-full max-w-3xl flex justify-center mb-2">
        <img src="/Images/organization_logo.png" alt="Logo" className="h-20 w-auto object-contain" />
      </div>

        <h2 className="text-xl font-bold text-walnut text-center">Child Learning Details</h2>

        {/* Speaking Level */}
        <div className="space-y-2">
          <Label>Child's Speaking Level</Label>
          <Select value={speakingLevel} onValueChange={setSpeakingLevel}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut">
              <SelectValue placeholder="Select Speaking level of child" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reading Level */}
        <div className="space-y-2">
          <Label>Child’s Reading Level</Label>
          <Select value={readingLevel} onValueChange={setReadingLevel}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut">
              <SelectValue placeholder="Select Reading level of child" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Photo */}
        <div className="space-y-2">
          <Label>Upload Child Photo</Label>
          <label htmlFor="photo-upload">
            <div className="w-full h-32 border border-gray-300 bg-gray-100 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-200 transition-all">
              {photo ? (
                <img src={URL.createObjectURL(photo)} alt="Uploaded" className="h-full object-cover rounded-md" />
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

        {/* Next Button */}
        <div className="w-full flex justify-end pt-4">
          <button
            onClick={() => navigate("/child-parent-details")}
            className="bg-walnut text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-earth"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
