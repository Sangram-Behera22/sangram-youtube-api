import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
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

export default app;

