import { useState } from 'react';
import VideoUploadForm from '../../components/VideoUploadForm.jsx';
import UploadSuccessMessage from '../../components/UploadSuccessMessage.jsx';

function UploadVideo() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {showSuccess && <UploadSuccessMessage />}
      <VideoUploadForm onSuccess={handleSuccess} />
    </div>
  );
}

export default UploadVideo;
