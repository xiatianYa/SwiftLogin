//字符串转boolean
function stringToBoolean(str: any): boolean {
  if (typeof str === "string" && str.toLowerCase() === "true") {
    return true;
  } else if (typeof str === "string" && str.toLowerCase() === "false") {
    return false;
  }
  return false;
}
//判断传入时间是否在三小时内
function isWithinThreeHours(dateToCheck: any) {
  // 获取当前时间
  const now = new Date();

  // 获取dateToCheck的时间戳和当前时间的时间戳
  const timeToCheck = dateToCheck.getTime();
  const nowTime = now.getTime();

  // 计算时间差（毫秒）
  const diff = Math.abs(timeToCheck - nowTime);

  // 将时间差转换为小时（1小时=3600000毫秒）
  const diffHours = diff / (3600 * 1000);

  // 判断时间差是否小于或等于3小时
  return diffHours <= 3;
}

// 导出函数
export { stringToBoolean,isWithinThreeHours };
