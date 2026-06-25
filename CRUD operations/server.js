const { log } = require("node:console")
const app = require("./src/app") //import the express app  
const connectDB = require("./src/db/db") //import the database connection function

connectDB() //connect to the database

app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})