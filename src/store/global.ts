import { defineStore } from "pinia";
import { stringToBoolean, stringToObject } from "@/utils/common";
import gameSocket from "@/utils/gameSocket";
import chatSocket from "@/utils/chatSocket";
//用户对象
interface userVoType {
  id: number;
  src: string;
  name: string;
}
export interface Global {
  //是否在自动挤服
  isAutomatic: boolean;
  //是否在地图订阅
  isAutoMap: boolean;
  //挤服信息
  automaticInfo: any;
  //地图订阅信息
  autoMapListInfo: any;
  //挤服次数
  automaticCount: number;
  //未读消息数
  unreadMessageCount: number;
  //是否在阅读消息
  isMessageRead: boolean;
  //白天 黑夜模式
  nightCycle: boolean;
  //服务器推送ws数据
  serverInfo: any;
  //接收到的消息列表
  chatHistory: Array<any>;
  //在线用户列表
  onlineUserList: Array<userVoType>;
  //已接收到地图订阅的服务器消息
  autoMapReceiveList: Array<any>;
}
export const useGloBalStore = defineStore("global", {
  // 真正存储数据的地方
  state: (): Global => {
    return {
      isAutomatic: false,
      isAutoMap: false,
      automaticInfo: null,
      autoMapListInfo: JSON.parse(
        stringToObject(localStorage.getItem("autoMap"))
      ),
      automaticCount: 0,
      unreadMessageCount: 0,
      isMessageRead: false,
      serverInfo: null,
      nightCycle: stringToBoolean(localStorage.getItem("nightCycle")),
      chatHistory: [],
      onlineUserList: [],
      autoMapReceiveList: [],
    };
  },
  actions: {
    //初始化gameSocket
    initGameSocket() {
      gameSocket.init();
    },
    //初始化chatSocket
    initChatSocket() {
      chatSocket.init();
    },
    //关闭chatSocket
    clostChatSocket() {
      chatSocket.close();
    },
    //清空全局
    initGlobal() {
      this.isAutomatic = false;
      this.automaticInfo = null;
      this.automaticCount = 0;
    },
    //发送聊天消息
    sendMessage(data: any) {
      chatSocket.sendMsgAll(data);
    },
  },
});
