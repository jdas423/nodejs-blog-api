const commentCreateCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            message:"comment created"
        })
    } catch(err){
        res.json(err.message)
    }
}

const commentFetchCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            message:"comment fetched"
        })
    } catch(err){
        res.json(err.message)
    }
}

const commentDeleteCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            message:"comment deleted"
        })
    } catch(err){
        res.json(err.message)
    }
}

const commentUpdateCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            message:"comment updated"
        })
    } catch(err){
        res.json(err.message)
    }
}

module.exports={
    commentCreateCtrl,
    commentFetchCtrl,
    commentDeleteCtrl,
    commentUpdateCtrl
}