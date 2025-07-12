import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {Tweet} from "../models/tweet.model.js"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const existingLike = await Like.findOne({
        owner: req.user._id,
        video: videoId    
    });

    if (existingLike) {
        const result = await Like.deleteOne({
            owner: req.user._id,
            video: videoId    
        });

        if (result.deletedCount === 0) {
            throw new ApiError(500, "Unable to unlike the video");
        }

        return res.status(200).json(
            new ApiResponse(200, null, "Video unliked successfully")
        );
    } else {
        const newLike = await Like.create({
            owner: req.user._id,
            video: videoId    
        });

        if (!newLike) {
            throw new ApiError(500, "Unable to like the video");
        }

        return res.status(200).json(
            new ApiResponse(200, newLike, "Video liked successfully")
        );
    }
});

// Toggle like/unlike for a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  // 1. Validate ID
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  // 2. Check if comment exists
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  // 3. Check if already liked by user
  const existingLike = await Like.findOne({
    owner: req.user._id,
    comment: new mongoose.Types.ObjectId(commentId),
  });

  // 4. If liked -> unlike
  if (existingLike) {
    const result = await Like.deleteOne({
      _id: existingLike._id,
    });

    if (result.deletedCount === 0) {
      throw new ApiError(500, "Unable to unlike the comment");
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment unliked successfully"));
}

const newLike = await Like.create({
    owner: req.user._id,
    comment: commentId
});

if (!newLike) {
    throw new ApiError(500, "Unable to like the comment");
}

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
     if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const existingLike = await Like.findOne({
        owner: req.user._id,
        tweet: tweetId    
    });

    if (existingLike) {
        const result = await Like.deleteOne({
            owner: req.user._id,
            tweet: tweetId    
        });

        if (result.deletedCount === 0) {
            throw new ApiError(500, "Unable to unlike tweet");
        }

        return res.status(200).json(
            new ApiResponse(200, null, "Tweet unliked successfully")
        );
    } else {
        const newLike = await Like.create({
            owner: req.user._id,
            tweet: tweetId    
        });

        if (!newLike) {
            throw new ApiError(500, "Unable to like tweet");
        }

        return res.status(200).json(
            new ApiResponse(200, newLike, "Tweet liked successfully")
        );
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const currentUserId = req.user._id;

    const likedVideos = await Like.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(currentUserId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            }
        },
        { $unwind: "$video" },
        {
            $match: {
                "video.isPublished": true
            }
        },
        {
            $replaceRoot: {
                newRoot: "$video"
            }
        },
        { $skip: (parseInt(page) - 1) * parseInt(limit) },
        { $limit: parseInt(limit) },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: true, 
                isOwner: {
                    $cond: {
                        if: { 
                            $eq: [
                                "$owner._id",
                                new mongoose.Types.ObjectId(currentUserId)
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
    ]);
    return res.status(200).json(new ApiResponse(200, {
        videos: likedVideos || [],
    }, "Liked videos fetched successfully"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}