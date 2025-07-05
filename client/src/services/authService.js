import API from './axios.js'

const logout = async()=>{
    try {
      await API.post("/users/logout");  
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const authService = {logout}
export default authService;