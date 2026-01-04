const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
    getActivities,
    createActivity
} = require('../controllers/activities');

router.get('/', verifyToken, getActivities);
router.post('/', verifyToken, createActivity);

module.exports = router;
