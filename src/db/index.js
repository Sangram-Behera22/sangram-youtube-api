import mongoose, { connect } from "mongoose";
async function connectDB(){
   try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
      console.log(`MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`);
   } catch (error) {
      console.log("MONGODB connection error",error);
      process.exit(1);  // new things
   }
}
export default connectDB;