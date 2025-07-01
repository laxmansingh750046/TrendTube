import API from '../../../services/axios.js';

const getWatchHistory = (page = 1) =>
  API.get(`/history?page=${page}&limit=10`);

const historyService ={
  getWatchHistory
}
export default historyService;
