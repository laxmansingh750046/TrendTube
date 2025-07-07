function ChannelBanner({ avatar, coverImage, username, fullname }) {
  return (
    <div className="relative w-full h-48 bg-gray-200">
      {coverImage && <img src={coverImage} className="w-full h-full object-cover" />}
      <div className="absolute bottom-[-30px] left-4 flex items-center gap-4">
        <img src={avatar} className="w-16 h-16 rounded-full border-2 border-white" />
        <div>
          <h2 className="font-bold text-xl">{fullname}</h2>
          <p className="text-gray-200">@{username}</p>
        </div>
      </div>
    </div>
  );
}
export default ChannelBanner;
