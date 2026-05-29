// Import the mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;

        // Check if the connection string contains placeholder values (e.g. <password>)
        // If it does, we spin up an in-memory MongoDB server so the server connects successfully for local testing
        if (!uri || uri.includes('<password>') || uri.includes('<db_password>') || uri.includes('your_username')) {
            console.log('Database placeholder detected in .env. Starting a local in-memory MongoDB server for testing...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        // Attempt to connect to MongoDB using mongoose, specifying database name as stocksync
        await mongoose.connect(uri, { dbName: 'stocksync' });

        // Log a success message to the console once the connection is established
        console.log('MongoDB Connected');
    } catch (error) {
        // Log any errors that occur during the connection attempt
        console.error(`API Errors: MongoDB Connection Error: ${error.message}`);
    }
};

// Export the connectDB function so it can be imported and run in server.js
module.exports = connectDB;
