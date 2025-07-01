function ProfileCard({ user }) {
  return (
    <div className="p-4 border rounded">
      <img src={user.avatar} className="w-24 h-24 rounded-full mb-2" />
      <h2 className="text-xl font-semibold">{user.fullname}</h2>
      <p className="text-gray-600">@{user.username}</p>
      <p>{user.email}</p>
    </div>
  );
}
export default ProfileCard;
