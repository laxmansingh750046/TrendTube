import { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import authServices from './features/auth/services/authServices.js';
import Header from './shared/layout/Header.jsx';
import Footer from './shared/layout/Footer.jsx';
import { useDispatch } from 'react-redux';
import NavigationMenu from './shared/layout/NavigationMenu.jsx';
import { setUser, logout } from './features/auth/authSlice';

function App() {
  const [loading, setLoading] = useState(false);
  const [isNavMinimized, setIsNavMinimized] = useState(false); // New state for nav minimized
  const dispatch = useDispatch();
  const location = useLocation();
  const hideNavRoutes = ['/watch'];
  const hideNav = hideNavRoutes.includes(location.pathname);
  
  useEffect(() => {
    setLoading(true);
    authServices.getCurrentUser()
      .then(userData => {
        if(userData) {
          dispatch(setUser({user: userData.data.user}));
        } else {
          dispatch(logout());
        } 
      })  
      .catch(err => {
        console.error('Error fetching user data in app.jsx:', err);
      })  
      .finally(() => setLoading(false));
  }, []);

  if(loading) return <div className='h-full w-full flex justify-center items-center'><h1>Loading ...</h1></div>

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      
      <div className="flex flex-1 relative">
        {!hideNav && 
          <NavigationMenu 
            isMinimized={isNavMinimized} 
            toggleMinimize={() => setIsNavMinimized(!isNavMinimized)} 
          />
        }
       
        <div className={`flex-1 transition-all duration-300 mt-4 mr-5 
          ${hideNav ? "pl-4": (isNavMinimized ? "pl-20" : "pl-48")} 
          flex flex-col min-h-[calc(100vh-4rem)]
          max-md:mx-4 max-md:px-4
          `}
        >
          <main className="flex-1 bg-slate-900 mt-14">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;