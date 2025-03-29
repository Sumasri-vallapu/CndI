"use client"

import { Mic } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StudentAvatar } from "@/components/ui/student-avatar"
import { useNavigate } from "react-router-dom"
import { ENDPOINTS } from "@/utils/api"

const recorders = [
  { id: "student", type: "Student", count: 0 },
  { id: "parent", type: "Student's Parent", count: 2 },
  { id: "fellow", type: "Fellow Parent", count: 0 },
  { id: "supporter", type: "Supporter", count: 2 },
]

export default function RecordUserTestimonial() {
  const uploaded = recorders.reduce((acc, r) => acc + (r.count > 0 ? 1 : 0), 0)
  const total = recorders.length
  const progress = (uploaded / total) * 100

  const handleSubmit = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('recorder_type', 'unknown');
      formData.append('mobile_number', '9876543210'); // Replace with actual mobile number

      const response = await fetch(ENDPOINTS.FELLOW_TESTIMONIAL, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      });

      if (!response.ok) {
        throw new Error('Failed to upload testimonial');
      }

      const data = await response.json();
      // Handle success - maybe show success message or redirect
      
    } catch (error) {
      console.error('Error uploading testimonial:', error);
      // Handle error - show error message to user
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-6 min-h-screen bg-white">
      <div className="flex items-center justify-between mb-4">
        <button aria-label="Menu">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="#7A3D1A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-[#7A3D1A]">Record Testimonial</h1>
        <div className="w-8" /> {/* for balance */}
      </div>

      <div className="mb-6">
        <div className="text-sm text-blue-600 font-medium mb-1 text-right">
          {uploaded}/{total} uploaded
        </div>
        <Progress value={progress} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
      </div>

      <div className="space-y-4">
        {recorders.map((rec) => (
          <TestimonialCard
            key={rec.id}
            type={rec.type}
            uploadCount={rec.count}
            icon={<StudentAvatar />}
          />
        ))}
      </div>
    </div>
  )
}

type TestimonialCardProps = {
  type: string
  uploadCount: number
  icon: React.ReactNode
}

function TestimonialCard({ type, uploadCount, icon }: TestimonialCardProps) {
  const navigate = useNavigate()
  const status =
    uploadCount === 0 ? "No Audios Uploaded" : `${uploadCount} Audios Uploaded`

  return (
    <Card className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-gray-800">{type}</span>
        </div>
        <div className="flex flex-col items-center" onClick={() => navigate("/record-user-testimonial/record")}>
          <Mic className="h-6 w-6 text-[#7A3D1A]" />
          <span className="text-xs text-[#7A3D1A]">Record</span>
        </div>
      </div>

      <div className="bg-[#A86543] text-white text-sm px-4 py-2 flex justify-between items-center">
        <span>{status}</span>
        <span className="text-xl">›</span>
      </div>
    </Card>
  )
}