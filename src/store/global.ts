import { defineStore } from "pinia";
import { stringToBoolean } from "@/utils/common";
import gameSocket from "@/utils/gameSocket";
import chatSocket from "@/utils/chatSocket";
//用户对象
interface userVoType {
  userId: number;
  userAvatar: string;
  userNickName: string;
}
export interface Global {
  //是否在自动挤服
  isAutomatic: boolean;
  //是否在自动挂机
  isAutoHook: boolean;
  //是否在地图订阅
  isAutoMap: boolean;
  //挤服信息
  automaticInfo: any;
  //地图订阅信息
  autoMapInfo: any;
  //挤服次数
  automaticCount: number;
  //挂机次数
  onHookNumber: number;
  //白天 黑夜模式
  nightCycle: boolean;
  //服务器推送ws数据
  serverInfo: any;
  //接收到的消息列表
  chatHistory: Array<any>;
  //在线用户列表
  onlineUserList: Array<userVoType>;
}
export const useGloBalStore = defineStore("global", {
  // 真正存储数据的地方
  state: (): Global => {
    return {
      //是否在自动挤服
      isAutomatic: false,
      isAutoHook: false,
      isAutoMap: false,
      automaticInfo: null,
      autoMapInfo: null,
      automaticCount: 0,
      onHookNumber: 0,
      serverInfo: null,
      nightCycle: stringToBoolean(localStorage.getItem("nightCycle")),
      chatHistory: [],
      onlineUserList: [],
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
    initGlobal() {
      this.isAutomatic = false;
      this.isAutoHook = false;
      this.isAutoMap = false;
      this.automaticInfo = null;
      this.autoMapInfo = null;
      this.automaticCount = 0;
      this.onHookNumber = 0;
    },
  },
});
