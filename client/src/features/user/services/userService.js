import API from "../../../services/axios.js";

const register = (formData) => API.post("/users/register", formData);
const login = (data) => API.post("/users/login", data);
const logout = () => API.post("/users/logout");
const getCurrentUser = () => API.get("/users/current-user");
const updateAvatar = (data) => API.patch("/user/schange-avatar", data);
const updateCoverImage = (data) => API.patch("/users/change-coverimage", data);
const updateUsername = (data) => API.post("/users/change-username", data);
const updateFullname = (data) => API.post("/users/change-fullname", data);
const updateEmail = (data) => API.post("/users/change-email", data);
const changePassword = (data) => API.post("/users/change-password", data);
const getChannelByUsername = (username) => API.get(`/users/u/${username}`);
const getWatchHistory = () => API.get("/users/history");

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
