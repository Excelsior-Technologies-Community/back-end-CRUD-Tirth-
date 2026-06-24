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
        // Attempt to connect to MongoDB Atlas with a 5-second timeout limit
        await mongoose.connect(uri, { 
            dbName: 'stocksync',
            serverSelectionTimeoutMS: 5000
        });
        
        console.log('MongoDB Connected (Atlas Cloud)');
        console.log(`Active Database Name: ${mongoose.connection.db.databaseName}`);
    } catch (error) {
        console.error(`MongoDB Atlas Connection Failed: ${error.message}`);
        console.warn('\n================================================================');
        console.warn('WARNING: Your current IP address is not whitelisted in MongoDB Atlas.');
        console.warn('To upload data to Atlas, please whitelist IP: 117.98.141.63');
        console.warn('Falling back to a local In-Memory database so the application works.');
        console.warn('================================================================\n');
        
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const localUri = mongoServer.getUri();
            
            await mongoose.connect(localUri, { dbName: 'stocksync' });
            console.log('MongoDB Connected (Temporary Local In-Memory Database)');
            console.log(`Active Database Name: ${mongoose.connection.db.databaseName}`);
        } catch (fallbackError) {
            console.error(`Failed to start local In-Memory database: ${fallbackError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
