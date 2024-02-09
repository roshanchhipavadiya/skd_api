const express = require('express');
const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Connect failed: " + error.message);
  }
}

// Function to fetch data from the second API
const fetchDataFromSecondApi = async () => {
  try {
    const firstApiUrl = 'http://103.250.149.178:9292/token';
    const firstApiCredentials = {
      username: '662',
      password: '662shivapi',
      grant_type: 'password'
    };
    const response = await axios.post(firstApiUrl, firstApiCredentials);
    const accessToken = response.data.access_token;
    const secondApiUrl = 'http://103.250.149.178:9292/api/DToW/StockList?dt';
    const secondApiResponse = await axios.get(secondApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return secondApiResponse.data;
  } catch (error) {
    throw new Error('Error fetching data from second API: ' + error.message);
  }
}

// Define route to handle requests
app.get('/', async (req, res) => {
  try {
    // Fetch data from second API
    const data = await fetchDataFromSecondApi();
    // Send the data as response
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server is running on Port " + PORT);
});

// Connect to MongoDB
connectDB();
