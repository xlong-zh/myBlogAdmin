import { isURL } from '@/utils/validate';

export function timeFix() {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好';
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了'];
  let index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  let event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, true);
  event.eventType = 'message';
  window.dispatchEvent(event);
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return;
  }

  for (var key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key];
    }
  }
  return obj;
}

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  // var regPos = /^\d+(\.\d+)?$/;
  // if (regPos.test(value)) {
  //如果是数字
  let getDate = new Date(value);
  let opt = {
    'Y+': getDate.getFullYear().toString(),
    'M+': (getDate.getMonth() + 1).toString(),
    'D+': getDate.getDate().toString(),
    'h+': getDate.getHours().toString(),
    'm+': getDate.getMinutes().toString(),
    's+': getDate.getSeconds().toString(),
  };
  for (let k in opt) {
    // if (new RegExp('(' + k + ')').test(fmt)) {
    // 	console.log(opt[k]);
    // 	console.log(RegExp.$1.length);
    // 	fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? opt[k] : ('00' + opt[k]).substr(('' + opt[k]).length));
    // }
    let ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
    }
  }
  return fmt;
}
// export function formatDate(value, fmt) {
//   var regPos = /^\d+(\.\d+)?$/;
//   if (regPos.test(value)) {
//     //如果是数字
//     let getDate = new Date(value);
//     let o = {
//       'M+': getDate.getMonth() + 1,
//       'd+': getDate.getDate(),
//       'h+': getDate.getHours(),
//       'm+': getDate.getMinutes(),
//       's+': getDate.getSeconds(),
//       'q+': Math.floor((getDate.getMonth() + 3) / 3),
//       S: getDate.getMilliseconds(),
//     };
//     if (/(y+)/.test(fmt)) {
//       fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length));
//     }
//     for (let k in o) {
//       if (new RegExp('(' + k + ')').test(fmt)) {
//         fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
//       }
//     }
//     return fmt;
//   } else {
//     //TODO
//     value = value.trim();
//     return value.substr(0, fmt.length);
//   }
// }

// 生成首页路由
export function generateIndexRouter(data) {
  let indexRouter = [
    {
      path: '/',
      name: 'dashboard',
      //component: () => import('@/components/layouts/BasicLayout'),
      component: (resolve) => require(['@/components/layouts/TabLayout'], resolve),
      meta: { title: '首页' },
      redirect: '/dashboard/analysis',
      children: [...generateChildRouters(data)],
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true,
    },
  ];
  return indexRouter;
}

// 生成嵌套路由（子路由）

function generateChildRouters(data) {
  const routers = [];
  for (var item of data) {
    let component = '';
    if (item.component.indexOf('layouts') >= 0) {
      component = 'components/' + item.component;
    } else {
      component = 'views/' + item.component;
    }

    // eslint-disable-next-line
    let URL = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)); // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      item.meta.url = URL;
    }

    let menu = {
      path: item.path,
      name: item.name,
      redirect: item.redirect,
      component: (resolve) => require(['@/' + component + '.vue'], resolve),
      hidden: item.hidden,
      //component:()=> import(`@/views/${item.component}.vue`),
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        permissionList: item.meta.permissionList,
      },
    };
    if (item.alwaysShow) {
      menu.alwaysShow = true;
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters(item.children)];
    }
    //--update-begin----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
    //判断是否生成路由
    if (item.route && item.route === '0') {
      //console.log(' 不生成路由 item.route：  '+item.route);
      //console.log(' 不生成路由 item.path：  '+item.path);
    } else {
      routers.push(menu);
    }
    //--update-end----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
  }
  return routers;
}

/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */

export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 随机生成数字
 *
 * 示例：生成长度为 12 的随机数：randomNumber(12)
 * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
 *
 * @param1 最小值 | 长度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber() {
  // 生成 最小值 到 最大值 区间的随机数
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  if (arguments.length === 1) {
    let [length] = arguments;
    // 生成指定长度的随机数字，首位一定不是 0
    let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)));
    return parseInt(nums.join(''));
  } else if (arguments.length >= 2) {
    let [min, max] = arguments;
    return random(min, max);
  } else {
    return Number.NaN;
  }
}

/**
 * 随机生成字符串
 * @param length 字符串的长度
 * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
  if (!length) length = 1;
  if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm';
  let str = '';
  for (let i = 0; i < length; i++) {
    let num = randomNumber(0, chats.length - 1);
    str += chats[num];
  }
  return str;
}

/**
 * 随机生成uuid
 * @return string 生成的uuid
 */
export function randomUUID() {
  let chats = '0123456789abcdef';
  return randomString(32, chats);
}

/**
 * 下划线转驼峰
 * @param string
 * @returns {*}
 */
export function underLine2CamelCase(string) {
  return string.replace(/_([a-z])/g, function(all, letter) {
    return letter.toUpperCase();
  });
}
//解决小数运算浮点数函数（2个数字的(+,-,*,/,%)可用）;
export function cleanFloatingNum(numa, numb, oper) {
  const lena = String(numa).split('.').length > 1 ? String(numa).split('.')[1].length : 0;
  const lenb = String(numb).split('.').length > 1 ? String(numb).split('.')[1].length : 0;
  const lenMax = Math.max(lena, lenb);
  const times = Number('1e' + lenMax);
  let obj = 0;
  if (oper === '*') {
    obj = (Number(numa + 'e' + lenMax) * Number(numb + 'e' + lenMax)) / times / times;
  } else if (oper === '+') {
    obj = (Number(numa + 'e' + lenMax) + Number(numb + 'e' + lenMax)) / times;
  } else if (oper === '-') {
    obj = (Number(numa + 'e' + lenMax) - Number(numb + 'e' + lenMax)) / times;
  } else if (oper === '/') {
    obj = Number(numa + 'e' + lenMax) / Number(numb + 'e' + lenMax);
  } else if (oper === '%') {
    obj = (Number(numa + 'e' + lenMax) % Number(numb + 'e' + lenMax)) / times;
  }
  return obj;
}
//金额千位加逗号,末尾2位小数
export function toThousands(obj) {
  if (typeof obj !== 'number') {
    return obj;
  }
  let arr = [],
    counter = 0,
    num = '',
    tail = '';
  tail = String(obj.toFixed(2)).split('.')[1];
  num = String(obj.toFixed(2))
    .split('.')[0]
    .split('');
  for (let i = num.length - 1; i >= 0; i--) {
    counter++;
    arr.unshift(num[i]);
    if (counter % 3 === 0 && i != 0) {
      arr.unshift(',');
    }
  }
  return arr.join('') + '.' + tail;
}
//设置接单时间间隔（当前时间，一个月前时间）
export function setTimeSpace(setATime, setBTime) {
  let time1 = new Date();
  time1.setTime(time1.getTime());
  let Y1 = time1.getFullYear();
  let M1 = time1.getMonth() + 1 > 9 ? time1.getMonth() + 1 : '0' + (time1.getMonth() + 1);
  let D1 = time1.getDate() > 9 ? time1.getDate() : '0' + time1.getDate();
  setATime = `${Y1}/${M1}/${D1} 23:59:59`; // 当前时间
  let time2 = new Date();
  time2.setTime(time2.getTime() - 24 * 60 * 60 * 1000 * 30);
  let Y2 = time2.getFullYear();
  let M2 = time2.getMonth() + 1 > 9 ? time2.getMonth() + 1 : '0' + (time2.getMonth() + 1);
  let D2 = time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate();
  setBTime = `${Y2}/${M2}/${D2} 00:00:00`; // 之前一个月
}
/* 导出ant-vue */
function handleExportXls(fileName) {
  if (!fileName || typeof fileName != 'string') {
    fileName = '导出文件';
  }
  // let param = { ...this.queryParam };
  // if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
  //   param['selections'] = this.selectedRowKeys.join(',');
  // }
  // console.log('导出参数', param);
  downFile('url', { param }).then((data) => {
    if (!data) {
      this.$message.warning('文件下载失败');
      return;
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data]), fileName + '.xls');
    } else {
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName + '.xls');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
  });
}
//函数节流
const throttle = (fun, delay) => {
  let last = null;
  return () => {
    const now = +new Date();
    if (now - last > delay) {
      fun();
      last = now;
    }
  };
};
//函数防抖
const debouce = (fun, delay) => {
  let timer = null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fun();
    }, delay);
  };
};
//将base64转换为文件对象
export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  //转换成file对象
  return new File([u8arr], filename, { type: mime });
  //转换成成blob对象
  //return new Blob([u8arr],{type:mime});
}
// let a = 1;
// function fnn(x) {
//   for (let j = x + 2; j < 13; j++) {
//     a += 1;
//     fnn(j);
//   }
// }
// function fn() {
//   for (let i = 2; i < 13; i++) {
//     a += 1;
//     fnn(i);
//   }
// }
// fn();
// console.log(a);

// let num1 = 1;
// let num2 = 1;
// let sum = 0;
// for (let i = 1; i < 13; i++) {
//   sum = num1 + num2;
//   num1 = num2;
//   num2 = sum;
// }
// console.log(sum);
