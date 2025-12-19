const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Is Connected!")
        console.log("Database:", mongoose.connection.db.databaseName)
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message)
        process.exit(1)
    }
}

module.exports = connectDB