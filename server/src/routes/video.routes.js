import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    increaseView
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AddUser } from '../middlewares/optionalAuth.js';
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public Routes
router.route("/").get(AddUser, getAllVideos);
router.route("/:videoId").get(AddUser, getVideoById);
router.route("/vw/:videoId").patch(increaseView);
// Protected Routes
router
    .route("/")
    .post(
        verifyJWT,
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router
    .route("/toggle/publish/:videoId")
    .patch(verifyJWT, togglePublishStatus);

export default router;
