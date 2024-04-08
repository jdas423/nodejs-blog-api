
const categoryCreateCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            message:"category created"
        })
    } catch(err){
        res.json(err.message)
    }
}

const categoryFetchCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            message:"category fetched"
        })
    } catch(err){
        res.json(err.message)
    }
}

const categoryDeleteCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            message:"category deleted"
        })
    } catch(err){
        res.json(err.message)
    }
}

const categoryUpdateCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            message:"category updated"
        })
    } catch(err){
        res.json(err.message)
    }
}

module.exports={categoryCreateCtrl,categoryFetchCtrl,categoryDeleteCtrl,categoryUpdateCtrl}