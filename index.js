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
    throw error; // Throw error to stop further execution
  }
}

// Function to fetch data from the first API
const fetchFirstApiData = async () => {
  try {
    console.log("Fetching data from the first API...");
    const firstApiUrl = 'http://103.250.149.178:9292/token';
    const firstApiCredentials = {
      username: '662',
      password: '662shivapi',
      grant_type: 'password'
    };
    const response = await axios.post(firstApiUrl, firstApiCredentials);
    console.log("Data fetched from the first API:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from first API:', error.message);
    throw new Error('Error fetching data from first API: ' + error.message);
  }
}

// Function to fetch data from the second API
const fetchSecondApiData = async (accessToken) => {
  try {
    console.log("Fetching data from the second API...");
    const secondApiUrl = 'http://103.250.149.178:9292/api/DToW/StockList?dt';
    const response = await axios.get(secondApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log("Data fetched from the second API:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from second API:', error.message);
    throw new Error('Error fetching data from second API: ' + error.message);
  }
}

// Define route to handle requests
app.get('/', async (req, res) => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch data from the first API
    const firstApiData = await fetchFirstApiData();

    // Fetch access token from first API response
    const accessToken = firstApiData.access_token;

    // Fetch data from the second API using access token
    const secondApiData = await fetchSecondApiData(accessToken);

    // Combine data from both APIs
    const combinedData = {
      firstApiData,
      secondApiData
    };

    // Send the combined data as response
    res.json(combinedData);
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
