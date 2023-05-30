const express=require("express");
const router=express.Router();

const authMiddleWare=require("../middleware/auth-middleware");
const messageController=require("../controller/messsage-controller")


router.route("/").post(authMiddleWare,messageController.sendMessage); 
router.route("/:chatId").get(authMiddleWare,messageController.allMessage); 



module.exports=router