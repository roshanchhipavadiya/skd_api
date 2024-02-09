const axios = require('axios');
const connectDB = require('./connectMONGO'); // Adjusted require statement to match filename

 // Import connectDB function from connectmongo.js

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

  const PORT = process.env.PORT

  app.listen(
    PORT,()=> {
      console.log("Server is runningon Port " + PORT)
    }
  )