import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoGrid = ({ videos = [], isLoading = false }) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg aspect-video animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {videos.map((video) => (
        <motion.div 
          key={video._id} 
          variants={item}
          className="group relative cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <div className="p-3 bg-black bg-opacity-60 rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play className="text-white" size={20} />
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
            <p className="text-gray-500 text-xs mt-1">{video.views} views</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VideoGrid;