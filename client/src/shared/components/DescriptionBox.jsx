import { useState } from 'react';
import  formatTime  from '../../shared/utils/formatTime';
import  formatNumber  from '../../shared/utils/formatNumber';
import formatDateToReadable from '../utils/formatDateToReadable';

function DescriptionBox({ views, createdAt, description, updatedAt = createdAt }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(prev => !prev);

  return (
    <div className="text-base text-gray-200 bg-[#1e1e1e] p-4 mr-5 mt-2 rounded-lg">
      {/* Header Info */}
      {!expanded ? (
        <div className="text-gray-300 mb-2 flex gap-3">
          <span>{formatNumber(views)} {views === 1 ? 'view' : 'views'}</span>
          <span>{formatTime(createdAt)}</span>
        </div>
      ) : (
        <div className="text-gray-300 mb-2">
          <div><strong>Views:</strong> {views}</div>
          <div><strong>Created:</strong> {formatDateToReadable(createdAt)}</div>
          <div><strong>Updated:</strong> {formatDateToReadable(updatedAt)}</div>
        </div>
      )}

      {/* Description */}
      <div className="whitespace-pre-wrap">
        {expanded ? description : `${description.slice(0, 200)}${description.length > 200 ? '...' : ''}`}
      </div>

      {/* Toggle Button */}
      {description.length > 200 && (
        <button
          onClick={handleToggle}
          className="mt-2 text-blue-400 hover:underline"
        >
          {expanded ? 'Show less' : '...more'}
        </button>
      )}
    </div>
  );
}

export default DescriptionBox;
