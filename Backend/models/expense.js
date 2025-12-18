const mongoose = require("mongoose");

//what every expense document should have
const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, "Enter an expense"],
    },

    description: {
        type: String,
        trim: true,
        required: [true, "Enter a description"],
    },

    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    splitBetween: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
}, {timestamps: true});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
