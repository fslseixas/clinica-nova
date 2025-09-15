const mongoose = require("mongoose");

const agendamentoSchema = new mongoose.Schema({
  paciente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Paciente", 
    required: true 
  },
  medico: { 
    type: String, 
    required: true 
  },
  data: { 
    type: Date, 
    required: true 
  },
  hora: { 
    type: String, 
    required: true 
  },
  especialidade: { 
    type: String, 
    required: true 
  },
  previsaoTempo: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ["agendado", "cancelado", "realizado"], 
    default: "agendado" 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Agendamento", agendamentoSchema);