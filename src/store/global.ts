import { defineStore } from "pinia";
import { stringToBoolean } from "@/utils/common";
import gameSocket from "@/utils/gameSocket";
export interface Global {
  //是否在自动挤服
  isAutomatic: boolean;
  //白天 黑夜模式
  nightCycle: boolean;
}
export const useGloBalStore = defineStore("global", {
  // 真正存储数据的地方
  state: (): Global => {
    return {
      //是否在自动挤服
      isAutomatic: false,
      nightCycle: stringToBoolean(localStorage.getItem("nightCycle")),
    };
  },
  actions: {
    //初始化socket
    initSocket() {
      gameSocket.init();
    },
  },
});
