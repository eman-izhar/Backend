const mongoose = require("mongoose");
const { post } = require("../app");

const postSchema = new mongoose.Schema({
    image: String,
    caption: String,
})

const postModel = mongoose.model("post", postSchema) //"post" is the name of the collection in the database //post model is the name of the model which we can use to perform CRUD operations on the "post" collection in the database

module.exports = postModel; //export the model so that we can use it in other files 