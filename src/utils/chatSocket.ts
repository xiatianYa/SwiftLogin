let wsUrl = "wss://bluearchive.top/websocket/server/";
import useStore from "@/store";
import chatEnum from "@/utils/chatEnum";
import { createDiscreteApi } from "naive-ui";
import { getUserList } from "@/api/chat";
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
    let { globalStore, userStore } = useStore();
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
    if (!userStore.token) {
      Websocket.notification["error"]({
        content: "认证失败",
        meta: "Token不存在",
        duration: 1500,
        keepAliveOnHover: true,
      });
      return;
    }
    //建立websocket连接
    Websocket.websocket = new WebSocket(wsUrl + userStore.token);
    // 监听服务器返回的数据
    Websocket.websocket.onmessage = (e: any) => {
      //处理服务器传递过来的参数
      let data: any = JSON.parse(e.data);
      //处理消息
      switch (data.type) {
        //全局群聊消息
        case chatEnum.ChatGroupType:
          globalStore.chatHistory.push(data);
          if (!globalStore.isMessageRead) globalStore.unreadMessageCount++;
          break;
        //在线|离线消息
        case chatEnum.OffLineType:
        case chatEnum.OnLineType:
          //重新获取用户列表
          getUserList().then((res) => {
            globalStore.onlineUserList = res.data.map((item: any) => {
              let { userId, userAvatar, userNickName } = item;
              return {
                id: userId,
                name: userNickName,
                src: userAvatar,
              };
            });
          });
          break;
        case chatEnum.LoginSuccessType:
          //清理定时器任务
          clearInterval(Websocket.reconnect_timer);
          //初始化参数
          Websocket.reconnect_current = 1;
          Websocket.reconnect_timer = null;
          Websocket.notification["success"]({
            content: "连接成功",
            meta: "聊天服务连接成功",
            duration: 1500,
            keepAliveOnHover: true,
          });
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
  sendMsgAll: (data: any) => {
    Websocket.websocket.send(data);
  },
  //处理断开连接操作
  onClose: () => {
    //当前定时任务为null时 && websocket为null时 自动重连
    if (!Websocket.reconnectTimer) {
      //触发重连机制
      Websocket.reconnectTimer = setInterval(() => {
        Websocket.notification["error"]({
          content: "服务断连",
          meta: "聊天服务断连,自动连接中...",
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
