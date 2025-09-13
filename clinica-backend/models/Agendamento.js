 const mongoose = require("mongoose");

const agendamentoSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: "Paciente", required: true },
  medico: { type: String, required: true },
  data: { type: String, required: true },
  hora: { type: String, required: true },
  previsao: { type: String }
});

module.exports = mongoose.model("Agendamento", agendamentoSchema);
