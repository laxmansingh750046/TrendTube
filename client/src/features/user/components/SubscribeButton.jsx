function SubscribeButton({ isSubscribed, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded ${isSubscribed ? 'bg-gray-400' : 'bg-red-500 text-white'}`}>
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </button>
  );
}
export default SubscribeButton;
