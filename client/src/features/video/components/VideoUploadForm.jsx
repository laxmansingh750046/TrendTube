import { useRef, useState } from "react";
import videoService from "../services/videoService";
import SmartInputField from "../../../shared/components/SmartInputField.jsx";
import LoadOverlay from "../../../shared/components/LoadOverLay.jsx";

function VideoUploadForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef();
  const thumbRef = useRef();
  const titleRef = useRef();
  const descRef = useRef();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const videoFile = videoRef.current.files?.[0];
      const thumbnail = thumbRef.current.files?.[0];
      const title = titleRef.current.value;
      const description = descRef.current.value;

      const formData = new FormData();
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);
      formData.append("title", title);
      formData.append("description", description);

      await videoService.publishAVideo(formData);
      onSuccess?.();
    } catch (error) {
      console.error("Error loading video:", error);
      alert("Failed to upload video. Please try again.");
    } finally{
      setLoading(false);
    }
  };

  return (
    
  <LoadOverlay loading={loading}>
    <div className="space-y-4 max-w-xl mx-auto p-4">
      <SmartInputField
        ref={videoRef}
        label="Video File"
        type="file"
        accept="video/*"
        validate={(file) => (file ? [] : ["Please upload a video file."])}
        successCheck={(file) => !!file}
      />

      <SmartInputField
        ref={thumbRef}
        label="Thumbnail Image"
        type="file"
        accept="image/*"
        validate={(file) => (file ? [] : ["Please upload a thumbnail image."])}
        successCheck={(file) => !!file}
      />

      <SmartInputField
        ref={titleRef}
        label="Title"
        placeholder="Enter video title"
        validate={(val) =>
          val.length === 0
            ? ["Title is required"]
            : val.length > 100
            ? ["Title must be under 100 characters"]
            : []
        }
        successCheck={(val) => val.length > 0 && val.length <= 100}
      />

      <SmartInputField
        ref={descRef}
        label="Description"
        placeholder="Enter video description"
        validate={(val) =>
          val.length === 0 ? ["Description is required"] : []
        }
        successCheck={(val) => val.length > 0}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Upload
      </button>
    </div>
  </LoadOverlay>
  );
}

export default VideoUploadForm;
