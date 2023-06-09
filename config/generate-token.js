const jwt=require("jsonwebtoken");

const  getGenerateToken=(id)=>{
    
    return jwt.sign({id},process.env.JWTSECRET,{expiresIn:"1d"})
}
module.exports=getGenerateToken