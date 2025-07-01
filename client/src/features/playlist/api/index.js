import API from './axios'; // axios with baseURL

const createPlaylist = (data) => API.post("/playlist", data);
const getUserPlaylists = (userId) => API.get(`/playlist/user/${userId}`);
const getPlaylistById = (playlistId) => API.get(`/playlist/${playlistId}`);
const addVideoToPlaylist = (videoId, playlistId) => API.patch(`/playlist/add/${videoId}/${playlistId}`);
const removeVideoFromPlaylist = (videoId, playlistId) => API.patch(`/playlist/remove/${videoId}/${playlistId}`);

export default {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist
};
