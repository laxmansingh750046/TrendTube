import { useEffect, useState } from "react";
import videoService from "../services/videoService.js";
import VideoCard from "../components/VideoCard.jsx";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VideoLibrary() {
  const [videos, setVideos] = useState([]);
  
    useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await videoService.getAllVideos();
        setVideos(response.data.data.videos || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Failed to load videos");
      }
    };
    
    fetchVideos();
  }, []); // Removed onDelete from dependencies as it's not needed


  const onVideoDeleted = (deletedVideoId, videoTitle) => {
    // Remove the deleted video from state
    setVideos(prevVideos => prevVideos.filter(video => video._id !== deletedVideoId));
    
    // Show success message with the video title
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

  return (
    <div className="px-3 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {videos.map(video => (
        <VideoCard 
          key={video._id} 
          video={video} 
          onVideoDeleted={onVideoDeleted}
          onVideoDeleteError = {onVideoDeleteError}
        />
      ))}
      
      <ToastContainer />
    </div>
  );
}

export default VideoLibrary;