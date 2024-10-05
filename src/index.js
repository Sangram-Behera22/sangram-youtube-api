
import app from "./app.js";
import connectDB from "./db/index.js";
import { configDotenv } from 'dotenv';
configDotenv();
const PORT = process.env.PORT;
connectDB().then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR", error);
        throw error;
    })
    app.listen(PORT,()=>{
        console.log(`SERVER RUNNING AT PORT ${PORT}`);
    })
}).catch((error)=>{
    console.log("MONGODB CONNECTION ERROR !!!", error);
    throw error;
});




/* anther way to connect mongoose
(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR", error);
            throw error
        })
        app.listen(PORT,()=>{
            console.log(`SERVER RUNNING IN PORT ${PORT}`);
        })
    } catch (error) {
        console.error("ERROR: ",error)
        throw error
    }
})()
*/

