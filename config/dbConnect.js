const mongoose=require("mongoose");

const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connection successful!!!")
    }
    catch(err){
       console.log(err.message);
       process.exit(1);
    }
}

dbConnect()