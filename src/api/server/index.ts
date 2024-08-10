import request from "@/utils/request";

// 查询服务器列表
export function listServer(query?: any) {
  return request({
    url: "/api/blog/server/list",
    method: "get",
    params: query,
  });
}