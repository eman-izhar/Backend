const express = require("express")
const router = require("./routes/auth.routes")
const posts = require("./routes/post.routes")
const app = express();
const cookieParser= require("cookie-parser")
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", router)
app.use("/api/post", posts)

module.exports = app;