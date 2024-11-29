import { createRouter, createWebHistory } from "vue-router";

// สร้างหน้าต่างๆ ที่จะใช้ใน router
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Callback from "../views/Callback.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/callback",
    name: "callback",
    component: Callback,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
