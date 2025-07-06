import {useState} from 'react'
import { useSearchParams } from 'react-router-dom';
import VideoPlayer from "../../components/VideoPlayer";
import CommentsSection from '../../../comment/pages/CommentsSection';

function Watch() {
  const[isCommentRightSide, setIsCommentRightSide] =useState(true);
  const [searchParams] = useSearchParams();
  const publicId = searchParams.get("pi");
  const videoId = searchParams.get("vi");
  return (
    // {main container}
     <div className="w-full h-full flex">
        {/* left container */}
        <div className='h-full w-[65%]'>
            <div className="aspect-video flex ">
                <VideoPlayer className="w-full h-full" publicId={publicId} />
            </div>
            <div>
                 {isCommentRightSide?<div>description</div>:<CommentsSection videoId={videoId}/>}
            </div>
        </div>
        {/* right container*/}
      <div className='text-white w-[35%] px-2 flex flex-col flex-center'>
           {/* // button for togling */}
            <div className="flex items-center justify-center mb-3">
              <button
                onClick={() => setIsCommentRightSide(p => !p)}
                className="relative px-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                <span className="relative z-10">
                  {isCommentRightSide ? "Up Next":"Comments"}
                </span>
                <span className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
              </button>
            </div>
        <div>
          {isCommentRightSide?<CommentsSection videoId={videoId}/>:<div>description</div>}
        </div>
      </div>
    </div>
  )
}

export default Watch;
