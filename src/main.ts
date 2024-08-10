import { createApp } from "vue";

//Pinia
import { createPinia } from "pinia";
//路由
import router from "./router";
// 路由拦截器
import "./permission";

// 引入重置样式
import "@/styles/reset.scss";
// 引入基础样式
import "@/styles/index.scss";
// 引入全局样式
import "@/styles/global.scss";
import App from "./App.vue";

//创建App实际
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");