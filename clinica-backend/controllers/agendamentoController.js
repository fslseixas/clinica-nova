const Agendamento = require("../models/Agendamento");
const Paciente = require("../models/Paciente");
const WeatherUtils = require("../utils/weather"); // corrigido
require("dotenv").config();

exports.criarAgendamento = async (req, res) => {
  try {
    const { emailPaciente, medico, data, hora, especialidade, cidade } = req.body;

    // Verificar se o paciente existe
    const paciente = await Paciente.findOne({ email: emailPaciente });
    if (!paciente) {
      return res.status(404).json({ 
        success: false,
        error: "Paciente não encontrado" 
      });
    }

    // Buscar previsão do tempo
    let previsaoTempo = null;
    try {
      previsaoTempo = await WeatherUtils.getPrevisaoTempo(cidade || "Salvador", data);
    } catch (weatherError) {
      console.error("Erro ao buscar previsão do tempo:", weatherError.message);
    }

    // Verificar se já existe agendamento
    const agendamentoExistente = await Agendamento.findOne({
      medico,
      data,
      hora
    });

    if (agendamentoExistente) {
      return res.status(409).json({
        success: false,
        error: "Já existe um agendamento para este médico no horário selecionado"
      });
    }

    // Criar novo agendamento
    const agendamento = new Agendamento({
      paciente: paciente._id,
      medico,
      data: new Date(data),
      hora,
      especialidade,
      cidade,
      previsaoTempo,
      status: "agendado"
    });

    await agendamento.save();

    // Popular dados do paciente
    const agendamentoPopulado = await Agendamento.findById(agendamento._id)
      .populate("paciente", "nome email telefone");

    res.status(201).json({
      success: true,
      message: "Agendamento criado com sucesso",
      data: agendamentoPopulado
    });

  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({ 
      success: false,
      error: "Erro interno ao criar agendamento" 
    });
  }
};

exports.meusAgendamentos = async (req, res) => {
  try {
    let agendamentos;

    if (req.user.role === "paciente") {
      agendamentos = await Agendamento.find({ paciente: req.user.userId })
        .populate("paciente", "nome email telefone")
        .sort({ data: 1, hora: 1 });

    } else if (req.user.role === "medico") {
      agendamentos = await Agendamento.find({ medico: req.user.nome })
        .populate("paciente", "nome email telefone")
        .sort({ data: 1, hora: 1 });

    } else {
      return res.status(403).json({ 
        success: false,
        error: "Acesso negado" 
      });
    }

    res.json({
      success: true,
      data: agendamentos
    });

  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ 
      success: false,
      error: "Erro interno ao buscar agendamentos" 
    });
  }
};

exports.listarAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate("paciente", "nome email telefone")
      .sort({ data: 1, hora: 1 });

    res.json({
      success: true,
      data: agendamentos
    });

  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    res.status(500).json({ 
      success: false,
      error: "Erro interno ao listar agendamentos" 
    });
  }
};

exports.obterAgendamento = async (req, res) => {
  try {
    const { id } = req.params;

    const agendamento = await Agendamento.findById(id)
      .populate("paciente", "nome email telefone");

    if (!agendamento) {
      return res.status(404).json({ 
        success: false,
        error: "Agendamento não encontrado" 
      });
    }

    res.json({
      success: true,
      data: agendamento
    });

  } catch (error) {
    console.error("Erro ao obter agendamento:", error);
    res.status(500).json({ 
      success: false,
      error: "Erro interno ao obter agendamento" 
    });
  }
};

exports.atualizarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { medico, data, hora, status, especialidade, cidade } = req.body;

    const agendamento = await Agendamento.findByIdAndUpdate(
      id,
      { medico, data, hora, status, especialidade, cidade },
      { new: true, runValidators: true }
    ).populate("paciente", "nome email telefone");

    if (!agendamento) {
      return res.status(404).json({ 
        success: false,
        error: "Agendamento não encontrado" 
      });
    }

    res.json({
      success: true,
      message: "Agendamento atualizado com sucesso",
      data: agendamento
    });

  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({ 
      success: false,
      error: "Erro interno ao atualizar agendamento" 
    });
  }
};

exports.cancelarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;

    const agendamento = await Agendamento.findByIdAndUpdate(
      id,
      { status: "cancelado" },
      { new: true }
    ).populate("paciente", "nome email telefone");

    if (!agendamento) {
      return res.status(404).json({ 
        success: false,
        error: "Agendamento não encontrado" 
      });
    }

    res.json({
      success: true,
      message: "Agendamento cancelado com sucesso",
      data: agendamento
    });

  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    res.status(500).json({ 
      success: false,
      error: "Erro interno ao cancelar agendamento" 
    });
  }
};

exports.agendamentosPorData = async (req, res) => {
  try {
    const { data } = req.params;

    const agendamentos = await Agendamento.find({ data: new Date(data) })
      .populate("paciente", "nome email telefone")
      .sort({ hora: 1 });

    res.json({
      success: true,
      data: agendamentos
    });

  } catch (error) {
    console.error("Erro ao buscar agendamentos por data:", error);
    res.status(500).json({ 
      success: false,
      error: "Erro interno ao buscar agendamentos por data" 
    });
  }
};
