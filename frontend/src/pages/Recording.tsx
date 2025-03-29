"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, Mic, Pause, Play, Square } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { ENDPOINTS } from "@/utils/api"

export default function RecordAudioPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const recorderId = searchParams.get("id") || "unknown"

  const [time, setTime] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => setTime((prev) => +(prev + 0.1).toFixed(1)), 100)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  // Start recording
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
    } catch (err) {
      console.error("Microphone access denied or error:", err)
    }
  }

  // Pause/Resume toggle
  const toggleRecording = () => {
    const recorder = mediaRecorderRef.current
    if (!recorder) return

    if (recorder.state === "recording") {
      recorder.pause()
      setIsRecording(false)
    } else if (recorder.state === "paused") {
      recorder.resume()
      setIsRecording(true)
    }
  }

  // Stop and upload
  const stopAndUpload = async () => {
    const recorder = mediaRecorderRef.current
    if (!recorder) return

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" })

      // ✅ Save to sessionStorage
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Audio = reader.result as string
        sessionStorage.setItem("latestRecording", base64Audio)
      }
      reader.readAsDataURL(audioBlob)

      // ✅ Upload to backend
      const formData = new FormData()
      formData.append("audio", audioBlob)
      formData.append("recorder_type", recorderId)
      formData.append("mobile_number", "9876543210") // replace with actual user mobile

      try {
        const response = await fetch(ENDPOINTS.SAVE_USER_TESTIMONIAL_RECORDING, {
          method: 'POST',
          body: formData,
        })

        console.log('response', response)
        const data = await response.json()
        if (!response.ok) throw new Error(data.detail || "Upload failed")

        alert("Audio uploaded successfully!")
        navigate(-1)
      } catch (err: any) {
        console.error("Upload failed:", err)
        alert(err.message)
      }
    }

    recorder.stop()
    setIsRecording(false)
  }

  return (
    <div className="h-screen flex flex-col items-center justify-between px-4 pt-6 pb-10 bg-white text-[#111]">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-base font-semibold text-gray-700">Standard</h1>
        <Mic className="h-5 w-5 text-green-600" />
      </div>

      {/* Timer */}
      <div className="mt-12 text-4xl font-medium tracking-wide text-gray-800">
        <span className="text-red-600">● </span>
        {String(Math.floor(time / 60)).padStart(2, "0")}:
        {String(Math.floor(time % 60)).padStart(2, "0")}.
        {String(Math.floor((time % 1) * 10))}
      </div>

      {/* Audio Preview */}
      {typeof window !== "undefined" && sessionStorage.getItem("latestRecording") && (
        <div className="mt-6 w-full flex justify-center">
          <audio
            controls
            src={sessionStorage.getItem("latestRecording") ?? undefined}
            className="w-full max-w-md"
          />
        </div>
      )}

      {/* Bottom controls */}
      <div className="flex items-center justify-around w-full mt-auto">
        <button onClick={startRecording} disabled={isRecording}>
          <Play className="h-7 w-7 text-gray-700" />
        </button>
        <button
          className="bg-gray-200 p-4 rounded-full"
          onClick={toggleRecording}
          disabled={!mediaRecorderRef.current}
        >
          {isRecording ? (
            <Pause className="h-6 w-6 text-gray-800" />
          ) : (
            <Mic className="h-6 w-6 text-gray-800" />
          )}
        </button>
        <button onClick={stopAndUpload} disabled={!mediaRecorderRef.current}>
          <Square className="h-7 w-7 text-black" />
        </button>
      </div>
    </div>
  )
}
