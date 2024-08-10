import request from "@/utils/request";

// 查询服务器列表
export function getServerInfo(paths: Array<string>) {
  const queryString = paths.map(path => `paths=${encodeURIComponent(path)}`).join('&'); 
  return request({
    url: `/steamApi/?${queryString}`,
    method: "get",
  });
}
