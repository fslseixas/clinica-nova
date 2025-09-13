<template>
  <div>
    <h2>Agendamentos</h2>
    
    <!-- Formulário para novo agendamento -->
    <div v-if="mostrarFormulario">
      <h3>Novo Agendamento</h3>
      <form @submit.prevent="criarAgendamento">
        <div>
          <label>Paciente:</label>
          <input type="text" v-model="novoAgendamento.paciente" required>
        </div>
        <div>
          <label>Data:</label>
          <input 
            type="date" 
            v-model="novoAgendamento.data" 
            :min="dataMinima"
            :max="dataMaxima"
            @change="gerarHorariosDisponiveis"
            required
          >
        </div>
        <div>
          <label>Hora:</label>
          <select v-model="novoAgendamento.horario" required>
            <option value="">Selecione um horário</option>
            <option 
              v-for="hora in horariosDisponiveis" 
              :key="hora" 
              :value="hora"
            >
              {{ hora }}
            </option>
          </select>
        </div>
        <button type="submit">Agendar</button>
      </form>
    </div>
    
    <button @click="mostrarFormulario = !mostrarFormulario">
      {{ mostrarFormulario ? 'Cancelar' : 'Novo Agendamento' }}
    </button>

    <!-- Tabela de agendamentos - CORRIGIDA -->
    <table>
      <thead>
        <tr>
          <th>Paciente</th>
          <th>Data</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ag in agendamentos" :key="ag.id">
          <td>{{ ag.paciente }}</td>
          <td>{{ formatarData(ag.data) }}</td>
          <td>{{ ag.horario }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "Agendamentos",
  data() {
    return { 
      agendamentos: [],
      mostrarFormulario: false,
      novoAgendamento: {
        paciente: '',
        data: '',
        horario: ''
      },
      horariosDisponiveis: []
    };
  },
  computed: {
    dataMinima() {
      // Data mínima é hoje
      return new Date().toISOString().split('T')[0];
    },
    dataMaxima() {
      // Permitir agendamento até 60 dias à frente
      const data = new Date();
      data.setDate(data.getDate() + 60);
      return data.toISOString().split('T')[0];
    }
  },
  async created() {
    const response = await api.get("/agendamentos");
    this.agendamentos = response.data;
  },
  methods: {
    // Verifica se uma data é dia útil (segunda a sábado)
    isDiaUtil(data) {
      const diaSemana = new Date(data).getDay();
      return diaSemana >= 1 && diaSemana <= 6; // 1=Segunda, 6=Sábado
    },
    
    // Gera horários disponíveis para a data selecionada
    gerarHorariosDisponiveis() {
      this.horariosDisponiveis = [];
      this.novoAgendamento.horario = '';
      
      if (!this.novoAgendamento.data) return;
      
      // Verifica se é dia útil (segunda a sábado)
      if (!this.isDiaUtil(this.novoAgendamento.data)) {
        alert('Agendamentos permitidos apenas de segunda a sábado');
        this.novoAgendamento.data = '';
        return;
      }
      
      // Gera horários comerciais (8h às 18h, de hora em hora)
      for (let hora = 8; hora <= 18; hora++) {
        this.horariosDisponiveis.push(`${hora.toString().padStart(2, '0')}:00`);
      }
    },
    
    // Formata data para exibição (dd/mm/aaaa)
    formatarData(data) {
      if (!data) return '';
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    },
    
    // Cria novo agendamento
    async criarAgendamento() {
      try {
        // Validações adicionais
        if (!this.isDiaUtil(this.novoAgendamento.data)) {
          alert('Agendamentos permitidos apenas de segunda a sábado');
          return;
        }
        
        const hora = parseInt(this.novoAgendamento.horario.split(':')[0]);
        if (hora < 8 || hora > 18) {
          alert('Horários permitidos apenas entre 8h e 18h');
          return;
        }
        
        // Envia para a API
        const response = await api.post("/agendamentos", this.novoAgendamento);
        
        // Adiciona à lista local
        this.agendamentos.push(response.data);
        
        // Limpa formulário
        this.novoAgendamento = {
          paciente: '',
          data: '',
          horario: ''
        };
        this.mostrarFormulario = false;
        
        alert('Agendamento criado com sucesso!');
      } catch (error) {
        alert('Erro ao criar agendamento: ' + error.message);
      }
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

form {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

form div {
  margin-bottom: 10px;
}

label {
  display: inline-block;
  width: 80px;
}

input, select {
  padding: 5px;
  width: 200px;
}

button {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background-color: #45a049;
}
</style>