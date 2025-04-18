import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; //Import useParams to extract the child ID from URL
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { ENDPOINTS } from "@/utils/api"; // If you're using endpoint constants
import UploadProfilePhoto from "@/components/ui/UploadProfilePhoto";



interface LocationOption {
    id: string;
    name: string;
}

interface ChildProfileData {
    full_name: string;
    gender: string;
    caste_category: string;
    date_of_birth: string;
    parent_mobile_number: string;
    state: string;
    state_name: string | null;
    district: string;
    district_name: string | null;
    mandal: string;
    mandal_name: string | null;
    grampanchayat: string;
    grampanchayat_name: string | null;
    school_name: string;
    type_of_school: string;
    child_class: string;
    mother_name: string;
    father_name: string;
    mother_occupation: string;
    father_occupation: string;
    speaking_level: string;
    reading_level: string;
    status: string;
    child_photo_s3_url?: string;
}

const GENDER_OPTIONS = [
    { value: "FEMALE", label: "Female" },
    { value: "MALE", label: "Male" },
    { value: "OTHER", label: "Other" }
];

const CASTE_OPTIONS = [
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" },
    { value: "BC", label: "BC" },
    { value: "OBC", label: "OBC" },
    { value: "OC", label: "OC" },
    { value: "MUSLIM", label: "Muslim" },
    { value: "CHRISTIAN", label: "Christian" },
    { value: "OTHER", label: "Other" }
];

const SCHOOL_TYPE_OPTIONS = [
    { value: "GOVERNMENT", label: "Government" },
    { value: "PRIVATE", label: "Private" },
    { value: "TWPS", label: "TWPS" },
    { value: "ASHRAM", label: "Ashram" },
    { value: "OTHER", label: "Other" }
];

const CLASS_OPTIONS = [
    { value: "out_of_school", label: "Out of School" },
    { value: "3", label: "Class 3" },
    { value: "4", label: "Class 4" },
    { value: "5", label: "Class 5" },
    { value: "6", label: "Class 6" },
    { value: "7", label: "Class 7" },
    { value: "8", label: "Class 8" },
    { value: "Other", label: "Other" }
];

const MOTHER_OCCUPATION_OPTIONS = [
    { value: "Home Maker", label: "Home Maker" },
    { value: "Tailor", label: "Tailor" },
    { value: "Agricultural Labour", label: "Agricultural Labour" },
    { value: "Construction Labour", label: "Construction Labour" },
    { value: "Other", label: "Other" }
];

const FATHER_OCCUPATION_OPTIONS = [
    { value: "Home Maker", label: "Home Maker" },
    { value: "Tailor", label: "Tailor" },
    { value: "Agricultural Labour", label: "Agricultural Labour" },
    { value: "Construction Labour", label: "Construction Labour" },
    { value: "Other", label: "Other" }
];

const LEVEL_OPTIONS = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
];

const STATUS_OPTIONS = [
    { value: "Active", label: "Active" },
    { value: "Dropout", label: "Dropout" }
];

const AddChildProfile = () => {
    const navigate = useNavigate();


    // Extract child ID from route param and check if we're in edit mode
    const { id } = useParams<{ id?: string }>();
    const isEditMode = Boolean(id); // ✅ true if we're editing an existing profile

    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [customMotherOccupation, setCustomMotherOccupation] = useState("");
    const [customFatherOccupation, setCustomFatherOccupation] = useState("");

    const [locationData, setLocationData] = useState({
        states: [] as LocationOption[],
        districts: [] as LocationOption[],
        mandals: [] as LocationOption[],
        grampanchayats: [] as LocationOption[],
    });

    // 🔜 Child photo upload
    const [childId, setChildId] = useState<string | null>(null);
    const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

    const uploadPhotoToS3 = async (blob: Blob, childId: string): Promise<string | null> => {
        const formData = new FormData();
        formData.append("photo", blob);
        formData.append("child_id", childId);

        try {
            const res = await fetch(ENDPOINTS.UPLOAD_CHILD_PHOTO, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            return data.photo_url || null;
        } catch (err) {
            console.error("Upload error:", err);
            return null;
        }
    };


    const [profileData, setProfileData] = useState({
        full_name: "",
        gender: "",
        caste_category: "",
        date_of_birth: "",
        parent_mobile_number: "",
        state: "",
        state_name: null,
        district: "",
        district_name: null,
        mandal: "",
        mandal_name: null,
        grampanchayat: "",
        grampanchayat_name: null,
        school_name: "",
        type_of_school: "",
        child_class: "",

        mother_name: "",
        father_name: "",
        mother_occupation: "",
        father_occupation: "",

        speaking_level: "",
        reading_level: "",
        status: "",
        child_photo_s3_url: null
    });


    const handleChange = (key: keyof ChildProfileData, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const validatePersonalDetails = (): { [key: string]: string } => {
        const newErrors: { [key: string]: string } = {};

        if (!profileData.full_name.trim()) newErrors.full_name = "Full name is required";
        if (!profileData.gender) newErrors.gender = "Gender is required";
        if (!profileData.caste_category) newErrors.caste_category = "Caste category is required";
        if (!profileData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
        if (!/^\d{10}$/.test(profileData.parent_mobile_number)) {
            newErrors.parent_mobile_number = "Valid 10-digit number required";
        }

        if (!profileData.state) newErrors.state = "State is required";
        if (!profileData.district) newErrors.district = "District is required";
        if (!profileData.mandal) newErrors.mandal = "Mandal is required";
        if (!profileData.grampanchayat) newErrors.grampanchayat = "Grampanchayat is required";

        return newErrors;
    };


    const handleSavePersonalDetails = () => {
        const validationErrors = validatePersonalDetails();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log("✅ Saving personal details:", {
            full_name: profileData.full_name,
            gender: profileData.gender,
            caste_category: profileData.caste_category,
            date_of_birth: profileData.date_of_birth,
            parent_mobile_number: profileData.parent_mobile_number,
            state: profileData.state,
            district: profileData.district,
            mandal: profileData.mandal,
            grampanchayat: profileData.grampanchayat,
        });

        setErrors({});
        setIsEditing(null);
        alert("Personal details saved successfully.");
    };


    const validateEducationalDetails = () => {
        const newErrors: { [key: string]: string } = {};
        if (!profileData.school_name.trim()) newErrors.school_name = "School name is required";
        if (!profileData.type_of_school) newErrors.school_type = "School type is required";
        if (!profileData.child_class) newErrors.child_class = "Class is required";
        return newErrors;
    };


    const handleSaveEducationalDetails = () => {
        const validationErrors = validateEducationalDetails();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log("✅ Saving educational details:", {
            school_name: profileData.school_name,
            school_type: profileData.type_of_school,
            child_class: profileData.child_class,
        });

        setErrors({});
        setIsEditing(null);
        alert("Educational details saved.");
    };


    const validateParentDetails = () => {
        const newErrors: { [key: string]: string } = {};
        if (!profileData.mother_name.trim()) newErrors.mother_name = "Mother's name is required";
        if (!profileData.father_name.trim()) newErrors.father_name = "Father's name is required";
        if (!profileData.mother_occupation) newErrors.mother_occupation = "Mother's occupation is required";
        if (!profileData.father_occupation) newErrors.father_occupation = "Father's occupation is required";
        return newErrors;
    };

    const handleSaveParentDetails = () => {
        const validationErrors = validateParentDetails();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log("✅ Saving parent details:", {
            mother_name: profileData.mother_name,
            father_name: profileData.father_name,
            mother_occupation: profileData.mother_occupation,
            father_occupation: profileData.father_occupation,
        });

        setErrors({});
        setIsEditing(null);
        alert("Parent details saved.");
    };


    const validateLearningDetails = () => {
        const newErrors: { [key: string]: string } = {};
        if (!profileData.speaking_level) newErrors.speaking_level = "Speaking level is required";
        if (!profileData.reading_level) newErrors.reading_level = "Reading level is required";
        if (!profileData.status) newErrors.status = "Status is required";
        return newErrors;
    };

    const handleSaveLearningDetails = () => {
        const validationErrors = validateLearningDetails();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log("✅ Saving learning details:", {
            speaking_level: profileData.speaking_level,
            reading_level: profileData.reading_level,
            status: profileData.status,
        });

        setErrors({});
        setIsEditing(null);
        alert("Learning details saved.");
    };


    const handleFinalSubmit = async () => {
        // 1. Validate photo for add mode
        if (!isEditMode && !photoBlob) {
            alert("Please upload a profile photo before submitting.");
            return;
        }

        // 2. Prepare payload
        const payload: any = {
            full_name: profileData.full_name,
            gender: profileData.gender,
            caste_category: profileData.caste_category,
            date_of_birth: profileData.date_of_birth,
            parent_mobile_number: profileData.parent_mobile_number,
            state: profileData.state,
            district: profileData.district,
            mandal: profileData.mandal,
            grampanchayat: profileData.grampanchayat,
            school_name: profileData.school_name,
            type_of_school: profileData.type_of_school,
            child_class: profileData.child_class,
            status: profileData.status,
            mother_name: profileData.mother_name,
            mother_occupation: profileData.mother_occupation,
            father_name: profileData.father_name,
            father_occupation: profileData.father_occupation,
            reading_level: profileData.reading_level,
            speaking_level: profileData.speaking_level,
            fellow_mobile_number: localStorage.getItem("mobile_number"),
        };

        if (profileData.father_occupation === "Other") {
            payload.father_occupation = `Other: ${customFatherOccupation}`;
        }

        if (profileData.mother_occupation === "Other") {
            payload.mother_occupation = `Other: ${customMotherOccupation}`;
        }

        if (isEditMode) {
            payload.id = id; // ✅ for update
        }

        try {
            // 3. Save child profile (add or update)
            const res = await fetch(ENDPOINTS.SAVE_CHILD_PROFILE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result?.errors || "Save failed");

            const newChildId = isEditMode ? id : result.child_id;
            setChildId(newChildId);

            // 4. Upload photo if available
            if (photoBlob) {
                const uploadedUrl = await uploadPhotoToS3(photoBlob, newChildId);
                if (!uploadedUrl) throw new Error("Photo upload failed");

                console.log("✅ Photo uploaded to:", uploadedUrl);

                // 5. Update child profile with photo URL
                const photoUpdatePayload = {
                    id: newChildId,
                    fellow_mobile_number: localStorage.getItem("mobile_number"),
                    child_photo_s3_url: uploadedUrl,
                };

                const updateRes = await fetch(ENDPOINTS.SAVE_CHILD_PROFILE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(photoUpdatePayload),
                });

                const updateResult = await updateRes.json();
                if (!updateRes.ok) {
                    console.warn("⚠️ Failed to update photo URL:", updateResult.errors);
                } else {
                    console.log("✅ Photo URL updated");
                }
            }

            if (isEditMode) {
                alert("Child profile updated successfully!");
            } else {
                alert("Child profile created successfully!");
            }
            navigate("/view-children");
        } catch (err) {
            console.error("❌ Save error:", err);
            alert("Failed to save child profile.");
        }
    };



    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        try {
            const res = await fetch(ENDPOINTS.GET_STATES);
            const data = await res.json();
            setLocationData((prev) => ({ ...prev, states: data }));
        } catch (error) {
            console.error("Failed to fetch states:", error);
        }
    };

    const fetchDistricts = async (stateId: string) => {
        try {
            const res = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${stateId}`);
            const data = await res.json();
            setLocationData((prev) => ({
                ...prev,
                districts: data,
                mandals: [],
                grampanchayats: []
            }));
        } catch (error) {
            console.error("Failed to fetch districts:", error);
        }
    };

    const fetchMandals = async (districtId: string) => {
        try {
            const res = await fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${districtId}`);
            const data = await res.json();
            setLocationData((prev) => ({
                ...prev,
                mandals: data,
                grampanchayats: []
            }));
        } catch (error) {
            console.error("Failed to fetch mandals:", error);
        }
    };

    const fetchGrampanchayats = async (mandalId: string) => {
        try {
            const res = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${mandalId}`);
            const data = await res.json();
            setLocationData((prev) => ({
                ...prev,
                grampanchayats: data
            }));
        } catch (error) {
            console.error("Failed to fetch grampanchayats:", error);
        }
    };

    // 🔜  Fetch location data if the child is in edit mode
    useEffect(() => {
        if (isEditMode && profileData.state) {
            fetchDistricts(profileData.state);
        }
    }, [isEditMode, profileData.state]);

    useEffect(() => {
        if (isEditMode && profileData.district) {
            fetchMandals(profileData.district);
        }
    }, [isEditMode, profileData.district]);

    useEffect(() => {
        if (isEditMode && profileData.mandal) {
            fetchGrampanchayats(profileData.mandal);
        }
    }, [isEditMode, profileData.mandal]);


    // 🔜  Fetch child profile data if we're in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchChild = async () => {
                try {
                    const res = await fetch(ENDPOINTS.GET_CHILD_PROFILE(id!));
                    const data = await res.json();

                    if (data.status === "success") {
                        setProfileData(data.data);
                        setPhotoPreviewUrl(data.data.child_photo_s3_url || null);
                        setChildId(id!);
                    } else {
                        console.error("❌ Failed to fetch child for edit mode");
                    }
                } catch (err) {
                    console.error("❌ Error fetching child:", err);
                }
            };

            fetchChild();
        }
    }, [id]);


    const renderInput = (
        key: keyof ChildProfileData,
        label: string,
        type = "text"
    ) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            {isEditing ? (
                <Input
                    type={type}
                    value={profileData[key] ?? ""}
                    placeholder={`Enter ${label}`}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-walnut/40 focus:border-walnut/40"
                />
            ) : (
                <p className="bg-gray-100 p-3 rounded text-gray-700">
                    {profileData[key] || "Please Provide"}
                </p>
            )}
            {errors[key] && (
                <p className="text-red-500 text-sm">{errors[key]}</p>
            )}
        </div>
    );


    const renderDropdown = (
        key: keyof ChildProfileData,
        label: string,
        options: { value: string; label: string }[]
    ) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            {isEditing ? (
                <Select
                    value={profileData[key] ?? ""}
                    onValueChange={(val) => handleChange(key, val)}
                >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-walnut/40 focus:border-walnut/40 bg-white">
                        <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        {options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <p className="bg-gray-100 p-3 rounded text-gray-700">
                    {options.find((o) => o.value === profileData[key])?.label || "Please Provide"}
                </p>
            )}
            {errors[key] && (
                <p className="text-red-500 text-sm">{errors[key]}</p>
            )}
        </div>
    );


    const renderLocationDropdown = (
        key: keyof ChildProfileData,
        label: string,
        options: LocationOption[],
        onChange: (val: string) => void
    ) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            {isEditing ? (
                <Select
                    value={profileData[key] ?? ""}
                    onValueChange={onChange}
                >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-walnut/40 focus:border-walnut/40 bg-white">
                        <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        {options.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                                {opt.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <p className="bg-gray-100 p-3 rounded text-gray-700">
                    {
                        options.find((o) => o.id === profileData[key])?.name ||
                        "Please Provide"
                    }
                </p>
            )}
            {errors[key] && (
                <p className="text-red-500 text-sm">{errors[key]}</p>
            )}
        </div>
    );



    return (
        <div className="min-h-screen bg-[#F4F1E3] px-4 py-6 flex flex-col items-center">

            {/* Top bar with Back and Logout */}
            <div className="w-full flex items-center justify-between max-w-3xl py-4">
                <button
                    onClick={() => navigate("/children-profile")}
                    className="text-walnut hover:text-earth flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    <span className="text-base font-medium">Back</span>
                </button>
                <button
                    onClick={() => navigate("/login")}
                    className="bg-walnut text-white px-4 py-2 rounded-lg text-sm"
                >
                    Logout
                </button>
            </div>

            <div>
                <h2 className="text-xl font-bold text-walnut">
                    {isEditMode ? "Edit Child Profile" : "Add Child Profile"}
                </h2>
            </div>


            {/* Main Card */}
            <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">

                {/* Profile Photo Upload */}
                <div className="flex justify-center mb-6">
                    <UploadProfilePhoto
                        previewUrl={photoPreviewUrl}
                        setPreviewUrl={setPhotoPreviewUrl}
                        setPhotoBlob={setPhotoBlob}
                    />
                </div>

                <div className="text-sm font-bold text-walnut mt-4 text-center">
                    Upload Child Photo
                </div>

                {/* Section: Child Personal Details */}
                <div className="w-full p-6 bg-white shadow-lg rounded-lg space-y-4">
                    <h3
                        className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
                        onClick={() =>
                            setActiveSection(activeSection === "personal" ? null : "personal")
                        }
                    >
                        Child Personal Details
                        <span>{activeSection === "personal" ? "▼" : "►"}</span>
                    </h3>

                    {activeSection === "personal" && (
                        <div className="space-y-4">
                            {renderInput("full_name", "Full Name")}
                            {renderDropdown("gender", "Gender", GENDER_OPTIONS)}
                            {renderDropdown("caste_category", "Caste Category", CASTE_OPTIONS)}
                            {renderInput("date_of_birth", "Date of Birth", "date")}
                            {renderInput("parent_mobile_number", "Parent WhatsApp Number")}

                            {/* State Dropdown */}
                            {renderLocationDropdown("state", "State", locationData.states, (val) => {
                                handleChange("state", val);
                                handleChange("district", "");
                                handleChange("mandal", "");
                                handleChange("grampanchayat", "");
                                fetchDistricts(val);
                            })}


                            {/* District Dropdown */}
                            {renderLocationDropdown("district", "District", locationData.districts, (val) => {
                                handleChange("district", val);
                                handleChange("mandal", "");
                                handleChange("grampanchayat", "");
                                fetchMandals(val);
                            })}


                            {/* Mandal Dropdown */}
                            {renderLocationDropdown("mandal", "Mandal", locationData.mandals, (val) => {
                                handleChange("mandal", val);
                                handleChange("grampanchayat", "");
                                fetchGrampanchayats(val);
                            })}


                            {/* Grampanchayat Dropdown */}
                            {renderLocationDropdown("grampanchayat", "Grampanchayat", locationData.grampanchayats, (val) => {
                                handleChange("grampanchayat", val);
                            })}


                            <Button
                                onClick={() =>
                                    setIsEditing(isEditing === "personal" ? null : "personal")
                                }
                                className="w-full"
                            >
                                {isEditing === "personal" ? "Cancel" : "Edit"}
                            </Button>

                            {isEditing === "personal" && (
                                <Button
                                    onClick={handleSavePersonalDetails}
                                    className="w-full bg-green-600 text-white mt-2"
                                >
                                    Save Personal Details
                                </Button>
                            )}

                        </div>
                    )}
                </div>


                {/* Section: Child Education Details */}
                <div className="w-full p-6 bg-white shadow-lg rounded-lg space-y-4">
                    <h3
                        className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
                        onClick={() =>
                            setActiveSection(activeSection === "education" ? null : "education")
                        }
                    >
                        Child Educational Details
                        <span>{activeSection === "education" ? "▼" : "►"}</span>
                    </h3>

                    {activeSection === "education" && (
                        <div className="space-y-4">
                            {renderInput("school_name", "School Name")}
                            {renderDropdown("type_of_school", "School Type", SCHOOL_TYPE_OPTIONS)}
                            {renderDropdown("child_class", "Class", CLASS_OPTIONS)}

                            <Button
                                onClick={() =>
                                    setIsEditing(isEditing === "education" ? null : "education")
                                }
                                className="w-full"
                            >
                                {isEditing === "education" ? "Cancel" : "Edit"}
                            </Button>

                            {isEditing === "education" && (
                                <Button
                                    onClick={handleSaveEducationalDetails}
                                    className="w-full bg-green-600 text-white mt-2"
                                >
                                    Save Educational Details
                                </Button>
                            )}
                        </div>
                    )}
                </div>


                {/* Section: Child Parent Details */}
                <div className="w-full p-6 bg-white shadow-lg rounded-lg space-y-4">
                    <h3
                        className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
                        onClick={() =>
                            setActiveSection(activeSection === "parent" ? null : "parent")
                        }
                    >
                        Child Parent Details
                        <span>{activeSection === "parent" ? "▼" : "►"}</span>
                    </h3>

                    {activeSection === "parent" && (
                        <div className="space-y-4">
                            {renderInput("mother_name", "Mother's Name")}

                            {/*mother Occupation with the input box for others section */}

                            <div className="space-y-2">
                                <Label>Mother's Occupation</Label>
                                {isEditing ? (
                                    <>
                                        <Select
                                            value={profileData.mother_occupation}
                                            onValueChange={(val) => {
                                                handleChange("mother_occupation", val);
                                                if (val !== "Other") setCustomMotherOccupation("");
                                            }}
                                        >
                                            <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-walnut/40 focus:border-walnut/40 bg-white">
                                                <SelectValue placeholder="Select Mother's Occupation" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {MOTHER_OCCUPATION_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {profileData.mother_occupation === "Other" && (
                                            <Input
                                                type="text"
                                                placeholder="Enter mother's occupation"
                                                value={customMotherOccupation}
                                                onChange={(e) => setCustomMotherOccupation(e.target.value)}
                                                className="mt-2"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <p className="bg-gray-100 p-3 rounded text-gray-700">
                                        {profileData.mother_occupation === "Other"
                                            ? customMotherOccupation || "Other"
                                            : MOTHER_OCCUPATION_OPTIONS.find((o) => o.value === profileData.mother_occupation)?.label || "Please Provide"}
                                    </p>
                                )}
                            </div>

                            {renderInput("father_name", "Father's Name")}

                            {/*father Occupation with the input box for others section*/}

                            <div className="space-y-2">
                                <Label>Father's Occupation</Label>
                                {isEditing ? (
                                    <>
                                        <Select
                                            value={profileData.father_occupation}
                                            onValueChange={(val) => {
                                                handleChange("father_occupation", val);
                                                if (val !== "Other") setCustomFatherOccupation("");
                                            }}
                                        >
                                            <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-walnut/40 focus:border-walnut/40 bg-white">
                                                <SelectValue placeholder="Select Father's Occupation" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {FATHER_OCCUPATION_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {profileData.father_occupation === "Other" && (
                                            <Input
                                                type="text"
                                                placeholder="Enter Father's occupation"
                                                value={customFatherOccupation}
                                                onChange={(e) => setCustomFatherOccupation(e.target.value)}
                                                className="mt-2"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <p className="bg-gray-100 p-3 rounded text-gray-700">
                                        {profileData.father_occupation === "Other"
                                            ? customFatherOccupation || "Other"
                                            : FATHER_OCCUPATION_OPTIONS.find((o) => o.value === profileData.father_occupation)?.label || "Please Provide"}
                                    </p>
                                )}
                            </div>


                            <Button
                                onClick={() =>
                                    setIsEditing(isEditing === "parent" ? null : "parent")
                                }
                                className="w-full"
                            >
                                {isEditing === "parent" ? "Cancel" : "Edit"}
                            </Button>

                            {isEditing === "parent" && (
                                <Button
                                    onClick={handleSaveParentDetails}
                                    className="w-full bg-green-600 text-white mt-2"
                                >
                                    Save Parent Details
                                </Button>
                            )}
                        </div>
                    )}
                </div>


                {/* Section: Child Learning Details */}

                <div className="w-full p-6 bg-white shadow-lg rounded-lg space-y-4">
                    <h3
                        className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
                        onClick={() =>
                            setActiveSection(activeSection === "learning" ? null : "learning")
                        }
                    >
                        Child Learning Details
                        <span>{activeSection === "learning" ? "▼" : "►"}</span>
                    </h3>

                    {activeSection === "learning" && (
                        <div className="space-y-4">
                            {renderDropdown("speaking_level", "Speaking Level", LEVEL_OPTIONS)}
                            {renderDropdown("reading_level", "Reading Level", LEVEL_OPTIONS)}
                            {renderDropdown("status", "Status", STATUS_OPTIONS)}

                            <Button
                                onClick={() =>
                                    setIsEditing(isEditing === "learning" ? null : "learning")
                                }
                                className="w-full"
                            >
                                {isEditing === "learning" ? "Cancel" : "Edit"}
                            </Button>

                            {isEditing === "learning" && (
                                <Button
                                    onClick={handleSaveLearningDetails}
                                    className="w-full bg-green-600 text-white mt-2"
                                >
                                    Save Learning Details
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleFinalSubmit}
                    className="w-full bg-walnut text-white text-lg mt-6"
                >
                    {isEditMode ? "Update Child Profile" : "Submit Child Profile"}
                </Button>


            </div>
        </div>
    );


};

export default AddChildProfile;



