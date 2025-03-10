// import { useState, useRef } from "react";
// import { Mic, MicOff, Trash, PlayCircle } from "lucide-react"; // Icons

// export default function AnnualTestimonial() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [audioURL, setAudioURL] = useState<string | null>(null);
//   const [testimonials, setTestimonials] = useState<{ id: number; url: string; timestamp: string }[]>([]);
//   const [selectedStakeholder, setSelectedStakeholder] = useState("");

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);

//   // Function to Start Recording
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//         const audioURL = URL.createObjectURL(audioBlob);
//         setAudioBlob(audioBlob);
//         setAudioURL(audioURL);
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Error accessing microphone:", error);
//     }
//   };

//   // Function to Stop Recording
//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // Function to Submit Testimonial
//   const submitTestimonial = () => {
//     if (audioURL) {
//       const newTestimonial = {
//         id: testimonials.length + 1,
//         url: audioURL,
//         timestamp: new Date().toLocaleTimeString(),
//       };
//       setTestimonials([...testimonials, newTestimonial]);
//       setAudioURL(null);
//     }
//   };

//   // Function to Delete Testimonial
//   const deleteTestimonial = (id: number) => {
//     setTestimonials(testimonials.filter((t) => t.id !== id));
//   };

//   return (
//     <div className="min-h-screen bg-[#F3EBE6] p-6 flex flex-col">
//       {/* Header */}
//       <h1 className="text-[24px] font-bold text-[#7A3D1A] text-center">Annual Testimonial Recording</h1>

//       {/* Stakeholder Dropdown */}
//       <div className="mt-4">
//         <label className="block text-[#7A3D1A] font-medium mb-2">Select Stakeholder:</label>
//         <select
//           className="w-full p-3 border border-[#A86543] rounded-md text-[#7A3D1A] bg-white"
//           value={selectedStakeholder}
//           onChange={(e) => setSelectedStakeholder(e.target.value)}
//         >
//           <option value="">Choose Stakeholder</option>
//           <option value="Teacher">Teacher</option>
//           <option value="Student">Student</option>
//           <option value="Parent">Parent</option>
//           <option value="Volunteer">Volunteer</option>
//           <option value="Admin">Admin</option>
//         </select>
//       </div>

//       {/* Recording Buttons */}
//       <div className="mt-6 flex flex-col items-center">
//         {!isRecording ? (
//           <button
//             onClick={startRecording}
//             className="w-full max-w-[300px] bg-[#7A3D1A] text-white flex items-center justify-center gap-2 px-6 py-3 rounded-md shadow-md"
//           >
//             <Mic size={20} />
//             Start Recording
//           </button>
//         ) : (
//           <button
//             onClick={stopRecording}
//             className="w-full max-w-[300px] bg-red-600 text-white flex items-center justify-center gap-2 px-6 py-3 rounded-md shadow-md"
//           >
//             <MicOff size={20} />
//             Stop Recording
//           </button>
//         )}
//       </div>

//       {/* Play & Submit Buttons */}
//       {audioURL && (
//         <div className="mt-4 flex flex-col items-center">
//           <audio controls className="w-full max-w-[300px]">
//             <source src={audioURL} type="audio/webm" />
//             Your browser does not support the audio element.
//           </audio>
//           <button
//             onClick={submitTestimonial}
//             className="mt-2 w-full max-w-[300px] bg-[#7A3D1A] text-white py-2 rounded-md"
//           >
//             Submit Testimonial
//           </button>
//         </div>
//       )}

//       {/* Recorded Testimonials List */}
//       {testimonials.length > 0 && (
//         <div className="mt-6">
//           <h2 className="text-[20px] font-semibold text-[#7A3D1A]">Recorded Testimonials</h2>
//           <div className="mt-2 space-y-2">
//             {testimonials.map((testimonial) => (
//               <div key={testimonial.id} className="flex justify-between items-center p-3 bg-white rounded-md shadow-md">
//                 <div className="flex items-center gap-2 text-[#7A3D1A]">
//                   <PlayCircle size={20} />
//                   <audio controls className="w-full max-w-[200px]">
//                     <source src={testimonial.url} type="audio/webm" />
//                   </audio>
//                   <span className="text-[#A86543] text-sm">{testimonial.timestamp}</span>
//                 </div>
//                 <button onClick={() => deleteTestimonial(testimonial.id)} className="text-red-600">
//                   <Trash size={20} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client"

// import type React from "react"

// import { useState } from "react"
// import { z } from "zod"

// const formSchema = z.object({
//   fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
//   gender: z.string().min(1, { message: "Gender is required" }),
//   casteCategory: z.string().min(1, { message: "Caste category is required" }),
//   dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
//   state: z.string().min(1, { message: "State is required" }),
//   district: z.string().min(1, { message: "District is required" }),
//   mandal: z.string().min(1, { message: "Mandal is required" }),
//   village: z.string().min(1, { message: "Village is required" }),
// })

// type FormData = z.infer<typeof formSchema>

// export default function RegistrationForm() {
//   const [formData, setFormData] = useState<FormData>({
//     fullName: "",
//     gender: "",
//     casteCategory: "",
//     dateOfBirth: "",
//     state: "",
//     district: "",
//     mandal: "",
//     village: "",
//   })

//   const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))

//     // Clear error when user types
//     if (errors[name as keyof FormData]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: undefined,
//       }))
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       // Validate form data
//       const validatedData = formSchema.parse(formData)

//       // Here you would typically send the data to your API
//       console.log("Form submitted:", validatedData)

//       // Show success message or redirect
//       alert("Registration successful!")

//       // Reset form
//       setFormData({
//         fullName: "",
//         gender: "",
//         casteCategory: "",
//         dateOfBirth: "",
//         state: "",
//         district: "",
//         mandal: "",
//         village: "",
//       })
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         // Convert Zod errors to a more usable format
//         const fieldErrors: Partial<Record<keyof FormData, string>> = {}
//         error.errors.forEach((err) => {
//           if (err.path[0]) {
//             fieldErrors[err.path[0] as keyof FormData] = err.message
//           }
//         })
//         setErrors(fieldErrors)
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="border border-blue-500 rounded-md p-4 space-y-3">
//         <div>
//           <input
//             type="text"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//           {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
//         </div>

//         <div>
//           <input
//             type="text"
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             placeholder="Gender"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//           {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
//         </div>

//         <div>
//           <input
//             type="text"
//             name="casteCategory"
//             value={formData.casteCategory}
//             onChange={handleChange}
//             placeholder="Caste category"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//           {errors.casteCategory && <p className="text-red-500 text-sm mt-1">{errors.casteCategory}</p>}
//         </div>

//         <div>
//           <input
//             type="date"
//             name="dateOfBirth"
//             value={formData.dateOfBirth}
//             onChange={handleChange}
//             placeholder="Date of Birth"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//           {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
//         </div>

//         <div>
//           <input
//             type="text"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             placeholder="State"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//           {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
//         </div>

//         <div>
//           <input
//             type="text"
//             name="district"
//             value={formData.district}
//             onChange={handleChange}
//             placeholder="District"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//           {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
//         </div>

//         <div>
//           <input
//             type="text"
//             name="mandal"
//             value={formData.mandal}
//             onChange={handleChange}
//             placeholder="Mandal"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//           {errors.mandal && <p className="text-red-500 text-sm mt-1">{errors.mandal}</p>}
//         </div>

//         <div>
//           <input
//             type="text"
//             name="village"
//             value={formData.village}
//             onChange={handleChange}
//             placeholder="Village"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//           {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village}</p>}
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full py-3 px-4 bg-[#a06b4e] hover:bg-[#8d5e44] text-white font-medium rounded-md transition-colors"
//       >
//         {isSubmitting ? "Submitting..." : "Submit Details"}
//       </button>
//     </form>
//   )
// }

