import React, {useState ,useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import authServices from './features/auth/services/authServices.js';
import Header from './shared/layout/Header.jsx';
import Footer from './shared/layout/Footer.jsx';
import { setUser } from './features/auth/authSlice';

function App() {
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;