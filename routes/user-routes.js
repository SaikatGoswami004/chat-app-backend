const express=require("express");
const router=express.Router();
const userController=require("../controller/user-controller");
const authMiddleWare=require("../middleware/auth-middleware");

//register User
router.route("/registration").post(userController.registerUser);
//Login User
router.post("/login",userController.loginUser); 

router.route("/").get(authMiddleWare,userController.allUser)

module.exports=router