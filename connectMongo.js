require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

const connectDB = async () => {
 try{
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
    console.log("Connected to MongoDB successfully");
 }catch(error){
    console.error("Connect failed: " + error.message);
 }
}

module.exports = connectDB;
