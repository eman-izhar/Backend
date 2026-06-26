const express = require("express");
const app = require("./src/app"); //import the express app
const connectDB = require("./src/db/db"); //import the database connection function
require ("dotenv").config(); //import the dotenv package to use environment variables

connectDB(); //connect to the database

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
