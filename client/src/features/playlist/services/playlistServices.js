import API from '../../../services/axios.js';

export default {
  createPlaylist: (data) => API.post('/playlists', data),
  getPlaylistById: (playlistId) => API.get(`/playlists/${playlistId}`),
  updatePlaylist: (playlistId) => API.patch(`/playlists/${playlistId}`),
  deletePlaylist: (playlistId) => API.delete(`/playlists/${playlistId}`),
  addVideoToPlaylist: (playlistId, videoId) => 
    API.patch(`/playlists/add/${videoId}/${playlistId}`),
  removeVideoFromPlaylist: (playlistId, videoId) => 
    API.patch(`/playlists/remove/${videoId}/${playlistId}`),
  getPlaylistVideos: (playlistId) => API.get(`/playlists/videos/${playlistId}`),
  getUserPlaylists: () => API.get('/playlists/user/owner'),
};