import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
const app = express()
app.use(cors({  // explore more about cors 
    origin:process.env.CORS_ORIGIN
}))
app.use(express.json({   // limit for json size (handle json data)
    limit:"16kb"
}))
app.use(express.urlencoded({  // express handle url data 
    extended:true,
    limit:"16kb"
}))
app.use(express.static('public'));  // static folder
app.use(cookieParser());   //handle cookies 


// route import
import userRouter from './route/user.route.js'
import videoRouter from './route/video.route.js'
app.use("/api/v1", (req, res) => {
    res.send("Welcome to the API");
})
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos", videoRouter)
export default app;

