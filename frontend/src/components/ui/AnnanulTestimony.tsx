import { useState, useRef } from "react";
import { Mic, MicOff, Trash, PlayCircle } from "lucide-react"; // Icons

export default function AnnualTestimonial() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<{ id: number; url: string; timestamp: string }[]>([]);
  const [selectedStakeholder, setSelectedStakeholder] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Function to Start Recording
  const startRecording = async () => { 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const recordedURL = URL.createObjectURL(recordedBlob);
        setAudioURL(recordedURL);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Function to Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Function to Submit Testimonial
  const submitTestimonial = () => {
    if (audioURL) {
      const newTestimonial = {
        id: testimonials.length + 1,
        url: audioURL,
        timestamp: new Date().toLocaleTimeString(),
      };
      setTestimonials([...testimonials, newTestimonial]);
      setAudioURL(null);
    }
  };

  // Function to Delete Testimonial
  const deleteTestimonial = (id: number) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F3EBE6] p-6 flex flex-col">
      {/* Header */}
      <h1 className="text-[24px] font-bold text-[#7A3D1A] text-center">Annual Testimonial Recording</h1>

      {/* Stakeholder Dropdown */}
      <div className="mt-4">
        <label className="block text-[#7A3D1A] font-medium mb-2">Select Stakeholder:</label>
        <select
          className="w-full p-3 border border-[#A86543] rounded-md text-[#7A3D1A] bg-white"
          value={selectedStakeholder}
          onChange={(e) => setSelectedStakeholder(e.target.value)}
        >
          <option value="">Choose Stakeholder</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
          <option value="Parent">Parent</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Recording Buttons */}
      <div className="mt-6 flex flex-col items-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-full max-w-[300px] bg-[#7A3D1A] text-white flex items-center justify-center gap-2 px-6 py-3 rounded-md shadow-md"
          >
            <Mic size={20} />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-full max-w-[300px] bg-red-600 text-white flex items-center justify-center gap-2 px-6 py-3 rounded-md shadow-md"
          >
            <MicOff size={20} />
            Stop Recording
          </button>
        )}
      </div>

      {/* Play & Submit Buttons */}
      {audioURL && (
        <div className="mt-4 flex flex-col items-center">
          <audio controls className="w-full max-w-[300px]">
            <source src={audioURL} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
          <button
            onClick={submitTestimonial}
            className="mt-2 w-full max-w-[300px] bg-[#7A3D1A] text-white py-2 rounded-md"
          >
            Submit Testimonial
          </button>
        </div>
      )}

      {/* Recorded Testimonials List */}
      {testimonials.length > 0 && (
        <div className="mt-6">
          <h2 className="text-[20px] font-semibold text-[#7A3D1A]">Recorded Testimonials</h2>
          <div className="mt-2 space-y-2">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex justify-between items-center p-3 bg-white rounded-md shadow-md">
                <div className="flex items-center gap-2 text-[#7A3D1A]">
                  <PlayCircle size={20} />
                  <audio controls className="w-full max-w-[200px]">
                    <source src={testimonial.url} type="audio/webm" />
                  </audio>
                  <span className="text-[#A86543] text-sm">{testimonial.timestamp}</span>
                </div>
                <button onClick={() => deleteTestimonial(testimonial.id)} className="text-red-600">
                  <Trash size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
