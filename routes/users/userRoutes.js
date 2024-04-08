const express=require("express");

const userRouter=express.Router();

const {userRegisterCtrl, userLoginCtrl ,
  userProfileCtrl, usersCtrl, userDeleteCtrl, userUpdateCtrl,profilePhotoUploadCtrl,
  whoViewedMyProfile, followingCtrl, unFollowCtrl, blockCtrl,unBlockCtrl, adminBlockUser, adminUnBlockUser, updatePasswordCtrl
}=require("../../controllers/users/userCtrl")

const isLogin=require("../../middlewares/isLogin")

const isAdmin=require("../../middlewares/isAdmin")

const storage=require("../../config/cloudinary")
const multer=require("multer")
const upload=multer({storage})

userRouter.post("/register",userRegisterCtrl);

userRouter.post("/login",userLoginCtrl)

userRouter.get("/profile",isLogin,userProfileCtrl)

userRouter.get("/profile-viewers/:id",isLogin,whoViewedMyProfile)

userRouter.get("/",isLogin,usersCtrl)

userRouter.delete("/delete-account",isLogin,userDeleteCtrl)

userRouter.put("/update-credentials",isLogin,userUpdateCtrl)

userRouter.post("/profile-photo-upload",isLogin,upload.single("profile"),profilePhotoUploadCtrl)

userRouter.get("/following/:id",isLogin,followingCtrl);

userRouter.get("/unfollowing/:id",isLogin,unFollowCtrl);

userRouter.get("/blocking/:id",isLogin,blockCtrl);

userRouter.get("/unblocking/:id",isLogin,unBlockCtrl);

userRouter.put("/admin/blocking",isLogin,isAdmin,adminBlockUser);

userRouter.put("/admin/unblocking",isLogin,isAdmin,adminUnBlockUser);

userRouter.put("/update-password",isLogin,updatePasswordCtrl);

module.exports=userRouter;