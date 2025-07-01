import API from "../../../services/axios.js";

const getAllVideos = () => API.get("/video");
const getVideoById = (id) => API.get(`/video/${id}`);
const publishAVideo = (formData) =>
  API.post("/video", formData);
const deleteVideo = (id) => API.delete(`/video/${id}`);
const updateVideo = (id, formData) =>
  API.patch(`/video/${id}`, formData);
const togglePublishStatus = (id) =>
  API.patch(`/video/toggle/publish/${id}`);

export default {
  getAllVideos,
  getVideoById,
  publishAVideo,
  deleteVideo,
  updateVideo,
  togglePublishStatus
};
