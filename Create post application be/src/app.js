const express = require("express");
const multer = require("multer"); //for file upload
const uploadFile = require("./services/storage.service"); //import the uploadFile function from storage.service.js
const postModel = require("./models/post.model"); //import the post model


const app = express(); // app ka instance ..
app.use(express.json()); //middleware
const upload = multer({ storage: multer.memoryStorage() }); //memory mai store karna hai ... memoryStorage() ka matlab hai ki file ko memory mai store karna hai

//api for creating a post

app.post("/create-post", upload.single("image"), async (req, res)=>{

console.log(req.body); //body mai caption aayega
console.log(req.file); //file mai image aayegi

const result = await uploadFile(req.file.buffer) //buffer ko uploadfile func mai bhjna hai

const post = await postModel.create({ //create a new post in the database
  image: result.url,
  caption: req.body.caption
})

return res.status(201).json({ //201 means created
  message:"Post created successfully",
  post: post
})

})

app.get("/get-posts", async (req, res)=>{

  const posts = await postModel.find(); //find all the posts from the database
  return res.status(200).json({ //200 means ok
    message:"Posts fetched successfully",
    posts: posts
  })
})
module.exports = app;
