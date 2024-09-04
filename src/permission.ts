import router from "./router";
import { getToken } from "@/utils/auth";
import useStore from "@/store";

router.beforeEach((to, from, next) => {
  let { userStore } = useStore();
  //没有token
  if (!getToken()) {
    //判断用户当前路由 如果需要校权 则返回登录页
  } else {
    //没有用户信息
    console.log(userStore.id);
    if (!userStore.id) {
      //获取用户信息 重新加载
      userStore.setUserInfo();      
    }
  }
  next();
});
//路由跳转后
router.afterEach((next) => {});
