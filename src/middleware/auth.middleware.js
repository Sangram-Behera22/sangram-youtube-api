import jwt  from "jsonwebtoken"
import {asyncHandler} from '../util/asyncHandler.js'
import {ApiError} from '../util/apiError.js'
import {User} from '../model/user.model.js'


export const verifyJWT = asyncHandler(async (req,res,next)=>{
  try {
    const token =  await req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ','')
    if(!token){
     throw new ApiError(401,"Unauthorized request")
    }
   
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
     // TODOs: discuss about frontend
     throw new ApiError(401,"Invalid Access token")
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401,error?.message || " Invalid access token.")
  }
})