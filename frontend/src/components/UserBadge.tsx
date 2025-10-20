import React from 'react';

interface UserBadgeProps {
  userType: 'host' | 'speaker';
  className?: string;
}

const UserBadge: React.FC<UserBadgeProps> = ({ userType, className = '' }) => {
  const badgeStyles = userType === 'host'
    ? 'bg-blue-100 text-blue-800 border-blue-300'
    : 'bg-purple-100 text-purple-800 border-purple-300';

  const badgeText = userType === 'host' ? 'Host' : 'Speaker';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${badgeStyles} ${className}`}>
      {badgeText}
    </span>
  );
};

export default UserBadge;
