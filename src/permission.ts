import router from "./router";

router.beforeEach((to, from, next) => {
  next();
});
//路由跳转后
router.afterEach((next) => {});
