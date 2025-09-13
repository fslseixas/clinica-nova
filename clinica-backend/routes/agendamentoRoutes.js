const express = require("express");
const router = express.Router();
const agendamentoController = require("../controllers/agendamentoController");
const authMiddleware = require("../middlewares/authMiddleware");

// Criar agendamento (apenas secretaria)
router.post("/", authMiddleware(["secretaria"]), agendamentoController.criarAgendamento);

// Listar meus agendamentos (paciente ou médico)
router.get("/meus", authMiddleware(["paciente", "medico"]), agendamentoController.meusAgendamentos);

// Listar todos os agendamentos (secretaria)
router.get("/", authMiddleware(["secretaria"]), agendamentoController.listarAgendamentos);

// Obter agendamento específico
router.get("/:id", authMiddleware(["secretaria", "paciente", "medico"]), agendamentoController.obterAgendamento);

// Atualizar agendamento
router.put("/:id", authMiddleware(["secretaria"]), agendamentoController.atualizarAgendamento);

// Cancelar agendamento
router.delete("/:id", authMiddleware(["secretaria", "paciente"]), agendamentoController.cancelarAgendamento);

// Agendamentos por data
router.get("/data/:data", authMiddleware(["secretaria", "medico"]), agendamentoController.agendamentosPorData);

module.exports = router;