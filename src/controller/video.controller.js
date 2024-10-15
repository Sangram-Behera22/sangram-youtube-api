import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../model/video.model.js"
import { asyncHandler } from "../util/asyncHandler.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import {uploadOnCloudinary,removeFromCloudinary} from "../util/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
      const pipeline = [
        {
          $match: {
            isPublished: "active",
            $or:[
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
          },
        },
        {
          $sort: {
            [sortBy]: Number(sortType),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
            $unwind : "$owner",
        },
        {
            $project : {
                title : 1,
                description : 1,
                thumbnail : 1,
                videoFile : 1,
                duration : 1,
                views : 1,
                createdAt : 1,
                updatedAt : 1,
                owner:{
                    _id : "$owner._id",
                   fullName : "$owner.fullName"
                }
            }
        },
        {
            $skip: (page - 1) * limit, // Pagination
        },
        {
            $limit: limit, // Limit the number of results
        },
      ];
      const videos = await Video.aggregate(pipeline)
      return res
      .status(200)
      .json(new ApiResponse(200, videos, "Video fetched Successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if (
        [title, description].some((field) => field?.trim() === "")
      ) {
        throw new ApiError(400, "Title and description fields are required");
      }
      const videoLocalPath = req.files?.video[0]?.path
      const thumbnailLocalPath = req.files?.thumbnail[0]?.path
      if (!videoLocalPath) {
        throw new ApiError(400, "Video is required");
      }
      if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required")
      }
      const video = await uploadOnCloudinary(videoLocalPath)
      if (!video) {
        throw new ApiError(400, "Video file is required");
      }
      const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
      if(!thumbnail){
           throw new ApiError(400, "thumbnail is required")
      }
      const uploadVideoObj = {
        videoFile : video.url,
        thumbnail : thumbnail.url,
        title: title,
        description : description,
        duration : video.duration,
        views : 0,
        isPublished : true,
        owner : req.user?._id
      }
      const uploadVideo = await Video.create(uploadVideoObj)
      if(!uploadVideo){
        throw new ApiError(500, "Something went wrong while uploading the video.");
      }

      return res
      .status(201)
      .json(new ApiResponse(201, uploadVideo, "Video uploaded Successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video =  await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "Invalid Id !!!");
    }
    res.status(200).json(new ApiResponse(200,video,"video fetched successfully."))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const video =  await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "Invalid Id !!!");
    }
    const {title, description}= req.body;
    if([title,description].some((field) => field?.trim() === "")){
        throw new ApiError(400, "Title and description fields are required")
    }
    const thumbnailLocalPath = req.file?.path
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    const updateVideo = await Video.findByIdAndUpdate(videoId,{
        thumbnail : thumbnail?.url,
        title: title,
        description : description,
    })
    await removeFromCloudinary(video.url);
    if(!updateVideo){
        throw new ApiError(500, "Something went wrong while updating the video.");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "Video updated Successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video =  await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "Invalid Id !!!");
    }
    await Video.findOneAndDelete(videoId)
    await removeFromCloudinary(video.url);
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted Successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {isPublished} = req.body
    const video =  await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "Invalid Id !!!");
    }
    const togglePublishStatus = await Video.findByIdAndUpdate(videoId,{isPublished})
    if(!togglePublishStatus){
        throw new ApiError(500, "Something went wrong while updating the video status.");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, togglePublishStatus, "Video status updated Successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}