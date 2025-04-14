import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface FormSelectProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const FormSelect = ({
    label,
    value,
    options,
    onChange,
    placeholder,
    disabled = false,
  }: FormSelectProps) => {
    return (
      <div className="space-y-2 w-full">
        <Label className="text-sm font-medium">{label}</Label>
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            disabled={disabled}
            className={`w-full border border-gray-300 rounded-md px-3 py-2 text-base shadow-xs ${
              disabled
                ? "bg-[#F3F4F6] text-black cursor-not-allowed"
                : "bg-white focus:border-walnut focus:ring-walnut/40"
            }`}
          >
            <SelectValue placeholder={placeholder || `Select ${label}`} />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-md border border-gray-300 z-[1000]">
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };