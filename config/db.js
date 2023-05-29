const mongoose=require("mongoose")

const connectDB=async()=>{
    try {
        const connection=await mongoose.connect(process.env.URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            
        });
        console.log(`mongoDB connected`);
    } catch (error) {
        console.log(error);
    }
}
module.exports=connectDB;