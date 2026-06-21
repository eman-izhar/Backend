const mongoose = require('mongoose');

async function connectDB() {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://backend:jv00yywTdtXD35pq@backend.mzccczv.mongodb.net/halley'
    );

    console.log("Connected to DB");
    console.log(conn.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error);
  }
}

module.exports = connectDB;