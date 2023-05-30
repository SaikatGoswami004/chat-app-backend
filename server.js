require("dotenv").config();
const express=require("express");
const connectDB = require("./config/db");
const userRoutes=require("./routes/user-routes");
const {errorHandler,notFound}=require("./middleware/error-middleware");
const cors=require("cors");
const chatRoutes=require("./routes/chat-routes")
const messageRoutes=require("./routes/message-routes")

connectDB();
const app=express();
app.use(express.json())
app.use(cors())

app.use("/api/user",userRoutes);
app.use("/api/chats",chatRoutes);
app.use("/api/message",messageRoutes);
// app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT,console.log(`server listining on port ${process.env.PORT}`))