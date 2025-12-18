const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getSpecificUser, updateUser, deleteUser } = require('../controllers/users');

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getSpecificUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router; 