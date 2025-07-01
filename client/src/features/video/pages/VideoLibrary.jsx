import { useEffect, useState } from "react";
import videoService from "../services/videoService.js";
import VideoCard from "../components/VideoCard.jsx";

function VideoLibrary() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    videoService.getAllVideos().then(res => setVideos(res.data.videos));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {videos.map(video => <VideoCard key={video._id} video={video} />)}
    </div>
  );
}

export default VideoLibrary;
