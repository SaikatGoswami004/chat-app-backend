const asyncHandler = require("express-async-handler");
const Chat = require("../model/chat-model");
const User = require("../model/user-model");

exports.accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId not send with request");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("letestMessage");
  isChat = await User.populate(isChat, {
    path: "letestMessage.sender",
    select: "name image email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      console.log(error);
      res.status(400);
      throw new Error(error.message);
    }
  }
});

exports.fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("letestMessage")
      .sort({ updateAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "letestMessage.sender",
          select: "name image email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error(error.message);
  }
});
exports.createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill All Field" });
    }
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .send({ message: "Please Add More Than Two People" });
    }
    users.push(req.user);

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
      //   throw new Error(error.message);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);

    // throw new Error(error.message);
  }
};
exports.renameChatGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updateChat) {
      return res.status(400).json({ message: "Chat Not Found" });
    } else {
      return res.status(200).json(updateChat);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};

exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {users:userId},
      },
      { new: true }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!added){
        return res.status(400).json({message:"Chat Not Found"});
    }
    else{
        return res.status(200).json(added);

    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};
exports.removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    try {
      const remove = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: {users:userId},
        },
        { new: true }
      ).populate("users", "-password")
      .populate("groupAdmin", "-password");
  
      if(!remove){
          return res.status(400).json({message:"Chat Not Found"});
      }
      else{
          return res.status(200).json({message:"Remove Succesfully!"});
  
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json(error.message);
    }
  };
  
