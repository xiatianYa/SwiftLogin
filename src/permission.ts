import router from "./router";
import { getToken } from "@/utils/auth";
import useStore from "@/store";
import chatSocket from "@/utils/chatSocket";

router.beforeEach((to, from, next) => {
  let { userStore, globalStore } = useStore();
  //没有token
  if (!getToken()) {
    //判断用户当前路由 如果需要校权 则返回登录页
  } else {
    //如果websocket为连接 则连接
    if (!chatSocket.websocket) {
      globalStore.initChatSocket();
    }
    //没有用户信息
    if (!userStore.id) {
      //获取用户信息 重新加载
      userStore.setUserInfo();
    }
  }
  next();
});
//路由跳转后
router.afterEach((next) => {});
