// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { FormInput } from "@/components/ui/FormInput";
// import { FormSelect } from "@/components/ui/FormSelect";
// import { Upload, Camera, User } from "lucide-react";
// import { ProfilePhoto } from "@/components/ui/ProfilePhoto"; // adjust path if needed
// import { useEffect } from "react";
// import { ENDPOINTS } from "@/utils/api";


// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { ArrowLeft } from "lucide-react";

// const ChildProfile = () => {
//   const navigate = useNavigate();

//   // Section toggles
//   const [isPersonalExpanded, setIsPersonalExpanded] = useState(false);
//   const [isEduExpanded, setIsEduExpanded] = useState(false);
//   const [isParentExpanded, setIsParentExpanded] = useState(false);
//   const [isLearningExpanded, setIsLearningExpanded] = useState(false);

//   // Section edit modes
//   const [isEditingPersonal, setIsEditingPersonal] = useState(true);
//   const [isEditingEdu, setIsEditingEdu] = useState(true);
//   const [isEditingParent, setIsEditingParent] = useState(true);
//   const [isEditingLearning, setIsEditingLearning] = useState(true);


//   const [formData, setFormData] = useState({
//     fullName: "",
//     gender: "",
//     caste: "",
//     dob: "",
//     state: "",
//     district: "",
//     mandal: "",
//     grampanchayat: "",
//     parentMobile: "",

//     schoolName: "",
//     typeOfSchool: "",
//     childClass: "",
    

//     motherName: "",
//     fatherName: "",
//     motherOccupation: "",
//     fatherOccupation: "",

//     speakingLevel: "",
//     readingLevel: "",
//     Status: "",
//   });

//   const [childPhoto, setChildPhoto] = useState<File | null>(null);
//   const [childPhotoPreviewUrl, setChildPhotoPreviewUrl] = useState<string | null>(null);


//   const [mobileError, setMobileError] = useState("");

//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [mandals, setMandals] = useState([]);
//   const [gramPanchayats, setGramPanchayats] = useState([]);

//   // Fetch states on component load
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const res = await fetch(ENDPOINTS.GET_STATES);
//         const data = await res.json();
//         setStates(data);
//       } catch (error) {
//         console.error("Failed to fetch states:", error);
//       }
//     };
//     fetchStates();
//   }, []);

//   // Fetch Districts on state change
//   useEffect(() => {
//     const fetchDistricts = async () => {
//       if (formData.state) {
//         try {
//           const res = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state=${formData.state}`);
//           const data = await res.json();
//           setDistricts(data);
//         } catch (error) {
//           console.error("Failed to fetch districts:", error);
//         }
//       } else {
//         setDistricts([]);
//       }
//     };
//     fetchDistricts();
//   }, [formData.state]);

//   // Fetch Mandals on district change

//   useEffect(() => {
//     const fetchMandals = async () => {
//       if (formData.district) {
//         try {
//           const res = await fetch(`${ENDPOINTS.GET_MANDALS}?district=${formData.district}`);
//           const data = await res.json();
//           setMandals(data);
//         } catch (error) {
//           console.error("Failed to fetch mandals:", error);
//         }
//       } else {
//         setMandals([]);
//       }
//     };
//     fetchMandals();
//   }, [formData.district]);

//   // Fetch Grampanchayats on mandal change
//   useEffect(() => {
//     const fetchGrampanchayats = async () => {
//       if (formData.mandal) {
//         try {
//           const res = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal=${formData.mandal}`);
//           const data = await res.json();
//           console.log('Fetched Grampanchayats:', data); // Add this line
//           setGramPanchayats(data);
//         } catch (error) {
//           console.error("Failed to fetch grampanchayats:", error);
//         }
//       } else {
//         setGramPanchayats([]);
//       }
//     };
//     fetchGrampanchayats();
//   }, [formData.mandal]);



//   const handleChange = (field: string, value: string) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: value,
//       ...(field === 'state' && { district: '', mandal: '', grampanchayat: '' }),
//       ...(field === 'district' && { mandal: '', grampanchayat: '' }),
//       ...(field === 'mandal' && { grampanchayat: '' }),
//     }));
//   };

//   const validateMobile = (value: string) => {
//     if (!/^[0-9]{10}$/.test(value)) {
//       setMobileError("Please enter a valid 10-digit mobile number");
//     } else {
//       setMobileError("");
//     }
//     handleChange("parentMobile", value);
//   };

//   {/* Handle Save for Personal Details */ }

//   const handleSavePersonalDetails = async () => {
//     const childId = localStorage.getItem("child_id");
//     const payload = {
//       id: childId,
//       mobile_number: localStorage.getItem("mobile_number"),
//       full_name: formData.fullName,
//       gender: formData.gender,
//       caste: formData.caste,
//       dob: formData.dob,
//       parent_mobile: formData.parentMobile,
//       state: formData.state,
//       district: formData.district,
//       mandal: formData.mandal,
//       grampanchayat: formData.grampanchayat,
//     };

//     // TODO: Uncomment and update the endpoint when ready
//     /*
//     try {
//       const res = await fetch(ENDPOINTS.SAVE_CHILD_PROFILE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
  
//       const result = await res.json();
  
//       if (res.ok && result.status === "success") {
//         alert("Personal details saved successfully");
//       } else {
//         alert("Failed to save personal details");
//         console.error(result);
//       }
//     } catch (error) {
//       console.error("Save failed:", error);
//       alert("Something went wrong");
//     }
//     */

//     alert("Personal details save simulated (endpoint coming soon)");
//   };


//   const handleSaveEducation = async () => {
//     const childId = localStorage.getItem("child_id");
//     const fellowMobile = localStorage.getItem("mobile_number");

//     const payload = {
//       id: childId,
//       mobile_number: fellowMobile,
//       school_name: formData.schoolName,
//       type_of_school: formData.typeOfSchool,
//       child_class: formData.childClass,
//     };

//     // try {
//     //   const res = await fetch(`${ENDPOINTS.SAVE_CHILD_PROFILE}`, {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify(payload),
//     //   });

//     //   const result = await res.json();

//     //   if (res.ok && result.status === "success") {
//     //     alert("Saved successfully");
//     //   } else {
//     //     alert("Failed to save educational details");
//     //     console.error(result);
//     //   }
//     // } catch (error) {
//     //   console.error("Save failed:", error);
//     //   alert("Something went wrong");
//     // }

//     alert("Save function triggered — backend not connected yet");

//   };

//   const handleSaveParentDetails = async () => {
//     const childId = localStorage.getItem("child_id");
//     const payload = {
//       id: childId,
//       mobile_number: localStorage.getItem("mobile_number"),
//       mother_name: formData.motherName,
//       father_name: formData.fatherName,
//       mother_occupation: formData.motherOccupation,
//       father_occupation: formData.fatherOccupation,
//     };

//     // TODO: Uncomment when endpoint is ready
//     /*
//     try {
//       const response = await fetch(ENDPOINTS.SAVE_CHILD_PROFILE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         alert("Saved parent details");
//       } else {
//         alert("Failed to save parent details");
//       }
//     } catch (err) {
//       console.error("Save error:", err);
//       alert("Something went wrong");
//     }
//     */
//     alert("Parent details saved (dummy)");
//   };

//   const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setChildPhoto(file);
//       setChildPhotoPreviewUrl(URL.createObjectURL(file));
//     }
//   };


//   const handleSaveLearningDetails = async () => {
//     const childId = localStorage.getItem("child_id");

//     const uploadPayload = {
//       speaking_level: formData.speakingLevel,
//       reading_level: formData.readingLevel,
//       status: formData.Status,
//     };

//     if (childPhoto) {
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const base64Photo = reader.result;
//         await saveLearningToBackend({ ...uploadPayload, child_photo_s3_url: base64Photo });
//       };
//       reader.readAsDataURL(childPhoto);
//     } else {
//       await saveLearningToBackend(uploadPayload);
//     }

//   };

//   const saveLearningToBackend = async (payload: any) => {
//     // COMMENTED OUT until endpoint is ready
//     /*
//     try {
//       const res = await fetch(ENDPOINTS.SAVE_CHILD_PROFILE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: localStorage.getItem("child_id"),
//           mobile_number: localStorage.getItem("mobile_number"),
//           ...payload,
//         }),
//       });
  
//       const result = await res.json();
//       if (res.ok && result.status === "success") {
//         alert("Learning details saved");
//       } else {
//         alert("Failed to save learning details");
//       }
//     } catch (err) {
//       console.error("Error saving learning details", err);
//       alert("Something went wrong");
//     }
//     */
//     alert("🧠 Learning details save simulated (endpoint coming soon)");
//   };

//   // After saveLearningToBackend

//   const handleStateChange = async (stateId: string) => {
//     handleChange("state", stateId);
//     handleChange("district", "");
//     handleChange("mandal", "");
//     handleChange("village", "");

//     const res = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${stateId}`);
//     const data = await res.json();
//     setDistricts(data);
//   };

//   const handleDistrictChange = async (districtId: string) => {
//     handleChange("district", districtId);
//     handleChange("mandal", "");
//     handleChange("village", "");

//     const res = await fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${districtId}`);
//     const data = await res.json();
//     setMandals(data);
//   };

//   const handleMandalChange = async (mandalId: string) => {
//     handleChange("mandal", mandalId);
//     handleChange("village", "");

//     const res = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${mandalId}`);
//     const data = await res.json();
//     setGramPanchayats(data);
//   };


//   return (
//     <div className="relative flex flex-col items-center min-h-screen bg-[#F4F1E3] px-4 py-6">
//       {/* Top Bar */}
//       <div className="w-full flex items-center justify-between max-w-3xl py-4">
//         <button
//           onClick={() => navigate("/main")}
//           className="text-walnut hover:text-earth flex items-center gap-2"
//         >
//           <ArrowLeft size={20} />
//           <span className="text-base font-medium">Back</span>
//         </button>
//         <button
//           onClick={() => {
//             localStorage.removeItem("mobile_number");
//             navigate("/login");
//           }}
//           className="bg-walnut text-white px-4 py-2 rounded-lg text-sm"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Main Content Container */}
//       <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">

//         {/* Profile Photo Upload Circle */}
//         <div className="flex flex-col items-center mb-6">
//           <div className="relative">
//             {/* Profile preview or placeholder */}
//             <label htmlFor="child-photo-upload">
//               {childPhotoPreviewUrl ? (
//                 <img
//                   src={childPhotoPreviewUrl}
//                   alt="Child Profile"
//                   className="w-24 h-24 rounded-full object-cover border-2 border-walnut cursor-pointer"
//                 />
//               ) : (
//                 <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-walnut">
//                   <User className="text-walnut w-16 h-16" />
//                 </div>
//               )}
//             </label>

//             {/* Camera Icon Overlay */}
//             <label htmlFor="child-photo-upload">
//               <div className="absolute bottom-0 right-0 bg-walnut p-2 rounded-full cursor-pointer">
//                 <Camera className="text-white w-5 h-5" />
//               </div>
//             </label>

//             {/* Hidden File Input */}
//             <input
//               id="child-photo-upload"
//               type="file"
//               accept="image/*"
//               onChange={handleUploadPhoto}
//               className="hidden"
//             />

//           </div>
//           {/* ✅ Name Label Below Photo */}
//           <div className="text-sm font-bold text-walnut mt-4 text-center">
//             Upload Child Photo
//           </div>
//         </div>


//         {/* Collapsible Section */}
//         <div className="p-6 rounded-lg shadow-md mt-6">
//           <div
//             onClick={() => setIsPersonalExpanded(!isPersonalExpanded)}
//             className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
//           >
//             <span>Child Personal Details</span>
//             <span>{isPersonalExpanded ? "▼" : "►"}</span>
//           </div>

//           {isPersonalExpanded && (
//             <div className="transition-all duration-300 ease-in-out mt-4 space-y-4">
//               {!isEditingPersonal ? (
//                 <>
//                   <div className="space-y-2">
//                     <Label>Full Name</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.fullName || "Please Provide"}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Gender</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.gender || "Please Provide"}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Caste Category</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.caste || "Please Provide"}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Date of Birth</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.dob || "Please Provide"}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Parent WhatsApp Number</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.parentMobile || "Please Provide"}
//                     </p>
//                   </div>

//                   {["State", "District", "Mandal", "Grampanchayat"].map((label) => (
//                     <div className="space-y-2" key={label}>
//                       <Label>{label}</Label>
//                       <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                         {formData[label.toLowerCase() as keyof typeof formData] || "Please Provide"}
//                       </p>
//                     </div>
//                   ))}

//                   <Button
//                     onClick={() => setIsEditingPersonal(true)}
//                     className="w-full bg-walnut text-white"
//                   >
//                     Edit
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <FormInput
//                     label="Full Name"
//                     value={formData.fullName}
//                     onChange={(e) => handleChange("fullName", e.target.value)}
//                     placeholder="Enter full name"
//                   />

//                   <FormSelect
//                     label="Gender"
//                     value={formData.gender}
//                     onChange={(val) => handleChange("gender", val)}
//                     options={["MALE", "FEMALE", "OTHER"]}
//                   />

//                   <FormSelect
//                     label="Caste Category"
//                     value={formData.caste}
//                     onChange={(val) => handleChange("caste", val)}
//                     options={["SC", "ST", "BC", "OBC", "OC", "MUSLIM", "CHRISTIAN", "OTHER"]}
//                   />

//                   <FormInput
//                     label="Date of Birth"
//                     type="date"
//                     value={formData.dob}
//                     onChange={(e) => handleChange("dob", e.target.value)}
//                     placeholder="Enter date of birth"
//                   />

//                   <FormInput
//                     label="Parent WhatsApp Number"
//                     type="tel"
//                     value={formData.parentMobile}
//                     onChange={(e) => validateMobile(e.target.value)}
//                     placeholder="Enter 10-digit mobile number"
//                     error={mobileError}
//                   />

//                   {/* State Dropdown */}
//                   <div className="space-y-2">
//                     <Label>State</Label>
//                     <Select
//                       value={formData.state}
//                       onValueChange={(val) => handleChange('state', val)}
//                     >
//                       <SelectTrigger className="w-full border-[1px] text-gray-500 border-gray-300 focus-visible:border-[#7A3D1A] focus-visible:ring-[#7A3D1A]/40">
//                         <SelectValue placeholder="Select State" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white shadow-md border border-gray-200 z-[1000]">
//                         {states.map((state) => (
//                           <SelectItem key={state.id} value={state.name}>
//                             {state.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* District Dropdown */}
//                   <div className="space-y-2">
//                     <Label>District</Label>
//                     <Select
//                       value={formData.district}
//                       onValueChange={(val) => handleChange('district', val)}
//                       disabled={!formData.state}
//                     >
//                       <SelectTrigger className="w-full border-[1px] text-gray-500 border-gray-300 focus-visible:border-[#7A3D1A] focus-visible:ring-[#7A3D1A]/40">
//                         <SelectValue placeholder="Select District" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white shadow-md border border-gray-200 z-[1000]">
//                         {districts.map((district) => (
//                           <SelectItem key={district.id} value={district.name}>
//                             {district.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Mandal Dropdown */}
//                   <div className="space-y-2">
//                     <Label>Mandal</Label>
//                     <Select
//                       value={formData.mandal}
//                       onValueChange={(val) => handleChange('mandal', val)}
//                       disabled={!formData.district}
//                     >
//                       <SelectTrigger className="w-full border-[1px] text-gray-500 border-gray-300 focus-visible:border-[#7A3D1A] focus-visible:ring-[#7A3D1A]/40">
//                         <SelectValue placeholder="Select Mandal" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white shadow-md border border-gray-200 z-[1000]">
//                         {mandals.map((mandal) => (
//                           <SelectItem key={mandal.id} value={mandal.name}>
//                             {mandal.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Grampanchayat Dropdown */}
//                   <div className="space-y-2">
//                     <Label>Grampanchayat</Label>
//                     <Select
//                       value={formData.grampanchayat}
//                       onValueChange={(val) => handleChange('grampanchayat', val)}
//                       disabled={!formData.mandal}
//                     >
//                       <SelectTrigger className="w-full border-[1px] text-gray-500 border-gray-300 focus-visible:border-[#7A3D1A] focus-visible:ring-[#7A3D1A]/40">
//                         <SelectValue placeholder="Select Grampanchayat" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white shadow-md border border-gray-200 z-[1000]">
//                         {gramPanchayats.map((gp) => (
//                           <SelectItem key={gp.id} value={gp.name}>
//                             {gp.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>


//                   <div className="flex flex-col gap-4 pt-4">
//                     <Button
//                       onClick={() => setIsEditingPersonal(false)}
//                       className="w-full bg-walnut text-white"
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={() => {
//                         setIsEditingPersonal(false);
//                         handleSavePersonalDetails();
//                       }}
//                       className="w-full bg-green-600 text-white"
//                     >
//                       Save Changes
//                     </Button>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}


//         </div>


//         {/* Child Educational Details */}
//         <div className="p-6 rounded-lg shadow-md mt-6">
//           <div
//             onClick={() => setIsEduExpanded(!isEduExpanded)}
//             className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
//           >
//             <span>Child Educational Details</span>
//             <span>{isEduExpanded ? "▼" : "►"}</span>
//           </div>

//           {isEduExpanded && (
//             <div className="mt-4 space-y-4">
//               {!isEditingEdu ? (
//                 <>
//                   <div className="space-y-2">
//                     <Label>School Name</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.schoolName || "Please Provide"}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Type of School</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.typeOfSchool || "Please Provide"}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Class</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.childClass || "Please Provide"}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Status</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.Status || "Please Provide"}
//                     </p>
//                   </div>

//                   <Button
//                     onClick={() => setIsEditingEdu(true)}
//                     className="w-full bg-walnut text-white"
//                   >
//                     Edit
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <FormInput
//                     label="School Name"
//                     value={formData.schoolName}
//                     onChange={(e) => handleChange("schoolName", e.target.value)}
//                     placeholder="Enter school name"
//                   />

//                   <FormSelect
//                     label="Type of School"
//                     value={formData.typeOfSchool}
//                     onChange={(val) => handleChange("typeOfSchool", val)}
//                     options={["GOVERNMENT", "PRIVATE", "TWPS", "ASHRAM", "OTHER"]}
//                   />

//                   <FormSelect
//                     label="Class"
//                     value={formData.childClass}
//                     onChange={(val) => handleChange("childClass", val)}
//                     options={["out_of_school", "3", "4", "5", "6", "7", "8", "Other"]}
//                   />

//                   <div className="flex flex-col gap-4 pt-4">
//                     <Button
//                       onClick={() => setIsEditingEdu(false)}
//                       className="w-full bg-walnut text-white"
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={() => {
//                         setIsEditingEdu(false);
//                         handleSaveEducation();
//                       }}
//                       className="w-full bg-green-600 text-white"
//                     >
//                       Save Changes
//                     </Button>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}


//         </div>


//         {/* Parent/Guardian Details */}
//         <div className="p-6 rounded-lg shadow-md mt-6">
//           <div
//             onClick={() => setIsParentExpanded(!isParentExpanded)}
//             className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
//           >
//             <span>Parent / Guardian Details</span>
//             <span>{isParentExpanded ? "▼" : "►"}</span>
//           </div>

//           {isParentExpanded && (
//             <div className="mt-4 space-y-4">
//               {!isEditingParent ? (
//                 <>
//                   <div className="space-y-2">
//                     <Label>Mother's Name</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.motherName || "Please Provide"}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Mother's Occupation</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.motherOccupation || "Please Provide"}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Father's Name</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.fatherName || "Please Provide"}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Father's Occupation</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.fatherOccupation || "Please Provide"}
//                     </p>
//                   </div>

//                   <Button
//                     onClick={() => setIsEditingParent(true)}
//                     className="w-full bg-walnut text-white"
//                   >
//                     Edit
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <FormInput
//                     label="Mother's Name"
//                     value={formData.motherName}
//                     onChange={(e) => handleChange("motherName", e.target.value)}
//                     placeholder="Enter mother's name"
//                   />
//                   <FormSelect
//                     label="Mother's Occupation"
//                     value={formData.motherOccupation}
//                     onChange={(val) => handleChange("motherOccupation", val)}
//                     options={[
//                       "Home Maker",
//                       "Tailor",
//                       "Agricultural Labour",
//                       "Construction Labour",
//                       "Daily Wage Worker",
//                       "School Teacher",
//                       "Anganwadi Teacher",
//                       "DWCRA Member",
//                       "Factory Worker",
//                       "Expired",
//                       "Other",
//                     ]}
//                   />
//                   <FormInput
//                     label="Father's Name"
//                     value={formData.fatherName}
//                     onChange={(e) => handleChange("fatherName", e.target.value)}
//                     placeholder="Enter father's name"
//                   />
//                   <FormSelect
//                     label="Father's Occupation"
//                     value={formData.fatherOccupation}
//                     onChange={(val) => handleChange("fatherOccupation", val)}
//                     options={[
//                       "Tailor",
//                       "Agricultural Labour",
//                       "Construction Labour",
//                       "Daily Wage Worker",
//                       "School Teacher",
//                       "Factory Worker",
//                       "Expired",
//                       "Plumber",
//                       "Electrician",
//                       "Driver",
//                       "Business",
//                       "Other",
//                     ]}
//                   />
//                   <div className="flex flex-col gap-4 pt-4">
//                     <Button
//                       onClick={() => setIsEditingParent(false)}
//                       className="w-full bg-walnut text-white"
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={() => {
//                         setIsEditingParent(false);
//                         handleSaveParentDetails();
//                       }}
//                       className="w-full bg-green-600 text-white"
//                     >
//                       Save Changes
//                     </Button>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}


//         </div>


//         {/* Learning Details */}
//         <div className="p-6 rounded-lg shadow-md mt-6">
//           <div
//             onClick={() => setIsLearningExpanded(!isLearningExpanded)}
//             className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
//           >
//             <span>Child Learning Details</span>
//             <span>{isLearningExpanded ? "▼" : "►"}</span>
//           </div>
//           {isLearningExpanded && (
//             <div className="mt-4 space-y-4">
//               {!isEditingLearning ? (
//                 <>
//                   <div className="space-y-2">
//                     <Label>Child's Speaking Level</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.speakingLevel || "Please Provide"}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Child's Reading Level</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.readingLevel || "Please Provide"}
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Status</Label>
//                     <p className="bg-gray-100 p-3 rounded text-gray-700 text-base">
//                       {formData.Status || "Please Provide"}
//                     </p>
//                   </div>


//                   <Button
//                     onClick={() => setIsEditingLearning(true)}
//                     className="w-full bg-walnut text-white"
//                   >
//                     Edit
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <FormSelect
//                     label="Child's Speaking Level"
//                     value={formData.speakingLevel}
//                     onChange={(val) => handleChange("speakingLevel", val)}
//                     options={["BEGINNER", "INTERMEDIATE", "ADVANCED"]}
//                   />

//                   <FormSelect
//                     label="Child’s Reading Level"
//                     value={formData.readingLevel}
//                     onChange={(val) => handleChange("readingLevel", val)}
//                     options={["BEGINNER", "INTERMEDIATE", "ADVANCED"]}
//                   />

//                   <FormSelect
//                     label="Status"
//                     value={formData.Status}
//                     onChange={(val) => handleChange("Status", val)}
//                     options={["ACTIVE", "DROPPED OUT"]}
//                   />

//                   <div className="flex flex-col gap-4 pt-4">
//                     <Button
//                       onClick={() => setIsEditingLearning(false)}
//                       className="w-full bg-walnut text-white"
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={() => {
//                         setIsEditingLearning(false);
//                         handleSaveLearningDetails();
//                       }}
//                       className="w-full bg-green-600 text-white"
//                     >
//                       Save Changes
//                     </Button>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}


//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChildProfile;
