const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const agendamentoRoutes = require("./routes/agendamentoRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const utilsRoutes = require("./routes/utilsRoutes"); // NOVO

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("MongoDB conectado"))
.catch(err => console.error("Erro MongoDB:", err));

app.use("/agendamentos", agendamentoRoutes);
app.use("/pacientes", pacienteRoutes);
app.use("/utils", utilsRoutes); // NOVO

app.get("/api/health", (req, res) => {
  res.json({ 
    message: "API da Clínica Nova está funcionando!",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));