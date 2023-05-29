const jwt=require("jsonwebtoken");

const  getGenerateToken=(id)=>{
    
    return jwt.sign({id},process.env.JWTSECRET,{expiresIn:"30d"})
}
module.exports=getGenerateToken