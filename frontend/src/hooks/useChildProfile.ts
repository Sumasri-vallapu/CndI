import { useState } from 'react';
import { ENDPOINTS } from '@/utils/api';

interface ChildProfileData {
    full_name: string;
    gender: string;
    caste_category: string;
    date_of_birth: string;
    parent_mobile_number: string;
    state: string;
    district: string;
    mandal: string;
    grampanchayat: string;
    school_name: string;
    type_of_school: string;
    child_class: string;
    mother_name: string;
    father_name: string;
    mother_occupation: string;
    father_occupation: string;
    child_photo_s3_url?: string;
}

export const useChildProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveChildProfile = async (data: Partial<ChildProfileData>, childId?: string) => {
        try {
            setLoading(true);
            const payload = {
                ...data,
                fellow_mobile_number: localStorage.getItem("mobile_number"),
                id: childId
            };

            const res = await fetch(ENDPOINTS.SAVE_CHILD_PROFILE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result?.errors || "Save failed");

            return result;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to save profile');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const uploadPhoto = async (photoBlob: Blob, childId: string) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("photo", photoBlob);
            formData.append("child_id", childId);

            const res = await fetch(ENDPOINTS.UPLOAD_CHILD_PHOTO, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.errors || "Upload failed");

            return data.photo_url;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to upload photo');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchChildProfile = async (childId: string) => {
        try {
            setLoading(true);
            const res = await fetch(ENDPOINTS.GET_CHILD_PROFILE(childId));
            const data = await res.json();

            if (!res.ok) throw new Error(data?.errors || "Fetch failed");

            return data.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch profile');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        saveChildProfile,
        uploadPhoto,
        fetchChildProfile
    };
}; 