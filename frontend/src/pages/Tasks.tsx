import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ENDPOINTS } from "@/utils/api";
import Dropzone from "react-dropzone";
import { PlayCircle, ArrowLeft, ImageUp } from "lucide-react";

// ✅ Define TypeScript Interfaces
interface LocationItem {
  id: string;
  name: string;
}

interface VideoStatus {
  video1: boolean;
  video2: boolean;
}

interface TaskStatus {
  video1_watched: boolean;
  video2_watched: boolean;
  task1_submitted: boolean;
  task2_submitted: boolean;
  task1_status: string;
  task2_status: string;
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

  // Add state for glossary toggle
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  
  const toggleGlossary = () => {
    setGlossaryOpen(!glossaryOpen);
  };

  // Add these state variables after your existing state declarations
  const [isAccepted, setIsAccepted] = useState(false);
  const [acceptanceDate, setAcceptanceDate] = useState<string | null>(null);

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

  // Fetch task status on component mount
  useEffect(() => {
    if (!mobileNumber) return;
    fetch(ENDPOINTS.GET_TASK_STATUS(mobileNumber))
      .then((res) => res.json())
      .then((data: TaskStatus) => {
        setVideosWatched({
          video1: data.video1_watched,
          video2: data.video2_watched
        });
        setTask1Status(data.task1_status);
        setTask2Status(data.task2_status);
      })
      .catch((err) => console.error("Error fetching task status:", err));
  }, [mobileNumber]);

  // Add this function with your other fetch functions
  const fetchAcceptanceStatus = async () => {
    if (!mobileNumber) return;
    
    try {
      const response = await fetch(ENDPOINTS.GET_FELLOW_ACCEPTANCE(mobileNumber));
      if (!response.ok) throw new Error("Failed to fetch acceptance status");
      
      const data = await response.json();
      setIsAccepted(data.is_accepted_offer_letter);
      setAcceptanceDate(data.accepted_offer_letter_date);
    } catch (error) {
      console.error("Error fetching acceptance status:", error);
    }
  };

  // Add a new useEffect to call fetchAcceptanceStatus
  useEffect(() => {
    if (mobileNumber) {
      fetchAcceptanceStatus();
    }
  }, [mobileNumber]);

  // Mark video as watched
  const handleVideoWatched = async (videoId: "video1" | "video2") => {
    if (!mobileNumber) {
      console.error("Mobile number not available");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.UPDATE_VIDEO_STATUS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id: videoId,
          mobile_number: mobileNumber
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update video status");
      }

      // Update local state only after successful backend update
      setVideosWatched(prev => ({ 
        ...prev, 
        [videoId]: true 
      }));

    } catch (err) {
      console.error("Error updating video status:", err);
      alert("Failed to mark video as watched. Please try again.");
    }
  };

  // Submit Task 1
  const handleSubmitTask1 = async () => {
    if (!selectedDistrict || !selectedMandal || !selectedVillage || !lcPhoto || !mobileNumber) {
        alert("All fields and photo are required for Task 1!");
        return;
    }
    
    const formData = new FormData();
    formData.append("mobile_number", mobileNumber);
    formData.append("district_id", selectedDistrict);
    formData.append("mandal_id", selectedMandal);
    formData.append("village_id", selectedVillage);
    formData.append("lc_photo", lcPhoto);
    
    try {
        const response = await fetch(ENDPOINTS.SUBMIT_TASK1, {
            method: "POST",
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to submit task 1");
        }

        setTask1Status("Under Review");
    } catch (error) {
        console.error("Error submitting task 1:", error);
        alert("Failed to submit Task 1. Please try again.");
    }
  };

  // Submit Task 2
  const handleSubmitTask2 = async () => {
    if (!task2Photo || !mobileNumber) {
      alert("Photo upload is required for Task 2!");
      return;
    }
    
    const formData = new FormData();
    formData.append("mobile_number", mobileNumber);
    formData.append("training_photo", task2Photo);
    
    try {
      const response = await fetch(ENDPOINTS.SUBMIT_TASK2, {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) throw new Error("Failed to submit task 2");
      setTask2Status("Under Review");
    } catch (error) {
      console.error("Error submitting task 2:", error);
      alert("Failed to submit Task 2. Please try again.");
    }
  };

  // Add the handleAcceptance function
  const handleAcceptance = async () => {
    if (!mobileNumber) {
      alert("Mobile number not available. Please login again.");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.UPDATE_FELLOW_ACCEPTANCE(mobileNumber), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) throw new Error("Failed to update acceptance");
      
      setIsAccepted(true);
      setAcceptanceDate(new Date().toISOString());
      alert("Thank you for accepting the fellowship!");
    } catch (error) {
      console.error("Error updating acceptance:", error);
      alert("Failed to update acceptance. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F4F1E3] px-6 space-y-6">
      {/* Navigation Bar */}
      <div className="w-full flex items-center justify-between max-w-3xl py-4">
        <button onClick={() => navigate("/register")} className="text-walnut hover:text-earth">
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
          <p className="text-gray-700">Watch the videos to know more!</p>
        </div>

        {/* Videos Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-walnut">Videos</h3>
          <div className="space-y-3">
            {(["video1", "video2"] as const).map((vid) => (
              <div key={vid} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <a 
                  href="https://www.youtube.com/watch?v=wrjDK1w0cTw" 
                  target="_blank" 
                  onClick={() => handleVideoWatched(vid)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <PlayCircle className="w-6 h-6" /> Task {vid === "video1" ? "1" : "2"} Guidelines 
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
        <div className="bg-gray-50 p-5 rounded-lg space-y-2">
          <Label>Upload Photo of LC</Label>
          <Dropzone onDrop={(acceptedFiles) => setLcPhoto(acceptedFiles[0])}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer bg-white flex flex-col items-center justify-center">
                <input {...getInputProps()} />
                <ImageUp className="w-8 h-8 text-gray-400 mb-2" />
                {lcPhoto ? (
                  <p className="text-green-600">{lcPhoto.name}</p>
                ) : (
                  <p className="text-gray-500">Drop or Click to Upload</p>
                )}
              </div>
            )}
          </Dropzone>
        </div>

        {/* Task 1 Submit Button */}
        <Button 
          className={`w-full py-3 rounded-lg shadow-md ${
            task1Status !== "NOT_STARTED" 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-walnut text-white hover:bg-walnut/90"
          }`} 
          onClick={handleSubmitTask1}
          disabled={task1Status !== "NOT_STARTED"}
        >
          {task1Status !== "NOT_STARTED" ? "Task 1 Submitted" : "Submit Task 1"}
        </Button>
      </div>

      {/* Task 2 Container */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-walnut">Task 2: Register Children</h3>
          <span className={`px-3 py-1 rounded-md text-sm text-white ${
            task2Status === "Submitted for Review" ? "bg-yellow-500" : 
            task2Status === "Approved" ? "bg-green-500" : 
            task2Status === "Rejected" ? "bg-red-500" : "bg-gray-500"
          }`}>
            {task2Status}
          </span>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg space-y-2">
          <Label>Upload Photo of Children List</Label>
          <Dropzone onDrop={(acceptedFiles) => setTask2Photo(acceptedFiles[0])}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer bg-white flex flex-col items-center justify-center">
                <input {...getInputProps()} />
                <ImageUp className="w-8 h-8 text-gray-400 mb-2" />
                {task2Photo ? (
                  <p className="text-green-600">{task2Photo.name}</p>
                ) : (
                  <p className="text-gray-500">Drop or Click to Upload</p>
                )}
              </div>
            )}
          </Dropzone>
        </div>

        {/* Task 2 Submit Button */}
        <Button 
          className={`w-full py-3 rounded-lg shadow-md ${
            task2Status !== "NOT_STARTED" 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-walnut text-white hover:bg-walnut/90"
          }`} 
          onClick={handleSubmitTask2}
          disabled={task2Status !== "NOT_STARTED"}
        >
          {task2Status !== "NOT_STARTED" ? "Task 2 Submitted" : "Submit Task 2"}
        </Button>
      </div>

      {/* ✅ Glossary Section */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h3 
          className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center" 
          onClick={toggleGlossary}
        >
          Status Glossary
          <span>{glossaryOpen ? "▼" : "►"}</span>
        </h3>
        
        {glossaryOpen && (
          <div className="mt-4 bg-gray-50 p-5 rounded-lg space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  status: "Not Started",
                  description: "You have not started the task"
                },
                {
                  status: "Under Review",
                  description: "You have submitted the task to the District Lead for review"
                },
                {
                  status: "Sent Back",
                  description: "The District Lead has sent the task back to you asking for more details. Discuss with District Lead and submit again."
                },
                {
                  status: "Approved",
                  description: "You have cleared the application and are selected as a Bose Fellow"
                },
                {
                  status: "Not Approved",
                  description: "You could not clear the application this time, please try again later."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-3 rounded-lg">
                  <span className="font-semibold">{item.status}:</span> {item.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Status Message - Consolidated Flow */}
      {(task1Status !== "NOT_STARTED" && task2Status !== "NOT_STARTED") && (
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg text-center">
          {task1Status === "APPROVED" && task2Status === "APPROVED" ? (
            <div className="py-4 space-y-6">
              {/* Always show congratulations */}
              <div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Congratulations!</h3>
                <p className="text-green-700 mb-4">You have been selected for the Bose Fellowship.</p>
              </div>

              {/* Acceptance section */}
              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-walnut mb-4">Fellowship Acceptance</h4>
                
                {!isAccepted ? (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      By accepting this fellowship, you agree to uphold the values and responsibilities 
                      of a Bose Fellow and commit to making a positive impact in your community.
                    </p>
                    <Button
                      onClick={handleAcceptance}
                      className="w-full bg-walnut text-white hover:bg-walnut/90 py-3 rounded-lg text-lg font-medium"
                    >
                      Accept Fellowship
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
                        Accepted on {acceptanceDate ? new Date(acceptanceDate).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className="text-green-700 mb-6">
                      Thank you for accepting the Bose Fellowship. We look forward to your contributions!
                    </p>
                    
                    {/* Profile completion section - only if accepted */}
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-gray-700 my-4">We would love to know more about our new Bose Fellow.</p>
                      <button 
                        onClick={() => navigate("/child-protection-consent")} 
                        className="px-6 py-3 bg-walnut text-white rounded-lg hover:bg-walnut/90 transition-colors"
                      >
                        Complete Your Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-4">
              <h3 className="text-lg font-semibold text-walnut mb-2">Application Submitted</h3>
              <p className="text-gray-700">Your Application for Bose fellowship is now completed. Please Log In after 8 days to check your status.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
