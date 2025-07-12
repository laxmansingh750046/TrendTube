import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import userService from "../services/userService";
import ChangeAvatarForm from "../components/ChangeAvatarForm";
import ChangeCoverImageForm from "../components/ChangeCoverImageForm";
import PersonalDetailsForm from "../components/PersonalDetailsForm";
import ChangePasswordForm from "../components/ChangePasswordForm";

function EditProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await userService.getCurrentUser();
      setUser(res.data.data.user);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mt-5 mx-auto p-4">
      <h1 className="text-2xl text-white font-bold mb-6">Edit Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-48 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("personal")}
                className={`w-full text-left px-3 py-2 rounded-md ${activeTab === "personal" ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
              >
                Personal Details
              </button>
              <button
                onClick={() => setActiveTab("avatar")}
                className={`w-full text-left px-3 py-2 rounded-md ${activeTab === "avatar" ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
              >
                Profile Picture
              </button>
              <button
                onClick={() => setActiveTab("cover")}
                className={`w-full text-left px-3 py-2 rounded-md ${activeTab === "cover" ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
              >
                Cover Image
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-3 py-2 rounded-md ${activeTab === "password" ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
              >
                Change Password
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {activeTab === "personal" && (
            <PersonalDetailsForm user={user} onUpdate={fetchProfile} />
          )}

          {activeTab === "avatar" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <img 
                    src={user.avatar || "/default-avatar.png"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChangeAvatarForm onUpload={fetchProfile} />
              </div>
            </div>
          )}

          {activeTab === "cover" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Cover Image</h2>
              <div className="mb-6">
                <div className="h-48 w-full rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={user.coverImage || "/default-cover.jpg"} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChangeCoverImageForm onUpload={fetchProfile} />
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <ChangePasswordForm onUpload={fetchProfile}/>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProfile;