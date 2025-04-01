// RecordUserTestimonial.tsx
"use client"

import { useEffect, useState } from "react"
import { Mic } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StudentAvatar } from "@/components/ui/student-avatar"
import { useNavigate } from "react-router-dom"
import { ENDPOINTS } from "@/utils/api"
import { getLoggedInMobile } from "@/utils/session"

// Define types for the API response
interface RecorderSummaryResponse {
  mobile_number: string;
  counts: {
    [key: string]: number;
  };
  latest_records: {
    [key: string]: {
      stakeholder_type: string;
      audio_url: string;
      created_at: string;
      mobile_number: string;
    };
  };
}

type Recorder = {
  id: string;
  type: string;
  count: number;
  lastRecording?: {
    audio_url: string;
    created_at: string;
  };
}

// Stakeholder label mapping
const stakeholderLabelMap: Record<string, string> = {
  fellow: "Fellow",
  fellow_parent: "Fellow Parent",
  child: "Child",
  childs_parent: "Child's Parent",
  supporter: "Supporter"
};

// Avatar components mapping
const avatarMap: Record<string, React.ReactNode> = {
  fellow: <StudentAvatar />,
  fellow_parent: <StudentAvatar />,
  child: <StudentAvatar />,
  childs_parent: <StudentAvatar />,
  supporter: <StudentAvatar />
};

export default function RecordUserTestimonial() {
  const [recorders, setRecorders] = useState<Recorder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const mobile_number = getLoggedInMobile();

      if (!mobile_number) {
        setError("Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${ENDPOINTS.GET_RECORDER_SUMMARY}?mobile=${mobile_number}`);
        if (!res.ok) throw new Error('Failed to fetch recorder summary');
        
        const data: RecorderSummaryResponse = await res.json();

        // Create recorders array with all stakeholder types
        const recorders: Recorder[] = Object.entries(stakeholderLabelMap).map(([key, label]) => ({
          id: key,
          type: label,
          count: data.counts[key] || 0,
          lastRecording: data.latest_records[key] ? {
            audio_url: data.latest_records[key].audio_url,
            created_at: data.latest_records[key].created_at
          } : undefined
        }));

        setRecorders(recorders);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recorder summary:", err);
        setError("Failed to load recorder summary");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const uploaded = recorders.reduce((acc, r) => acc + (r.count > 0 ? 1 : 0), 0);
  const total = recorders.length;
  const progress = (uploaded / total) * 100;

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
        <div className="w-8" />
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
            icon={avatarMap[rec.id]}
            id={rec.id}
            lastRecording={rec.lastRecording}
          />
        ))}
      </div>
    </div>
  );
}

type TestimonialCardProps = {
  type: string;
  uploadCount: number;
  icon: React.ReactNode;
  id: string;
  lastRecording?: {
    audio_url: string;
    created_at: string;
  };
}

function TestimonialCard({ type, uploadCount, icon, id, lastRecording }: TestimonialCardProps) {
  const navigate = useNavigate();
  const status = uploadCount === 0 
    ? "No Audios Uploaded" 
    : `${uploadCount} Audio${uploadCount > 1 ? 's' : ''} Uploaded`;

  return (
    <Card className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-gray-800">{type}</span>
        </div>
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate(`/testimonial-form?id=${id}`)}
        >
          <Mic className="h-6 w-6 text-[#7A3D1A]" />
          <span className="text-xs text-[#7A3D1A]">Record</span>
        </div>
      </div>

      <div className="bg-[#A86543] text-white text-sm px-4 py-2 flex justify-between items-center">
        <span>{status}</span>
        <span className="text-xl">›</span>
      </div>
    </Card>
  );
}
