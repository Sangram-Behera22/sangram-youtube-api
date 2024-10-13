import { asyncHandler } from "../util/asyncHandler.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary,removeFromCloudinary } from "../util/cloudinary.js";
import jwt from "jsonwebtoken";

const geneateAccessAndRefreshToken = async function (userId) {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went worng while generating and access token"
    );
  }
};

export const registerUser = asyncHandler(async (req, res, next) => {
  // get user details frontend
  // validation
  // check if user already exists (email and username)
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field form response
  // check for user creation
  // return res

  const { username, email, fullname, password } = req.body;
  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist.");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path; // questin mark is user for optional chaining
  //  const coverImageLocalPath = req.files?.coverImage[0]?.path
  const coverImageLocalPath = "";
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullname,
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    username: username.toLowerCase(),
  });
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createUser, "User register Successfully"));
});

export const loginUser = asyncHandler(async (req, res, next) => {
  // my todo
  // get email or userame and password from user
  // check user data is not empty
  // check user is register or not
  // check the user nad password is correct or not
  // generate access token
  // send cookies

  // tutor todo
  // req body -> data
  // username or email
  // find the user
  // check password
  // access and refresh token
  // send cookies
  const { email, username, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }], // $or mongodb opreators
  });
  if (!user) {
    throw new ApiError(404, "user does not exist.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password); // all methods defined by me in model can be accessable only in my object not mongoose Object example: User is a mongoose Object and user is object
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await geneateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          new: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const inCommingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;
  if (!inCommingRefreshToken) {
    throw new ApiError(401, "Unauthorized Error");
  }

  try {
    const decodedToken = jwt.verify(
      inCommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (inCommingRefreshToken !== decodedToken.refreshToken) {
      throw new ApiError(401, "Refresh token is expried or used.");
    }

    const { accessToken, refreshToken } = await geneateAccessAndRefreshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401,error?.message || "Unauthorized Error");
  }
});

export const changeCurrentPassword = asyncHandler(async (req,res)=>{
  const {oldPassword, newPassword} = req.body
  const user = User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid Password.")
  }
  user.password = newPassword
  await user.save({validateBeforeSave:false})
  return res.status(200).json(new ApiResponse(200,{},"Password changes successfully"))
})

export const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req,user,"Current user fetched successfully"))     
})

export const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {fullName,email} =req.body
  if(!fullName || !email ){
    throw new ApiError(400, "fullName and email fields are required");
  }
 const user = await User.findByIdAndDelete(req.user?._id,{
     $set:{
       fullName,
       email
     }
  },{new:true}).select("-password")
  return res.status(200).json(new ApiResponse(200,user,"Account details updated successfully"))
})

export const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath =  req.file?.path
    if(!avatarLocalPath){
       throw new ApiError(400,"Avatar file is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const updatedAvatar = User.findByIdAndUpdate(req.user?._id,{
      $set:{
        avatar: avatar.url
      }
    },{new:true}).select('-password')
   await removeFromCloudinary(req.user?.avatar)
  return res.status(200).json(new ApiResponse(200,updatedAvatar,"Avatar updated successfully"))

})

export const updateUserCover = asyncHandler(async(req,res)=>{
  const coverImageLocalPath =  req.file?.path
  if(!coverImageLocalPath){
     throw new ApiError(400,"Cover Image file is missing")
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
 const updatedCoverImage = await User.findByIdAndUpdate(req.user?._id,{
    $set:{
      coverImage: coverImage.url
    }
  },{new:true}).select('-password')
  await removeFromCloudinary(req.user?.coverImage)
  return res.status(200).json(new ApiResponse(200,updatedCoverImage,"Cover Image updated successfully"))
})

export const getUserChannelProfile = asyncHandler(async(req,res)=>{
      const {username} = req.params
      if(!username?.trim()){
           throw new ApiError(400,"username is missing");
      }
      const channel = await User.aggregate([
        {
           $match:{
            username:username?.toLowerCase()
           }
        },
        {
          $lookup:{
            from:"subscriptions", // db name
            localField:"_id",
            foreignField:"channel",
            as : "subscribers"

          }
        },
        {
          $lookup:{
            from:"subscriptions", // db name
            localField:"_id",
            foreignField:"subscriber",
            as : "subscribedTo"
          }
        },
        {
          $addFields:{
            subscribersCount:{
              $size : "$subscribers"
            },
            channelsSubscribedToCount : {
               $size : "$subscribedTo"
            },
            isSubscribed : {
              $cond :{
                if:{
                  $in:[req.user?._id,"$subscribers.subscriber"],
                  then : true,
                  else:false
                }
              }
            }
          }
        },
        {
           $project:{
               fullName : 1,
               username:1,
               subscribersCount:1,
               channelsSubscribedToCount  : 1,
               isSubscribed : 1,
               avatar : 1,
               coverImage : 1,
               email : 1
           }
        }
      ])
       if(channel?.length){
          throw new ApiError(404,"channel does not exists");
       }
       return res.status(200).json(new ApiResponse(200, channel[0],"User Channel fetched successfully."))

})