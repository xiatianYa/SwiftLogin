import request from '@/utils/request'

export function listLeave(data) {
    var parameter = "";
    if (data != null) {
        for (let name in data) {

        }
    }
    return request({
        url: "/blog/leave/list/v2",
        method: "get",
    });
}