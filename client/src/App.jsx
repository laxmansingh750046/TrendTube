import React, {useState, useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import authServices from './features/auth/services/authServices.js';
import Header from './shared/layout/Header.jsx';
import Footer from './shared/layout/Footer.jsx';
import { useDispatch, useSelector } from 'react-redux';
import NavigationMenu from './shared/layout/NavigationMenu.jsx'
import { setUser, logout } from './features/auth/authSlice';

function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
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
  }, [])

  if(loading) return <div className='h-full w-full flex justify-center items-center'><h1>Loading ...</h1></div>

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      
      {/* Main content wrapper */}
      <div className="flex flex-1 relative">
        <NavigationMenu />
        
        {/* Content area with padding for footer */}
        <div className="flex-1 pl-56 flex flex-col min-h-[calc(100vh-4rem)]">
          <main className="flex-1 bg-slate-900">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;