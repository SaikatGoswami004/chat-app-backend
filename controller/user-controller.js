const asyncHandler=require("express-async-handler");
const User= require("../model/user-model");
const getGenerateToken=require("../config/generate-token")

exports.registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password,image}=req.body;

    if(!name|| !email|| !password){
        res.status(400)
        throw new Error("please Enter All Field")
    }

    const userExists=await User.findOne({email});
    if(userExists){
        res.status(400)
        throw new Error("User Already Exist")  ;

    }
    const user=await User.create({
        name,
        email,
        password,
        image
    });
    if(user){
return res.status(201).json({
    _id:user._id,
    name:user.name,
    email:user.email,
    image:user.image,
    token:getGenerateToken(user._id)
});
    }else{
        res.status(400)
        throw new Error("Failed To Create User")  ;
    }

});

//Login 
exports.loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    const user=await User.findOne({email});

    if(user && (await user.matchPass(password))){
        return res.status(201).json({
            message:"Login Successfull",
            _id:user._id,
            name:user.name,
            email:user.email,
            image:user.image,
            token:getGenerateToken(user._id)
        });
    }else{
        res.status(400)
        throw new Error("Invalid UserName And Password")  ;
    }
})

exports.allUser=asyncHandler(async(req,res)=>{

try {
    const keyword=req.query.search?{
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}},
        ],
    }:{ };

    const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
    return res.json(users)
} catch (error) {
    console.log(error);
}

})