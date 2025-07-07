import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LogoutButton } from '../components';
import { 
  Home, 
  Upload, 
  History, 
  Play, 
  Video, 
  ThumbsUp,
  LogOut,
  User
} from 'lucide-react';

function NavigationMenu() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const mainItems = [
    { name: 'Home', slug: '/', icon: <Home size={20} />, active: true },
    { name: 'Upload', slug: '/upload', icon: <Upload size={20} />, active: authStatus },
  ];

  const secondaryItems = [
    { name: 'Profile', slug: '/u', icon: <User size={20} /> }, 
    { name: 'History', slug: '/history', icon: <History size={20} /> },
    { name: 'Playlists', slug: '/playlists', icon: <Play size={20} /> },
    { name: 'Your Videos', slug: '/your-videos', icon: <Video size={20} /> },
    { name: 'Liked Videos', slug: '/liked-videos', icon: <ThumbsUp size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-slate-800 text-white flex flex-col">
      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {mainItems.map(
            (item) =>
              item.active && (
                <button
                  key={item.name}
                  onClick={() => navigate(item.slug)}
                  className="flex items-center space-x-3 w-full px-3 py-2 hover:bg-slate-700 rounded"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              )
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-2"></div>

        {/* Secondary Navigation */}
        <div className="space-y-1 p-2">
          {secondaryItems.map((item) => (
            <Link
              key={item.name}
              to={item.slug}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-slate-700 rounded"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Logout at bottom */}
      {authStatus && (
        <div className="p-2 border-t border-slate-700">
          <button
            onClick={() => navigate('/logout')}
            className="flex items-center space-x-3 w-full px-3 py-2 hover:bg-slate-700 rounded text-red-400"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default NavigationMenu;