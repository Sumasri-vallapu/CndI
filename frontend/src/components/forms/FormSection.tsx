import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface FormSectionProps {
    title: string;
    children: ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    onSave?: () => void;
    isEditing?: boolean;
    onEdit?: () => void;
}

export const FormSection = ({
    title,
    children,
    isExpanded,
    onToggle,
    onSave,
    isEditing,
    onEdit
}: FormSectionProps) => {
    return (
        <div className="w-full p-6 bg-white shadow-lg rounded-lg space-y-4">
            <h3
                className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
                onClick={onToggle}
            >
                {title}
                <span>{isExpanded ? "▼" : "►"}</span>
            </h3>

            {isExpanded && (
                <div className="space-y-4">
                    {children}
                    
                    <Button
                        onClick={onEdit}
                        className="w-full"
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </Button>

                    {isEditing && onSave && (
                        <Button
                            onClick={onSave}
                            className="w-full bg-green-600 text-white mt-2"
                        >
                            Save {title}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}; 