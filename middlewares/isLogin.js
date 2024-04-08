const getTokenFromHeader=require("../utilis/getTokenFromHeader")
const verifyToken=require("../utilis/verifyToken")
const appErr=require("../utilis/appErr")

const isLogin=(req,res,next)=>{
    const token=getTokenFromHeader(req)
    const decodedUser=verifyToken(token)
    if(!decodedUser){
        return next(appErr("invalid token",500))
    }else{
       req.authUserId=decodedUser
       return next()
    }
}


module.exports=isLogin