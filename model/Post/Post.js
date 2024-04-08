
const mongoose=require("mongoose");

const postSchema= new mongoose.Schema({
  title:{type:String,required:[true,"Post title is required"],trim:true},
  description:{type:String,required:[true,"Post description is required"]},
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category"
  },
  numViews:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  likes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  dislikes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:[true,"Post author is required"]},
  photo:{type:String}, 
},{timestamps:true});

const Post=mongoose.model("Post",postSchema);

module.exports=Post;