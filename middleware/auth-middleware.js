const asyncHandler = require("express-async-handler");
const User = require("../model/user-model");
const jwt = require("jsonwebtoken");

const authMiddleWare = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWTSECRET);
      req.user = await User.findById(decoded.id).select("-password");
    //   console.log(decoded.id);
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Unathorize,Token Failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Unathorize,Token Failed");
  }
});
module.exports = authMiddleWare;
