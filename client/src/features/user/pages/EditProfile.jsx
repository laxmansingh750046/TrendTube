import { useEffect, useState } from "react";
import userService from "../services/userService";
import ChangeAvatarForm from "../components/ChangeAvatarForm";

function EditProfile() {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    const res = await userService.getCurrentUser();
    setUser(res.data.user);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <div className="mb-4">
        <label className="font-medium">Avatar</label>
        <ChangeAvatarForm onUpload={fetchProfile} />
      </div>
      {/* Add forms for username, email, coverImage, etc. */}
    </div>
  );
}
export default EditProfile;
