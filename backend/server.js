// Import the express library to create our web server
const express = require('express');

// Import the dotenv library to load environment variables from the .env file
const dotenv = require('dotenv');

// Import the cors library to allow cross-origin resource sharing
const cors = require('cors');

// Import the database connection helper function we created in config/db.js
const connectDB = require('./config/db');

// Import the product routes
const productRoutes = require('./routes/productRoutes');

// Load environment variables from the .env file into process.env
dotenv.config();

// Connect to the MongoDB database
connectDB();

// Create an instance of an express application
const app = express();

// Define the PORT number, falling back to 5000 if not specified in the environment variables
const PORT = process.env.PORT || 5000;

// Middleware configuration
// Enable CORS for all incoming requests (this allows React app to talk to backend)
app.use(cors());

// Parse incoming requests with JSON payloads (so we can read req.body)
app.use(express.json());

// Mounting our Product API routes under /api/products
app.use('/api/products', productRoutes);

// Create a basic GET route for the root URL ('/') for testing
app.get('/', (req, res) => {
    res.send('Product Management API is running successfully');
});

// Global Error Handling Middleware (beginner-friendly)
app.use((err, req, res, next) => {
    console.error('API Errors:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong on the server',
        error: err.message
    });
});

// Start the Express server and listen for incoming network requests
const server = app.listen(PORT, () => {
    // Log a confirmation message when the server runs successfully
    console.log(`Server Running on Port ${PORT}`);
});

// Handle server errors (e.g. if the port is already in use)
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Retrying on port 8000...`);
        
        // Start the server on the fallback port 8000
        const fallbackServer = app.listen(8000, () => {
            console.log('Server Running on Port 8000');
        });
    } else {
        // Log any other server startup errors
        console.error('Server error:', err);
    }
});
