const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Define the port number
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Connect failed: " + error.message);
    }
}

// Function to fetch access token from the first API
const fetchAccessToken = async () => {
    try {
        const firstApiUrl = 'http://103.250.149.178:9292/token';
        const firstApiCredentials = new URLSearchParams();
        firstApiCredentials.append('username', '662');
        firstApiCredentials.append('password', '662shivapi');
        firstApiCredentials.append('grant_type', 'password');
        const response = await axios.post(firstApiUrl, firstApiCredentials);
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.message);
        throw error;
    }
}

// Function to fetch data from the second API using the access token
const fetchDataFromSecondApi = async () => {
    try {
        const accessToken = await fetchAccessToken();
        const secondApiUrl = 'http://103.250.149.178:9292/api/DToW/StockList?dt';
        const response = await axios.get(secondApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from second API:', error.message);
        throw error;
    }
}

// Connect to MongoDB
connectDB();

// Fetch data from the second API and log it
(async () => {
    try {
        const data = await fetchDataFromSecondApi();
        app.get('/', (req, res) => {
            res.send(data); // Respond with a welcome message
          });
        console.log('Data from second API:', data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
})();

// Define the HTTP function for Firebase
exports.api = functions.https.onRequest(app);
