const express = require('express');

const categoryRouter=express.Router();
const {categoryCreateCtrl, categoryFetchCtrl, categoryDeleteCtrl, categoryUpdateCtrl}=require("../../controllers/categories/categoryCtrl")

categoryRouter.post("/",categoryCreateCtrl)

categoryRouter.get("/:id",categoryFetchCtrl)

categoryRouter.delete("/:id",categoryDeleteCtrl)

categoryRouter.put("/:id",categoryUpdateCtrl)

module.exports=categoryRouter;