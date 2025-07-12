// export const asyncHandler = (requestHandler)=>{
//     return (req,res,next)=>{
//          Promise.resolve(requestHandler(req,res,next))
//         .catch((err)=>next(err));
//     };
// };

// // const asyncHandler = (fn)=>async(req,res,next)=>{
// //     try{
// //         await fn(req,res,next);
// //     }
// //     catch(err){
// //         res.status(err.code || 500).json({
// //             success: false,
// //             message: err.message
// //         });
// //     }
// // };


export const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      // Format error response consistently
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        errors: error.errors || [],
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };
};