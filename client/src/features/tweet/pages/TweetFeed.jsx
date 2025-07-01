import { useEffect, useState } from 'react';
import tweetService from '../api';
import TweetForm from '../components/TweetForm';
import TweetCard from '../components/TweetCard';

function TweetFeed() {
  const [tweets, setTweets] = useState([]);

  const fetchTweets = async () => {
    const res = await tweetService.getAllTweets();
    setTweets(res.data.tweets);
  };

  const handleNewTweet = async (content) => {
    await tweetService.createTweet({ content });
    fetchTweets();
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div className="p-4">
      <TweetForm onSubmit={handleNewTweet} />
      {tweets.map(tweet => (
        <TweetCard key={tweet._id} tweet={tweet} onLike={() => {}} onReply={() => {}} />
      ))}
    </div>
  );
}
export default TweetFeed;
