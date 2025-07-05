import { useState, useRef } from "react";
import { User, Camera } from "lucide-react";


interface ProfilePhotoProps {
  initialPhotoUrl?: string | null;
  mobileNumber: string;
  onPhotoUpdate?: (url: string) => void;
}

export function ProfilePhoto({ initialPhotoUrl, mobileNumber, onPhotoUpdate }: ProfilePhotoProps) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('mobile_number', mobileNumber);

    try {
      const response = await fetch('', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setPhotoUrl(data.photo_url);
      onPhotoUpdate?.(data.photo_url);
      
      // Store in localStorage for persistence
      localStorage.setItem('profile_photo', data.photo_url);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    }
  };

  return (
    <div className="relative">
      {photoUrl ? (
        <img 
          src={photoUrl} 
          alt="Profile" 
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <User className="h-24 w-24 text-walnut p-4 bg-gray-100 rounded-full" />
      )}
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 bg-walnut text-white rounded-full p-2 hover:bg-walnut/90 transition-colors"
      >
        <Camera className="h-5 w-5" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
} 