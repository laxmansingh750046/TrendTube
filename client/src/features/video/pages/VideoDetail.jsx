import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import videoService from "../services/videoService";
import VideoPlayer from "../components/VideoPlayer";

function VideoDetail() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    videoService.getVideoById(videoId).then(res => setVideo(res.data.video));
  }, [videoId]);

  if (!video) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <VideoPlayer videoUrl={video.videoFile} />
      <h1 className="mt-4 text-2xl font-bold">{video.title}</h1>
      <p className="text-gray-600 mt-1">{video.description}</p>
      <p className="text-sm text-gray-500 mt-1">Views: {video.views}</p>
    </div>
  );
}

export default VideoDetail;
