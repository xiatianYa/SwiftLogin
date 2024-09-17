import request from "@/utils/request";

// 查询模式枚举
export function listModeEnum() {
    return request({
        url: "/blog/gameEnum/mode",
        method: "get",
    });
}

// 查询地图标签枚举
export function listTagEnum() {
    return request({
        url: "/blog/gameEnum/tag",
        method: "get",
    });
}

// 查询地图难度枚举
export function listTypeEnum() {
    return request({
        url: "/blog/gameEnum/type",
        method: "get",
    });
}

// 查询留言类型枚举
export function listLeaveTypeEnum() {
    return request({
        url: "/blog/gameEnum/leaveType",
        method: "get",
    });
}

