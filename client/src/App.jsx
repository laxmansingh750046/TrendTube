import React, {useState ,useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import authServices from './features/auth/services/authServices.js';
import Header from './shared/layout/Header.jsx';
import Footer from './shared/layout/Footer.jsx';
import { useDispatch } from 'react-redux';
import NavigationMenu from './shared/layout/NavigationMenu.jsx'
import { setUser, logout } from './features/auth/authSlice';

function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
     authServices.getCurrentUser()
     .then(userData =>{
       if(userData){
        dispatch(setUser({user:userData}));
      }else{
        dispatch(logout());
      } 
     }) 
     .catch(err => {
      console.error('Error fetching user data in app.jsx:', err);})  
     .finally(()=>setLoading(false));
  }, [])
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-1 bg-slate-900 w-[100%] py-1">
        <div className='h-[100%] w-[100%] flex'>
          <NavigationMenu />
          <Outlet />
         </div> 
      </main>

      <Footer />
    </div>
  );
}

export default App;