import { useState, useRef } from 'react';
import Comments from '../../components/Comments.jsx';
import UpNext from '../../components/UpNext.jsx';

export default function CommentAndUpnext({ videoId, initialTab = 'comments' ,commentRef=null}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [direction, setDirection] = useState(null);
 
  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setDirection(newTab === 'comments' ? 'right' : 'left');
      setActiveTab(newTab);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="relative mb-6">
        <div className="flex border-b border-slate-600">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium relative z-10 ${
              activeTab === 'comments' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
            }`}
            onClick={() => handleTabChange('comments')}
          >
            Comments
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium relative z-10 ${
              activeTab === 'upnext' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
            }`}
            onClick={() => handleTabChange('upnext')}
          >
            Up Next
          </button>
        </div>
        
        <div 
          className={`absolute bottom-0 h-0.5 bg-purple-500 transition-all duration-300 ${
            activeTab === 'comments' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
          }`}
        />
      </div>

      {/* Animated content area - now with proper height handling */}
      <div className="relative overflow-hidden min-h-[300px]">
        <div className={`w-full transition-transform duration-500 ease-in-out ${
          activeTab === 'comments' 
            ? 'translate-x-0' 
            : '-translate-x-full absolute'
        }`}>
          <Comments key={`${videoId}-comments`} videoId={videoId} commentRef={commentRef}/>
        </div>
        
        <div className={`w-full transition-transform duration-500 ease-in-out ${
          activeTab === 'upnext' 
            ? 'translate-x-0' 
            : 'translate-x-full absolute'
        }`}>
          <UpNext key={`${videoId}-upnext`} />
        </div>
      </div>
    </div>
  );
}