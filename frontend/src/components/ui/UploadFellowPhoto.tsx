import { useState } from "react";
import { Button } from "./button";

interface UploadFellowPhotoProps {
  fellowId: string;
  currentUrl?: string;
  fellowName?: string;
  onSuccess: (url: string) => void;
}

export const UploadFellowPhoto = ({
  fellowId,
  currentUrl,
  fellowName,
  onSuccess,
}: UploadFellowPhotoProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setShowConfirm(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !fellowId) return;

    const formData = new FormData();
    formData.append("photo", selectedImage);
    formData.append("fellow_id", fellowId);

    try {
      const res = await fetch("http://localhost:8000/api/fellow/photo-upload/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        onSuccess(data.photo_url);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Something went wrong");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-2 mb-4">
        {/* Avatar + camera overlay */}
        <div className="relative w-28 h-28">
          <img
            src={currentUrl || "/default-avatar.png"}
            alt="Fellow"
            className="w-full h-full rounded-full object-cover border-2 border-walnut bg-gray-100"
          />
          <label
            htmlFor="file-upload"
            className="absolute bottom-0 right-0 bg-walnut text-white p-2 rounded-full cursor-pointer shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 4a2 2 0 012-2h1l1-1h4l1 1h1a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 3a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Name */}
        <p className="text-lg font-bold text-walnut uppercase tracking-wide">
          {fellowName || "FELLOW NAME"}
        </p>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4">
            <p className="text-lg font-semibold">Do you want to save this image?</p>
            <div className="flex justify-around gap-4">
              <Button className="bg-green-600 text-white" onClick={handleUpload}>
                Yes
              </Button>
              <Button className="bg-red-500 text-white" onClick={() => setShowConfirm(false)}>
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
