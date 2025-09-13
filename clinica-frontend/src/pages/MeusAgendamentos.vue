<template>
  <div>
    <h2>Meus Agendamentos</h2>
    <ul>
      <li v-for="consulta in agendamentos" :key="consulta.id">
        {{ consulta.data }} - {{ consulta.horario }} - {{ consulta.medico }}
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "MeusAgendamentos",
  data() {
    return { agendamentos: [] };
  },
  async created() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/meus-agendamentos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.agendamentos = response.data;
    } catch {
      alert("Erro ao buscar agendamentos");
    }
  },
};
</script>
