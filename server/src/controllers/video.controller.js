import mongoose, {isValidObjectId, mongo} from "mongoose"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import {getVideoDuration} from "../utils/getVideoDuration.js"

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = -1, userId } = req.query;
  const matchConditions = {
    isPublished: true
  };

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        matchConditions.owner = new mongoose.Types.ObjectId(userId);
    }

    if (query?.trim()) {
        matchConditions.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    const currentUserId = req.user?._id; // Get current user ID if authenticated

    const videos = await Video.aggregate([
        { $match: matchConditions },
        { $sort: { [sortBy]: parseInt(sortType) || -1 } },
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
                isLiked: {
                    $cond: {
                        if: { $in: [currentUserId ? new mongoose.Types.ObjectId(currentUserId) : null, "$likes.owner"] },
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
                isOwner:1
            }
        }
    ]);

    res.status(200).json(new ApiResponse(200, {
        videos: videos || [],
    }));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const currentUserId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(videoId), isPublished: true } },
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
                isLiked: {
                    $cond: {
                        if: { $in: [currentUserId ? new mongoose.Types.ObjectId(currentUserId) : null, "$likes.owner"] },
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
                isLiked: 1
            }
        }
    ]);

    if (!video.length) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiResponse(200, {video:video.length ? video[0] : null}, "Video fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, description, isPublished=true} = req.body
    const videofilePath = req.files?.videoFile[0]?.path;

    if(!videofilePath)throw new ApiError(400, "video file not present");
    const durationInSeconds = await getVideoDuration(videofilePath);
    if(durationInSeconds > 600) throw new ApiError(400, "video duration can't be greater than 10min");

    const thumbnailPath = req.files?.thumbnail[0]?.path;
    if(!thumbnailPath)throw new ApiError(400, "thumbnail not present");

    const videoUploaded = await uploadOnCloudinary(videofilePath);
    if(!videoUploaded)throw new ApiError(501, "something went wrong while uploading video");

    const thumbnailUploaded = await uploadOnCloudinary(thumbnailPath);
    if(!thumbnailUploaded)throw new ApiError(502, "something went wrong while uploading thumbnail");

    const video = await Video.create({
        videoFile: videoUploaded.url,
        thumbnail: thumbnailUploaded.url,
        owner: req.user._id,
        title,
        description,
        duration: durationInSeconds,
        isPublished: true
    });
    if(!video) throw new ApiError(500, "Something went wrong while uploading video details in database");

    return res.status(201)
     .json(
        new ApiResponse(201, video, "Video uploaded successfully")
     )

})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this video");
  }

  if (req.file?.path) {
    const newThumbnail = await uploadOnCloudinary(req.file.path);
    if (!newThumbnail) {
      throw new ApiError(500, "Failed to upload new thumbnail");
    }
    try {
       await deleteFromCloudinary(video.thumbnail); 
    } catch (err) {
        console.error("Failed to delete old thumbnail:", err.message);
    }
    video.thumbnail = newThumbnail.url;
  }

  if (title) video.title = title;
  if (description) video.description = description;

  await video.save();
  return res.status(200).json(
    new ApiResponse(200, video, "Video updated successfully")
  );
});


const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const type='video'
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this video");
  }

  try {
    await deleteFromCloudinary(video.videoFile,type);
    await deleteFromCloudinary(video.thumbnail);
  } catch (err) {
    console.error("Cloudinary cleanup failed:", err.message);
  }

  await video.deleteOne();
  return res.status(200).json(
    new ApiResponse(200, {}, "Video deleted successfully")
  );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to change this video's publish status");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { isPublished: video.isPublished },
      `Video is now ${video.isPublished ? "published" : "unpublished"}`
    )
  );
});

const increaseView = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // Fetch the video with owner details
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  video.views += 1; // Increment views
  await video.save();
  return res.status(200).json(
    new ApiResponse(200, { views: video.views }, "View count increased successfully")
  );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    increaseView
}