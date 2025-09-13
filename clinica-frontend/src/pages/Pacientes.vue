<template>
  <div class="home-container">
    <div class="welcome-section">
      <h2><i class="fas fa-user-injured"></i> Área do Paciente</h2>
      <p>Bem-vindo, {{ paciente.nome }}!</p>
      <button @click="sair" class="btn-sair">
        <i class="fas fa-sign-out-alt"></i> Sair
      </button>
    </div>

    <div class="content-container">
      <!-- Agendar Consulta -->
      <div class="left-panel">
        <div class="login-section">
          <h3><i class="fas fa-calendar-plus"></i> Agendar Consulta</h3>
          <form @submit.prevent="agendarConsulta" class="agendamento-form">
            <div class="form-row">
              <div class="input-group">
                <label for="data">Data:</label>
                <input 
                  type="date" 
                  id="data" 
                  v-model="novaConsulta.data" 
                  @change="carregarPrevisaoTempo"
                  required
                >
              </div>
              <div class="input-group">
                <label for="hora">Hora:</label>
                <input type="time" id="hora" v-model="novaConsulta.hora" required>
              </div>
            </div>
            
            <div class="input-group">
              <label for="especialidade">Especialidade Médica:</label>
              <select id="especialidade" v-model="novaConsulta.especialidade" @change="carregarMedicosPorEspecialidade" required>
                <option value="">Selecione uma especialidade</option>
                <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                  {{ especialidade }}
                </option>
              </select>
            </div>
            
            <div class="input-group">
              <label for="medico">Médico:</label>
              <select id="medico" v-model="novaConsulta.medicoId" :disabled="!novaConsulta.especialidade || medicosCarregando" required>
                <option value="">Selecione um médico</option>
                <option v-for="medico in medicosFiltrados" :key="medico._id" :value="medico._id">
                  {{ medico.nome }} - {{ medico.especialidade }}
                </option>
              </select>
              <small v-if="!novaConsulta.especialidade" class="select-help">
                Selecione primeiro uma especialidade
              </small>
              <small v-if="medicosCarregando" class="select-help">
                Carregando médicos...
              </small>
            </div>
            
            <button type="submit" class="btn-login" :disabled="agendamentoCarregando">
              <i class="fas fa-calendar-check"></i> 
              {{ agendamentoCarregando ? 'Agendando...' : 'Agendar Consulta' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Previsão do Tempo e Consultas -->
      <div class="right-panel">
        <!-- Previsão do Tempo -->
        <div class="login-section" v-if="previsaoTempo">
          <h3><i class="fas fa-cloud-sun"></i> Previsão do Tempo - Salvador/BA</h3>
          <div class="weather-content">
            <div class="weather-main">
              <img :src="`https://openweathermap.org/img/wn/${previsaoTempo.weather[0].icon}@2x.png`" :alt="previsaoTempo.weather[0].description">
              <div class="weather-temp">{{ Math.round(previsaoTempo.main.temp) }}°C</div>
            </div>
            <div class="weather-details">
              <p><strong>{{ formatarDataPrevisao(novaConsulta.data) }}</strong></p>
              <p><strong>{{ formatarDescricao(previsaoTempo.weather[0].description) }}</strong></p>
              <p>🌡️ Máx: {{ Math.round(previsaoTempo.main.temp_max) }}°C / Mín: {{ Math.round(previsaoTempo.main.temp_min) }}°C</p>
              <p>💧 Umidade: {{ previsaoTempo.main.humidity }}%</p>
              <p>💨 Vento: {{ previsaoTempo.wind.speed }} km/h</p>
              <p>🌡️ Sensação: {{ Math.round(previsaoTempo.main.feels_like) }}°C</p>
            </div>
          </div>
          <div v-if="carregandoPrevisao" class="loading">
            <i class="fas fa-spinner fa-spin"></i> Carregando previsão...
          </div>
        </div>

        <!-- Mensagem quando não há data selecionada -->
        <div class="login-section" v-else-if="!carregandoPrevisao">
          <h3><i class="fas fa-cloud-sun"></i> Previsão do Tempo - Salvador/BA</h3>
          <p>Selecione uma data para ver a previsão do tempo.</p>
        </div>

        <!-- Consultas Agendadas -->
        <div class="login-section" v-if="consultas.length > 0">
          <h3><i class="fas fa-list"></i> Minhas Consultas</h3>
          <div class="consultas-list">
            <div v-for="consulta in consultas" :key="consulta._id" class="consulta-item">
              <div class="consulta-info">
                <h4>Consulta com {{ consulta.medico.nome }}</h4>
                <p><strong>Data:</strong> {{ formatarData(consulta.data) }}</p>
                <p><strong>Hora:</strong> {{ consulta.hora }}</p>
                <p><strong>Especialidade:</strong> {{ consulta.medico.especialidade }}</p>
                <p><strong>Status:</strong> {{ consulta.status }}</p>
              </div>
              <div class="consulta-actions">
                <button @click="editarConsulta(consulta)" class="btn-editar" v-if="consulta.status === 'Agendada'">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button @click="cancelarConsulta(consulta._id)" class="btn-cancelar" v-if="consulta.status === 'Agendada'">
                  <i class="fas fa-times"></i> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensagem quando não há consultas -->
        <div class="login-section" v-else>
          <h3><i class="fas fa-list"></i> Minhas Consultas</h3>
          <p>Você não possui consultas agendadas.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

// Chave API do OpenWeather
const API_KEY = 'c7ffb5ee9495238440a598f1eff0312a';
const CIDADE = 'Salvador,BR';

export default {
  name: "Pacientes",
  data() {
    return {
      paciente: {},
      previsaoTempo: null,
      carregandoPrevisao: false,
      agendamentoCarregando: false,
      medicosCarregando: false,
      novaConsulta: {
        data: '',
        hora: '',
        especialidade: '',
        medicoId: ''
      },
      especialidades: [], // Será carregado do backend
      medicos: [], // Será carregado do backend
      consultas: []
    };
  },
  computed: {
    medicosFiltrados() {
      if (!this.novaConsulta.especialidade) return [];
      return this.medicos.filter(medico => 
        medico.especialidade === this.novaConsulta.especialidade
      );
    }
  },
  async mounted() {
    await this.carregarPaciente();
    await this.carregarEspecialidades();
    await this.carregarConsultas();
  },
  methods: {
    async carregarPaciente() {
      try {
        const response = await api.get('/pacientes/me');
        this.paciente = response.data;
      } catch (error) {
        console.error('Erro ao carregar dados do paciente:', error);
        this.$router.push('/login');
      }
    },
    
    async carregarEspecialidades() {
      try {
        const response = await api.get('/especialidades');
        this.especialidades = response.data;
      } catch (error) {
        console.error('Erro ao carregar especialidades:', error);
        // Fallback para dados estáticos
        this.especialidades = ['Clínica Geral', 'Cardiologia', 'Dermatologia', 'Ortopedia', 'Pediatria'];
      }
    },
    
    async carregarMedicosPorEspecialidade() {
      if (!this.novaConsulta.especialidade) return;
      
      this.medicosCarregando = true;
      this.novaConsulta.medicoId = '';
      
      try {
        const response = await api.get(`/medicos?especialidade=${this.novaConsulta.especialidade}`);
        this.medicos = response.data;
      } catch (error) {
        console.error('Erro ao carregar médicos:', error);
        alert('Erro ao carregar médicos. Tente novamente.');
      } finally {
        this.medicosCarregando = false;
      }
    },
    
    async carregarConsultas() {
      try {
        const response = await api.get('/consultas');
        this.consultas = response.data;
      } catch (error) {
        console.error('Erro ao carregar consultas:', error);
        alert('Erro ao carregar consultas.');
      }
    },
    
    async agendarConsulta() {
      if (!this.novaConsulta.medicoId) {
        alert('Por favor, selecione um médico.');
        return;
      }
      
      this.agendamentoCarregando = true;
      
      try {
        const response = await api.post('/consultas', this.novaConsulta);
        
        this.consultas.push(response.data);
        alert('Consulta agendada com sucesso!');
        
        // Resetar formulário
        this.novaConsulta = {
          data: '',
          hora: '',
          especialidade: '',
          medicoId: ''
        };
        
        this.previsaoTempo = null;
      } catch (error) {
        console.error('Erro ao agendar consulta:', error);
        alert('Erro ao agendar consulta: ' + (error.response?.data?.message || error.message));
      } finally {
        this.agendamentoCarregando = false;
      }
    },
    
    async cancelarConsulta(id) {
      if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;
      
      try {
        await api.delete(`/consultas/${id}`);
        this.consultas = this.consultas.filter(consulta => consulta._id !== id);
        alert('Consulta cancelada com sucesso!');
      } catch (error) {
        console.error('Erro ao cancelar consulta:', error);
        alert('Erro ao cancelar consulta.');
      }
    },
    
    // Métodos de previsão do tempo (mantidos da versão anterior)
    async carregarPrevisaoTempo() {
      if (!this.novaConsulta.data) {
        this.previsaoTempo = null;
        return;
      }
      
      this.carregandoPrevisao = true;
      this.previsaoTempo = null;
      
      try {
        const dataSelecionada = new Date(this.novaConsulta.data);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        if (dataSelecionada < hoje) {
          this.previsaoTempo = {
            weather: [{ description: 'Data passada', icon: '01d' }],
            main: { 
              temp: 0, 
              temp_max: 0,
              temp_min: 0,
              humidity: 0,
              feels_like: 0
            },
            wind: { speed: 0 }
          };
          return;
        }
        
        const diffTime = Math.abs(dataSelecionada - hoje);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 5) {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${CIDADE}&appid=${API_KEY}&units=metric&lang=pt_br`
          );
          const dados = await response.json();
          
          const previsaoEncontrada = dados.list.find(item => {
            const dataPrevisao = new Date(item.dt * 1000);
            return dataPrevisao.toDateString() === dataSelecionada.toDateString() && 
                   dataPrevisao.getHours() >= 12;
          });
          
          if (previsaoEncontrada) {
            this.previsaoTempo = previsaoEncontrada;
          } else {
            const previsoesDoDia = dados.list.filter(item => {
              const dataPrevisao = new Date(item.dt * 1000);
              return dataPrevisao.toDateString() === dataSelecionada.toDateString();
            });
            
            if (previsoesDoDia.length > 0) {
              this.previsaoTempo = previsoesDoDia[0];
            } else {
              throw new Error('Previsão não encontrada para esta data');
            }
          }
        } else {
          this.previsaoTempo = this.gerarPrevisaoSimulada(dataSelecionada);
        }
      } catch (error) {
        console.error('Erro ao carregar previsão do tempo:', error);
        this.previsaoTempo = this.gerarPrevisaoSimulada(new Date(this.novaConsulta.data));
      } finally {
        this.carregandoPrevisao = false;
      }
    },
    
    gerarPrevisaoSimulada(data) {
      const mes = data.getMonth();
      let tempBase, variacao;
      
      if (mes >= 9 || mes <= 2) {
        tempBase = 28 + Math.floor(Math.random() * 5);
        variacao = 3;
      } else {
        tempBase = 25 + Math.floor(Math.random() * 4);
        variacao = 2;
      }
      
      const condicoes = [
        { desc: 'ensolarado', icon: '01d' },
        { desc: 'parcialmente nublado', icon: '02d' },
        { desc: 'nublado', icon: '03d' },
        { desc: 'chuva leve', icon: '10d' }
      ];
      
      const condicao = condicoes[Math.floor(Math.random() * condicoes.length)];
      
      return {
        weather: [{ description: condicao.desc, icon: condicao.icon }],
        main: { 
          temp: tempBase,
          temp_max: tempBase + variacao,
          temp_min: tempBase - variacao,
          humidity: 60 + Math.floor(Math.random() * 30),
          feels_like: tempBase + 1
        },
        wind: { speed: 5 + Math.floor(Math.random() * 10) }
      };
    },
    
    formatarData(data) {
      return new Date(data).toLocaleDateString('pt-BR');
    },
    
    formatarDataPrevisao(data) {
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      return new Date(data).toLocaleDateString('pt-BR', options);
    },
    
    formatarDescricao(descricao) {
      return descricao.charAt(0).toUpperCase() + descricao.slice(1);
    },
    
    sair() {
      localStorage.removeItem('token');
      localStorage.removeItem('pacienteLogado');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.home-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.welcome-section h2 {
  color: #4b6cb7;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.welcome-section p {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.btn-sair {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-sair:hover {
  background: #5a6268;
}

.content-container {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.left-panel, .right-panel {
  flex: 1;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-section {
  padding: 1.5rem;
}

.login-section h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  color: white;
}

.agendamento-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: white;
}

.input-group input,
.input-group select {
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  box-sizing: border-box;
  height: 48px;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #4b6cb7;
  background: white;
  box-shadow: 0 0 5px rgba(75, 108, 183, 0.5);
}

.input-group select:disabled {
  background: rgba(255, 255, 255, 0.7);
  cursor: not-allowed;
  color: #666;
}

.select-help {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  margin-top: 0.3rem;
  font-style: italic;
}

.input-group select option {
  background: white;
  color: #333;
  padding: 10px;
}

.btn-login {
  background: rgba(255, 255, 255, 0.9);
  color: #4b6cb7;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-login:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-login:disabled {
  background: rgba(255, 255, 255, 0.6);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.weather-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.weather-main {
  text-align: center;
}

.weather-temp {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 0.5rem;
}

.weather-details p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.weather-details strong {
  color: #fff;
  font-size: 1.1rem;
}

.loading {
  text-align: center;
  padding: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.consultas-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.consulta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
}

.consulta-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.consulta-info p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.consulta-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-editar,
.btn-cancelar {
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-editar {
  background: #ffc107;
  color: #212529;
}

.btn-cancelar {
  background: #dc3545;
  color: white;
}

.btn-editar:hover,
.btn-cancelar:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }
  
  .home-container {
    padding: 1rem;
  }
  
  .left-panel, .right-panel {
    padding: 1.5rem;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .consulta-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .consulta-actions {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .weather-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>