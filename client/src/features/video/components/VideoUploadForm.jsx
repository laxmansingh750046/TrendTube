import { useState } from "react";
import videoService from "../services/videoService";

function VideoUploadForm({ onSuccess }) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);

    await videoService.publishAVideo(formData);
    onSuccess?.();
  };

  return (
    <div className="space-y-3">
      <input type="file" onChange={e => setVideoFile(e.target.files[0])} />
      <input type="file" onChange={e => setThumbnail(e.target.files[0])} />
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border w-full p-2" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border w-full p-2" />
      <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (e.g. 5:12)" className="border w-full p-2" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Upload</button>
    </div>
  );
}

export default VideoUploadForm;
