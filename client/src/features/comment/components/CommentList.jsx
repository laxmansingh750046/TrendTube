import CommentThread from "./CommentThread";

const CommentList = ({ comments }) => {
  return (
    <div className="mt-4">
      {comments.map((comment) => (
        <CommentThread
          key={comment._id}
          comment={comment}
        />
      ))}
    </div>
  );
};

export default CommentList;
