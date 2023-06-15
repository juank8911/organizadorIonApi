const express = require('express');3
const TaskRouter = require('./TaskRoutes');
const UserRouter = require('./UserRoutes');

const router = express.Router();
router.use('/auth',UserRouter);
router.use('/task',TaskRouter);

module.exports = router;