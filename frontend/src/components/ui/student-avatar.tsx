export function StudentAvatar() {
    return (
      <div className="w-12 h-12">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="35" r="25" fill="#FFD700" />
          <circle cx="40" cy="30" r="2.5" fill="#000" />
          <circle cx="60" cy="30" r="2.5" fill="#000" />
          <path d="M42 45 Q50 55 58 45" stroke="#000" strokeWidth="2" fill="none" />
          <rect x="35" y="60" width="30" height="35" fill="#4CAF50" />
          <rect x="30" y="60" width="5" height="20" fill="#8B4513" />
          <rect x="65" y="60" width="5" height="20" fill="#8B4513" />
        </svg>
      </div>
    )
  }
  