"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, Mic, Pause, Play, Square } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function RecordAudioPage() {
  const navigate = useNavigate()
  const [time, setTime] = useState(0)
  const [isRecording, setIsRecording] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => setTime((prev) => +(prev + 0.1).toFixed(1)), 100)
    }
    return () => clearInterval(interval)
  }, [isRecording])

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

      {/*   */}

      {/* Bottom controls */}
      <div className="flex items-center justify-around w-full mt-auto">
        <Play className="h-7 w-7 text-gray-700" />
        <button
          className="bg-gray-200 p-4 rounded-full"
          onClick={() => setIsRecording((r) => !r)}
        >
          {isRecording ? (
            <Pause className="h-6 w-6 text-gray-800" />
          ) : (
            <Mic className="h-6 w-6 text-gray-800" />
          )}
        </button>
        <Square className="h-7 w-7 text-black" />
      </div>
    </div>
  )
}
