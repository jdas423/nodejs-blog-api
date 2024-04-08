const Post=require("../../model/Post/Post")
const User=require("../../model/User/User")
const appErr=require("../../utilis/appErr")
const postCreateCtrl=async(req,res,next)=>{
    try{
        const {title,description}= req.body;
        const user=await User.findById(req.authUserId.id)
        if(!user) return next(appErr("User not found",403))
        const post=await Post.create({title,description,user:user._id})
        user.posts.push(post);
        await user.save()
        return res.json({
            status:'success',
            message:"post created"
        })
    }catch(err){
        next(appErr(err.message,500))
    }
}

const postFetchCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            data:"post fetched"
        })
    } catch(err){
        res.json(err.message)
    }
}

const postsCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            data:"post route"
    })} catch(err){
        res.json(err.message)
    }
}

const postDeleteCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            message:"delete post"
    })} catch(err){
        res.json(err.message)
    }
}

const postUpdateCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            message:"update post route"
    })} catch(err){
        res.json(err.message)
    }
}

module.exports={
    postCreateCtrl,
    postFetchCtrl,
    postsCtrl,
    postDeleteCtrl,
    postUpdateCtrl
}