import { useRef, useState } from "react";
import { Camera, User } from "lucide-react";

interface UploadProfilePhotoProps {
  previewUrl: string | null;
  setPreviewUrl: (url: string) => void;
  setPhotoBlob: (blob: Blob | null) => void;
}

export default function UploadProfilePhoto({
  previewUrl,
  setPreviewUrl,
  setPhotoBlob,
}: UploadProfilePhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setPhotoPreview(file);

      // ✅ Simulate quick success message
      setTimeout(() => {
        alert("✅ Profile photo added successfully (will be uploaded on final save)");
      }, 300);

    } finally {
      setUploading(false);
    }
  };

  const setPhotoPreview = (file: Blob) => {
    const objectUrl = URL.createObjectURL(file);
    console.log("fetched url",objectUrl);
    setPreviewUrl(objectUrl);
    setPhotoBlob(file);
  };

  return (
    <div className="relative w-24 h-24">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <User className="h-24 w-24 text-walnut p-4 bg-gray-100 rounded-full" />
      )}

      <button
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`absolute bottom-0 right-0 rounded-full p-2 ${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-walnut text-white hover:bg-walnut/90 transition-colors"
        }`}
        disabled={uploading}
        title={uploading ? "Uploading..." : "Upload"}
      >
        <Camera className="h-5 w-5" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
