// src/components/ui/ToggleButton.tsx
import React from "react";

interface ToggleButtonProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-all"></div>
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-full transition-transform"></div>
    </label>
  );
};

export default ToggleButton;
