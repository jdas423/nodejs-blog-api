const mongoose=require("mongoose");
const Post=require("../Post/Post")
const userSchema=mongoose.Schema({
   firstName:{type:String,required:[true,"firstName is required"]},
   lastName:{type:String,required:[true,"lastName is required"]},
   profilePhoto:{type:String},
   email:{type:String,required:[true,"email is required"]},
   password:{type:String,required:[true,"password is required"]},
   isBlocked:{type:Boolean,default:false},
   isAdmin:{type:Boolean,default:false},
   role:{type:String,enum:["Admin","Guest","Blogger"],default:"Guest"},
   viewers:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
   followers:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
   following:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
   posts:[{type:mongoose.Schema.Types.ObjectId,ref:"Post"}],
   blocked:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
   plan:{type:String,enum:["free","premium"],default:"free"},
   userAward:{type:String,enum:["bronze","silver","gold","platinum"],default:"bronze"},
},
{timestamps:true,
toJSON:{virtuals:true},
})

userSchema.pre("findOne",async function(next){
    this.populate({
      path:"posts"
    })
    if(this._conditions._id){
       const userId=this._conditions._id;
       const posts=await Post.find({user:userId});
       const lastPost=posts[posts.length-1];
       const lastPostDate=new Date(lastPost?.createdAt)
       const lastPostDateStr=lastPostDate.toDateString();
       userSchema.virtual("lastPostDate").get(function(){
         return lastPostDateStr;
       });
       const currentDate=new Date();
       const diff=currentDate-lastPostDate;
       const diffDays=diff/(1000*60*60*24);
       if(diffDays>30){
           userSchema.virtual("isInActive").get(function(){
               return true;
             });     
           await User.findByIdAndUpdate(userId,{isBlocked:true},{new:true}); 
       }
       else{
         userSchema.virtual("isInActive").get(function(){
           return false;
         })
         await User.findByIdAndUpdate(userId,{isBlocked:false},{new:true});
       }
   
       const daysAgo=Math.ceil(diffDays);
       userSchema.virtual("lastActive").get(function(){
         if(daysAgo<=0) return "Today"
         else if(daysAgo===1) return "Yesterday"
         else return `Active ${daysAgo}days ago`
       })
      
       const numberOfPosts=posts.length;
       if(numberOfPosts<10) await User.findByIdAndUpdate(userId,{userAward:"bronze"},{new:true});
       else if(numberOfPosts<20) await User.findByIdAndUpdate(userId,{userAward:"silver"},{new:true});
       else if(numberOfPosts<30) await User.findByIdAndUpdate(userId,{userAward:"gold"},{new:true});
       else await User.findByIdAndUpdate(userId,{userAward:"platinum"},{new:true});
      
    }
    next();
})

userSchema.virtual("fullName").get(function(){
   return `${this.firstName} ${this.lastName}`
})

userSchema.virtual("initials").get(function(){
   return `${this.firstName[0]}${this.lastName[0]}`
})

userSchema.virtual("followingCount").get(function(){
   return this.following.length
})

userSchema.virtual("followersCount").get(function(){
   return this.followers.length
})

userSchema.virtual("viewersCount").get(function(){
   return this.viewers.length
})

userSchema.virtual("postsCount").get(function(){
   return this.posts.length
})

userSchema.virtual("blockedCount").get(function(){
   return this.blocked.length
})

const User=mongoose.model("User",userSchema);

module.exports=User;