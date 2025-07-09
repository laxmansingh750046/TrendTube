import extractPublicId from '../../../shared/utils/extractPublicId.js'
import formatTime from "../../../shared/utils/formatTime";
import { Link, useNavigate } from 'react-router-dom';
import formatDuration from '../../../shared/utils/formatDuration.js'
import VideoOptionsMenu from './VideoOptionsMenu.jsx';

function VideoCard({ video , onVideoDeleted = ()=>{}, onVideoDeleteError = ()=>{}}) {
  const navigate= useNavigate();
  const publicId = extractPublicId(video.videoFile);
  const duration=formatDuration(video.duration);

  const onDelete = ()=>{
    onVideoDeleted(video._id, video.title);
  }

  const onDeleteError = ()=>{
    onVideoDeleteError(video._id, video.title);
  }

  return (
    <div className="h-[35vh] bg-slate-900 px-1rounded shadow hover:shadow-md cursor-pointer"
       onClick={()=>navigate(`/watch?pi=${publicId}&vi=${video._id}`)}
    >
      {/* Thumbnail */}
      <div className="relative h-[65%]">
        <img
          src={video.thumbnail}
          className="w-full h-full object-cover rounded-xl"
          alt={video.title}
          />
          <div className='flex items-center justify-center absolute bg-slate-700 rounded-[7px] px-2 right-4 bottom-3'>
            <span className='text-gray-300 text-2xl'>{duration}</span>
          </div>
      </div>

      {/* Details Section (35% of card) */}
      <div className="h-[35%] flex gap-3 pt-2">
        {/* Logo Section 1st container*/}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-600">
            <img
              src={video.avatar}
              alt="Channel Logo"
              className="w-full h-full object-cover object-top"
              />
          </div>
        </div>

        {/* 2nd Contaniner  */}
       <div className="flex flex-col w-full">
          {/* Video Description (50%) */}
          <div className="mb-2">
            <h3 className="text-white font-semibold text-2xl leading-tight line-clamp-2">
              {video.title}
            </h3>
          </div>
            
            <Link to={`/u/${video.username}/videos`}
              onClick={(e)=>e.stopPropagation()}
            >
              <div className="text-gray-300 text-base opacity-80 hover:text-white hover:text-xl">
                {video.username}
              </div>
            </Link>

            <div className="flex items-center text-white text-base opacity-70">
              <span>{video.views} views</span>
              <span className="mx-1">•</span>
              <span>{formatTime(video.createdAt)}</span>
            </div>
        </div>

        {/* third container */}
        <VideoOptionsMenu videoId={video._id} publicId={publicId} isOwner={video.isOwner} onDelete={onDelete} onDeleteError={onDeleteError}  />
      </div>
    </div>
  );
}
export default VideoCard;

