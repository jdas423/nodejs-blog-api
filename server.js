const express=require("express");
require("dotenv").config();
require("./config/dbConnect");
const app=express();
const userRouter=require("./routes/users/userRoutes")
const postRouter=require("./routes/posts/postRoutes")
const commentRouter=require("./routes/comments/commentRoutes")
const categoryRouter=require("./routes/categories/categoryRoutes")
const globalErrorHandler=require("./middlewares/globalErrorHandler")
const User=require("./model/User/User")
const appErr=require("./utilis/appErr")

app.use(express.json());

app.use("/",async(req,res,next)=>{
   try{
     const user=await User.find();
     return res.json(
        {
            status:"success",
            data:user
        }
     )
   }catch(err){
     return next(appErr(err.message, 500));
   }
})

app.use("/api/v1/users",userRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/categories", categoryRouter);


app.use(globalErrorHandler)
app.use("*", (req, res) => {
    return res.status(404).json({
        message:`${req.originalUrl} not found`
    })
})

const PORT=process.env.port || 9000;

app.listen(PORT,()=>console.log("server is listening"));