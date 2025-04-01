"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, Mic, Pause, Play, Square, UploadCloud } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { ENDPOINTS } from "@/utils/api"
import { getLoggedInMobile } from "@/utils/session"

export default function RecordAudioPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const recorderId = searchParams.get("id") || "unknown"

  const [time, setTime] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recorded, setRecorded] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const mobile_number = getLoggedInMobile()
  if (!mobile_number) {
    alert("Please login again.")
    return null
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => setTime((prev) => +(prev + 0.1).toFixed(1)), 100)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

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

    const formData = new FormData()
    formData.append("audio", audioBlob)
    formData.append("recorder_type", recorderId)
    formData.append("mobile_number", mobile_number)

    try {
      const response = await fetch(ENDPOINTS.SAVE_USER_TESTIMONIAL_RECORDING, {
        method: "POST",
        body: formData,
      })

      const contentType = response.headers.get("content-type")
      let data = {}

      if (contentType?.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.warn("Non-JSON response:", text)
      }

      if (!response.ok) throw new Error((data as any)?.detail || "Upload failed")

      alert("Audio uploaded successfully!")
      navigate(-1)
    } catch (err: any) {
      console.error("Upload failed:", err)
      alert(err.message || "Something went wrong")
    }
  }

  return (
    <div
      className={`h-screen flex flex-col items-center justify-between px-4 pt-6 pb-10 transition-all duration-500 ${
        isRecording ? "bg-[#7A3D1A]" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center text-white">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold tracking-wide">Record Audio</h1>
        <Mic className="h-5 w-5" />
      </div>

      {/* Timer */}
      <div className="mt-16 text-5xl font-semibold tracking-wider text-white">
        <span className="text-red-400">● </span>
        {String(Math.floor(time / 60)).padStart(2, "0")}:
        {String(Math.floor(time % 60)).padStart(2, "0")}:
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

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 mt-auto w-full">
        {/* Main Toggle Button */}
        <button
          onClick={() => {
            if (!isRecording) startRecording()
            else if (isPaused) toggleRecording()
            else stopRecording()
          }}
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-md text-white transition ${
            isRecording ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {isRecording ? (
            isPaused ? (
              <Play className="h-10 w-10" />
            ) : (
              <Square className="h-10 w-10" />
            )
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </button>

        {/* Upload Button */}
        <button
          onClick={uploadRecording}
          disabled={!recorded}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg disabled:opacity-50"
        >
          <UploadCloud className="h-5 w-5" />
          Upload Recording
        </button>
      </div>
    </div>
  )
}
