import Router from 'express'
import {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   changeCurrentPassword,
   getCurrentUser,
   updateAccountDetails,
   updateUserAvatar,
   updateUserCover,
   getUserChannelProfile,
   getWatchHistory
} from "../controller/user.controller.js"
import {upload} from '../middleware/multer.middleware.js'
import {verifyJWT} from '../middleware/auth.middleware.js'
const router = Router()

router.route("/register").post(upload.fields([
   {
       name : "avatar",
       maxCount : 1
   },
   {
      name : "coverImage",
      maxCount : 1
   } 
]),registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-access-token").post(verifyJWT,refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route('/update-account-details').patch(verifyJWT,updateAccountDetails)
router.route('/update-avatar').patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route('/update-cover-image').patch(verifyJWT,upload.single("coverImage"),updateUserCover)
router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)
router.route("/watch-history/").get(verifyJWT,getWatchHistory)
export default router