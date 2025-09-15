 const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/cadastro', pacienteController.cadastrar);
router.post('/login', pacienteController.login);

// Rota protegida - APENAS para pacientes
router.get('/me', authMiddleware(['paciente']), pacienteController.getPerfil);

module.exports = router;