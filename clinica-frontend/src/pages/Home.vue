<template>
  <div class="home-container">
    <div class="welcome-section">
      <h2>Bem-vindo à Clínica Nova</h2>
      <p>Faça seu cadastro ou login para agendar suas consultas de forma rápida e segura.</p>
    </div>

    <div class="content-container">
      <div class="left-panel">
        <!-- Seção de Login do Paciente -->
        <div class="login-section">
          <h3><i class="fas fa-sign-in-alt"></i> Login do Paciente</h3>
          <form @submit.prevent="login">
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input type="email" v-model="loginEmail" placeholder="E-mail" required />
            </div>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input type="password" v-model="loginSenha" placeholder="Senha" required />
            </div>
            <div class="forgot-password">
              <a href="#" @click.prevent="esqueciSenha">Esqueceu a senha?</a>
            </div>
            <button type="submit" class="btn-login">Entrar</button>
          </form>
        </div>
      </div>

      <div class="right-panel">
        <!-- Seção de Cadastro -->
        <div class="login-section">
          <h3><i class="fas fa-user-plus"></i> Cadastro de Paciente</h3>
          <form @submit.prevent="registerPatient">
            <!-- Campos principais -->
            <div class="input-group">
              <i class="fas fa-user"></i>
              <input type="text" v-model="nome" placeholder="Nome Completo" required />
            </div>
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input type="email" v-model="email" placeholder="E-mail" required />
            </div>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input type="password" v-model="senha" placeholder="Senha" required />
            </div>

            <!-- Campos adicionais -->
            <div class="input-group">
              <i class="fas fa-phone"></i>
              <input type="tel" v-model="telefone" placeholder="Telefone" />
            </div>

            <div class="input-group">
              <i class="fas fa-map-marker-alt"></i>
              <input 
                type="text" 
                v-model="cep" 
                placeholder="CEP"
                @blur="buscarCEP"
                maxlength="9"
              />
            </div>

            <div class="input-group">
              <i class="fas fa-road"></i>
              <input type="text" v-model="logradouro" placeholder="Logradouro" />
            </div>

            <div class="form-row">
              <div class="input-group">
                <i class="fas fa-hashtag"></i>
                <input type="text" v-model="numero" placeholder="Número" />
              </div>
              <div class="input-group">
                <i class="fas fa-building"></i>
                <input type="text" v-model="complemento" placeholder="Complemento" />
              </div>
            </div>

            <div class="form-row">
              <div class="input-group">
                <i class="fas fa-map"></i>
                <input type="text" v-model="bairro" placeholder="Bairro" />
              </div>
              <div class="input-group">
                <i class="fas fa-city"></i>
                <input type="text" v-model="cidade" placeholder="Cidade" />
              </div>
            </div>

            <div class="form-row">
              <div class="input-group">
                <i class="fas fa-flag"></i>
                <input type="text" v-model="estado" placeholder="Estado" maxlength="2" />
              </div>
              <div class="input-group">
                <i class="fas fa-globe"></i>
                <input type="text" v-model="uf" placeholder="UF" maxlength="2" />
              </div>
            </div>

            <div class="input-group">
              <i class="fas fa-calendar"></i>
              <input 
                type="date" 
                v-model="dataNascimento" 
                placeholder="Data de Nascimento"
              />
            </div>

            <button type="submit" class="btn-login">Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: 'Home',
  data() {
    return {
      nome: '',
      email: '',
      senha: '',
      telefone: '',
      loginEmail: '',
      loginSenha: '',
      
      // Campos de endereço
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      uf: '',
      dataNascimento: ''
    }
  },
  methods: {
    async registerPatient() {
      try {
        const pacienteData = {
          nome: this.nome,
          email: this.email,
          senha: this.senha,
          telefone: this.telefone,
          dataNascimento: this.dataNascimento,
          endereco: {
            cep: this.cep,
            logradouro: this.logradouro,
            numero: this.numero,
            complemento: this.complemento,
            bairro: this.bairro,
            cidade: this.cidade,
            estado: this.estado,
            uf: this.uf
          }
        };

        const response = await api.post("/pacientes/cadastro", pacienteData);
        
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("pacienteLogado", JSON.stringify(response.data.paciente));
          alert('Paciente cadastrado com sucesso!');
          this.$router.push('/pacientes');
          
          // Limpar formulário
          this.nome = '';
          this.email = '';
          this.senha = '';
          this.telefone = '';
          this.cep = '';
          this.logradouro = '';
          this.numero = '';
          this.complemento = '';
          this.bairro = '';
          this.cidade = '';
          this.estado = '';
          this.uf = '';
          this.dataNascimento = '';
        }
        
      } catch (error) {
        alert('Erro ao cadastrar paciente!');
        console.error(error);
      }
    },

    async buscarCEP() {
      if (this.cep.length >= 8) {
        try {
          const cepLimpo = this.cep.replace(/\D/g, '');
          if (cepLimpo.length === 8) {
            const response = await api.get(`/utils/cep/${cepLimpo}`);
            if (response.data.success) {
              const endereco = response.data.data;
              this.logradouro = endereco.logradouro || '';
              this.bairro = endereco.bairro || '';
              this.cidade = endereco.cidade || '';
              this.estado = endereco.estado || '';
              this.uf = endereco.uf || '';
            }
          }
        } catch (error) {
          console.log('CEP não encontrado ou inválido');
        }
      }
    },

    async login() {
      try {
        console.log('📤 Tentando fazer login...');
        console.log('🔍 Email:', this.loginEmail);
        console.log('🔍 Senha:', this.loginSenha);
        
        // ✅ CORRETO - Faz request para o backend real
        const response = await api.post('/pacientes/login', {
          email: this.loginEmail.trim(),
          senha: this.loginSenha.trim()
        });
        
        console.log('✅ Login bem-sucedido:', response.data);
        
        // Salva o token e dados do paciente
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('pacienteLogado', JSON.stringify(response.data.paciente));
        localStorage.setItem('user_email', response.data.paciente.email);
        
        alert('Login realizado com sucesso!');
        this.$router.push('/pacientes');
        
      } catch (error) {
        console.error('❌ Erro no login:', error);
        console.log('📊 Status:', error.response?.status);
        console.log('📋 Dados:', error.response?.data);
        
        if (error.response?.status === 401) {
          alert('Email ou senha incorretos!');
        } else if (error.response?.status === 500) {
          alert('Erro no servidor. Tente novamente.');
        } else {
          alert('Erro ao fazer login. Verifique o console.');
        }
      }
    },
    
    esqueciSenha() {
      const email = prompt('Digite seu e-mail para recuperar a senha:');
      if (email) {
        alert(`Instruções de recuperação de senha enviadas para: ${email}`);
      }
    }
  }
}
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
}

.welcome-section h2 {
  color: #4b6cb7;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.welcome-section p {
  color: #6c757d;
  font-size: 1.1rem;
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

.input-group {
  position: relative;
  margin-bottom: 1.2rem;
}

.input-group i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 1;
}

.input-group input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  box-sizing: border-box;
  height: 48px;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.input-group input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.2);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .input-group {
  flex: 1;
}

.forgot-password {
  text-align: right;
  margin-bottom: 1rem;
}

.forgot-password a {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.btn-login {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  color: #4b6cb7;
  height: 48px;
  transition: all 0.3s;
}

.btn-login:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
}
</style>