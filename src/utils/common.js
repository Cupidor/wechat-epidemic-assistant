import Taro from "@tarojs/taro";

// 时间转时间戳
export const formatStamp = (date) => {
  return new Date(date.replace(/-/g, "/")).getTime();
};

// 时间戳转时间（年月日）
export const formatTime = (timestamp) => {
  if (Number(timestamp)) {
    let d = new Date(Number(timestamp));
    let year = d.getFullYear();
    let month = format(d.getMonth() + 1);
    let date = format(d.getDate());
    return `${year}-${month}-${date}`;
  } else {
    return timestamp;
  }
};

// 时间戳转时间（年月日时分秒）
export const formatTime2 = (timestamp) => {
  if (Number(timestamp)) {
    let d = new Date(Number(timestamp));
    let year = d.getFullYear();
    let month = format(d.getMonth() + 1);
    let date = format(d.getDate());
    let hour = format(d.getHours());
    let minutes = format(d.getMinutes());
    let seconds = format(d.getSeconds());
    return `${year}-${month}-${date} ${hour}:${minutes}:${seconds}`;
  } else {
    return timestamp;
  }
};

// 时间戳转时间字符串（年月日时）
export const formatTimeHour = (timestamp) => {
  let d = new Date(Number(timestamp));
  let year = d.getFullYear();
  let month = format(d.getMonth() + 1);
  let date = format(d.getDate());
  let hour = format(d.getHours());
  return `${year}-${month}-${date} ${hour}`;
};

// 时间戳转时间字符串（年月）
export const formatTimeMonth = (timestamp) => {
  let d = new Date(Number(timestamp));
  let year = d.getFullYear();
  let month = format(d.getMonth() + 1);
  return year + "-" + month;
};

// 时间戳转时间字符串（年）
export const formatTimeYear = (timestamp) => {
  let d = new Date(Number(timestamp));
  let year = d.getFullYear();
  return year;
};

// 时间戳转时间（时分）
export const formatTimeMin = (timestamp) => {
  if (Number(timestamp)) {
    let d = new Date(Number(timestamp));
    let hour = format(d.getHours());
    let minutes = format(d.getMinutes());
    return `${hour}:${minutes}`;
  } else {
    return timestamp;
  }
};

// 获取某年某月天数
export function mGetDate(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}

// 格式化时间
export const format = (t) => {
  return t > 9 ? t : "0" + t;
};

// 公共提示
export function showMessage(msg) {
  Taro.showToast({
    title: msg,
    icon: "none",
    duration: 1500,
  });
}

// 数组集合去重
export function unique(arr) {
  let obj = {};
  return arr.reduce((cur, next) => {
    obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
    return cur;
  }, []);
}

// 移除最后一个字符
export function removeLastlastComma(val) {
  return val.substring(0, val.length - 1);
}

// 获取字符串长度
export function getLength(arr) {
  let len = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr.charCodeAt(i) > 127 || arr.charCodeAt(i) == 94) {
      len += 2;
    } else {
      len++;
    }
  }
  return len;
}

// 补齐数组小数点后位数
export function fixLength(arr) {
  let maxLength = 0;
  let newarr = [];
  for (let item of arr) {
    if (item.toString().indexOf(".") !== -1) {
      let nowLength = item.toString().split(".")[1].toString().length;
      if (nowLength > maxLength) {
        maxLength = nowLength;
      }
    }
  }
  for (let item of arr) {
    newarr.push(Number(item).toFixed(maxLength));
  }
  return newarr;
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accAdd(arg1, arg2) {
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}

/**
 **减法函数，用来得到精确的减法结果
 **说明：javascript的减法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
 **调用：accSubtr(arg1,arg2)
 **返回值：arg1减去arg2的精确结果
 **/
export function accSubtr(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
export function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m)
  );
}

/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为 精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
export function accDiv(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {}
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

/**数组根据数组对象中的某个属性值进行排序的方法
 * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性 如number属性
 * @param rev true表示升序排列，false降序排序
 * */
export function sortBy(attr, rev) {
  //第二个参数没有传递 默认升序排列
  if (rev === undefined) {
    rev = 1;
  } else {
    rev = rev ? 1 : -1;
  }

  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  };
}

// 两个对象数组的差集
export function getDifferenceSet(arr1, arr2, typeName) {
  return Object.values(
    arr1.concat(arr2).reduce((acc, cur) => {
      if (
        acc[cur[typeName]] &&
        acc[cur[typeName]][typeName] === cur[typeName]
      ) {
        delete acc[cur[typeName]];
      } else {
        acc[cur[typeName]] = cur;
      }
      return acc;
    }, {})
  );
}

// 获取当前页url
export function getCurrentPageUrl() {
  var pages = getCurrentPages(); //获取加载的页面
  var currentPage = pages[pages.length - 1]; //获取当前页面的对象
  var url = currentPage.route; //当前页面url
  return url;
}

// 校验是数字（包含正负整数，0以及正负浮点数）
export function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}

// 去除字符串前后中间所有空格
export function trimSpace(str) {
  return str.replace(/\s*/g, "");
}
