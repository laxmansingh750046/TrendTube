import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid Video id format");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found with given ID");
    }

    const currentUserId = req.user?._id; // Will be undefined if not logged in
    const videoOwnerId = video.owner;

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "commentLikes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$commentLikes" },
                // Only add priority if currentUserId exists (user is logged in)
                priorityOrder: currentUserId ? {
                    $switch: {
                        branches: [
                            {
                                case: { $eq: ["$owner", new mongoose.Types.ObjectId(videoOwnerId)] },
                                then: 2
                            },
                            {
                                case: { $eq: ["$owner", new mongoose.Types.ObjectId(currentUserId)] },
                                then: 1
                            }
                        ],
                        default: 0
                    }
                } : 0 // Default to 0 if not logged in
            }
        },
        {
            $sort: {
                likesCount: -1, // Sort by most likes first
                priorityOrder: -1, // Then by priority (video owner > current user > others)
                createdAt: -1 // Then by newest comments
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerInfo"
            }
        },
        {
            $unwind: "$ownerInfo"
        },
        {
            $addFields: {
                isLiked: currentUserId ? {
                    $in: [new mongoose.Types.ObjectId(currentUserId), {
                        $map: {
                            input: "$commentLikes",
                            as: "like",
                            in: "$$like.owner"
                        }
                    }]
                } : false // Default to false if not logged in
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                "ownerInfo._id": 1,
                "ownerInfo.username": 1,
                "ownerInfo.profilePicture": "$ownerInfo.avatar",
                likesCount: 1,
                repliesCount: 1, 
                isLiked: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, { comments }, "Video comments fetched successfully")
    );
});

const getCommentReply = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID format");
    }

    const replies = await Comment.aggregate([
        {
            $match: {
                parentComment: new mongoose.Types.ObjectId(commentId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerInfo"
            }
        },
        {
            $unwind: "$ownerInfo"
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "commentLikes"
            }
        },
         {
            $addFields: {
                likesCount: { $size: "$commentLikes" },
                isLiked: req.user?._id
                    ? {
                        $in: [
                        req.user?._id,
                        {
                            $map: {
                            input: "$commentLikes",
                            as: "like",
                            in: "$$like.owner"
                            }
                        }
                        ]
                    }
                    : false
                }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                "ownerInfo._id": 1,
                "ownerInfo.username": 1,
                "ownerInfo.profilePicture": "$ownerInfo.avatar",
                likesCount: 1,
                isLiked: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, { replies }, "Replies fetched successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    
    const {content} = req.body;

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid Video id format");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found with given ID");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });
    if(!comment){
        throw new ApiError(500, "Something went wrong while creaing comment");
    }
    
    const responseComment = {
        content: comment.content,
        createdAt: comment.createdAt,
        ownerInfo: {
            _id: req.user._id,
            username: req.user.username,
            profilePicture: req.user.avatar
        },
        likesCount: 0 // Initially set to 0, will be updated later if needed
    };

    return res.status(201)
      .json(
        new ApiResponse(201, {responseComment}, "Comment added successfully")
      )
});

const addReply = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    const {content} = req.body;

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid Video id format");
    }

    const comment = await Comment.findById(commentId);
    
    if(!comment){
        throw new ApiError(404, "Comment not found with given ID");
    }
    
    if(comment.parentComment){
        const parentComment = await Comment.findById(comment.parentComment);
        parentComment.repliesCount += 1;
        await parentComment.save();
    }else{
        comment.repliesCount += 1;
        await comment.save();
    }

    const owner = await User.findById(comment.owner);
    const newContent = `@${owner.username}: ${content}`.trim();
    const parentCommentId = (comment.parentComment) ? comment.parentComment : comment._id;

    const reply = await Comment.create({
        content: newContent,
        parentComment: parentCommentId,
        owner: req.user._id
    });

    if(!reply){
        throw new ApiError(500, "Something went wrong while creaing reply");
    }

    return res.status(201)
      .json(
        new ApiResponse(201, reply, "Reply added successfully")
      )
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID format");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content cannot be empty");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment");
    }

    comment.content = content.trim();
    await comment.save();

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID format");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this comment");
    }

    await comment.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    );
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment,
    getCommentReply,
    addReply
}