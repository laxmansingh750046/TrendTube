import { useState } from "react";
import userService from "../services/userService";
import { toast } from "react-hot-toast";

function ChangeAvatarForm({avatar, onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("avatar", file);
      await userService.updateAvatar(formData);
      toast.success("Avatar updated successfully");
      onUpload();
      setPreview(null);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to update avatar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-x-5">
          <div className="w-24 h-24 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200">
          <img 
            src={avatar} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
      {preview && (
        <div className="w-24 h-24 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      </div>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      
      <button 
        onClick={handleUpload}
        disabled={isLoading || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Uploading..." : "Upload Avatar"}
      </button>
    </div>
  );
}

export default ChangeAvatarForm;