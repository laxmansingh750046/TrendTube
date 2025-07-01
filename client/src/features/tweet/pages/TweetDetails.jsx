import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tweetService from '../api';
import TweetCard from '../components/TweetCard';
import ReplyForm from '../components/ReplyForm';
import ReplyList from '../components/ReplyList';

function TweetDetails() {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);

  const fetchTweet = async () => {
    const res = await tweetService.getTweetById(id);
    setTweet(res.data.tweet);
  };

  const handleReply = async (replyText) => {
    await tweetService.replyToTweet(id, replyText);
    fetchTweet(); // refresh
  };

  useEffect(() => {
    fetchTweet();
  }, [id]);

  if (!tweet) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <TweetCard tweet={tweet} />
      <ReplyForm onReplySubmit={handleReply} />
      <ReplyList replies={tweet.replies || []} />
    </div>
  );
}
export default TweetDetails;
