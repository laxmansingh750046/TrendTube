import API from "../../../services/axios";

const registerUser = async (formData) => {
  try {
    const res = await API.post("/user/register", formData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const loginUser = async (credentials) => {
  try {
    const res = await API.post("/user/login", credentials);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getCurrentUser = async () => {
  try {
    const res = await API.get("/user/current-user");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const authService = {
  registerUser,
  loginUser,
  getCurrentUser,
};

export default authService;
