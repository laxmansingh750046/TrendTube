import API from '../../../services/axios.js';

const getAllTweets = () => API.get('/tweets');
const getTweetById = (id) => API.get(`/tweets/${id}`);
const createTweet = (data) => API.post('/tweets', data);
const replyToTweet = (id, content) => API.post(`/tweets/${id}/reply`, { content });

export default {
  getAllTweets,
  getTweetById,
  createTweet,
  replyToTweet,
};
