import { useRef } from "react";
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoPreview(file);
  };

  const setPhotoPreview = (file: Blob) => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl); // ✅ Show preview
    setPhotoBlob(file);       // ✅ Pass blob to parent
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
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 bg-walnut text-white rounded-full p-2"
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
