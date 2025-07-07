export default function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  // Always show seconds with leading zero
  const paddedSecs = secs.toString().padStart(2, '0');

  if (hours > 0) {
    // For hours, show minutes with leading zero
    return `${hours}:${minutes.toString().padStart(2, '0')}:${paddedSecs}`;
  } else if (minutes > 0) {
    // For minutes, no leading zero unless >10 minutes
    return `${minutes}:${paddedSecs}`;
  } else {
    return `0:${paddedSecs}`;
  }
}