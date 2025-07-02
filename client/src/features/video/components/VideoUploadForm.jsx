import { useState } from "react";
import videoService from "../services/videoService";
import InputField from "../../../shared/components/InputField.jsx"; 

function VideoUploadForm({ onSuccess }) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);
      formData.append("title", title);
      formData.append("description", description);

      await videoService.publishAVideo(formData);
      onSuccess?.();
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto p-4">
      <InputField
        label="Video File"
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />

      <InputField
        label="Thumbnail Image"
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files[0])}
      />

      <InputField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter video title"
      />

      <div>
        <label className="inline-block mb-1 pl-1 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description"
          className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-300 w-full"
        />
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Upload
      </button>
    </div>
  );
}

export default VideoUploadForm;
