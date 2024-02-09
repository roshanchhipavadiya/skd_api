const express = require('express'); // Import Express
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

const connectDB = async () => {
 try{
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
    console.log("Connected to MongoDB successfully");
 } catch(error){
    console.error("Connect failed: " + error.message);
 }
}

const app = express(); // Initialize Express

// First API endpoint URL
const firstApiUrl = 'http://103.250.149.178:9292/token';

// First API credentials
const firstApiCredentials = new URLSearchParams();
firstApiCredentials.append('username', '662');
firstApiCredentials.append('password', '662shivapi');
firstApiCredentials.append('grant_type', 'password');

// Second API endpoint URL
const secondApiUrl = 'http://103.250.149.178:9292/api/DToW/StockList?dt';

// Call connectDB function to establish connection to MongoDB
connectDB()
  .then(() => {
    axios.post(firstApiUrl, firstApiCredentials)
      .then(response => {
        // Extract the access token from the response
        const accessToken = response.data.access_token;

        // Make GET request to second API with the obtained token as Bearer token
        axios.get(secondApiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(response => {
          // Log the response from the second API
          console.log(response.data);
        })
        .catch(error => {
          // Handle error from second API
          console.error('Error:', error.message);
        });
      })
      .catch(error => {
        // Handle error from first API
        console.error('Error:', error.message);
      });
  })
  .catch(error => {
    // Handle connection error
    console.error('Error connecting to MongoDB:', error.message);
  });

const PORT = process.env.PORT || 8080; // Use port from environment variable or default to 8080

app.get('/', (req, res) => {
  res.send('Welcome to my MongoDB API!'); // Respond with a welcome message
});

app.listen(PORT, () => {
  console.log("Server is running on Port " + PORT);
});
