import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
    getCommentReply,
    addReply
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {AddUser} from "../middlewares/optionalAuth.js"

const router = Router();

router.route("/r/:commentId").post(verifyJWT, addReply).get(AddUser, getCommentReply);
router.route("/:videoId").get(AddUser, getVideoComments).post(verifyJWT, addComment);
router.route("/c/:commentId").delete(verifyJWT, deleteComment).patch(verifyJWT, updateComment);

export default router