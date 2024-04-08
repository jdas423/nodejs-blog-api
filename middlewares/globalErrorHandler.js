
const globalErrorHandler=(err,req,res,next)=>{
    const status= "failed";
    const message=err.message || "something went wrong"
    const stack=err.stack || "no stack trace"
    const statusCode=err.statusCode || 500
    return res.status(statusCode).json({
        status,
        message,
        stack
    })
}


module.exports=globalErrorHandler;