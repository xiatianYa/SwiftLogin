import request from "@/utils/request";

// 查询地图列表
export function listLive(query?: any) {
  return request({
    url: "/blog/live/list",
    method: "get",
    params: query
  });
}
