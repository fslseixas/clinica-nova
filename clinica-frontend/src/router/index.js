import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Secretaria from "../pages/Secretaria.vue";
import AreaSecretaria from "../pages/Area.Secretaria.vue"; // Importação adicionada
import Pacientes from "../pages/Pacientes.vue";
import Agendamentos from "../pages/Agendamentos.vue";
import MeusAgendamentos from "../pages/MeusAgendamentos.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/secretaria", name: "Secretaria", component: Secretaria },
  { path: "/area-secretaria", name: "AreaSecretaria", component: AreaSecretaria }, // Rota adicionada
  { path: "/pacientes", name: "Pacientes", component: Pacientes },
  { path: "/agendamentos", name: "Agendamentos", component: Agendamentos },
  { path: "/meus-agendamentos", name: "MeusAgendamentos", component: MeusAgendamentos },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;