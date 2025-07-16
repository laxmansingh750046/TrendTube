import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutConfirmation from '../../features/auth/pages/LogoutConfirmation.jsx';
import { 
  Home, 
  Upload, 
  History, 
  Play, 
  Video, 
  ThumbsUp,
  User,
  LogIn,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

function NavigationMenu({ isMinimized, toggleMinimize }) {
  const username = useSelector((state) => state.auth.user?.username);
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
    { name: 'Liked Videos', slug: '/liked-videos', icon: <ThumbsUp size={20} />, active: authStatus },
    { name: 'About', slug: '/about', icon: <Info size={20} />, active: true },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className={`hidden md:block fixed top-20 z-50 ${isMinimized ? 'w-16' : 'w-52'} h-[89vh] bg-slate-800 text-white flex flex-col transition-all duration-300`}>
        {/* Minimize Button */}
        <button 
          onClick={toggleMinimize}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-slate-700 rounded-full p-1 hover:bg-slate-400 z-10"
        >
          {isMinimized ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Auth Navigation */}
        {!authStatus && (
          <div className="space-y-1 p-2">
            {authItems.map(
              (item) =>
                item.active && (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    className={({ isActive }) => 
                      `flex items-center ${isMinimized ? 'justify-center' : 'space-x-3'} w-full px-3 py-2 rounded ${
                        isActive ? 'bg-slate-600' : 'hover:bg-slate-500'
                      }`
                    }
                    title={isMinimized ? item.name : ''}
                  >
                    {item.icon}
                    {!isMinimized && <span>{item.name}</span>}
                  </NavLink>
                )
            )}
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `flex items-center ${isMinimized ? 'justify-center' : 'space-x-3'} w-full px-3 py-2 rounded ${
                  isActive ? 'bg-slate-600' : 'hover:bg-slate-500'
                }`
              }
              title={isMinimized ? 'About' : ''}
            >
              <Info size={20} />
              {!isMinimized && <span>About</span>}
            </NavLink>
          </div>
        )}

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {mainItems.map(
              (item) =>
                item.active && (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    className={({ isActive }) => 
                      `flex items-center ${isMinimized ? 'justify-center' : 'space-x-3'} w-full px-3 py-2 rounded ${
                        isActive ? 'bg-slate-600' : 'hover:bg-slate-500'
                      }`
                    }
                    title={isMinimized ? item.name : ''}
                  >
                    {item.icon}
                    {!isMinimized && <span>{item.name}</span>}
                  </NavLink>
                )
            )}
          </div>

          {/* Divider */}
          {authStatus && (
            <>
              <div className="border-t border-slate-700 my-2"></div>
              <div className="space-y-1 p-2">
                {secondaryItems.map(
                  (item) =>
                    item.active && (
                      <NavLink
                        key={item.name}
                        to={item.slug}
                        className={({ isActive }) => 
                          `flex items-center ${isMinimized ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded ${
                            isActive ? 'bg-slate-600' : 'hover:bg-slate-500'
                          }`
                        }
                        title={isMinimized ? item.name : ''}
                      >
                        {item.icon}
                        {!isMinimized && <span>{item.name}</span>}
                      </NavLink>
                    )
                )}
              </div>
            </>
          )}
        </div>

        {/* Logout */}
        {authStatus && (
          <div className="p-2 border-t border-slate-700">
            <LogoutConfirmation isMinimized={isMinimized} />
          </div>
        )}
      </div>

      {/* Mobile Navigation (Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-800 text-white flex justify-around items-center py-2 border-t border-slate-700">
        {/* Show only the most important items for mobile */}
        {mainItems.map(
          (item) =>
            item.active && (
              <NavLink
                key={item.name}
                to={item.slug}
                className={({ isActive }) => 
                  `flex flex-col items-center p-2 rounded ${
                    isActive ? 'bg-slate-600' : 'hover:bg-slate-500'
                  }`
                }
                title={item.name}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </NavLink>
            )
        )}
        
        {!authStatus ? (
          <>
            {authItems.map(
              (item) =>
                item.active && (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    className={({ isActive }) => 
                      `flex flex-col items-center p-2 rounded ${
                        isActive ? 'bg-slate-600' : 'hover:bg-slate-500'
                      }`
                    }
                    title={item.name}
                  >
                    {item.icon}
                    <span className="text-xs mt-1">{item.name}</span>
                  </NavLink>
                )
            )}
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `flex flex-col items-center p-2 rounded ${
                  isActive ? 'bg-slate-600' : 'hover:bg-slate-500'
                }`
              }
              title="About"
            >
              <Info size={20} />
              <span className="text-xs mt-1">About</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to={`/u/${username}`}
              className={({ isActive }) => 
                `flex flex-col items-center p-2 rounded ${
                  isActive ? 'bg-slate-600' : 'hover:bg-slate-500'
                }`
              }
              title="Profile"
            >
              <User size={20} />
              <span className="text-xs mt-1">Profile</span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `flex flex-col items-center p-2 rounded ${
                  isActive ? 'bg-slate-600' : 'hover:bg-slate-500'
                }`
              }
              title="About"
            >
              <Info size={20} />
              <span className="text-xs mt-1">About</span>
            </NavLink>
          </>
        )}
      </div>
    </>
  );
}

export default NavigationMenu;