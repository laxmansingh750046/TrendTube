import {useState, useEffect} from 'react'
import videoService from "../services/videoService.js";
import extractPublicId from '../../../shared/utils/extractPublicId.js'
import formatTime from "../../../shared/utils/formatTime";
import { Link } from 'react-router-dom';
import formatDuration from '../../../shared/utils/formatDuration.js'

function UpNext() {
  const [videos, setVideos] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(()=>{
    const handleResize = ()=>{
      setIsMobile(window.innerWidth <= 640);
    } 
    window.addEventListener('resize', handleResize);
    handleResize();
    return ()=> window.removeEventListener('resize', handleResize);
  });

  useEffect(() => {
    videoService.getAllVideos().then(res => setVideos(res.data.data.videos));
  }, []);
  return (
    <div className="flex flex-col items-stretch bg-slate-800 gap-y-2">
        {videos?.map(video => 
              <Link key={video._id} to={`/watch?pi=${extractPublicId(video.videoFile)}&vi=${video._id}`}>
                  <div className="h-[10vh] sm:h-[15vh] bg-slate-900 flex items-stretch rounded-xl">
                    {/* Thumbnail */}
                      <div className="relative h-full w-40 sm:w-60 mr-3">
                           <img
                                src={video.thumbnail}
                                className="w-full h-full object-cover rounded-xl"
                                alt={video.title}
                            />
                            <div className='flex items-center justify-center absolute bg-slate-800 rounded-[7px] px-2 right-4 bottom-3'>
                                <span className='text-gray-200 text-sm sm:text-1xl'>{formatDuration(video.duration)}</span>
                            </div>
                      </div>
              
                      {/* Details Section (35% of card) */}
                      <div className="h-[35%] flex gap-4 pt-2">
                
                          {/* Right Content Section */}
                          <div className="flex flex-col justify-between items-start gap-y-[2px] sm:gap-3 w-full">
                            
                            {/* Video Description (50%) */}
                              <div>
                                  <h3 className="text-white text-sm sm:text-base leading-tight line-clamp-2">
                                    {video.title}
                                  </h3>
                              </div>
                  
                              <div className=" text-gray-200 text-sm sm:text-base opacity-80">
                                  {video.username}
                              </div>
                  
                              <div className="flex items-center text-gray-300 text-sm opacity-70">
                                  <span>{video.views} views</span>
                                  <span className="mx-1">•</span>
                                  <span>{formatTime(video.createdAt)}</span>
                              </div>

                          </div>
                      </div>
                  </div>
              </Link>
        )}
    </div>
  );
}

export default UpNext
