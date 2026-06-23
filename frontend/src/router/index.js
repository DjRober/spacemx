import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../composables/useAuth.js";

import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/DashboardView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/dashboard", component: DashboardView },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.path === "/dashboard" && to.hash === "#reportes" && !auth.isLoggedIn.value) {
    return "/login";
  }
});

export default router;