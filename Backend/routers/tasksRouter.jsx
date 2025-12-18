const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
    createTask,
    getAllTasks,
    getSpecificTask,
    updateTask,
    deleteTask
} = require('../controllers/tasks');

router.post('/', verifyToken, createTask);
router.get('/', verifyToken, getAllTasks);
router.get('/:id', verifyToken, getSpecificTask);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

module.exports = router;
