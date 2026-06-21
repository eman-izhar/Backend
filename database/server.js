const app = require('./src/app'); // Import the Express application instance
const connectDB = require('./src/db/db'); // Import the function to connect to the database
connectDB(); // Call the function to connect to the database

app.listen (3000, () => {
  console.log('Server is running on port 3000');
})