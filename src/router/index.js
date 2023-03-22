import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import EditView from "../views/EditView.vue";
import CreateView from "../views/CreateView.vue";
import { useTargetStore } from '@/stores/target'
import TargetConfig from "../components/home/TargetConfig.vue";
import ObjectList from "../components/home/ObjectList.vue";
import ObjectEdit from "../components/edit/ObjectEdit.vue";
import ObjectCreate from "../components/edit/ObjectCreate.vue";

const router = createRouter({
  // We do not deploy gui in a server, so hash based history is enough.
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      // Add object as children here.
      children: [
        { path: "", component: TargetConfig }, // default tab that config target machine,
        { path: "/objects/:type", component: ObjectList },
      ],
    },
    {
      path: "/edit",
      name: "edit",
      component: EditView,
      // Add object as children here.
      children: [
        { path: "/edit/:type/:id", component: ObjectEdit },
      ],
    },
    {
      path: "/create",
      name: "create",
      component: CreateView,
      // Add object as children here.
      children: [
        { path: "/create/:type", component: ObjectCreate },
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
