const express= require('express');

const postRouter=express.Router();

const {postCreateCtrl, postUpdateCtrl, postDeleteCtrl, postProfileCtrl, postsCtrl, postFetchCtrl}=require("../../controllers/posts/postCtrl")

const isLogin=require("../../middlewares/isLogin")

postRouter.post("/",isLogin,postCreateCtrl)


postRouter.get("/:id",postFetchCtrl)

postRouter.get("/",postsCtrl)

postRouter.delete("/:id",postDeleteCtrl)

postRouter.put("/:id",postUpdateCtrl)

module.exports=postRouter;
