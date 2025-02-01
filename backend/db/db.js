const mongoose = require('mongoose');

// MongoDB Atlas connection URL
const MONGO_URI = process.env.MONGO_URI;

// Database connection function
const connectDB = async () => {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Atlas connected successfully');
    } catch (error) {
        console.error(MONGO_URI);
        console.error('Error connecting to MongoDB Atlas', error.message);
        process.exit(1); // Exit the process if connection fails
    }
};

// Export the connection function for use in other files
module.exports = connectDB;
