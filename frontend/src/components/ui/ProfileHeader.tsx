import { useState, useRef, useEffect } from "react";
import { User, Camera } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ENDPOINTS } from "@/utils/api";

interface ProfileHeaderProps {
  className?: string;
}

export function ProfileHeader({ className = "" }: ProfileHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get mobile number from both location state and localStorage
  const mobileNumber = location.state?.mobileNumber || localStorage.getItem('mobile_number');

  // Fetch user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!mobileNumber) return;
      
      try {
        const response = await fetch(`${ENDPOINTS.GET_USER_DETAILS}?mobile_number=${mobileNumber}`);
        if (!response.ok) throw new Error('Failed to fetch user details');
        
        const data = await response.json();
        setFullName(data.full_name);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [mobileNumber]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !mobileNumber) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('mobile_number', mobileNumber);

    try {
      const response = await fetch(ENDPOINTS.UPLOAD_PROFILE_PHOTO, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setProfilePhoto(data.photo_url);
      
      // Optionally store in localStorage
      localStorage.setItem('profile_photo', data.photo_url);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    }
  };

  const handleProfileClick = () => {
    if (!mobileNumber) {
      navigate('/login');
      return;
    }
    navigate("/fellow-profile", { 
      state: { mobileNumber }
    });
  };

  return (
    <div 
      className={`w-full max-w-3xl bg-white p-6 rounded-lg shadow-md ${className}`}
      onClick={handleProfileClick}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Logo */}
        <img 
          src="/Images/organization_logo.png" 
          alt="Logo" 
          className="h-16 w-auto object-contain" 
          loading="eager" 
        />

        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          {/* Profile Photo with Upload */}
          <div className="relative">
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt="Profile" 
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <User className="h-16 w-16 text-walnut p-2 bg-gray-100 rounded-full" />
            )}
            <button 
              onClick={(event) => {
                event.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute bottom-0 right-0 bg-walnut text-white rounded-full p-1.5 hover:bg-walnut/90 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* User Name */}
          <h2 className="text-2xl font-bold text-walnut">
            {fullName || "Loading..."}
          </h2>
        </div>
      </div>
    </div>
  );
} 