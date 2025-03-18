import { useState } from "react";
import { PlayCircle } from "lucide-react";

const TasksPage = () => {
  const [videosWatched, setVideosWatched] = useState<{ [key: string]: boolean }>({});
  
  const handleVideoWatched = (vid: string) => setVideosWatched({ ...videosWatched, [vid]: true });

  return (
    <div className="min-h-screen bg-[#f0e8d9] px-6 py-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl text-center">
        <img src="/Images/organization_logo.png" alt="Logo" className="h-14 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Fellow Tasks</h2>
        <p className="text-earth font-medium">Dear Youth Volunteer,</p>
        <p className="text-gray-700">Welcome to the next stage of your Application! Watch these videos to know more!</p>
      </div>
      
      {/* Videos Section */}
      <div className="w-full max-w-4xl flex flex-col space-y-3 p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">Videos</h3>
        {["video1", "video2"].map((vid) => (
          <div key={vid} className="flex justify-between items-center p-4  rounded-lg shadow">
            <a href="https://youtube.com" target="_blank" className="flex items-center gap-2 text-blue-600 underline" onClick={() => handleVideoWatched(vid)}>
              <PlayCircle className="w-6 h-6 text-blue-600" /> Watch Video {vid === "video1" ? "1" : "2"}
            </a>
            <div className={`px-4 py-2 rounded-full text-white text-sm ${videosWatched[vid] ? "bg-green-500" : "bg-gray-500"}`}>
              {videosWatched[vid] ? "✅ Seen" : "⌛ Unseen"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
