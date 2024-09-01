import request from "@/utils/request";

// 查询服务器列表
export function getServerInfo(countryId: string) {
  return request({
    url: `/blog/server/steamApi/?${countryId}`,
    method: "get",
    params:{
      countryId
    }
  });
}
