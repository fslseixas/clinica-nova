<template>
  <div id="app">
    <header class="header-blue">
      <div class="header-container">
        <h1><i class="fas fa-hospital"></i> Clínica Nova</h1>
        <nav>
          <router-link to="/">Início</router-link>
          <router-link to="/secretaria">Secretaria</router-link>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>© 2025 Clínica Nova - Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
.header-blue {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-blue h1 {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 600;
}

.header-blue nav {
  display: flex;
  gap: 1.5rem;
}

.header-blue nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.header-blue nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.header-blue nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 200px);
}

.footer {
  padding: 1.5rem;
  background: #f8f9fa;
  color: #6c757d;
  font-size: 0.9rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .header-blue h1 {
    font-size: 1.8rem;
  }
  
  .header-blue nav {
    gap: 1rem;
  }
}
</style>