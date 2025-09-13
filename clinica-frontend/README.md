🏥 Clínica Nova - Sistema de Gestão Médica
Sistema completo para agendamento de consultas médicas com integração de previsão do tempo e busca de CEP.

📋 Índice
Funcionalidades

Tecnologias

Pré-requisitos

Instalação

Configuração

Uso

API Endpoints

Deploy

Estrutura do Projeto

Contribuição

Licença

🚀 Funcionalidades
👥 Gestão de Usuários
✅ Cadastro e login de pacientes

✅ Autenticação segura com JWT

✅ Perfil do usuário

✅ Recuperação de senha

🗓️ Agendamentos
✅ Agendamento de consultas

✅ Validação de horários disponíveis

✅ Cancelamento de agendamentos

✅ Histórico de consultas

🏥 Painéis Administrativos
✅ Dashboard da secretaria

✅ Gestão de médicos e especialidades

✅ Relatórios e estatísticas

✅ Controle de agendamentos

🌐 Integrações Externas
✅ Previsão do tempo (OpenWeatherMap)

✅ Busca de CEP (ViaCEP)

✅ APIs RESTful completas

🛠️ Tecnologias
Frontend
Vue.js 3 - Framework principal

Vue Router - Roteamento

Axios - Cliente HTTP

Font Awesome - Ícones

CSS3 - Estilização com gradients

Backend
Node.js - Runtime JavaScript

Express.js - Framework web

MongoDB - Banco de dados NoSQL

Mongoose - ODM para MongoDB

JWT - Autenticação por tokens

bcryptjs - Hash de senhas

CORS - Cross-Origin Resource Sharing

APIs Externas
OpenWeatherMap - Previsão do tempo

ViaCEP - Busca de endereços

📋 Pré-requisitos
Node.js 16+

MongoDB 5+

npm ou yarn

Git

🚀 Instalação
1. Clone o repositório
bash

Copy

Download
git clone https://github.com/seu-usuario/clinica-nova.git
cd clinica-nova
2. Configure o Backend
bash

Copy

Download
cd clinica-backend
npm install
3. Configure o Frontend
bash

Copy

Download
cd clinica-frontend
npm install
⚙️ Configuração
Backend (.env)
env

Copy

Download
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/clinica
JWT_SECRET=meusegredo123
OPENWEATHER_API_KEY=c7ffb5ee9495238440a598f1eff0312a
Frontend (.env)
env

Copy

Download
VITE_API_URL=http://localhost:3000
🎯 Uso
Desenvolvimento
bash

Copy

Download
# Terminal 1 - Backend
cd clinica-backend
npm run dev

# Terminal 2 - Frontend
cd clinica-frontend
npm run dev
Produção
bash

Copy

Download
# Build do frontend
cd clinica-frontend
npm run build

# Start do backend
cd clinica-backend
npm start
Acessos
Frontend: http://localhost:5173

Backend: http://localhost:3000

Health Check: http://localhost:3000/api/health

📡 API Endpoints
Autenticação
POST /pacientes/cadastro - Cadastrar paciente

POST /pacientes/login - Login do paciente

GET /pacientes/me - Perfil do paciente (autenticado)

Agendamentos
POST /agendamentos - Criar agendamento

GET /agendamentos - Listar agendamentos

GET /agendamentos/meus - Meus agendamentos

PUT /agendamentos/:id - Atualizar agendamento

DELETE /agendamentos/:id - Cancelar agendamento

Utilitários
GET /utils/cep/:cep - Buscar endereço por CEP

GET /api/health - Health check da API

Exemplo de Uso
bash

Copy

Download
# Health Check
curl http://localhost:3000/api/health

# Cadastro de paciente
curl -X POST http://localhost:3000/pacientes/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456",
    "telefone": "(71) 99999-9999"
  }'

# Login
curl -X POST http://localhost:3000/pacientes/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
🌐 Deploy
Opção 1: Render (Recomendado)
Backend:

Conecte repositório no Render

Configure variáveis de ambiente

Deploy automático

Frontend:

Build com npm run build

Deploy na Vercel/Netlify

Opção 2: Heroku
bash

Copy

Download
# Backend
heroku create clinica-nova-backend
heroku config:set MONGODB_URI=sua_string_conexao
git push heroku main

# Frontend
npm run build
git add dist
git commit -m "Build for production"
Opção 3: MongoDB Atlas
env

Copy

Download
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/clinica
📁 Estrutura do Projeto
text

Copy

Download
clinica-nova/
├── clinica-backend/
│   ├── controllers/
│   │   ├── pacienteController.js
│   │   └── agendamentoController.js
│   ├── models/
│   │   ├── Paciente.js
│   │   └── Agendamento.js
│   ├── routes/
│   │   ├── pacienteRoutes.js
│   │   ├── agendamentoRoutes.js
│   │   └── utilsRoutes.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   ├── weather.js
│   │   └── cep.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── clinica-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.vue
│   │   │   ├── Pacientes.vue
│   │   │   ├── Secretaria.vue
│   │   │   └── Agendamentos.vue
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── router/
│   │   │   └── index.js
│   │   └── App.vue
│   └── package.json
└── README.md
🤝 Contribuição
Faça o fork do projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

🆘 Suporte
Para dúvidas e suporte:

📧 Email: suporte@clinicanova.com

🐛 Issues: GitHub Issues

💬 Discord: Link do Servidor

🔗 Links Úteis
Documentação da API

Guia de Deploy

Modelo de Dados

Desenvolvido com ❤️ para a Clínica Nova 🏥