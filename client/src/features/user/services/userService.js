import API from "../../../services/axios.js";

const register = (formData) => API.post("/users/register", formData);
const login = (data) => API.post("/users/login", data);
const logout = () => API.post("/users/logout");
const getCurrentUser = () => API.get("/users/current-user");
const updateAvatar = (data) => API.patch("/users/change-avatar", data);
const updateCoverImage = (data) => API.patch("/users/change-coverimage", data);
const updateUsername = (data) => API.patch("/users/change-username", data);
const updateFullname = (data) => API.patch("/users/change-fullname", data);
const updateEmail = (data) => API.patch("/users/change-email", data);
const changePassword = (data) => API.patch("/users/change-password", data);
const getChannelByUsername = (username) => API.get(`/users/u/${username}`);
const getChannelVideos = (username, page = 1, limit = 10) => 
  API.get(`/users/videos/${username}?page=${page}&limit=${limit}`);
const getWatchHistory = () => API.get("/users/history");

const userService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
  updateCoverImage,
  updateUsername,
  updateFullname,
  updateEmail,
  changePassword,
  getChannelByUsername,
  getWatchHistory,
  getChannelVideos
};

export default userService;