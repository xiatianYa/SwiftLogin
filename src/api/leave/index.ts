import request from "@/utils/request";

//查询留言列表
export function listLeave(query?: any) {
  return request({
    url: "/blog/leave/list",
    method: "get",
    params: query,
  });
}

//新增留言
export function addLeave(query: any) {
    return request({
      url: "/blog/leave",
      method: "post",
      data: query,
    });
  }
