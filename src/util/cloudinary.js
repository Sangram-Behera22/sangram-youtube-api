import {v2 as cloudinary} from 'cloudinary'
import {unlinkSync} from "node:fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localfilePath)=>{
     try {
        if(!localfilePath){
              return null
        }
         const response = await cloudinary.uploader.upload(localfilePath,{
            resource_type:"auto"
        })
        // file has been uploaded successful
        console.log("file has been uploaded successful",response);
         const test = unlinkSync(localfilePath) // remove the local upload file
         console.log(test)
        return response;
     } catch (error) {
         unlinkSync(localfilePath) // remove the local upload file 
         return null
     }
}
const removeFromCloudinary = async (url)=>{
   try {
    const public_id = url.replace('http://','').split('/').pop().split('.')[0]
    const response = await cloudinary.uploader.destroy(public_id)
    return response
   } catch (error) {
     return null
   }
}

export {uploadOnCloudinary}