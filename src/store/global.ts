import { defineStore } from "pinia";
import gameSocket from "@/utils/gameSocket";
export interface Global {
  //是否在自动挤服
  isAutomatic: boolean;
}
export const useGloBalStore = defineStore("global", {
  // 真正存储数据的地方
  state: (): Global => {
    return {
      //是否在自动挤服
      isAutomatic: false,
    };
  },
  actions: {
    //初始化socket
    initSocket() {
      gameSocket.init();
    },
  },
});
