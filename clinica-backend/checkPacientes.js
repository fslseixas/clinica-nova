const mongoose = require('mongoose');
const Paciente = require('./models/Paciente');
require('dotenv').config();

async function checkPacientes() {
  try {
    console.log('🔗 Conectando ao MongoDB...');
    
    // Use a MESMA string de conexão do seu backend
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinicanova';
    console.log('String de conexão:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado ao MongoDB');
    
    // Listar TODAS as coleções para verificar o banco
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📦 Coleções no banco:');
    collections.forEach(col => console.log('-', col.name));
    
    console.log('\n🔍 Verificando pacientes...');
    const count = await Paciente.countDocuments();
    console.log(`📊 Total de pacientes: ${count}`);
    
    if (count > 0) {
      const pacientes = await Paciente.find({}, 'nome email');
      console.log('\n📋 Pacientes encontrados:');
      pacientes.forEach(p => console.log('-', p.nome, '(', p.email, ')'));
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    
    // Verificar se o MongoDB está rodando
    console.log('\n🔍 Verifique se o MongoDB está executando:');
    console.log('1. Abra o Prompt de Comando como Administrador');
    console.log('2. Execute: net start MongoDB');
    console.log('3. Ou: services.msc e inicie o serviço MongoDB');
  }
}

checkPacientes();