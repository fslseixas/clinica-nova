const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const pacienteSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: [true, "Nome é obrigatório"],
    trim: true,
    maxlength: [100, "Nome não pode ter mais de 100 caracteres"]
  },
  email: { 
    type: String, 
    unique: true, 
    required: [true, "Email é obrigatório"],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"]
  },
  senha: { 
    type: String, 
    required: [true, "Senha é obrigatória"],
    minlength: [6, "Senha deve ter pelo menos 6 caracteres"]
  },
  telefone: {
    type: String,
    trim: true,
    match: [/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, "Telefone inválido"]
  },
  dataNascimento: {
    type: Date,
    validate: {
      validator: function(value) {
        return value < new Date();
      },
      message: "Data de nascimento deve ser anterior à data atual"
    }
  },
  // NOVO: Campos de endereço (opcionais)
  endereco: {
    cep: {
      type: String,
      trim: true,
      match: [/^\d{5}-?\d{3}$/, "CEP inválido"]
    },
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    uf: {
      type: String,
      uppercase: true,
      maxlength: 2
    }
  }
}, { 
  timestamps: true
});

// Middleware para hash da senha antes de salvar
pacienteSchema.pre("save", async function(next) {
  if (!this.isModified("senha")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
pacienteSchema.methods.compararSenha = async function(senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

// Método para omitir a senha no JSON
pacienteSchema.methods.toJSON = function() {
  const paciente = this.toObject();
  delete paciente.senha;
  return paciente;
};

module.exports = mongoose.model("Paciente", pacienteSchema);