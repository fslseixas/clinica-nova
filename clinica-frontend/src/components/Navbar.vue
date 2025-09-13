<template>
  <nav class="navbar">
    <div class="logo">Clinica Nova M</div>
    <ul class="nav-links">
      <li><router-link to="/">Login</router-link></li>
      <li><router-link to="/register">Cadastro</router-link></li>
      <li><router-link to="/painel">Painel</router-link></li>
      <li><router-link to="/pacientes">Pacientes</router-link></li>
      <li><router-link to="/secretaria">Secretaria</router-link></li>
      <li><router-link to="/agendamentos">Agendamentos</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1976d2;
  padding: 15px 30px;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.nav-links a:hover {
  text-decoration: underline;
}
</style>
