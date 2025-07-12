import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Playlist } from "../models/playlist.model.js";
import { uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose"
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
       
        await user.save({ validateBeforeSave: false });
       
        return {accessToken, refreshToken};
    } catch (error) {

        throw new ApiError(500,`something went wrong while generating refresh and access token. ${error}`);
    }
}

const getCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullname, password } = req.body;

    // Validation
    if ([fullname, username, email, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!email.includes("@")) {
        throw new ApiError(400, "Invalid email format");
    }

    // Check existing user
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        throw new ApiError(409, existedUser.email === email 
            ? "Email already registered" 
            : "Username already taken");
    }

    // Handle avatar upload
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

    let coverImageLocalPath;
    if (req.files?.coverImage?.[0]?.path) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    const [avatar, coverImage] = await Promise.all([
        uploadOnCloudinary(avatarLocalPath),
        coverImageLocalPath ? uploadOnCloudinary(coverImageLocalPath) : Promise.resolve(null)
    ]);

    if (!avatar) throw new ApiError(500, "Avatar upload failed");

    // Create user
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) throw new ApiError(500, "User registration failed");

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    return res.status(201)
        .cookie("accessToken", accessToken, getCookieOptions())
        .cookie("refreshToken", refreshToken, getCookieOptions())
        .json(new ApiResponse(
            201, 
            { user: createdUser },
            "Registration successful"
        ));
});

const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    
    if (!identifier) throw new ApiError(400, "Username or email required");

    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });
    if (!user) throw new ApiError(404, "User not found");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200)
        .cookie("accessToken", accessToken, getCookieOptions())
        .cookie("refreshToken", refreshToken, getCookieOptions())
        .json(new ApiResponse(
            200,
            { user: loggedInUser },
            "Login successful"
        ));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    const options = {
        ...getCookieOptions(),
        maxAge: 0 // Expire immediately
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized");

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);
        if (!user || incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

        return res.status(200)
            .cookie("accessToken", accessToken, getCookieOptions())
            .cookie("refreshToken", newRefreshToken, getCookieOptions())
            .json(new ApiResponse(200, {}, "Token refreshed"));
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token");
    }
});

const getCurrentUser = asyncHandler(async(req,res)=>{
    if(!req.user){throw new ApiError(500, "user is not logged");}
    
    return res
    .status(200)
    .json(new ApiResponse(200,{user: req.user}," Current user fetched succesfully"));
});

const deleteAndUpdateImage = async(req, res, type)=>{
    // check user and file
    // if prev img present delete it
    // upload img
    if(!req.user){
        throw new ApiError(500, "Unautorized access can't change detail without login");
    }

    const localFilePath = req.file?.path;
    if(!localFilePath){
        throw new ApiError(400, `${type} file is missing`);
    }

    const previousImage = req.user[type];

    if(previousImage || previousImage !== ""){
        await deleteFromCloudinary(previousImage); // error handeled inside function
    }

    const newImage = await uploadOnCloudinary(localFilePath);
    
    if(!newImage){
        throw ApiError(400, `Error while uploading ${type} image`);
    }

    const user  = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                [type]: newImage.url
            }
        },
        {new: true}
    )
    .select("-password -refreshToken");

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, `${type} image uploaded succesfully`)
    );
}

const updateUserDetail = async(req, res, type)=>{
    if(!req.user){
        throw new ApiError(500, "Unautorized access can't change detail without login");
    }
     
    const userDetail = req.body[type];

    if(!userDetail){
        throw ApiError(400, `${type} is required to update`);
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    [type]: userDetail
                }
            },
            {new: true}
        ).select("-password -refreshToken");
        return res
        .status(200)
        .json(new ApiResponse(200,user,"All details updated"));
    } catch (error) {
        console.log(`error while updating ${type} `,error);
        throw new ApiError(500,`error updating details: ${error}`);
    }
}

const updateFullname = asyncHandler(async (req, res) => {
    return await updateUserDetail(req, res, 'fullname');
});

const updateUsername = asyncHandler(async (req, res) => {
    return await updateUserDetail(req, res, 'username');
});

const updateEmail = asyncHandler(async (req, res) => {
    return await updateUserDetail(req, res, 'email');
});

const updateUserAvatar = asyncHandler(async(req,res)=>{
    return await deleteAndUpdateImage(req,res,"avatar");
});

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    return await deleteAndUpdateImage(req,res,"coverImage");
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old and new passwords are required");
    }

    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(400, "Unauthorized access");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password cannot be same as old password");
    }

    user.password = newPassword;
    const savedUser = await user.save({validateBeforeSave: false});
    
    if(!savedUser){
        throw new ApiError(500, "failed to update password");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{},"password changed successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const loggedInUserId = req.user?._id;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Get basic channel info
    const channel = await User.aggregate([
        { $match: { username: username.toLowerCase() } },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                channelsSubscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: {
                    $cond: {
                        if: loggedInUserId,
                        then: {
                            $in: [new mongoose.Types.ObjectId(loggedInUserId), "$subscribers.subscriber"]
                        },
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                createdAt: 1,
                isOwner: {
                    $eq: ["$_id", new mongoose.Types.ObjectId(loggedInUserId)]
                }
            }
        }
    ]);

    if (!channel?.length) {
        throw new ApiError(404, "Channel not found");
    }

    // Get additional stats
    const [videoCount, playlistCount] = await Promise.all([
        Video.countDocuments({ owner: user._id, isPublished: true }),
        Playlist.countDocuments({ owner: user._id })
    ]);

    const responseData = {
        ...channel[0],
        videoCount,
        playlistCount
    };

    return res.status(200).json(
        new ApiResponse(200, responseData, "Channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async(req,res)=>{
    if(!req.user){
        throw ApiError(403," loged in to watch history")
    }
    const user = await User.aggregate([
        {   
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from : "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ]);

    return res
    .status(200)
    .json( new ApiResponse(200, user[0].watchHistory, "watched history fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const currentUserId = req.user?._id; // Get current user for isLiked check

    const pipeline = [
        { $match: { 
            owner: user._id, 
            isPublished: true 
        }},
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { username: 1, avatar: 1 } }
                ]
            }
        },
        { $unwind: "$owner" },
        // Add likes lookup
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        // Add computed fields
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: {
                    $cond: {
                        if: { 
                            $in: [
                                currentUserId ? new mongoose.Types.ObjectId(currentUserId) : null, 
                                "$likes.owner"
                            ] 
                        },
                        then: true,
                        else: false
                    }
                },
                isOwner: {
                    $cond: {
                        if: {
                            $eq: [
                                "$owner._id",
                                currentUserId ? new mongoose.Types.ObjectId(currentUserId) : null
                            ]
                        },
                        then: true,
                        else: false
                    }
                },
                userId: "$owner._id",
                username: "$owner.username",
                avatar: "$owner.avatar"
            }
        },
        // Project matching getAllVideos format
        {
            $project: {
                _id: 1,
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                updatedAt: 1, 
                userId: 1,
                username: 1,
                avatar: 1,
                likesCount: 1,
                isLiked: 1,
                isOwner: 1
            }
        }
    ];

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 }
    };

    const videos = await Video.aggregatePaginate(
        pipeline,
        options
    );

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    );
});

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateFullname,
    updateUsername,
    updateEmail,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    getChannelVideos
};