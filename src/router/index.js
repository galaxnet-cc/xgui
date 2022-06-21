import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useTargetStore } from '@/stores/target'
import TargetConfig from "../components/TargetConfig.vue";
import PhysicalInterface from "../components/PhysicalInterface.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      // Add object as children here.
      children: [
        { path: "", component: TargetConfig }, // default tab that config target machine,
        { path: "/phyif", component: PhysicalInterface },
      ],
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useTargetStore()
})

export default router;
