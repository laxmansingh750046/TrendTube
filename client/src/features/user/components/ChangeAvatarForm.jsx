import { useState } from "react";
import userService from "../services/userService";

function ChangeAvatarForm({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("avatar", file);
    await userService.updateAvatar(formData);
    onUpload();
  };

  return (
    <div className="flex items-center gap-2">
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}
export default ChangeAvatarForm;
