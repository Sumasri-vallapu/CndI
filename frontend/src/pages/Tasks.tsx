import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ENDPOINTS } from "@/utils/api";
import Dropzone from "react-dropzone";
import { PlayCircle, ArrowLeft } from "lucide-react";

// ✅ Define TypeScript Interfaces
interface LocationItem {
  id: string;
  name: string;
}

interface VideoStatus {
  video1: boolean;
  video2: boolean;
}

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber;

  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [mandals, setMandals] = useState<LocationItem[]>([]);
  const [villages, setVillages] = useState<LocationItem[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedMandal, setSelectedMandal] = useState<string>("");
  const [selectedVillage, setSelectedVillage] = useState<string>("");
  const [lcPhoto, setLcPhoto] = useState<File | null>(null);
  const [task2Photo, setTask2Photo] = useState<File | null>(null);
  const [task1Status, setTask1Status] = useState<string>("Not Started");
  const [task2Status, setTask2Status] = useState<string>("Not Started");
  const [videosWatched, setVideosWatched] = useState<VideoStatus>({
    video1: false,
    video2: false,
  });

  const [state] = useState("36"); // Telangana State ID

  // ✅ Fetch Districts
  useEffect(() => {
    if (!state) return;
    fetch(ENDPOINTS.GET_DISTRICTS(state))
      .then((res) => res.json())
      .then(setDistricts)
      .catch((err) => console.error("Error fetching districts:", err));
  }, [state]);

  // ✅ Fetch Mandals
  useEffect(() => {
    if (!selectedDistrict) return;
    fetch(ENDPOINTS.GET_MANDALS(selectedDistrict))
      .then((res) => res.json())
      .then(setMandals)
      .catch((err) => console.error("Error fetching mandals:", err));
  }, [selectedDistrict]);

  // ✅ Fetch Villages
  useEffect(() => {
    if (!selectedMandal) return;
    fetch(ENDPOINTS.GET_VILLAGES(selectedMandal))
      .then((res) => res.json())
      .then(setVillages)
      .catch((err) => console.error("Error fetching villages:", err));
  }, [selectedMandal]);

  // ✅ Fetch Task Status
  useEffect(() => {
    if (!mobileNumber) return;
    fetch(ENDPOINTS.GET_TASK_STATUS(mobileNumber))
      .then((res) => res.json())
      .then((data) => {
        setTask1Status(data.task1_status || "Not Started");
        setTask2Status(data.task2_status || "Not Started");
      })
      .catch((err) => console.error("Error fetching task status:", err));
  }, [mobileNumber]);

  // ✅ Mark video as watched
  const handleVideoWatched = (videoId: "video1" | "video2") => {
    fetch(ENDPOINTS.UPDATE_VIDEO_STATUS(videoId, mobileNumber!), { method: "POST" })
      .then(() => setVideosWatched((prev) => ({ ...prev, [videoId]: true })))
      .catch((err) => console.error("Error updating video status:", err));
  };

  // ✅ Submit Task 1 (Location + Photo)
  const handleSubmitTask1 = async () => {
    if (!selectedDistrict || !selectedMandal || !selectedVillage || !lcPhoto || !mobileNumber) {
      alert("All fields and photo are required for Task 1!");
      return;
    }
    
    // Add implementation here for Task 1 submission
    // For example:
    // const formData = new FormData();
    // formData.append('mobile_number', mobileNumber);
    // formData.append('district', selectedDistrict);
    // formData.append('mandal', selectedMandal);
    // formData.append('village', selectedVillage);
    // formData.append('lc_photo', lcPhoto);
    
    // try {
    //   const response = await fetch(ENDPOINTS.SUBMIT_TASK1, {
    //     method: 'POST',
    //     body: formData
    //   });
    //   if (response.ok) {
    //     setTask1Status("Submitted for Review");
    //   }
    // } catch (error) {
    //   console.error("Error submitting task 1:", error);
    //   alert("Failed to submit Task 1. Please try again.");
    // }
  };

  // ✅ Submit Task 2 (Upload Photo)
  const handleSubmitTask2 = async () => {
    if (!task2Photo || !mobileNumber) {
      alert("Photo upload is required for Task 2!");
      return;
    }
    
    // Add implementation here for Task 2 submission
    // For example:
    // const formData = new FormData();
    // formData.append('mobile_number', mobileNumber);
    // formData.append('training_photo', task2Photo);
    
    // try {
    //   const response = await fetch(ENDPOINTS.SUBMIT_TASK2, {
    //     method: 'POST',
    //     body: formData
    //   });
    //   if (response.ok) {
    //     setTask2Status("Submitted for Review");
    //   }
    // } catch (error) {
    //   console.error("Error submitting task 2:", error);
    //   alert("Failed to submit Task 2. Please try again.");
    // }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F4F1E3] px-6 space-y-6">
      {/* Navigation Bar */}
      <div className="w-full flex items-center justify-between max-w-3xl py-4">
        <button onClick={() => navigate(-1)} className="text-walnut hover:text-earth">
          <ArrowLeft size={24} />
        </button>
        <button onClick={() => navigate("/login")} className="bg-walnut text-white px-3 py-1 rounded-md text-xs md:text-sm">
          Logout
        </button>
      </div>

      {/* Combined Logo, Welcome Text and Videos Container */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Logo and Title */}
        <div className="flex flex-col items-center">
          <img 
            src="/Images/organization_logo.png" 
            alt="Logo" 
            className="h-16 w-auto object-contain mb-4" 
            loading="eager" 
          />
          <h2 className="text-2xl font-bold text-walnut">Fellow Tasks</h2>
        </div>

        {/* Welcome Text */}
        <div className="text-center space-y-2">
          <p className="text-lg text-walnut font-medium">Dear Youth Volunteer,</p>
          <p className="text-gray-700">Welcome to the next stage of your Application!</p>
          <p className="text-gray-700">Watch this video to know more!</p>
        </div>

        {/* Videos Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-walnut">Videos</h3>
          <div className="space-y-3">
            {(["video1", "video2"] as const).map((vid) => (
              <div key={vid} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <a href="https://youtube.com" target="_blank" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <PlayCircle className="w-6 h-6" /> Watch Video {vid === "video1" ? "1" : "2"}
                </a>
                <div className={`px-4 py-2 rounded-full text-white text-sm ${videosWatched[vid] ? "bg-green-500" : "bg-gray-500"}`}>
                  {videosWatched[vid] ? "✅ Seen" : "⌛ Unseen"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task 1 Container */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-walnut">Task 1: Set up LC</h3>
          <span className={`px-3 py-1 rounded-md text-sm text-white ${
            task1Status === "Submitted for Review" ? "bg-yellow-500" : 
            task1Status === "Approved" ? "bg-green-500" : 
            task1Status === "Rejected" ? "bg-red-500" : "bg-gray-500"
          }`}>
            {task1Status}
          </span>
        </div>

        {/* Location Selection */}
        <div className="bg-gray-50 p-5 rounded-lg space-y-4">
          <div className="space-y-2">
            <Label>State</Label>
            <Select value={state} disabled>
              <SelectTrigger className="w-full bg-white border border-gray-300 h-10 px-3 rounded-lg focus:ring-2 focus:ring-earth/70">
                <SelectValue placeholder="Telangana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="36">Telangana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {[
            { label: "District", value: selectedDistrict, setter: setSelectedDistrict, options: districts },
            { label: "Mandal", value: selectedMandal, setter: setSelectedMandal, options: mandals },
            { label: "Village", value: selectedVillage, setter: setSelectedVillage, options: villages }
          ].map(({ label, value, setter, options }) => (
            <div key={label} className="space-y-2">
              <Label>{label}</Label>
              <Select value={value} onValueChange={setter}>
                <SelectTrigger className="w-full bg-white border border-gray-300 h-10 px-3 rounded-lg focus:ring-2 focus:ring-earth/70">
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md text-black">
                  {options.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <Label>Upload LC Photo</Label>
          <Dropzone onDrop={(acceptedFiles) => setLcPhoto(acceptedFiles[0])}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer bg-gray-50">
                <input {...getInputProps()} />
                {lcPhoto ? <p className="text-green-600">{lcPhoto.name}</p> : "Drop or Click to Upload"}
              </div>
            )}
          </Dropzone>
        </div>

        <Button className="w-full bg-walnut text-white py-3 rounded-lg shadow-md hover:bg-walnut/90" onClick={handleSubmitTask1}>
          Submit Task 1
        </Button>
      </div>

      {/* Task 2 Container */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-walnut">Task 2: Registering Children</h3>
          <span className={`px-3 py-1 rounded-md text-sm text-white ${
            task2Status === "Submitted for Review" ? "bg-yellow-500" : 
            task2Status === "Approved" ? "bg-green-500" : 
            task2Status === "Rejected" ? "bg-red-500" : "bg-gray-500"
          }`}>
            {task2Status}
          </span>
        </div>

        <div className="space-y-2">
          <Label>Upload Training Completion Photo</Label>
          <Dropzone onDrop={(acceptedFiles) => setTask2Photo(acceptedFiles[0])}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer bg-gray-50">
                <input {...getInputProps()} />
                {task2Photo ? <p className="text-green-600">{task2Photo.name}</p> : "Drop or Click to Upload"}
              </div>
            )}
          </Dropzone>
        </div>

        <Button className="w-full bg-walnut text-white py-3 rounded-lg shadow-md hover:bg-walnut/90" onClick={handleSubmitTask2}>
          Submit Task 2
        </Button>
      </div>
    </div>
  );
};

export default Tasks;
