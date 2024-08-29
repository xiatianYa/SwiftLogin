import { defineStore } from "pinia";
import { stringToBoolean } from "@/utils/common";
import gameSocket from "@/utils/gameSocket";
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
      nightCycle: stringToBoolean(localStorage.getItem("nightCycle")),
    };
  },
  actions: {
    //初始化socket
    initSocket() {
      gameSocket.init();
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
