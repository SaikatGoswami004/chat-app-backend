const express=require("express");
const router=express.Router();
const chatController=require("../controller/chat-controller");
const authMiddleWare=require("../middleware/auth-middleware");


router.route("/").post(authMiddleWare,chatController.accessChat); 
router.route("/").get(authMiddleWare,chatController.fetchChat);
router.route("/group").post(authMiddleWare,chatController.createGroupChat);
router.route("/rename-group").put(authMiddleWare,chatController.renameChatGroup);
router.route("/remove-from-group").put(authMiddleWare,chatController.removeFromGroup);
router.route("/add-to-group").put(authMiddleWare,chatController.addToGroup);


module.exports=router