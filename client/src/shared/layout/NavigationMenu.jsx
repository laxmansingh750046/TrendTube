import { Link, useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import  LogoutConfirmation  from '../../features/auth/pages/LogoutConfirmation.jsx';
import { 
  Home, 
  Upload, 
  History, 
  Play, 
  Video, 
  ThumbsUp,
  LogOut,
  User,
  LogIn,
  UserPlus
} from 'lucide-react';

function NavigationMenu() {
  const username = useSelector((state)=> state.auth.user?.data?.user?.username);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const authItems = [
    { name: 'Login', slug: '/login', icon: <LogIn size={20} />, active: !authStatus },
    { name: 'Signup', slug: '/register', icon: <UserPlus size={20} />, active: !authStatus },
  ];

  const mainItems = [
    { name: 'Home', slug: '/', icon: <Home size={20} />, active: true },
    { name: 'Upload', slug: '/upload', icon: <Upload size={20} />, active: authStatus },
  ];

  const secondaryItems = [
    { name: 'Profile', slug: `/u/${username}`, icon: <User size={20} />, active: authStatus },
    { name: 'History', slug: '/history', icon: <History size={20} />, active: authStatus },
    { name: 'Playlists', slug: '/playlists', icon: <Play size={20} />, active: authStatus },
    { name: 'Your Videos', slug: '/your-videos', icon: <Video size={20} />, active: authStatus },
    { name: 'Liked Videos', slug: '/liked-videos', icon: <ThumbsUp size={20} />, active: authStatus },
  ];

  return (
    <div className="w-64 h-screen bg-slate-800 text-white flex flex-col">
      {/* Auth Navigation (shown when not logged in) */}
      {!authStatus && (
        <div className="space-y-1 p-2">
          {authItems.map(
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
      )}

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

        {/* Divider - only shown when logged in */}
        {authStatus && (
          <>
            <div className="border-t border-slate-700 my-2"></div>
            {/* Secondary Navigation */}
            <div className="space-y-1 p-2">
              {secondaryItems.map(
                (item) =>
                  item.active && (
                    <Link
                      key={item.name}
                      to={item.slug}
                      className="flex items-center space-x-3 px-3 py-2 hover:bg-slate-700 rounded"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  )
              )}
            </div>
          </>
        )}
      </div>

      {/* Logout at bottom (shown when logged in) */}
      {authStatus && (
  <div className="p-2 border-t border-slate-700">
    <LogoutConfirmation />
  </div>
)}
    </div>
  );
}

export default NavigationMenu;