const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your name"],
        trim: true,
    },

    email: {
        type: String,
        required: [true, "Enter your email"],
        trim: true,
        lowercase: true,
        // validates the email format using a regular expression (regex)
        match: [/^\S+@\S+\.\S+$/, "Enter a valid email"]
    },

    password: {
        type: String,
        required: [true, "Enter your password"],
        trim: true
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;

