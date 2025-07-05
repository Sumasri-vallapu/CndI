import * as z from 'zod';

// Base schema for form data
export const childProfileSchema = z.object({
    // Personal Details
    full_name: z.string().min(1, "Full name is required"),
    gender: z.string().min(1, "Gender is required"),
    custom_gender: z.string().optional(),
    religion: z.string().min(1, "Religion is required"),
    custom_religion: z.string().optional(),
    caste_category: z.string().min(1, "Caste category is required"),
    custom_caste: z.string().optional(),
    date_of_birth: z.string().min(1, "Date of birth is required"),
    parent_mobile_number: z.string()
        .min(10, "Must be 10 digits")
        .max(10, "Must be 10 digits")
        .regex(/^\d+$/, "Must contain only numbers"),
    
    // Location
    state: z.string().min(1, "State is required"),
    district: z.string().min(1, "District is required"),
    mandal: z.string().min(1, "Mandal is required"),
    grampanchayat: z.string().min(1, "Village is required"),
    
    // Education
    school_name: z.string().min(1, "School name is required"),
    type_of_school: z.string().min(1, "School type is required"),
    child_class: z.string().min(1, "Class is required"),
    
    // Parent Details
    mother_name: z.string().min(1, "Mother's name is required"),
    father_name: z.string().min(1, "Father's name is required"),
    mother_occupation: z.string().min(1, "Mother's occupation is required"),
    father_occupation: z.string().min(1, "Father's occupation is required"),

    // Photo
    child_photo_s3_url: z.string().optional(),
    photo_blob: z.instanceof(Blob).optional(),
});

export type ChildProfileFormData = z.infer<typeof childProfileSchema>;

// Validation for custom fields
export const validateCustomField = (field: string, value: string, customValue: string) => {
    if (value === "OTHER" && !customValue) {
        return `${field} is required when Other is selected`;
    }
    return undefined;
};

export const validateSection = (data: Partial<ChildProfileFormData>, section: 'personal' | 'education' | 'parent') => {
    const sectionFields = {
        personal: [
            'full_name', 'gender', 'custom_gender', 
            'religion', 'custom_religion',
            'caste_category', 'custom_caste',
            'date_of_birth', 'parent_mobile_number',
            'state', 'district', 'mandal', 'grampanchayat'
        ],
        education: ['school_name', 'type_of_school', 'child_class'],
        parent: ['mother_name', 'father_name', 'mother_occupation', 'father_occupation']
    };

    const sectionSchema = z.object(
        Object.fromEntries(
            sectionFields[section].map(field => [
                field,
                childProfileSchema.shape[field as keyof typeof childProfileSchema.shape]
            ])
        )
    );

    const result = sectionSchema.safeParse(data);

    if (result.success) {
        // Additional validation for custom fields
        const errors: Record<string, string> = {};
        
        if (section === 'personal') {
            const genderError = validateCustomField('Gender', data.gender || '', data.custom_gender || '');
            if (genderError) errors.custom_gender = genderError;

            const religionError = validateCustomField('Religion', data.religion || '', data.custom_religion || '');
            if (religionError) errors.custom_religion = religionError;

            const casteError = validateCustomField('Caste', data.caste_category || '', data.custom_caste || '');
            if (casteError) errors.custom_caste = casteError;
        }

        if (Object.keys(errors).length > 0) {
            return { success: false, error: { errors: Object.entries(errors).map(([path, message]) => ({ path: [path], message })) } };
        }
    }

    return result;
}; 