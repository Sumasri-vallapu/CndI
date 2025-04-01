"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ChevronLeft, Mic, Pause, Play, Square, UploadCloud } from "lucide-react"
import { STAKEHOLDER_QUESTIONS } from "@/utils/stakeholder_questions"
import { getLoggedInMobile } from "@/utils/session"
import { ENDPOINTS } from "@/utils/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StakeholderQuestion {
  label: string;
  type: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export default function RecordTestimonialPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const stakeholder = searchParams.get("id") || "unknown"

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [time, setTime] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const mobile_number = getLoggedInMobile()
  const questions = STAKEHOLDER_QUESTIONS[stakeholder] || []

  useEffect(() => {
    if (!mobile_number) {
      alert("Please login again.")
      navigate("/login")
    }
  }, [mobile_number])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => setTime((prev) => +(prev + 0.1).toFixed(1)), 100)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  const handleChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunks.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data)
      }

      recorder.start()
      setIsRecording(true)
      setIsPaused(false)
    } catch (err) {
      console.error("Microphone access denied or error:", err)
    }
  }

  const toggleRecording = () => {
    const recorder = mediaRecorderRef.current
    if (!recorder) {
      startRecording()
      return
    }

    if (recorder.state === "recording") {
      recorder.pause()
      setIsPaused(true)
    } else if (recorder.state === "paused") {
      recorder.resume()
      setIsPaused(false)
    }
  }

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current
    if (!recorder) return

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" })
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Audio = reader.result as string
        sessionStorage.setItem("latestRecording", base64Audio)
        setRecorded(true)
      }
      reader.readAsDataURL(audioBlob)
    }

    recorder.stop()
    setIsRecording(false)
    setIsPaused(false)
  }

  const validateForm = () => {
    const requiredFields = questions
      .filter(q => q.required)
      .map(q => q.label)

    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(", ")}`)
      return false
    }

    if (!recorded) {
      alert("Please record your testimonial before submitting")
      return false
    }

    return true
  }

  const uploadRecording = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      const audioBase64 = sessionStorage.getItem("latestRecording")
      if (!audioBase64 || !mobile_number) return

      const testimonialPayload = {
        mobile_number,
        stakeholder_type: stakeholder,
        form_data: formData,
        audio_url: audioBase64  // Send the base64 audio data
      }

      console.log('Submitting testimonial...')
      const testimonialRes = await fetch(ENDPOINTS.SUBMIT_TESTIMONIAL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testimonialPayload)
      })

      if (!testimonialRes.ok) {
        const errorData = await testimonialRes.json()
        console.error('Server response:', errorData)
        throw new Error(errorData.error || "Testimonial submission failed")
      }
      
      alert("Testimonial submitted successfully!")
      navigate("/recorder-page")
    } catch (err) {
      console.error("Error submitting testimonial:", err)
      alert(err instanceof Error ? err.message : "Failed to submit testimonial. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 min-h-screen bg-[#F4F1E3]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-walnut" />
        </button>
        <h1 className="text-xl font-bold text-walnut capitalize">
          {stakeholder.replace(/_/g, " ")} Testimonial
        </h1>
        <div className="w-10" />
      </div>

      {/* Form Section */}
      <Card className="p-6 mb-6 bg-white shadow-md rounded-xl">
        <h2 className="text-lg font-semibold text-walnut mb-4">Details</h2>
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.label} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {q.label} {q.required && <span className="text-red-500">*</span>}
              </label>
              {q.type === "dropdown" ? (
                <Select 
                  onValueChange={(val) => handleChange(q.label, val)}
                  value={formData[q.label]}
                >
                  <SelectTrigger className={cn(
                    "w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-walnut focus:border-transparent",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}>
                    <SelectValue placeholder={`Select ${q.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    {q.options?.map((opt) => (
                      <SelectItem 
                        key={opt} 
                        value={opt}
                        className={cn(
                          "py-2 px-3 text-sm cursor-pointer",
                          "hover:bg-walnut hover:text-white",
                          "focus:bg-walnut focus:text-white"
                        )}
                      >
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type="text"
                  placeholder={q.placeholder || q.label}
                  value={formData[q.label] || ""}
                  onChange={(e) => handleChange(q.label, e.target.value)}
                  className="w-full"
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recording Section */}
      <Card className="bg-white p-6 rounded-xl space-y-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-walnut">Record Audio</h2>
          <p className="text-sm text-gray-500 mt-1">Share your experience</p>
        </div>

        <div className="text-center text-3xl font-semibold font-mono">
          <span className={`${isRecording ? "text-red-500" : "text-gray-400"}`}>●</span>
          {String(Math.floor(time / 60)).padStart(2, "0")}:
          {String(Math.floor(time % 60)).padStart(2, "0")}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              if (!isRecording) startRecording()
              else if (isPaused) toggleRecording()
              else stopRecording()
            }}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg text-white transition-all transform hover:scale-105 ${
              isRecording ? "bg-red-500 hover:bg-red-600" : "bg-walnut hover:bg-walnut/90"
            }`}
          >
            {isRecording ? (
              isPaused ? <Play className="h-8 w-8" /> : <Square className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </button>
        </div>

        {typeof window !== "undefined" && sessionStorage.getItem("latestRecording") && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <audio
              controls
              src={sessionStorage.getItem("latestRecording") ?? undefined}
              className="w-full"
            />
          </div>
        )}

        <Button
          onClick={uploadRecording}
          disabled={!recorded || Object.keys(formData).length === 0 || isSubmitting}
          className="w-full bg-walnut hover:bg-walnut/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Submitting...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 mr-2" /> 
              Submit Testimonial
            </>
          )}
        </Button>
      </Card>
    </div>
  )
}
