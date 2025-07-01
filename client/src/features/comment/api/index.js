import API from "../../../services/axios";

const getVideoComments = async (videoId,page=1,limit=10)=>{
    try {
        const res = await API.get(`/comments/${videoId}?page=${page}&limit=${limit}`);
        return res?.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const getCommentReply = async (commentId)=>{
    try {
        console.log("commplete get comment reply function");//TODO
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const onLike = async (commentId)=>{
    try {
        const res = await API.post(`/likes/toggle/c/${commentId}`);
        return res?.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const onReplySubmit = async (commentId, content)=>{
    try {
        const res = await API.post(`/comments/${commentId}`,{
            content
        });
        return res?.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const commentService = {
    getVideoComments,
    onLike,
    onReplySubmit,
    getCommentReply
};

export default commentService;