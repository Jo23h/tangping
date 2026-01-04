const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Task text is required"],
        trim: true
    },

    completed: {
        type: Boolean,
        default: false
    },

    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'low'
    },

    dueDate: {
        type: Date,
        default: null
    },

    memo: {
        type: String,
        default: ''
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    },

    isArchived: {
        type: Boolean,
        default: false
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
