import API from "../../../services/axios.js";

const getAllVideos = () => API.get("/videos");
const getVideoById = (id) => API.get(`/videos/${id}`);
const publishAVideo = (formData) =>
  API.post("/videos", formData);
const deleteVideo = (id) => API.delete(`/videos/${id}`);
const updateVideo = (id, formData) =>
  API.patch(`/videos/${id}`, formData);
const togglePublishStatus = (id) =>
  API.patch(`/videos/toggle/publish/${id}`);
const incrementView = (id) => 
  API.patch(`videos/vw/${id}`);

const videoService = {
  getAllVideos,
  getVideoById,
  publishAVideo,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
  incrementView
};

export default videoService;
