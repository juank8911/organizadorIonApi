const express = require('express');
const UserController = require('../controllers/UserController');
const TaskController = require('../controllers/TaskController');
const AuthMiddleware = require('../middlewares/AuthMiddelware');
const VerifyAuthorizeMiddleware = require('../middlewares/VerifyAuthorizeMiddelware');
const router = express.Router();

// Rutas de usuario
router.post('/register', (req, res, next) => VerifyAuthorizeMiddleware(['admin'])(req, res, next), UserController.register);
// El usuario debe ser administrador para poder crear otro usuario
router.post('/login', UserController.login);
router.post('/newpass', AuthMiddleware, UserController.changePassword);
router.post('/logout', AuthMiddleware, UserController.logout);

module.exports = router;
