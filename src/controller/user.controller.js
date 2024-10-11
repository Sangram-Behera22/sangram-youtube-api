import {asyncHandler} from '../util/asyncHandler.js'
import {ApiError} from '../util/apiError.js'
import {ApiResponse} from '../util/apiResponse.js'
import {User} from '../model/user.model.js'
import {uploadOnCloudinary} from '../util/cloudinary.js'


const geneateAccessAndRefreshToken = async function(userId){
  try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()
       user.refreshToken = refreshToken
       await user.save({validateBeforeSave:false})
       return {
        accessToken,
        refreshToken
       }
  } catch (error) {
    throw new ApiError(500,"Something went worng while generating and access token")
  }
}

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
     const avatarLocalPath = req.files?.avatar[0]?.path  // questin mark is user for optional chaining
    //  const coverImageLocalPath = req.files?.coverImage[0]?.path
    const coverImageLocalPath = ""
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImageLocalPath = req.files?.coverImage[0]?.path
    }
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

export const loginUser = asyncHandler(async (req,res,next)=>{
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
  const {email,username,password} = req.body
  if(!username || !email){
         throw new ApiError(400,"username or email is required")
  }
  const user = await User.findOne({
   $or: [{email},{username}]   // $or mongodb opreators
  })
  if(!user){
      throw new ApiError(404,"user does not exist.")
  }

 const isPasswordValid =  await user.isPasswordCorrect(password)             // all methods defined by me in model can be accessable only in my object not mongoose Object example: User is a mongoose Object and user is object 
 if(!isPasswordValid){
  throw new ApiError(401,"Invalid user credentials")
}
 const {accessToken,refreshToken} = await geneateAccessAndRefreshToken(user._id)
 const loggedInUser  = await User.findById(user._id).select("-password -refreshToken");

 const options= {
    httpOnly : true,
    secure:true
 }
 return res.status(200)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(
  new ApiResponse(
    200,
    {
      new : loggedUser,accessToken,refreshToken
    },
    "User Logged In Successfully"
  )
 )
})

export const logoutUser = asyncHandler(async(req,res,next)=>{
      const user = await User.findByIdAndUpdate(req.user._id,{
        $set : {
          refreshToken : undefined
        }
      },{
        new: true
      })

      const options= {
        httpOnly : true,
        secure:true
     }

     return res.status(200)
 .clearCookie("accessToken",options)
 .clearCookie("refreshToken",options)
 .json(
  new ApiResponse(
    200,
    {},
    "User Logged Out Successfully"
  )
 )

})


