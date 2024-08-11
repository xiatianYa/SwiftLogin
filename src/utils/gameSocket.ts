let wsUrl = "ws://www.bluearchive.top:8080/websocket/gameServer";
import gameEnum from "./gameEnum";
import useStore from "@/store";
import { createDiscreteApi } from "naive-ui";
const Websocket: any = {
  websocket: null,
  //连接地址
  connectURL: wsUrl,
  // 是否自动重连
  is_reonnect: true,
  // 重连次数
  reconnect_count: 10,
  // 已发起重连次数
  reconnect_current: 1,
  // 重连timer
  reconnect_timer: null,
  // 重连频率
  reconnect_interval: 5000,
  //消息提示
  notification: null,
  // 建立websocket连接
  init: () => {
    //全局仓库
    let { globalStore } = useStore();
    //初始化消息对象
    const { notification } = createDiscreteApi(["notification"]);
    Websocket.notification = notification;
    //浏览器适配
    if (!("WebSocket" in window)) {
      Websocket.notification["error"]({
        content: "适配警告",
        meta: "浏览器不支持WebSocket",
        duration: 2500,
        keepAliveOnHover: true,
      });
      return;
    }
    //建立websocket连接
    Websocket.websocket = new WebSocket(wsUrl);
    // 监听服务器返回的数据
    Websocket.websocket.onmessage = (e: any) => {
      //处理服务器传递过来的参数
      let data: any = JSON.parse(e.data);
      //处理消息
      switch (data.type) {
        case gameEnum.LoginSuccessType:
          //清理定时器任务
          clearInterval(Websocket.reconnect_timer);
          //初始化参数
          Websocket.reconnect_current = 1;
          Websocket.reconnect_timer = null;
          Websocket.notification["success"]({
            content: "连接成功",
            meta: "服务器连接成功",
            duration: 1500,
            keepAliveOnHover: true,
          });
          break;
        case gameEnum.ServerMessageSuccessType:
          let serverInfo = JSON.parse(data.data);
          //如果返回状态为 true 或 全局isAutomatic 为 false
          if (!serverInfo.status || !globalStore.isAutomatic) return;
          globalStore.isAutomatic = false;
          //发送消息
          Websocket.notification["success"]({
            content: "挤服成功",
            duration: 3000,
            keepAliveOnHover: true,
          });
          const aLink = document.createElement("a");
          aLink.href =
            "steam://rungame/730/76561198977557298/+connect " +
            serverInfo.ip +
            ":" +
            serverInfo.port;
          aLink.click();
          break;
        default:
          break;
      }
    };
    //连接断开时触发
    Websocket.websocket.onclose = (e: any) => {
      // 需要重新连接
      if (Websocket.is_reonnect && !Websocket.reconnect_timer) {
        Websocket.reconnect_timer = setInterval(async () => {
          //如果重连次数超出,则清除定时器任务
          if (Websocket.reconnect_current >= Websocket.reconnect_count) {
            Websocket.notification["warning"]({
              content: "连接错误",
              meta: "聊天室连接失败",
              keepAliveOnHover: true,
            });
            clearInterval(Websocket.reconnect_timer);
            return;
          }
          // 记录重连次数
          Websocket.reconnect_current++;
          // 创建连接
          Websocket.reconnect(true);
        }, Websocket.reconnect_interval);
      }
    };
    //连接发生错误
    Websocket.websocket.onerror = function () {};
    //连接成功
    Websocket.websocket.onopen = function () {};
  },
  // 发送数据 全体消息
  sendMessage: (data: any) => {
    Websocket.websocket.send(JSON.stringify(data));
  },
  // 断开连接
  close: (isReonnect: boolean) => {
    //如果传递是false 则不重新连接
    if (!isReonnect) {
      //清空定时任务
      clearInterval(Websocket.reconnect_timer);
      //不再重新连接
      Websocket.is_reonnect = isReonnect;
      //断开连接
      Websocket.websocket.close();
      //重置webSocket
      Websocket.websocket = null;
      return;
    }
    //清空本地
    Websocket.websocket = null;
  },
  //重新连接
  reconnect: () => {
    if (Websocket.websocket) {
      Websocket.close();
    }
    Websocket.init();
  },
};
export default Websocket;
