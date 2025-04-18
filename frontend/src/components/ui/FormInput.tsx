import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
}

export const FormInput = ({
    label,
    value,
    type = "text",
    placeholder = "",
    onChange,
    error,
    disabled = false,
}: FormInputProps) => {
    return (
        <div className="space-y-2 w-full">
            <Label className="text-sm font-medium">{label}</Label>
            <Input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none ${
                    disabled
                        ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                        : "bg-white text-black"
                }`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};
