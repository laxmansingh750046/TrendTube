import { useEffect, useState } from "react";
import VideoCard from "../../video/components/VideoCard.jsx";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import historyService from "../services/historyService.js";

function WatchHistory() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        setLoading(true);
        const response = await historyService.getWatchHistory();
        console.log("history res: ",response);
        setVideos(response?.data?.data?.docs || []);
      } catch (error) {
        console.error("Error fetching watch history:", error);
        toast.error("Failed to load watch history");
      } finally {
        setLoading(false);
      }
    };
    
    fetchWatchHistory();
  }, []);

  const removeFromHistory = async (videoId) => {
    try {
      await historyService.removeFromWatchHistory(videoId);
      setVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
      toast.success("Removed from watch history");
    } catch (error) {
      console.error("Error removing from history:", error);
      toast.error("Failed to remove from history");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Watch History</h1>
      
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <p className="text-xl">No watch history yet</p>
          <p className="text-sm mt-2">Videos you watch will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {videos.map(video => (
            <div key={video._id} className="relative group">
              <VideoCard video={video} />
              <button
                onClick={() => removeFromHistory(video._id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from history"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
}

export default WatchHistory;