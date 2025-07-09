import { useState } from "react";
import { useDispatch } from "react-redux";
import userService from "../services/userService";
import { toast } from "react-hot-toast";
import authServices from "../../auth/services/authServices";
import { setUser } from '../../auth/authSlice.js';


function PersonalDetailsForm({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    fullname: user.fullname
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update each field separately (you might want to batch these)
      if (formData.username !== user.username) {
        await userService.updateUsername({ username: formData.username });
      }
      if (formData.email !== user.email) {
        await userService.updateEmail({ email: formData.email });
      }
      if (formData.fullname !== user.fullname) {
        await userService.updateFullname({ fullname: formData.fullname });
      }
      
      const userData = await authServices.getCurrentUser();
      if (userData) dispatch(setUser({ user: userData.data.user }));
      toast.success("Profile updated successfully");
      onUpdate();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export default PersonalDetailsForm;