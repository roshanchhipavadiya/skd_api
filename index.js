const express = require('express'); // Import Express
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

const app = express(); // Initialize Express

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Connect failed: " + error.message);
  }
}

// Fetch data from the second API
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
    console.error('Error fetching data from second API:', error.message);
    throw error;
  }
}

// Periodically fetch data from the second API and broadcast it to connected clients
const broadcastDataUpdate = async () => {
  try {
    const data = await fetchDataFromSecondApi();
    io.emit('dataUpdate', data); // Broadcast data update to all connected clients
    console.log('Data update broadcasted:', data);
  } catch (error) {
    console.error('Error broadcasting data update:', error.message);
  }
}

// Start server
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log("Server is running on Port " + PORT);
});

// WebSocket setup
const socketIo = require('socket.io');
const io = socketIo(server);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Connect to MongoDB
connectDB();

// Periodically broadcast data update
const INTERVAL_TIME_MS = 10000; // Interval time in milliseconds (e.g., every 10 seconds)
setInterval(broadcastDataUpdate, INTERVAL_TIME_MS);
