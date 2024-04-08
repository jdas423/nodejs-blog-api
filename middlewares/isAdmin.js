const appErr=require("../utilis/appErr")
const User=require("../model/User/User")
const isAdmin=async(req,res,next)=>{
    try{
        const user=await User.findById(req.authUserId.id)
        if(!user){
            return next(appErr("User not found",403))
        }
        if(user.isAdmin){
            return next()
        }
        else{
            return next(appErr("Unauthorized",403))
        }
    }catch(err){
        return next(appErr(err.message,500))
    }
}

module.exports=isAdmin