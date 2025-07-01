function ReplyList({ replies }) {
  return (
    <div className="mt-4 border-t pt-2 space-y-2">
      {replies.map(reply => (
        <div key={reply._id} className="text-sm text-gray-700 border-b pb-1">
          <span className="font-medium">{reply.owner?.username}</span>: {reply.content}
        </div>
      ))}
    </div>
  );
}
export default ReplyList;
