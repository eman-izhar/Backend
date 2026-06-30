const app = require("./src/app")
const connectDB = require("./src/db/db"); //import the database connection function
require("dotenv").config();

connectDB();



app.listen(3000, () =>{
    console.log("connected to port 3000")
})



