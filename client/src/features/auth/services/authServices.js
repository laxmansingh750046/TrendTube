import API from "../../../services/axios";

const registerUser = async (formData) => {
  try {
    const res = await API.post("/users/register", formData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const loginUser = async (credentials) => {
  try {
    const res = await API.post("/users/login", credentials);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getCurrentUser = async () => {
  try {
    const res = await API.get("/users/current-user");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const authServices = {
  registerUser,
  loginUser,
  getCurrentUser,
};

export default authServices;
