const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({ //database mai kis type ka data store karna hai uska schema define karte hai
    
        title: String,   
        description: String,
       
    })

    const noteModel = mongoose.model("Note", noteSchema); //model create karte hai jisse hum database mai data store kar sake // CRUD operations ke liye model ka use karte hai

    module.exports = noteModel; //model ko export karte hai jisse hum dusre files mai use kar sake