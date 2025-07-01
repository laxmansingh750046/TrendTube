function VideoPlayer({ videoUrl }) {
  return (
    <video controls className="w-full rounded">
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
export default VideoPlayer;
