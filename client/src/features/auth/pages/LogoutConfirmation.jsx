import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authServices.js';
import { logout } from '../authSlice.js';
import { motion, AnimatePresence } from 'framer-motion';

function LogoutConfirmation({isMinimized}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logouthandler = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Button to open the modal - use this in your NavigationMenu */}
      <button
        className='flex items-center space-x-3 w-full px-3 py-2 hover:bg-slate-400 rounded text-red-400'
        onClick={() => setIsOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        {!isMinimized &&<span>Logout</span>}
      </button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop with blur effect */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal card - centered with vertical offset */}
            <motion.div
              className="relative bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-slate-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ 
                scale: 1, 
                y: "-30vh" // 30% from top of viewport
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Logout Confirmation</h3>
                <p className="text-slate-300">Are you sure you want to logout?</p>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={logouthandler}
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default LogoutConfirmation;