// Import the express library to create our web server
const express = require('express');

// Import the dotenv library to load environment variables from the .env file
const dotenv = require('dotenv');

// Import the cors library to allow cross-origin resource sharing
const cors = require('cors');

// Import path and fs modules for folder paths and disk file systems
const path = require('path');
const fs = require('fs');

// Import multer to handle incoming file uploads
const multer = require('multer');

// Import the database connection helper function we created in config/db.js
const connectDB = require('./config/db');

// Import the product routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

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

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using timestamp and original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// POST /api/upload - Upload a new image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }
    res.json({
        success: true,
        message: 'File uploaded successfully',
        filename: req.file.filename
    });
});

// GET /api/images - Retrieve all image filenames from uploads folder
app.get('/api/images', (req, res) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads folder:', err);
            return res.status(500).json({
                success: false,
                message: 'Unable to read uploads folder',
                error: err.message
            });
        }
        
        // Return only image files
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });
        
        res.json(imageFiles);
    });
});

// Mounting our Product API routes under /api/products
app.use('/api/products', productRoutes);

// Mounting our Auth API routes under /api/auth
app.use('/api/auth', authRoutes);

// GET /api/db-status - Retrieve database connection status
app.get('/api/db-status', (req, res) => {
    const mongoose = require('mongoose');
    const state = mongoose.connection.readyState;
    let dbType = 'Disconnected';
    let host = 'None';
    
    if (state === 1) { // Connected
        host = mongoose.connection.host;
        if (host.includes('mongodb.net')) {
            dbType = 'MongoDB Atlas (Cloud)';
        } else if (host.includes('127.0.0.1') || host.includes('localhost') || host.includes('27017')) {
            dbType = 'Local MongoDB (localhost:27017)';
        } else {
            dbType = 'In-Memory (Mock Sandbox)';
        }
    }
    
    res.json({
        success: true,
        dbType,
        host,
        dbName: mongoose.connection.db?.databaseName || 'stocksync'
    });
});

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
