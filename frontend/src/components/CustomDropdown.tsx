import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-lg font-medium text-white mb-2">
          {label} {required && '*'}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-4 py-3 border-2 border-white/30 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 text-base text-white appearance-none cursor-pointer hover:border-white/50 flex items-center justify-between"
      >
        <span className={value ? 'text-white' : 'text-white/70'}>
          {displayText}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Options List */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-white transition-colors duration-150 text-left ${
                  value === option.value ? 'bg-white/50' : ''
                }`}
              >
                <span className="font-medium text-gray-800">
                  {option.label}
                </span>
                {value === option.value && (
                  <Check className="w-4 h-4 text-[#27465C]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDropdown;
