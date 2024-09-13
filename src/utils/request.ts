import axios from "axios";
import { getToken } from "@/utils/auth";
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
  baseURL: "/api",
  // 超时
  timeout: 20000,
  //重试次数
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    // 查看token是否存在
    if (getToken()) {
      config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
