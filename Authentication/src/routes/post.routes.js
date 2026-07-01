const express = require("express");
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");
const router = express.Router();


router.post("/create", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      message: "unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({
        _id:decoded.id
    })
    console.log(user)
  } catch (err) {
    return res.status(401).json({
      message: "token invalid",
    });
  }
  res.send("post created successfully");
});

module.exports = router;
