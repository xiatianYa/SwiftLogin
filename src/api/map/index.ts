import request from "@/utils/request";

// 查询地图列表
export function listMap(query?: any) {
  return request({
    url: "/blog/map/list",
    method: "get",
    params: query,
  });
}

// 查询全部地图列表
export function listAllMap(query?: any) {
  return request({
    url: "/blog/map/listAll",
    method: "get",
    params: query,
  });
}
