const User = require('../models/user');
const { getUserBalanceSummary } = require('../services/balanceSummary')

// Still allows for multiple users to have the same email
async function createUser(req, res) {
    try {
        const newUser = await User.create(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


async function getAllUsers(req, res) {
    try {
        const users = await User.find().select('-password');
        return res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getSpecificUser(req, res) {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function updateUser(req, res) {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function deleteUser(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getSpecificUser,
    deleteUser,
    updateUser,
    
}