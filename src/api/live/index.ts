import request from "@/utils/request";

// 查询直播列表
export function listLive(query?: any) {
  return request({
    url: "/blog/live/list",
    method: "get",
    params: query,
  });
}

//新增主播
export function addLive(query: any) {
  return request({
    url: "/blog/live",
    method: "post",
    data: query,
  });
}
