import React, { useEffect, useState, useRef } from 'react';
import historyService from '../services/historyService';

function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observerRef = useRef();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await historyService.getWatchHistory(page);
        if (res.data.history.length === 0) setHasMore(false);
        else setHistory(prev => [...prev, ...res.data.history]);
      } catch (err) {
        setError(err.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore, loading]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Watch History</h2>
      <ul className="space-y-4">
        {history.map(item => (
          <li key={item._id} className="flex gap-4">
            <img src={item.video.thumbnail} alt={item.video.title} className="w-32 h-20 object-cover rounded" />
            <div>
              <h3 className="font-semibold">{item.video.title}</h3>
              <p className="text-sm text-gray-500">Watched on {new Date(item.watchedAt).toLocaleDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div ref={observerRef} style={{ height: 1, marginTop: 20, textAlign: 'center' }}>
          <span>Loading more...</span>
        </div>
      )}
    </div>
  );
}

export default WatchHistory;
