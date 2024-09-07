import request from "@/utils/request";

// 登录方法
export function statisticsEchats() {
  return request({
    url: "/blog/statistics/listAll",
    method: "get",
  });
}
