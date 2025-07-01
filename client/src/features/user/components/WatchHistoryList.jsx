function WatchHistoryList({ history }) {
  return (
    <div className="mt-4 space-y-3">
      {history.map(item => (
        <div key={item._id} className="flex items-center gap-4 border p-2 rounded">
          <img src={item.video.thumbnail} className="w-28 h-16 rounded" />
          <div>
            <h3 className="font-semibold">{item.video.title}</h3>
            <p className="text-gray-500 text-sm">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default WatchHistoryList;
