import API from "../../../services/axios.js";

const register = (formData) => API.post("/user/register", formData);
const login = (data) => API.post("/user/login", data);
const logout = () => API.post("/user/logout");
const getCurrentUser = () => API.get("/user/current-user");
const updateAvatar = (data) => API.patch("/user/change-avatar", data);
const updateCoverImage = (data) => API.patch("/user/change-coverimage", data);
const updateUsername = (data) => API.post("/user/change-username", data);
const updateFullname = (data) => API.post("/user/change-fullname", data);
const updateEmail = (data) => API.post("/user/change-email", data);
const changePassword = (data) => API.post("/user/change-password", data);
const getChannelByUsername = (username) => API.get(`/user/u/${username}`);
const getWatchHistory = () => API.get("/user/history");

export default {
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
  getWatchHistory
};
