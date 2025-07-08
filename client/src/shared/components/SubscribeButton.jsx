import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from './Button.jsx';
import API from '../../services/axios.js';
import { toast } from 'react-hot-toast';

const SubscribeButton = ({ channelId, isSubscribed: initialIsSubscribed }) => {
    const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
    const [isLoading, setIsLoading] = useState(false);
    const userId = useSelector((state) => state.auth.user?._id);

    const handleSubscribe = async () => {
        if (!userId) {
            toast.error('Please login to subscribe');
            return;
        }

        setIsLoading(true);
        try {
            await API.post(`/subscriptions/c/${channelId}`);

            setIsSubscribed(!isSubscribed);

            toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
            console.error('Subscription error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            variant={isSubscribed ? 'outline' : 'default'} 
            onClick={handleSubscribe}
            disabled={isLoading}
            className="min-w-[100px]"
        >
            {isLoading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : isSubscribed ? (
                'Subscribed'
            ) : (
                'Subscribe'
            )}
        </Button>
    );
};

export default SubscribeButton;