import API from "../../../services/axios";

const onLikeComment = async (commentId)=>{
    try {
        const res = await API.post(`/likes/toggle/c/${commentId}`);
        return res?.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const likeServices = {
    onLikeComment,
}
export default likeServices;