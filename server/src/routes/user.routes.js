import { Router } from "express";
import { 
     changeCurrentPassword,
     getCurrentUser,
     getUserChannelProfile,
     getWatchHistory,
     loginUser, 
     logoutUser,
     refreshAccessToken, 
     registerUser,
     updateEmail,
     updateFullname, 
     updateUserAvatar, 
     updateUserCoverImage, 
     updateUsername,
     getChannelVideos,
     removeFromWatchHistory,
     addToWatchHistory
 } 
 from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; 
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AddUser } from "../middlewares/optionalAuth.js";

const router = Router();

router.route("/register").post(
     upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },{
            name: "coverImage",
            maxCount: 1
        }
     ]), 
     registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").patch(verifyJWT,changeCurrentPassword);
router.route("/change-fullname").patch(verifyJWT,updateFullname);
router.route("/change-username").patch(verifyJWT,updateUsername);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-email").patch(verifyJWT,updateEmail);
router.route("/change-avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar);
router.route("/change-coverimage").patch(verifyJWT, upload.single("coverImage"),updateUserCoverImage);
router.route("/u/:username").get(AddUser,getUserChannelProfile);
router.route("/videos/:username").get(AddUser, getChannelVideos);
router.route("/history")
    .get(verifyJWT,getWatchHistory)
    .delete(verifyJWT, removeFromWatchHistory)
    .post(verifyJWT, addToWatchHistory);

export default router;
