import API from "../../../services/axios";

const onLikeComment = async (commentId)=>{
    try {
        const res = await API.post(`/likes/toggle/c/${commentId}`);
        return res?.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const onLikeVideo = async (videoId)=>{
    try {
        const res = await API.post(`/likes/toggle/v/${videoId}`);
        return res?.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const getAllLikedVideos = async ()=>{
    try{
        const res = await API.get('/likes/videos');
        return res; 
    }catch (error){
        throw error.response?.data || error.message;
    }
}

const likeServices = {
    onLikeComment,
    onLikeVideo,
    getAllLikedVideos
}
export default likeServices;