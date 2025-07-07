import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import userService from "../services/userService";
import ChannelBanner from "../components/ChannelBanner";

function ChannelPage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getChannelByUsername(username).then(res => {setUser(res.data);console.log(res.data)});
  }, [username]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <ChannelBanner {...user} />
      <div className="mt-16 p-4">
        <h1 className="text-xl font-bold">{user.fullname}'s Channel</h1>
        {/* Add tabs: Videos, Tweets, etc. */}
      </div>
    </div>
  );
}
export default ChannelPage;
