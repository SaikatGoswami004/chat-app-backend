const asyncHandler = require("express-async-handler");
const Message = require("../model/message-model");
const User = require("../model/user-model");
const Chat = require("../model/chat-model");

exports.sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content && !chatId) {
    console.log("Invalid Data Passed in req");
    return res.status(400).json({ message: "Invalid Data Passed" });
  }

  var newMessages = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessages);
    message = await message.populate("sender", "name image");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name image email",
    });

    const chat = await Chat.findByIdAndUpdate(req.body.chatId, {
      letestMessage: message,
    });

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

exports.allMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name image email")
      .populate("chat");
  
      return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
