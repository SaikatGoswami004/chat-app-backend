const express=require("express");
const router=express.Router();
const userController=require("../controller/user-controller");
const authMiddleWare=require("../middleware/auth-middleware");

//register User
router.route("/registration").post(userController.registerUser);
//Login User
router.post("/login",userController.loginUser); 
//get all user
router.route("/").get(authMiddleWare,userController.allUser)
//forgot Password
router.route("/forgot-password").post(userController.frogotPassword);
//reset password
router.route("/reset-password").post(userController.resetPassword);

module.exports=router