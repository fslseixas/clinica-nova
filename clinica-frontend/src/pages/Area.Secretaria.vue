<template>
  <div class="area-secretaria-container">
    <div class="header">
      <h1><i class="fas fa-user-tie"></i> Área da Secretaria</h1>
      <p>Bem-vinda, {{ secretaria.nome }}!</p>
      <button @click="sair" class="btn-sair">
        <i class="fas fa-sign-out-alt"></i> Sair
      </button>
    </div>

    <div class="content">
      <!-- Estatísticas Rápidas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-info">
            <h3>{{ totalPacientes }}</h3>
            <p>Pacientes Cadastrados</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stat-info">
            <h3>{{ totalConsultas }}</h3>
            <p>Consultas Agendadas</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-md"></i>
          </div>
          <div class="stat-info">
            <h3>{{ medicos.length }}</h3>
            <p>Médicos Cadastrados</p>
          </div>
        </div>
      </div>

      <!-- Gerenciamento de Consultas -->
      <div class="content-box">
        <div class="content-header">
          <h2><i class="fas fa-calendar-alt"></i> Gerenciar Consultas</h2>
          <button @click="mostrarFiltros = !mostrarFiltros" class="btn-filtrar">
            <i class="fas fa-filter"></i> Filtrar
          </button>
        </div>

        <!-- Filtros -->
        <div class="filtros" v-if="mostrarFiltros">
          <div class="filtro-group">
            <label>Data:</label>
            <input type="date" v-model="filtroData">
          </div>
          <div class="filtro-group">
            <label>Especialidade:</label>
            <select v-model="filtroEspecialidade">
              <option value="">Todas</option>
              <option v-for="esp in especialidades" :key="esp" :value="esp">{{ esp }}</option>
            </select>
          </div>
          <div class="filtro-group">
            <label>Médico:</label>
            <select v-model="filtroMedico">
              <option value="">Todos</option>
              <option v-for="med in medicos" :key="med.id" :value="med.nome">{{ med.nome }}</option>
            </select>
          </div>
        </div>

        <!-- Lista de Consultas -->
        <div class="consultas-table">
          <div class="table-header">
            <div>Paciente</div>
            <div>Data</div>
            <div>Hora</div>
            <div>Especialidade</div>
            <div>Médico</div>
            <div>Ações</div>
          </div>
          
          <div v-for="consulta in consultasFiltradas" :key="consulta.id" class="table-row">
            <div>{{ consulta.paciente }}</div>
            <div>{{ formatarData(consulta.data) }}</div>
            <div>{{ consulta.hora }}</div>
            <div>{{ consulta.especialidade }}</div>
            <div>{{ consulta.medico }}</div>
            <div class="acoes">
              <button @click="editarConsulta(consulta)" class="btn-editar">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="cancelarConsulta(consulta.id)" class="btn-cancelar">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div v-if="consultasFiltradas.length === 0" class="empty-state">
            <i class="fas fa-calendar-times"></i>
            <p>Nenhuma consulta encontrada</p>
          </div>
        </div>
      </div>

      <!-- Modal de Edição -->
      <div v-if="consultaEditando" class="modal-overlay">
        <div class="modal">
          <h3>Editar Consulta</h3>
          <form @submit.prevent="salvarEdicao">
            <div class="form-group">
              <label>Paciente:</label>
              <input type="text" v-model="consultaEditando.paciente" disabled>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Data:</label>
                <input type="date" v-model="consultaEditando.data" required>
              </div>
              <div class="form-group">
                <label>Hora:</label>
                <input type="time" v-model="consultaEditando.hora" required>
              </div>
            </div>
            <div class="form-group">
              <label>Especialidade:</label>
              <select v-model="consultaEditando.especialidade" required>
                <option v-for="esp in especialidades" :key="esp" :value="esp">{{ esp }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Médico:</label>
              <select v-model="consultaEditando.medico" required>
                <option v-for="med in medicosFiltrados" :key="med.id" :value="med.nome">{{ med.nome }}</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" @click="cancelarEdicao" class="btn-cancel">Cancelar</button>
              <button type="submit" class="btn-salvar">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AreaSecretaria',
  data() {
    return {
      secretaria: {},
      mostrarFiltros: false,
      filtroData: '',
      filtroEspecialidade: '',
      filtroMedico: '',
      consultaEditando: null,
      especialidades: [
        'Clínica Geral',
        'Cardiologia',
        'Dermatologia',
        'Ortopedia',
        'Pediatria'
      ],
      medicos: [
        { id: 1, nome: 'Dr. Carlos Silva', especialidade: 'Clínica Geral' },
        { id: 2, nome: 'Dra. Ana Santos', especialidade: 'Cardiologia' },
        { id: 3, nome: 'Dr. Pedro Costa', especialidade: 'Dermatologia' },
        { id: 4, nome: 'Dra. Mariana Oliveira', especialidade: 'Ortopedia' },
        { id: 5, nome: 'Dr. João Pereira', especialidade: 'Pediatria' }
      ],
      todasConsultas: []
    }
  },
  computed: {
    totalPacientes() {
      const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
      return pacientes.length;
    },
    totalConsultas() {
      return this.todasConsultas.length;
    },
    consultasFiltradas() {
      return this.todasConsultas.filter(consulta => {
        const matchData = !this.filtroData || consulta.data === this.filtroData;
        const matchEspecialidade = !this.filtroEspecialidade || consulta.especialidade === this.filtroEspecialidade;
        const matchMedico = !this.filtroMedico || consulta.medico === this.filtroMedico;
        return matchData && matchEspecialidade && matchMedico;
      });
    },
    medicosFiltrados() {
      if (!this.consultaEditando?.especialidade) return this.medicos;
      return this.medicos.filter(medico => 
        medico.especialidade === this.consultaEditando.especialidade
      );
    }
  },
  mounted() {
    this.carregarSecretaria();
    this.carregarConsultas();
  },
  methods: {
    carregarSecretaria() {
      const secretariaLogada = localStorage.getItem('secretariaLogada');
      if (secretariaLogada) {
        this.secretaria = JSON.parse(secretariaLogada);
      } else {
        this.$router.push('/secretaria');
      }
    },
    carregarConsultas() {
      // Carregar todas as consultas de todos os pacientes
      const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
      this.todasConsultas = [];
      
      pacientes.forEach(paciente => {
        const consultasPaciente = JSON.parse(localStorage.getItem(`consultas_${paciente.id}`) || '[]');
        consultasPaciente.forEach(consulta => {
          this.todasConsultas.push({
            ...consulta,
            paciente: paciente.nome,
            pacienteId: paciente.id
          });
        });
      });
      
      // Ordenar por data e hora
      this.todasConsultas.sort((a, b) => {
        const dataA = new Date(`${a.data}T${a.hora}`);
        const dataB = new Date(`${b.data}T${b.hora}`);
        return dataA - dataB;
      });
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString('pt-BR');
    },
    editarConsulta(consulta) {
      this.consultaEditando = { ...consulta };
    },
    cancelarEdicao() {
      this.consultaEditando = null;
    },
    salvarEdicao() {
      if (this.consultaEditando) {
        // Atualizar a consulta no localStorage do paciente
        const consultasPaciente = JSON.parse(
          localStorage.getItem(`consultas_${this.consultaEditando.pacienteId}`) || '[]'
        );
        
        const index = consultasPaciente.findIndex(c => c.id === this.consultaEditando.id);
        if (index !== -1) {
          consultasPaciente[index] = this.consultaEditando;
          localStorage.setItem(`consultas_${this.consultaEditando.pacienteId}`, JSON.stringify(consultasPaciente));
        }
        
        // Recarregar consultas
        this.carregarConsultas();
        this.consultaEditando = null;
        alert('Consulta atualizada com sucesso!');
      }
    },
    cancelarConsulta(id) {
      if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
        // Encontrar a consulta para obter o ID do paciente
        const consulta = this.todasConsultas.find(c => c.id === id);
        if (consulta) {
          const consultasPaciente = JSON.parse(
            localStorage.getItem(`consultas_${consulta.pacienteId}`) || '[]'
          );
          
          const novasConsultas = consultasPaciente.filter(c => c.id !== id);
          localStorage.setItem(`consultas_${consulta.pacienteId}`, JSON.stringify(novasConsultas));
          
          // Recarregar consultas
          this.carregarConsultas();
          alert('Consulta cancelada com sucesso!');
        }
      }
    },
    sair() {
      localStorage.removeItem('secretariaLogada');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.area-secretaria-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.header {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  position: relative;
}

.header h1 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.btn-sair {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  background: #4b6cb7;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.stat-info h3 {
  font-size: 1.8rem;
  margin: 0;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  color: #6c757d;
}

.content-box {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f1f1;
}

.content-header h2 {
  margin: 0;
  color: #2c3e50;
}

.btn-filtrar {
  background: #4b6cb7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.filtros {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 5px;
}

.filtro-group {
  display: flex;
  flex-direction: column;
}

.filtro-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.filtro-group input,
.filtro-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.consultas-table {
  border: 1px solid #e9ecef;
  border-radius: 5px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
  background: #4b6cb7;
  color: white;
  font-weight: 600;
  padding: 1rem;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f8f9fa;
}

.acoes {
  display: flex;
  gap: 0.5rem;
}

.btn-editar,
.btn-cancelar {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-editar {
  background: #ffc107;
  color: #212529;
}

.btn-cancelar {
  background: #dc3545;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h3 {
  margin-top: 0;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-salvar {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .filtros {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>