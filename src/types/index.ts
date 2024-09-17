export type CustomType<T = any> = T;
//用户
export type UserType = {
    //用户Token
    token: string;
    //用户id
    id: number | null;
    //用户昵称
    nickName: string;
    //用户头像
    avatar: string;
    //用户邮箱
    email: string;
    //用户手机号
    phone: string;
    //用户创建实际
    createTime: string;
    //用户权限
    roles: [];
    //用户身份
    permissions: [];
};

export type LeaveType = {
    // 留言类型名称
    label: string;
    // 留言类型值
    value: number;
}
export type Leave = {
    // 主键
    id: number;
    // 留言类型
    leaveType: number;
    // 留言消息
    leaveMessage: string;
    // 留言图片
    leaveImages: string;
    // 留言数组
    lstImages: string[];
    // 开始时间
    leaveStart: string;
    // 结束时间
    leaveEnd: string;
    // 创建
    createBy: number;
    // 昵称
    nickName: string;
    // 头像
    avatar: string;
}