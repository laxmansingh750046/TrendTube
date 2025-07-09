import { useState, useRef } from "react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import userService from "../services/userService";

const COVER_ASPECT = 3/1;

function ChangeCoverImageForm({ onUpload }) {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    aspect: COVER_ASPECT,
    width: 80,  // Default to 80% of image width
    height: (80 / COVER_ASPECT),
    x: 10,      // Center the crop box
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setError("");
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrc(reader.result);
        // Reset to default crop when new image is selected
        setCrop({
          unit: '%',
          aspect: COVER_ASPECT,
          width: 80,
          height: (80 / COVER_ASPECT),
          x: 10,
          y: 10
        });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = (image, crop) => {
    if (!crop.width || !crop.height) {
      throw new Error("No crop data available");
    }

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleUpload = async () => {
    if (!completedCrop || !imgRef.current) {
      setError("Please select and crop an image first");
      return;
    }

    try {
      setIsLoading(true);
      const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
      
      const formData = new FormData();
      formData.append("coverImage", croppedImage, "cover.jpg");
      
      await userService.updateCoverImage(formData);
      onUpload();
      setSrc(null);
    } catch (error) {
      console.error("Failed to upload cover image:", error);
      setError(error.message || "Something went wrong while uploading the image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

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

      {src && (
        <div className="mt-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={COVER_ASPECT}
            className="max-h-96"
            ruleOfThirds
          >
            <img
              ref={imgRef}
              src={src}
              onLoad={(e) => {
                const { width, height } = e.currentTarget;
                const newHeight = (width / COVER_ASPECT);
                
                setCrop(prev => ({
                  ...prev,
                  width: Math.min(80, 100),  // Cap at 80% width
                  height: Math.min((80 / COVER_ASPECT), (100 * newHeight / height)),
                  x: (100 - Math.min(80, 100)) / 2,  // Center horizontally
                  y: (100 - Math.min((80 / COVER_ASPECT), (100 * newHeight / height))) / 2  // Center vertically
                }));
              }}
              alt="Crop preview"
              className="max-h-96 object-contain"
            />
          </ReactCrop>
          <p className="text-xs text-gray-500 mt-1">
            Crop your image to fit the cover area ({COVER_ASPECT.toFixed(1)}:1 ratio)
          </p>
        </div>
      )}

      <button 
        onClick={handleUpload}
        disabled={isLoading || !src}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Uploading..." : "Upload Cover Image"}
      </button>
    </div>
  );
}

export default ChangeCoverImageForm;