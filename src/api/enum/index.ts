import request from "@/utils/request";

// 查询模式枚举
export function listModeEnum() {
  return request({
    url: "/blog/mode/list",
    method: "get",
  });
}
