import React from 'react';
import { Group } from '../types';

interface GroupBadgeProps {
  group: Group;
  onRemove?: (groupId: string) => void;
}

const GroupBadge: React.FC<GroupBadgeProps> = ({ group, onRemove }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {group.name}
      {onRemove && (
        <button
          onClick={() => onRemove(group.id)}
          className="ml-1 hover:text-blue-600 focus:outline-none"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default GroupBadge;