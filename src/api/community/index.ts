import request from "@/utils/request";

// 查询社区列表
export function listCommunity(query?: any) {
  return request({
    url: "/blog/community/list",
    method: "get",
    params: query,
  });
}
