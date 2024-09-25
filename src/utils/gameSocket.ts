let wsUrl = "wss://bluearchive.top/websocket/gameServer";
import gameEnum from "./gameEnum";
import useStore from "@/store";
import { createDiscreteApi } from "naive-ui";
const Websocket: any = {
  websocket: null,
  //连接地址
  connectURL: wsUrl,
  // 重连timer
  reconnectTimer: null,
  // 重连频率
  reconnectInterval: 8000,
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
        duration: 1500,
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
            content: "连接服务器成功",
            meta: "推荐使用Microsoft Edge浏览器进行操作。",
            duration: 1500,
            keepAliveOnHover: true,
          });
          break;
        case gameEnum.ServerMessageSuccessType:
          let serverInfo = JSON.parse(data.data);
          //重新设置全局挤服对象人数信息
          globalStore.automaticInfo.players = serverInfo.players;
          globalStore.automaticInfo.maxPlayers = serverInfo.maxPlayers;
          //全局isAutomatic 为 false
          if (!globalStore.isAutomatic) return;
          //如果返回状态为 true 则继续挤服
          if (!serverInfo.status) {
            globalStore.automaticCount++;
            Websocket.sendMessage(globalStore.automaticInfo);
            return;
          }
          //清空数据
          globalStore.isAutomatic = false;
          globalStore.automaticCount = 0;
          const aLink = document.createElement("a");
          aLink.href =
            "steam://rungame/730/76561198977557298/+connect " +
            serverInfo.ip +
            ":" +
            serverInfo.port;
          aLink.click();
          //发送消息
          Websocket.notification["success"]({
            content: "连接成功",
            meta: "游戏服务连接成功",
            duration: 1500,
            keepAliveOnHover: true,
          });
        case gameEnum.MessageFailType:
          //避免消息失败导致挤服生效
          Websocket.sendMessage(globalStore.automaticInfo);
          break;
        case gameEnum.ServerPushServerDataType:
          globalStore.serverInfo = new Map(
            Object.entries(JSON.parse(data.data))
          );
          break;
        default:
          break;
      }
    };
    //连接断开时触发
    Websocket.websocket.onclose = (e: any) => {
      Websocket.onClose();
    };
    //连接成功
    Websocket.websocket.onopen = function () {
      //连接成功 清空定时任务
      clearTimeout(Websocket.reconnectTimer);
      Websocket.reconnectTimer = null;
    };
  },
  // 发送数据 全体消息
  sendMessage: (data: any) => {
    Websocket.websocket.send(JSON.stringify(data));
  },
  //处理断开连接操作
  onClose: () => {
    //当前定时任务为null时 && websocket为null时 自动重连
    if (!Websocket.reconnectTimer) {
      //触发重连机制
      Websocket.reconnectTimer = setInterval(() => {
        Websocket.notification["error"]({
          content: "服务断连",
          meta: "游戏服务断连,自动连接中...",
          duration: 1000,
          keepAliveOnHover: true,
        });
        // 创建连接
        Websocket.reconnect(true);
      }, Websocket.reconnectInterval);
    }
  },
  //重新连接
  reconnect: () => {
    Websocket.init();
  },
};
export default Websocket;
