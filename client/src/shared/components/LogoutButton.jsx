import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../services/authService.js' 
import {logout} from '../../features/auth/authSlice.js'


function LogoutButton() {
    const dispatch = useDispatch();
    const logouthandler =  () => {
        authService.logout()
            .then(() => {
                dispatch(logout());
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }
    return (
      <button
      className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 hover:text-black rounded-full'
      onClick={logouthandler}
      >
        Logout
      </button>
    )
}

export default LogoutButton