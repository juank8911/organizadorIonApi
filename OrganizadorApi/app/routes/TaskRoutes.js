const express = require('express');
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/AuthMiddelware');
const VerifyAuthorizeMiddleware = require('../middlewares/VerifyAuthorizeMiddelware');



const router = express.Router();

// Rutas de tareas (requieren autenticación)
router.get('/', authMiddleware, TaskController.list);
router.post('/',VerifyAuthorizeMiddleware(['admin']), TaskController.create);
router.put('/:id', (req, res, next) => VerifyAuthorizeMiddleware(['ejec', 'admin'])(req, res, next), TaskController.update);
router.delete('/:id', (req, res, next) => VerifyAuthorizeMiddleware(['admin'])(req, res, next), TaskController.delete);
router.get('/ejec/:id',VerifyAuthorizeMiddleware(['ejec']), TaskController.listTaskAsignedEject);
router.get('/admin/:id',VerifyAuthorizeMiddleware(['admin']), TaskController.listTaskCreatedAdmin);

module.exports = router;