import { Link } from "react-router-dom";

function VideoCard({ video }) {
  return (
    <Link to={`/video/${video._id}`} className="block border p-3 rounded shadow hover:shadow-md">
      <img src={video.thumbnail} className="w-full h-40 object-cover rounded" />
      <h3 className="mt-2 font-semibold">{video.title}</h3>
      <p className="text-gray-500 text-sm">{video.views} views</p>
    </Link>
  );
}
export default VideoCard;
