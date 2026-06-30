const express = require("express")
const router = require("./routes/auth.routes")
const app = express();
app.use(express.json());

app.use("/api/auth", router)

module.exports = app;