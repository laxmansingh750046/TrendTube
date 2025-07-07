import {useState, useEffect} from 'react'
import videoService from "../services/videoService.js";
import extractPublicId from '../../../shared/utils/extractPublicId.js'
import formatTime from "../../../shared/utils/formatTime";
import { Link } from 'react-router-dom';
import formatDuration from '../../../shared/utils/formatDuration.js'


function UpNext() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    videoService.getAllVideos().then(res => setVideos(res.data.data.videos));
  }, []);
  return (
    <div className="grid grid-cols-1 gap-4 py-2">
      {videos?.map(video => <div key={video._id}>
         <Link key={video._id} to={`/watch?pi=${extractPublicId(video.videoFile)}&vi=${video._id}`}>
          <div className="h-[15vh] bg-slate-900 px-1 rounded shadow hover:shadow-md flex">
            {/* Thumbnail */}
            <div className="relative h-full w-80 mr-3">
              <img
                src={video.thumbnail}
                className="w-full h-full object-cover rounded-xl"
                alt={video.title}
                />
                <div className='flex items-center justify-center absolute bg-slate-700 rounded-[7px] px-2 right-4 bottom-3'>
                  <span className='text-gray-300 text-2xl'>{formatDuration(video.duration)}</span>
                </div>
            </div>
      
            {/* Details Section (35% of card) */}
            <div className="h-[35%] flex gap-4 pt-2">
      
              {/* Right Content Section */}
             <div className="flex flex-col gap-3 w-full">
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
          </div>)}
    </div>
  );
}

export default UpNext
