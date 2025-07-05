interface ActionCardProps {
  label: string;
  onClick: () => void;
}

export const ActionCard = ({ label, onClick }: ActionCardProps) => {
  return (
    <div
      onClick={onClick}
      role="button"
      className="flex items-center justify-between rounded-lg shadow-md px-5 py-5 mb-4 text-lg font-bold text-walnut cursor-pointer hover:bg-gray-100 transition-colors"
    >
      {label}
      {/* Right-facing triangle */}
      <div
        className="w-0 h-0 border-t-6 border-b-6 border-l-8 border-t-transparent border-b-transparent border-l-walnut group-hover:translate-x-1 transition-transform"
      />
    </div>
  );
};




