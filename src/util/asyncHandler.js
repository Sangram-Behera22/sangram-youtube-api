// const asyncHandler = (func)=>{async()=>{}}  // same as below (this is in async / await)
// const asyncHandler = (func) => async (req,res,next) =>{
//    try {
//         await func(req,res,next);
//    } catch (error) {
//      res.status(error.code || 500).josn({
//         success : false,
//         message : error.message
//      })
//    }
// }
const asyncHandler = (requestHandler) => {  // (this is in Promise)
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
 }
export {asyncHandler}