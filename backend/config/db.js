// Import the mongoose library to interact with MongoDB
const mongoose = require('mongoose');

/**
 * Connect to the MongoDB Database.
 * Connects exclusively to MongoDB Atlas.
 * No local/in-memory database fallbacks allowed.
 */
const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('API Errors: MONGO_URI is missing in backend environment variables.');
        process.exit(1);
    }

    // Print active MongoDB URI (without password)
    let sanitizedUri = uri;
    const match = uri.match(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/);
    if (match) {
        sanitizedUri = `${match[1]}*****${match[3]}`;
    }
    console.log(`Active MongoDB URI: ${sanitizedUri}`);

    try {
        console.log('Connecting to MongoDB Atlas...');
        // Attempt to connect to MongoDB Atlas
        await mongoose.connect(uri, { 
            dbName: 'stocksync'
        });
        
        console.log('MongoDB Connected (Atlas Cloud)');
        console.log(`Active Database Name: ${mongoose.connection.db.databaseName}`);
    } catch (error) {
        console.error(`MongoDB Atlas Connection Failed: ${error.message}`);
        console.error('Local/In-Memory MongoDB fallback has been disabled. Exiting process...');
        process.exit(1);
    }
};

module.exports = connectDB;
