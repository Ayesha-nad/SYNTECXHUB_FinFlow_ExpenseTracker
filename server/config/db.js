const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Timeout fast if local Mongo is not running
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB at ${uri}. Running with local resilient storage engine.`);
    console.warn(`[MongoDB] Details: ${error.message}`);
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
