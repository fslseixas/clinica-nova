<template>
  <div class="home-container">
    <div class="welcome-section">
      <h2>Área da Secretaria</h2>
      <p>Acesso restrito às secretárias</p>
    </div>

    <div class="content-container">
      <div class="left-panel">
        <!-- Seção de Login da Secretaria -->
        <div class="login-section">
          <h3><i class="fas fa-lock"></i> Login da Secretaria</h3>
          <form @submit.prevent="login">
            <div class="input-group">
              <i class="fas fa-id-card"></i>
              <input type="text" v-model="matricula" placeholder="Matrícula" required />
            </div>
            <div class="input-group">
              <i class="fas fa-key"></i>
              <input type="password" v-model="senha" placeholder="Senha" required />
            </div>
            
            <div class="buttons-group">
              <button type="submit" class="btn-login">Entrar</button>
              <button type="button" class="btn-voltar" @click="voltar">Voltar</button>
            </div>
          </form>
        </div>
      </div>

      <div class="right-panel">
        <h3><i class="fas fa-info-circle"></i> Informações</h3>
        <div class="info-content">
          <p>Use suas credenciais de secretária para acessar o sistema de agendamentos.</p>
          <div class="credentials-example">
            <p><strong>Exemplo de acesso:</strong></p>
            <p>Matrícula: 12345</p>
            <p>Senha: senha123</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Secretaria',
  data() {
    return {
      matricula: '',
      senha: ''
    }
  },
  methods: {
    login() {
      const secretarias = [
        { id: 1, matricula: '12345', senha: 'senha123', nome: 'Ana Silva' },
        { id: 2, matricula: '67890', senha: 'senha456', nome: 'Carlos Oliveira' }
      ];
      
      const secretaria = secretarias.find(s => s.matricula === this.matricula && s.senha === this.senha);
      
      if (secretaria) {
        localStorage.setItem('secretariaLogada', JSON.stringify(secretaria));
        this.$router.push('/area-secretaria');
      } else {
        alert('Matrícula ou senha incorretas!');
      }
    },
    
    voltar() {
      this.$router.push('/');
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
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.left-panel {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
}

.left-panel h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
}

.right-panel h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  color: #2c3e50;
}

.login-section {
  padding: 1.5rem;
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

.buttons-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-login, .btn-voltar {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  height: 48px;
}

.btn-login {
  background: rgba(255, 255, 255, 0.9);
  color: #4b6cb7;
}

.btn-voltar {
  background: #6c757d;
  color: white;
}

.btn-login:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-voltar:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.info-content {
  padding: 1rem;
  text-align: center;
}

.info-content p {
  margin-bottom: 1rem;
  color: #555;
}

.credentials-example {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.credentials-example p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
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
  
  .buttons-group {
    flex-direction: column;
  }
  
  .btn-login, .btn-voltar {
    width: 100%;
  }
}
</style>