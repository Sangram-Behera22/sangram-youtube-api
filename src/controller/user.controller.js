import {asyncHandler} from '../util/asyncHandler.js'
import {ApiError} from '../util/apiError.js'
import {ApiResponse} from '../util/apiResponse.js'
import {User} from '../model/user.model.js'
import {uploadOnCloudinary} from '../util/cloudinary.js'

export const registerUser = asyncHandler( async(req,res,next)=>{
     // get user details frontend
     // validation
     // check if user already exists (email and username)
     // check for images, check for avatar
     // upload them to cloudinary, avatar 
     // create user object - create entry in db
     // remove password and refresh token field form response
     // check for user creation 
     // return res

     const {username,email,fullname,password} = req.body;
     if(([username,email,fullname,password]).some((field)=> field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
     }
     const existedUser = await User.findOne({
        $or:[{username},{email}]
     })
     if(existedUser){
           throw new ApiError(409, "User with email or username already exist.")
     }
     console.log(req.files);
     const avatarLocalPath = req.files?.avatar[0]?.path  // questin mark is user for optional chaining
     const coverImageLocalPath = req.files?.coverImage[0].path
     if(!avatarLocalPath){
            throw new ApiError(400, "Avatar file is required")
     }

     const avatar = await uploadOnCloudinary(avatarLocalPath)
     if(!avatar){
         throw new ApiError(400, "Avatar file is required")
     }
     const coverImage = await uploadOnCloudinary(coverImageLocalPath)
     
     const user = await User.create({
      fullname,
      email,
      avatar: avatar.url,
      coverImage : coverImage?.url || "",
      password,
      username: username.toLowerCase()
     })
    const createUser =  await User.findById(user._id).select(
      "-password -refreshToken"
    )
    if(!createUser){
      throw new ApiError(500,"Something went wrong while registering the user.")
    }

    return res.status(201).json(
      new ApiResponse(201,createUser,"User register Successfully")
    )

})