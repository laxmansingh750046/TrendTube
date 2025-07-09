import { useState } from "react";
import VideoCard from '../../video/components/VideoCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VideoGrid = ({ videos: initialVideos = [], isLoading = false }) => {
  const [videos, setVideos] = useState(initialVideos);
  
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

  return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-2"> 
          {videos?.map(video => 
            <VideoCard key={video._id} video={video} 
            onVideoDeleted={onVideoDeleted}
            onVideoDeleteError = {onVideoDeleteError}/>
          )}
        <ToastContainer />
        </div>
  );
};

export default VideoGrid;