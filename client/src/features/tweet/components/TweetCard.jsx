function TweetCard({ tweet, onLike, onReply }) {
  return (
    <div className="border p-4 rounded mb-4">
      <div className="font-bold">{tweet.owner?.username}</div>
      <p className="mt-1">{tweet.content}</p>
      <div className="text-sm text-gray-600 mt-2 flex gap-4">
        <button onClick={() => onLike(tweet._id)}>❤️ {tweet.likes?.length || 0}</button>
        <button onClick={() => onReply(tweet)}>💬 Reply</button>
      </div>
    </div>
  );
}
export default TweetCard;
