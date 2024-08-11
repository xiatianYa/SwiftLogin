import request from "@/utils/request";

// 查询地图列表
export function listMap(query?: any) {
  return request({
    url: "/blog/map/list",
    method: "get",
    params: query,
  });
}
