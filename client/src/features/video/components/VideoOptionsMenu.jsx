import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MoreVertical, Trash2, Share2, ListPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddToPlaylist from '../../playlist/page/AddToPlaylist.jsx';

export default function VideoOptionsMenu({ videoId, publicId, isOwner = false, onDelete, onDeleteError }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const optionsRef = useRef(null);

  // Check if user is logged in
  const isLoggedIn = useSelector(state => state.auth.status);

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
      setShowConfirm(false);
      setShowPlaylistModal(false);
    }
  };

  useEffect(() => {
    if (showOptions || showConfirm || showPlaylistModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions, showConfirm, showPlaylistModal]);

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/watch?pi=${publicId}&vi=${videoId}`);
    // Add toast notification here
  };

  const confirmDelete = async () => {
    try {
      await videoServices.deleteVideo(videoId);
      onDelete();
    } catch (error) {
      console.error('Failed to delete video:', error);
      onDeleteError(error);
    } finally {
      setShowConfirm(false);
      setShowOptions(false);
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center w-8"
      ref={optionsRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setShowOptions(!showOptions);
        }}
        className="p-1 rounded-full hover:bg-slate-700"
      >
        <MoreVertical className="text-gray-400 hover:text-white" size={20} />
      </button>
      
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-8 bg-slate-800 rounded-md shadow-lg z-10 w-48 py-1 border border-slate-700"
          >
            {isOwner && (
              <button 
                className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
              >
                <Trash2 className="mr-2" size={16} />
                Delete Video
              </button>
            )}
            <button 
              className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-slate-700"
              onClick={handleShare}
            >
              <Share2 className="mr-2" size={16} />
              Share
            </button>
            {isLoggedIn && (
              <button 
                className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPlaylistModal(true);
                }}
              >
                <ListPlus className="mr-2" size={16} />
                Save to Playlist
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
          >
            <motion.div 
              className="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white text-lg font-medium mb-4">Delete Video</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to delete this video? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded text-gray-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist Selection Modal - Using the reusable component */}
      {showPlaylistModal && (
        <AddToPlaylist 
          videoId={videoId} 
          onClose={() => {
            setShowPlaylistModal(false);
            setShowOptions(false);
          }}
          closePlaylistModal={()=>{
            setShowPlaylistModal(false);
          }}
        />
      )}
    </div>
  );
}