const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        console.log("🔄 Attempting MongoDB connection...");

        const options = {
            // Recommended settings for MongoDB Atlas
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(process.env.MONGODB_URI, options);

        console.log("✅ MongoDB connected successfully");
        console.log("   Database:", mongoose.connection.db.databaseName);
    } catch (error) {
        console.error("❌ MongoDB connection FAILED:");
        console.error("   Error:", error.message);
        console.error("   Full error:", error);

        // Don't exit - let app run without DB for debugging
        console.log("⚠️  Continuing without database connection...");
    }
}

// Handle connection events
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

module.exports = connectDB