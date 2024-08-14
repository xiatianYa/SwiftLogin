//字符串转boolean
function stringToBoolean(str: any): boolean {
  if (typeof str === "string" && str.toLowerCase() === "true") {
    return true;
  } else if (typeof str === "string" && str.toLowerCase() === "false") {
    return false;
  }
  return false;
}

// 导出函数
export { stringToBoolean };
