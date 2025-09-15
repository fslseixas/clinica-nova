<template>
  <div class="home-container">
    <div class="welcome-section">
      <h2><i class="fas fa-user-injured"></i> Área do {{ ehSecretaria ? 'Secretaria' : 'Paciente' }}</h2>
      <p>Bem-vindo, {{ usuario.nome }}!</p>
      <div class="welcome-buttons">
        <button v-if="!ehSecretaria" @click="abrirEdicaoPerfil" class="btn-editar-perfil">
          <i class="fas fa-user-edit"></i> Editar Perfil
        </button>
        <button @click="sair" class="btn-sair">
          <i class="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    </div>

    <!-- Modal de Edição de Perfil -->
    <div v-if="mostrarEditarPerfil" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-user-edit"></i> Editar Perfil</h3>
          <button @click="mostrarEditarPerfil = false" class="btn-fechar">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="atualizarPerfil" class="perfil-form">
          <!-- Dados Pessoais -->
          <div class="form-section">
            <h4><i class="fas fa-user"></i> Dados Pessoais</h4>
            <div class="form-row">
              <div class="input-group">
                <label>Nome Completo *</label>
                <input type="text" v-model="pacienteEdit.nome" required>
              </div>
              <div class="input-group">
                <label>Email</label>
                <input type="email" v-model="pacienteEdit.email" disabled>
                <small>Email não pode ser alterado</small>
              </div>
            </div>
            
            <div class="form-row">
              <div class="input-group">
                <label>Telefone *</label>
                <input type="tel" v-model="pacienteEdit.telefone" 
                       placeholder="(71) 99999-9999" required>
              </div>
              <div class="input-group">
                <label>Data de Nascimento</label>
                <input type="date" v-model="pacienteEdit.dataNascimento" 
                       :max="obterDataHoje()">
              </div>
            </div>
          </div>

          <!-- Endereço -->
          <div class="form-section">
            <h4><i class="fas fa-map-marker-alt"></i> Endereço</h4>
            <div class="input-group">
              <label>CEP</label>
              <div class="cep-container">
                <input type="text" v-model="pacienteEdit.endereco.cep" 
                       @blur="buscarCEP" placeholder="00000-000" maxlength="9">
                <button type="button" @click="buscarCEP" class="btn-cep">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>

            <div class="input-group">
              <label>Logradouro</label>
              <input type="text" v-model="pacienteEdit.endereco.logradouro" 
                     placeholder="Rua, Avenida, etc.">
            </div>

            <div class="form-row">
              <div class="input-group">
                <label>Número</label>
                <input type="text" v-model="pacienteEdit.endereco.numero" 
                       placeholder="123">
              </div>
              <div class="input-group">
                <label>Complemento</label>
                <input type="text" v-model="pacienteEdit.endereco.complemento" 
                       placeholder="Apto, Bloco, etc.">
              </div>
            </div>

            <div class="form-row">
              <div class="input-group">
                <label>Bairro</label>
                <input type="text" v-model="pacienteEdit.endereco.bairro" 
                       placeholder="Bairro">
              </div>
              <div class="input-group">
                <label>Cidade</label>
                <input type="text" v-model="pacienteEdit.endereco.cidade" 
                       placeholder="Cidade">
              </div>
            </div>

            <div class="form-row">
              <div class="input-group">
                <label>Estado</label>
                <input type="text" v-model="pacienteEdit.endereco.estado" 
                       placeholder="BA" maxlength="2">
              </div>
              <div class="input-group">
                <label>UF</label>
                <input type="text" v-model="pacienteEdit.endereco.uf" 
                       placeholder="BA" maxlength="2">
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-salvar" :disabled="atualizandoPerfil">
              <i class="fas fa-save"></i> 
              {{ atualizandoPerfil ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
            <button type="button" @click="mostrarEditarPerfil = false" class="btn-cancelar">
              <i class="fas fa-times"></i> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="content-container">
      <!-- Agendar Consulta (apenas para pacientes) -->
      <div class="left-panel" v-if="!ehSecretaria">
        <div class="login-section">
          <h3><i class="fas fa-calendar-plus"></i> Agendar Consulta</h3>
          <form @submit.prevent="agendarConsulta" class="agendamento-form">
            
            <!-- Data e Hora -->
            <div class="form-row">
              <div class="input-group">
                <label for="data">Data *</label>
                <input 
                  type="date" 
                  id="data" 
                  v-model="novaConsulta.data" 
                  :min="dataMinima"
                  :max="dataMaxima"
                  @change="onDataChange"
                  required
                >
                <small v-if="novaConsulta.data">
                  {{ formatarDataExtenso(novaConsulta.data) }}
                </small>
              </div>
              
              <div class="input-group">
                <label for="hora">Horário *</label>
                <select id="hora" v-model="novaConsulta.hora" 
                        :disabled="!novaConsulta.data || !ehDiaUtil" required>
                  <option value="">Selecione o horário</option>
                  <option v-for="horario in horariosComerciais" :key="horario" :value="horario">
                    {{ horario }}
                  </option>
                </select>
                <small v-if="!novaConsulta.data">
                  Selecione primeiro uma data
                </small>
                <small v-else-if="!ehDiaUtil" class="erro-texto">
                  ⚠️ Atendimento apenas de segunda a sexta
                </small>
              </div>
            </div>
            
            <!-- Especialidade e Médico -->
            <div class="input-group">
              <label for="especialidade">Especialidade *</label>
              <select id="especialidade" v-model="novaConsulta.especialidade" 
                      @change="novaConsulta.medico = ''" required>
                <option value="">Selecione a especialidade</option>
                <option v-for="especialidade in especialidades" :key="especialidade" 
                        :value="especialidade">
                  {{ especialidade }}
                </option>
              </select>
            </div>
            
            <div class="input-group">
              <label for="medico">Médico *</label>
              <select id="medico" v-model="novaConsulta.medico" 
                      :disabled="!novaConsulta.especialidade" required>
                <option value="">Selecione o médico</option>
                <option v-for="medico in medicosFiltrados" :key="medico" 
                        :value="medico">
                  {{ medico }}
                </option>
              </select>
              <small v-if="!novaConsulta.especialidade">
                Selecione primeiro uma especialidade
              </small>
            </div>

            <!-- Mensagem de Status -->
            <div v-if="mensagemAgendamento" class="mensagem-status" 
                 :class="{'erro': mensagemErro, 'sucesso': !mensagemErro}">
              <i :class="mensagemErro ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'"></i>
              {{ mensagemAgendamento }}
            </div>
            
            <button type="submit" class="btn-login" 
                    :disabled="agendamentoCarregando || !formularioValido">
              <i class="fas fa-calendar-check"></i> 
              {{ agendamentoCarregando ? 'Agendando...' : 'Agendar Consulta' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Previsão do Tempo e Consultas -->
      <div class="right-panel" :class="{ 'full-width': ehSecretaria }">
        <!-- Previsão do Tempo (apenas para pacientes) -->
        <div class="login-section" v-if="!ehSecretaria">
          <h3><i class="fas fa-cloud-sun"></i> Previsão do Tempo - Salvador/BA</h3>
          
          <div v-if="carregandoPrevisao" class="loading">
            <i class="fas fa-spinner fa-spin"></i> Carregando previsão...
          </div>
          
          <div v-else-if="previsaoTempo && novaConsulta.data" class="weather-card">
            <div class="weather-content">
              <div class="weather-main">
                <img :src="`https://openweathermap.org/img/wn/${previsaoTempo.weather[0].icon}@2x.png`" 
                     :alt="previsaoTempo.weather[0].description"
                     class="weather-icon">
                <div class="weather-temp">{{ Math.round(previsaoTempo.main.temp) }}°C</div>
              </div>
              <div class="weather-details">
                <p class="weather-date"><strong>{{ formatarDataPrevisao(novaConsulta.data) }}</strong></p>
                <p class="weather-desc"><strong>{{ formatarDescricao(previsaoTempo.weather[0].description) }}</strong></p>
                <div class="weather-info">
                  <span>🌡️ Máx: {{ Math.round(previsaoTempo.main.temp_max) }}°C</span>
                  <span>💧 Umidade: {{ previsaoTempo.main.humidity }}%</span>
                  <span>💨 Vento: {{ previsaoTempo.wind.speed }} km/h</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="weather-placeholder">
            <i class="fas fa-calendar-alt"></i>
            <p>Selecione uma data para ver a previsão do tempo</p>
          </div>
        </div>

        <!-- Consultas Agendadas -->
        <div class="login-section">
          <h3><i class="fas fa-list"></i> {{ ehSecretaria ? 'Todos os Agendamentos' : 'Minhas Consultas' }}</h3>
          
          <!-- Filtros para Secretaria -->
          <div v-if="ehSecretaria" class="filtros-secretaria">
            <div class="form-row">
              <div class="input-group">
                <label for="filtro-data">Filtrar por Data:</label>
                <input type="date" id="filtro-data" v-model="filtroData" @change="aplicarFiltros">
              </div>
              <div class="input-group">
                <label for="filtro-status">Filtrar por Status:</label>
                <select id="filtro-status" v-model="filtroStatus" @change="aplicarFiltros">
                  <option value="">Todos</option>
                  <option value="agendado">Agendado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="realizado">Realizado</option>
                </select>
              </div>
            </div>
            <button @click="limparFiltros" class="btn-limpar-filtros">
              <i class="fas fa-times"></i> Limpar Filtros
            </button>
          </div>
          
          <div v-if="consultasFiltradas.length > 0" class="consultas-list">
            <div v-for="consulta in consultasFiltradas" :key="consulta._id" class="consulta-item">
              <div class="consulta-info">
                <h4>Consulta com {{ consulta.medico }}</h4>
                <p v-if="ehSecretaria && consulta.paciente">
                  <i class="fas fa-user"></i> <strong>Paciente:</strong> 
                  {{ consulta.paciente.nome }} ({{ consulta.paciente.email }})
                </p>
                <p><i class="fas fa-calendar"></i> <strong>Data:</strong> {{ formatarData(consulta.data) }}</p>
                <p><i class="fas fa-clock"></i> <strong>Hora:</strong> {{ consulta.hora }}</p>
                <p><i class="fas fa-stethoscope"></i> <strong>Especialidade:</strong> {{ consulta.especialidade }}</p>
                <p><i class="fas fa-circle" :class="'status-' + consulta.status"></i> 
                   <strong>Status:</strong> {{ formatarStatus(consulta.status) }}</p>
                <p v-if="consulta.previsaoTempo">
                  <i class="fas fa-cloud"></i> <strong>Previsão:</strong> {{ consulta.previsaoTempo }}
                </p>
              </div>
              <div class="consulta-actions">
                <button @click="cancelarConsulta(consulta._id)" 
                        class="btn-cancelar" 
                        v-if="consulta.status === 'agendado' && (ehSecretaria || !ehSecretaria)">
                  <i class="fas fa-times"></i> Cancelar
                </button>
                <button @click="marcarComoRealizado(consulta._id)" 
                        class="btn-realizado" 
                        v-if="ehSecretaria && consulta.status === 'agendado'">
                  <i class="fas fa-check"></i> Realizado
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="no-consultas">
            <i class="fas fa-calendar-plus"></i>
            <p>{{ ehSecretaria ? 'Nenhum agendamento encontrado' : 'Você não possui consultas agendadas' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

const API_KEY = 'c7ffb5ee9495238440a598f1eff0312a';
const CIDADE = 'Salvador,BR';

const ESPECIALIDADES_FIXAS = [
  'Clínica Geral', 'Cardiologia', 'Dermatologia', 
  'Ortopedia', 'Pediatria', 'Ginecologia', 'Oftalmologia'
];

const MEDICOS_POR_ESPECIALIDADE = {
  'Clínica Geral': ['Dr. Carlos Silva', 'Dra. Ana Paula'],
  'Cardiologia': ['Dr. Roberto Santos', 'Dra. Maria Oliveira'],
  'Dermatologia': ['Dra. Juliana Costa', 'Dr. Paulo Mendes'],
  'Ortopedia': ['Dr. Fernando Lima', 'Dra. Camila Rodrigues'],
  'Pediatria': ['Dra. Patrícia Almeida', 'Dr. Ricardo Souza'],
  'Ginecologia': ['Dra. Beatriz Castro', 'Dra. Vanessa Torres'],
  'Oftalmologia': ['Dr. Marcelo Dias', 'Dra. Larissa Nunes']
};

export default {
  name: "Pacientes",
  data() {
    return {
      usuario: {
        nome: '',
        email: '',
        role: '',
        telefone: '',
        dataNascimento: '',
        endereco: {
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          uf: ''
        }
      },
      pacienteEdit: {},
      mostrarEditarPerfil: false,
      atualizandoPerfil: false,
      previsaoTempo: null,
      carregandoPrevisao: false,
      agendamentoCarregando: false,
      novaConsulta: {
        data: '',
        hora: '',
        especialidade: '',
        medico: ''
      },
      especialidades: ESPECIALIDADES_FIXAS,
      medicos: MEDICOS_POR_ESPECIALIDADE,
      consultas: [],
      todasConsultas: [],
      
      // Filtros para secretaria
      filtroData: '',
      filtroStatus: '',
      
      dataMinima: this.obterDataMinima(),
      dataMaxima: this.obterDataMaxima(),
      mensagemAgendamento: '',
      mensagemErro: false,
      horariosComerciais: [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30'
      ]
    };
  },
  computed: {
    medicosFiltrados() {
      if (!this.novaConsulta.especialidade) return [];
      return this.medicos[this.novaConsulta.especialidade] || [];
    },
    
    formularioValido() {
      return this.novaConsulta.data && 
             this.novaConsulta.hora && 
             this.novaConsulta.especialidade && 
             this.novaConsulta.medico &&
             this.ehDiaUtil;
    },
    
    ehDiaUtil() {
      if (!this.novaConsulta.data) return false;
      const data = new Date(this.novaConsulta.data);
      const diaSemana = data.getDay();
      return diaSemana >= 1 && diaSemana <= 5;
    },
    
    ehSecretaria() {
      return this.usuario.role === 'secretaria';
    },
    
    consultasFiltradas() {
      if (!this.ehSecretaria) return this.consultas;
      
      let consultasFiltradas = [...this.todasConsultas];
      
      // Filtrar por data
      if (this.filtroData) {
        const dataFiltro = new Date(this.filtroData).toISOString().split('T')[0];
        consultasFiltradas = consultasFiltradas.filter(consulta => {
          const dataConsulta = new Date(consulta.data).toISOString().split('T')[0];
          return dataConsulta === dataFiltro;
        });
      }
      
      // Filtrar por status
      if (this.filtroStatus) {
        consultasFiltradas = consultasFiltradas.filter(consulta => 
          consulta.status === this.filtroStatus
        );
      }
      
      return consultasFiltradas;
    }
  },
  async mounted() {
    await this.carregarUsuario();
    await this.carregarConsultas();
  },
  methods: {
    // --- USUÁRIO ---
    async carregarUsuario() {
      try {
        const response = await api.get('/pacientes/me');
        this.usuario = response.data;
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        this.$router.push('/login');
      }
    },

    abrirEdicaoPerfil() {
      this.pacienteEdit = JSON.parse(JSON.stringify(this.usuario));
      this.mostrarEditarPerfil = true;
    },
    
    async atualizarPerfil() {
      this.atualizandoPerfil = true;
      try {
        const response = await api.put('/pacientes/me', this.pacienteEdit);
        this.usuario = response.data;
        this.mostrarEditarPerfil = false;
        this.mostrarMensagem('✅ Perfil atualizado com sucesso!', false);
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        this.mostrarMensagem('❌ Erro ao atualizar perfil. Tente novamente.', true);
      } finally {
        this.atualizandoPerfil = false;
      }
    },
    
    async buscarCEP() {
      if (!this.pacienteEdit.endereco.cep || this.pacienteEdit.endereco.cep.length < 8) return;
      
      try {
        const cepLimpo = this.pacienteEdit.endereco.cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
          const response = await api.get(`/utils/cep/${cepLimpo}`);
          if (response.data.success) {
            const endereco = response.data.data;
            this.pacienteEdit.endereco = {
              ...this.pacienteEdit.endereco,
              logradouro: endereco.logradouro || '',
              bairro: endereco.bairro || '',
              cidade: endereco.cidade || 'Salvador',
              estado: endereco.estado || 'BA',
              uf: endereco.uf || 'BA'
            };
            this.mostrarMensagem('✅ Endereço preenchido automaticamente!', false);
          }
        }
      } catch (error) {
        console.log('CEP não encontrado');
      }
    },
    
    obterDataHoje() {
      return new Date().toISOString().split('T')[0];
    },
    
    // --- AGENDAMENTO ---
    obterDataMinima() {
      const hoje = new Date();
      hoje.setDate(hoje.getDate() + 1);
      return hoje.toISOString().split('T')[0];
    },
    
    obterDataMaxima() {
      const max = new Date();
      max.setMonth(max.getMonth() + 3);
      return max.toISOString().split('T')[0];
    },
    
    onDataChange() {
      this.validarDataSelecionada();
      this.carregarPrevisaoTempo();
    },
    
    validarDataSelecionada() {
      this.mensagemErro = false;
      this.novaConsulta.hora = '';
      
      if (!this.novaConsulta.data) {
        this.mensagemAgendamento = '';
        this.previsaoTempo = null;
        return;
      }
      
      const data = new Date(this.novaConsulta.data);
      const diaSemana = data.getDay();
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (data < hoje) {
        this.mostrarMensagem('❌ Não é possível agendar para datas passadas', true);
      } else if (diaSemana === 0 || diaSemana === 6) {
        this.mostrarMensagem('❌ Atendimento apenas de segunda a sexta-feira', true);
      } else {
        this.mostrarMensagem('✅ Data válida! Selecione o horário', false);
      }
    },
    
    formatarDataExtenso(data) {
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(data).toLocaleDateString('pt-BR', options);
    },
    
    async carregarConsultas() {
      try {
        let endpoint = this.ehSecretaria ? '/agendamentos' : '/agendamentos/meus';
        const response = await api.get(endpoint);
        
        if (this.ehSecretaria) {
          this.todasConsultas = response.data.data || [];
        } else {
          this.consultas = response.data.data || [];
        }
      } catch (error) {
        console.error('Erro ao carregar consultas:', error);
      }
    },

    async agendarConsulta() {
      this.agendamentoCarregando = true;
      
      try {
        const consultaData = {
          emailPaciente: this.usuario.email,
          medico: this.novaConsulta.medico,
          data: this.novaConsulta.data,
          hora: this.novaConsulta.hora,
          especialidade: this.novaConsulta.especialidade
        };

        const response = await api.post('/agendamentos', consultaData);
        
        this.mostrarMensagem('✅ Consulta agendada com sucesso!', false);
        await this.carregarConsultas();
        
        this.novaConsulta = {
          data: '',
          hora: '',
          especialidade: '',
          medico: ''
        };
        
        this.previsaoTempo = null;
        
      } catch (error) {
        console.error('❌ Erro ao agendar consulta:', error);
        
        if (error.response?.status === 409) {
          this.mostrarMensagem('❌ Já existe uma consulta para este médico no horário selecionado', true);
        } else if (error.response?.status === 404) {
          this.mostrarMensagem('❌ Médico não encontrado', true);
        } else {
          this.mostrarMensagem('❌ Erro ao agendar consulta. Tente novamente.', true);
        }
      } finally {
        this.agendamentoCarregando = false;
      }
    },

    async cancelarConsulta(id) {
      if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;
      
      try {
        await api.delete(`/agendamentos/${id}`);
        await this.carregarConsultas();
        this.mostrarMensagem('✅ Consulta cancelada com sucesso!', false);
      } catch (error) {
        console.error('Erro ao cancelar consulta:', error);
        this.mostrarMensagem('❌ Erro ao cancelar consulta', true);
      }
    },

    async marcarComoRealizado(id) {
      try {
        await api.put(`/agendamentos/${id}`, { status: 'realizado' });
        await this.carregarConsultas();
        this.mostrarMensagem('✅ Consulta marcada como realizada!', false);
      } catch (error) {
        console.error('Erro ao marcar como realizado:', error);
        this.mostrarMensagem('❌ Erro ao atualizar consulta', true);
      }
    },

    aplicarFiltros() {
      // Os filtros são aplicados automaticamente pela computed property
    },

    limparFiltros() {
      this.filtroData = '';
      this.filtroStatus = '';
    },

    // --- PREVISÃO DO TEMPO ---
    async carregarPrevisaoTempo() {
      if (!this.novaConsulta.data) {
        this.previsaoTempo = null;
        return;
      }
      
      this.carregandoPrevisao = true;
      
      try {
        const dataSelecionada = new Date(this.novaConsulta.data);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        if (dataSelecionada < hoje) {
          this.previsaoTempo = null;
          return;
        }
        
        const diffTime = dataSelecionada - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 5) {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${CIDADE}&appid=${API_KEY}&units=metric&lang=pt_br`
          );
          const dados = await response.json();
          
          const previsaoEncontrada = dados.list.find(item => {
            const dataPrevisao = new Date(item.dt * 1000);
            return dataPrevisao.toDateString() === dataSelecionada.toDateString();
          });
          
          this.previsaoTempo = previsaoEncontrada || this.gerarPrevisaoSimulada(dataSelecionada);
        } else {
          this.previsaoTempo = this.gerarPrevisaoSimulada(dataSelecionada);
        }
        
      } catch (error) {
        console.error('Erro ao carregar previsão:', error);
        this.previsaoTempo = this.gerarPrevisaoSimulada(new Date(this.novaConsulta.data));
      } finally {
        this.carregandoPrevisao = false;
      }
    },
    
    gerarPrevisaoSimulada(data) {
      const mes = data.getMonth();
      const tempBase = mes >= 9 || mes <= 2 ? 28 + Math.floor(Math.random() * 5) : 25 + Math.floor(Math.random() * 4);
      
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
          temp_max: tempBase + 3,
          temp_min: tempBase - 2,
          humidity: 60 + Math.floor(Math.random() * 30),
          feels_like: tempBase + 1
        },
        wind: { speed: 5 + Math.floor(Math.random() * 10) }
      };
    },
    
    mostrarMensagem(mensagem, erro) {
      this.mensagemAgendamento = mensagem;
      this.mensagemErro = erro;
      setTimeout(() => { this.mensagemAgendamento = ''; }, 4000);
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
    
    formatarStatus(status) {
      const statusMap = {
        'agendado': 'Agendado',
        'cancelado': 'Cancelado',
        'realizado': 'Realizado'
      };
      return statusMap[status] || status;
    },
    
    sair() {
      localStorage.removeItem('token');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* ESTILOS EXISTENTES MANTIDOS - apenas adições */
.home-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
.welcome-section { text-align: center; margin-bottom: 3rem; }
.welcome-section h2 { color: #4b6cb7; font-size: 2.2rem; margin-bottom: 1rem; }
.welcome-section p { color: #6c757d; font-size: 1.1rem; margin-bottom: 1rem; }
.welcome-buttons { display: flex; gap: 1rem; justify-content: center; }

.btn-editar-perfil {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-editar-perfil:hover {
  background: #218838;
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

.right-panel.full-width {
  flex: 2;
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

.input-group small {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.erro-texto {
  color: #ff6b6b !important;
  font-weight: 600;
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

.btn-login:hover:not(:disabled) {
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

.mensagem-status {
  padding: 12px;
  border-radius: 8px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.mensagem-status.sucesso {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid #28a745;
}

.mensagem-status.erro {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid #dc3545;
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

.status-agendado {
  color: #28a745;
}

.status-cancelado {
  color: #dc3545;
}

.status-realizado {
  color: #17a2b8;
}

.consulta-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-cancelar {
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
  background: #dc3545;
  color: white;
}

.btn-cancelar:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-realizado {
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
  background: #28a745;
  color: white;
}

.btn-realizado:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Modal de Edição de Perfil */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  color: white;
  margin: 0;
}

.btn-fechar {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-section h4 {
  color: white;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 0.5rem;
}

.cep-container {
  display: flex;
  gap: 0.5rem;
}

.btn-cep {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  padding: 0 1rem;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-salvar {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-salvar:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-cancelar {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.weather-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
}

.weather-placeholder, .no-consultas {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.weather-placeholder i, .no-consultas i {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
}

.weather-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.9rem;
}

.weather-date {
  font-size: 1.1rem !important;
  margin-bottom: 0.5rem !important;
}

.weather-desc {
  margin-bottom: 1rem !important;
}

.filtros-secretaria {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.btn-limpar-filtros {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.btn-limpar-filtros:hover {
  background: #5a6268;
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
  
  .welcome-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .cep-container {
    flex-direction: column;
  }
}
</style>