import API from '../../../services/axios.js';

const getWatchHistory = (page = 1) => 
  API.get(`/users/history?page=${page}&limit=10`);
const removeFromWatchHistory = (videoId) => 
  API.delete('/users/history', { data: { videoId } }); // Axios DELETE uses `data` key
const addToWatchHistory = (videoId) => 
  API.post('/users/history', { videoId });

const historyService ={
  getWatchHistory,
  removeFromWatchHistory,
  addToWatchHistory
}
export default historyService;
