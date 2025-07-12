import { useEffect, useState } from "react";
import VideoCard from "../../video/components/VideoCard.jsx";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import likeService from '../likesServices/likesServices.js';

function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const response = await likeService.getAllLikedVideos();
        setVideos(response?.data?.data?.videos || []);
      } catch (error) {
        console.error("Error fetching liked videos:", error);
        toast.error("Failed to load liked videos");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLikedVideos();
  }, []);

  const onVideoDeleted = (deletedVideoId, videoTitle) => {
    setVideos(prevVideos => prevVideos.filter(video => video._id !== deletedVideoId));
    toast.success(`"${videoTitle}" has been deleted successfully`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  
  const onVideoDeleteError = (videoId, videoTitle) => {
    toast.error(`Failed to delete "${videoTitle}"`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400">
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Liked Videos</h1>
      
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className="text-xl">No videos liked yet</p>
          <p className="text-sm mt-2">Videos you like will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {videos.map(video => (
            <VideoCard 
              key={video._id} 
              video={video} 
              onVideoDeleted={onVideoDeleted}
              onVideoDeleteError={onVideoDeleteError}
            />
          ))}
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
}

export default LikedVideos;