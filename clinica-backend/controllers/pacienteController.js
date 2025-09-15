 const Paciente = require('../models/Paciente');
const jwt = require('jsonwebtoken');

// Função para gerar token
async function gerarToken(paciente) {
  return jwt.sign(
    { 
      userId: paciente._id, 
      email: paciente.email,
      role: 'paciente'
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, senha, telefone, dataNascimento, endereco } = req.body;

    // Verificar se paciente já existe
    const pacienteExistente = await Paciente.findOne({ email });
    if (pacienteExistente) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    // Criar novo paciente
    const paciente = new Paciente({
      nome,
      email,
      senha,
      telefone,
      dataNascimento,
      endereco
    });

    await paciente.save();

    // Gerar token
    const token = await gerarToken(paciente);

    res.status(201).json({
      message: 'Paciente cadastrado com sucesso',
      token,
      paciente: {
        _id: paciente._id,
        nome: paciente.nome,
        email: paciente.email,
        telefone: paciente.telefone,
        dataNascimento: paciente.dataNascimento,
        endereco: paciente.endereco
      }
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Dados inválidos', errors });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }
    
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Encontrar paciente
    const paciente = await Paciente.findOne({ email });
    if (!paciente) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaValida = await paciente.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token COM ROLE
    const token = await gerarToken(paciente);

    res.json({
      message: 'Login realizado com sucesso',
      token,
      paciente: {
        _id: paciente._id,
        nome: paciente.nome,
        email: paciente.email,
        telefone: paciente.telefone,
        dataNascimento: paciente.dataNascimento,
        endereco: paciente.endereco
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.getPerfil = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.user.userId).select('-senha');
    
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    res.json(paciente);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};