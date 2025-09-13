// routes/pacienteRoutes.js
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/cadastro', pacienteController.cadastrar);
router.post('/login', pacienteController.login);

// Rotas protegidas
router.get('/me', authMiddleware, pacienteController.getPerfil);

module.exports = router;