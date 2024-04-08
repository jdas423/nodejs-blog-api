const express= require("express")

const commentRouter=express.Router()
const {commentCreateCtrl, commentFetchCtrl, commentDeleteCtrl, commentUpdateCtrl}=require("../../controllers/comments/commentCtrl")
commentRouter.post("/",commentCreateCtrl)

commentRouter.get("/:id",commentFetchCtrl)

commentRouter.delete("/:id",commentDeleteCtrl)

commentRouter.put("/:id",commentUpdateCtrl)

module.exports=commentRouter;
