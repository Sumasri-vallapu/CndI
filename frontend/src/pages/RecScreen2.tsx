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

  const uploadRecording = async () => {
    const audioBase64 = sessionStorage.getItem("latestRecording")
    if (!audioBase64) return

    const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" })
    const payload = new FormData()

    payload.append("audio", audioBlob)
    payload.append("mobile_number", mobile_number)
    payload.append("stakeholder_type", stakeholder)
    payload.append("form_data", JSON.stringify(formData))

    try {
      const res = await fetch(ENDPOINTS.SAVE_USER_TESTIMONIAL_RECORDING, {
        method: "POST",
        body: payload,
      })

      if (!res.ok) throw new Error("Upload failed")
      alert("Audio uploaded successfully!")
      navigate("/record-user-testimonial")
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Try again.")
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft className="h-6 w-6 text-[#7A3D1A]" />
        </button>
        <h1 className="text-lg font-bold text-[#7A3D1A] capitalize">
          {stakeholder.replace(/-/g, " ")} Testimonial
        </h1>
        <div className="w-6" />
      </div>

      {/* Form Section */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.label}>
            <label className="block mb-1 font-medium text-gray-700">{q.label}</label>
            {q.type === "dropdown" ? (
              <Select onValueChange={(val) => handleChange(q.label, val)}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${q.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {q.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="text"
                placeholder={q.label}
                value={formData[q.label] || ""}
                onChange={(e) => handleChange(q.label, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Recording Section */}
      <div className="bg-gray-50 border p-4 rounded-xl space-y-4">
        <div className="text-center text-sm text-gray-500">Audio Recorder</div>

        <div className="text-center text-2xl font-semibold">
          <span className="text-red-500">● </span>
          {String(Math.floor(time / 60)).padStart(2, "0")}:
          {String(Math.floor(time % 60)).padStart(2, "0")}:
          {String(Math.floor((time % 1) * 10))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              if (!isRecording) startRecording()
              else if (isPaused) toggleRecording()
              else stopRecording()
            }}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-md text-white transition ${
              isRecording ? "bg-red-600" : "bg-green-600"
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
          <audio
            controls
            src={sessionStorage.getItem("latestRecording") ?? undefined}
            className="w-full mt-4"
          />
        )}

        <Button
          onClick={uploadRecording}
          disabled={!recorded}
          className="w-full bg-blue-600 text-white disabled:opacity-50"
        >
          <UploadCloud className="w-4 h-4 mr-2" /> Upload Testimonial
        </Button>
      </div>
    </div>
  )
}
