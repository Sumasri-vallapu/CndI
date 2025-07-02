import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

interface Option {
    value: string;
    label: string;
}

interface FormFieldProps {
    name: string;
    label: string;
    type?: 'text' | 'date' | 'select';
    options?: Option[];
    placeholder?: string;
    required?: boolean;
    onChange?: (value: string) => void;
}

export const FormField = ({
    name,
    label,
    type = 'text',
    options,
    placeholder,
    required,
    onChange
}: FormFieldProps) => {
    const { register, formState: { errors }, setValue } = useFormContext();
    const error = errors[name]?.message as string;

    const handleSelectChange = (value: string) => {
        setValue(name, value);
        onChange?.(value);
    };

    const renderField = () => {
        switch (type) {
            case 'select':
                return (
                    <Select onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={placeholder || `Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            default:
                return (
                    <Input
                        type={type}
                        placeholder={placeholder || `Enter ${label}`}
                        {...register(name, { required })}
                    />
                );
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {renderField()}
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}; 