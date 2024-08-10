import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/view/layout/index.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Layout,
      redirect: "/main",
      children: [
        {
          path: "/main",
          name: "main",
          component: () => import("@/view/main/index.vue"),
        },
        {
          path: "/servers",
          name: "servers",
          redirect: "/servers/cs2",
          component: () => import("@/view/servers/index.vue"),
          children: [
            {
              path: "cs2",
              name: "cs2",
              component: () => import("@/view/servers/csgo2/index.vue"),
            },
            {
              path: "projectZomboid",
              name: "projectZomboid",
              component: () =>
                import("@/view/servers/projectZomboid/index.vue"),
            },
            {
              path: "7daysToDie",
              name: "7daysToDie",
              component: () => import("@/view/servers/7daysToDie/index.vue"),
            },
          ],
        },
        {
          path: "/tool",
          name: "tool",
          component: () => import("@/view/tool/index.vue"),
        },
        {
          path: "/map",
          name: "map",
          component: () => import("@/view/map/index.vue"),
        },
        {
          path: "/live",
          name: "live",
          component: () => import("@/view/live/index.vue"),
        },
        {
          path: "/chat",
          name: "chat",
          component: () => import("@/view/chat/index.vue"),
        },
      ],
    },
  ],
});

export default router;
