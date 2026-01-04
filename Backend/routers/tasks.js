const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
    createTask,
    getAllTasks,
    getSpecificTask,
    updateTask,
    deleteTask,
    getDeletedTasks,
    clearAllDeletedTasks
} = require('../controllers/tasks');

router.post('/', verifyToken, createTask);
router.get('/', verifyToken, getAllTasks);
router.get('/deleted', verifyToken, getDeletedTasks);
router.delete('/deleted/clear', verifyToken, clearAllDeletedTasks);
router.get('/:id', verifyToken, getSpecificTask);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

module.exports = router;
