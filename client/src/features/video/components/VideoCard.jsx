import extractPublicId from '../../../shared/utils/extractPublicId.js'
import formatTime from "../../../shared/utils/formatTime";
import { Link } from 'react-router-dom';

function VideoCard({ video }) {
  const publicId = extractPublicId(video.videoFile);
  return (
    <Link to={`/watch?pi=${publicId}&vi=${video._id}`}>
    <div className="h-[50vh] bg-slate-900 px-1 rounded shadow hover:shadow-md">
      {/* Thumbnail */}
      <div className="h-[65%]">
        <img
          src={video.thumbnail}
          className="w-full h-full object-cover rounded-xl"
          alt={video.title}
          />
      </div>

      {/* Details Section (35% of card) */}
      <div className="h-[35%] flex gap-3 pt-2">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-600">
            <img
              src={video.avatar}
              alt="Channel Logo"
              className="w-full h-full object-cover object-top"
              />
          </div>
        </div>

        {/* Right Content Section */}
       <div className="flex flex-col w-full">
          {/* Video Description (50%) */}
          <div className="mb-2">
            <h3 className="text-white font-semibold text-2xl leading-tight line-clamp-2">
              {video.title}
            </h3>
          </div>

            <div className="mb-0 text-white text-base opacity-80">
              {video.username}
            </div>

            <div className="flex items-center text-white text-base opacity-70">
              <span>{video.views} views</span>
              <span className="mx-1">•</span>
              <span>{formatTime(video.createdAt)}</span>
            </div>
        </div>
      </div>
    </div>
    </Link>
  );
}
export default VideoCard;
