import extractPublicId from '../../../shared/utils/extractPublicId.js'
import VideoPlayer from "./VideoPlayer.jsx";
import { formatTime } from "../../../shared/utils/formatTime";
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

// import { useState } from "react";
// import VideoPlayer from "./VideoPlayer";
// import { formatTime } from "../../../shared/utils/formatTime";

// function VideoCard({ video }) {
  //   const videoUrl = video.videoFile;
  //   const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  //   const handleCardClick = () => {
    //     setIsVideoOpen(true);
//   };

//   const handleCloseVideo = () => {
//     setIsVideoOpen(false);
//   };

//   return (
//     <>
//       <div 
//         className="h-[40vh] bg-slate-800 p-3 rounded-full shadow hover:shadow-md cursor-pointer"
//         onClick={handleCardClick}
//       >
//         {/* Thumbnail */}
//         <div className="h-[65%]">
//           <img
//             src={video.thumbnail}
//             className="w-full h-full object-cover rounded-xl"
//             alt={video.title}
//           />
//         </div>

//         {/* Details Section (35% of card) */}
//         <div className="h-[35%] flex gap-3 pt-2">
//           {/* Logo Section */}
//           <div className="flex-shrink-0">
//             <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-600">
//               <img
//                 src={video.avatar}
//                 alt="Channel Logo"
//                 className="w-full h-full object-cover object-top"
//               />
//             </div>
//           </div>

//           {/* Right Content Section */}
//           <div className="flex flex-col w-full">
//             {/* Video Description (50%) */}
//             <div className="mb-2">
//               <h3 className="text-white font-semibold text-2xl leading-tight line-clamp-2">
//                 {video.title}
//               </h3>
//             </div>

//             <div className="mb-0 text-white text-base opacity-80">
//               {video.username}
//             </div>

//             <div className="flex items-center text-white text-base opacity-70">
//               <span>{video.views} views</span>
//               <span className="mx-1">•</span>
//               <span>{formatTime(video.createdAt)}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isVideoOpen && (
//         <VideoPlayer 
//           videoUrl={videoUrl}
//           onClose={handleCloseVideo}
//           title={video.title}
//         />
//       )}
//     </>
//   );
// }
// export default VideoCard;


// // import { Link } from "react-router-dom";

// // function VideoCard({ video }) {
// //   return (
// //     <Link to={`/playvideo`} className="block border p-3 rounded shadow hover:shadow-md">
// //       <img src={video.thumbnail} className="w-full h-40 object-cover rounded" />
// //       <h3 className="mt-2 font-semibold">{video.title}</h3>
// //       <p className="text-gray-500 text-sm">{video.views} views</p>
// //     </Link>
// //   );
// // }
// // export default VideoCard;

