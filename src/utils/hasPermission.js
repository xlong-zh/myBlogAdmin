// import { USER_AUTH, SYS_BUTTON_AUTH } from "@/store/mutation-types";

const hasPermission = {
  install(Vue, options) {
    console.log(options);
    Vue.directive("has", {
      inserted: (el, binding, vnode) => {
        console.log("页面权限控制----");
        //节点权限处理，如果命中则不进行全局权限处理
        if (!filterNodePermission(el, binding, vnode)) {
          filterGlobalPermission(el, binding, vnode);
        }
      }
    });
  }
};
//自动获取焦点
const focusPermission = {
  install(Vue, options) {
    console.log(options);
    Vue.directive("focus", {
      // 当被绑定的元素插入到 DOM 中时……
      inserted: function(el) {
        // 聚焦元素
        el.focus();
      }
    });
  }
};
// 拖拽组件
const dragPermission = {
  install(Vue, options) {
    console.log(options);
    Vue.directive("drag", {
      // 指令的定义
      inserted: function(el, binding, vnode) {
        vnode = vnode.elm;
        el.onmousedown = event => {
          if (!event.target.className) {
            return;
          } else if (
            event.target.className &&
            event.target.className.indexOf("my_dialog_title") === -1
          ) {
            return;
          }
          // if (event.target.className !== 'my_dialog_title') {
          //   return;
          // }
          if (event && event.stopPropagation) {
            event.stopPropagation();
          } else {
            window.event.cancelBubble = true;
          }
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            window.event.returnValue = false;
          }
          // (clientX, clientY)点击位置距离当前可视区域的坐标(x，y)
          // offsetLeft, offsetTop 距离上层或父级的左边距和上边距

          // 获取鼠标在弹窗中的位置
          let mouseX = event.clientX - el.offsetLeft;
          let mouseY = event.clientY - el.offsetTop;

          // 绑定移动和停止函数
          document.onmousemove = event => {
            let left, top;

            // 获取新的鼠标位置(event.clientX, event.clientY)
            // 弹窗应该在的位置(left, top)
            left = event.clientX - mouseX;
            top = event.clientY - mouseY;

            // offsetWidth、offsetHeight 当前元素的宽度
            // innerWidth、innerHeight 浏览器可视区的宽度和高度

            // 获取弹窗在页面中距X轴的最小、最大 位置,减去偏移位置
            let minX = -el.offsetWidth / 2 + 100;
            let maxX = window.innerWidth + el.offsetWidth / 2 - 100;
            if (left <= minX) {
              left = minX;
            } else if (left >= maxX) {
              left = maxX;
            }

            // 获取弹窗在页面中距Y轴的最小、最大 位置,减去偏移位置
            let minY = el.offsetHeight / 2;
            let maxY = window.innerHeight + el.offsetHeight / 2 - 100;
            if (top <= minY) {
              top = minY;
            } else if (top >= maxY) {
              top = maxY;
            }
            // 赋值移动
            el.style.left = left + "px";
            el.style.top = top + "px";
          };
          document.onmouseup = () => {
            document.onmousemove = document.onmouseup = null;
          };
        };
        window.onresize = () => {
          el.style.left = "50%";
          el.style.top = "50%";
        };
      }
    });
  }
};

/**
 * 节点权限控制
 */
export function filterNodePermission(el, binding, vnode) {
  console.log("页面权限--NODE--");

  var permissionList = [];
  try {
    // console.log(vnode, "vnode");
    // console.log(binding, "binding");
    // console.log(binding.value, "binding.value");
    // console.log(el, "el");
    // console.log(vnode.context, "vnode.context");
    var obj = vnode.context.$props.formData;
    // console.log(vnode.context.$props, "vnode.contex.propst");
    if (obj) {
      let bpmList = obj.permissionList;
      for (var bpm of bpmList) {
        if (bpm.type != "2") {
          permissionList.push(bpm);
        }
      }
    }
  } catch (e) {
    // console.log("页面权限异常----", e);
  }
  if (
    permissionList === null ||
    permissionList === "" ||
    permissionList === undefined ||
    permissionList.length <= 0
  ) {
    //el.parentNode.removeChild(el)
    return false;
  }
  let permissions = [];
  for (var item of permissionList) {
    if (item.type != "2") {
      permissions.push(item.action);
    }
  }
  //console.log("页面权限----"+permissions);
  //console.log("页面权限----"+binding.value);
  if (!permissions.includes(binding.value)) {
    //el.parentNode.removeChild(el)
    return false;
  } else {
    for (var item2 of permissionList) {
      if (binding.value === item2.action) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 全局权限控制
 */
export function filterGlobalPermission(el, binding, vnode) {
  console.log("页面权限--Global--");

  var permissionList = [];
  var allPermissionList = [];

  //let authList = Vue.ls.get(USER_AUTH);
  let authList = JSON.parse(sessionStorage.getItem("USER_AUTH") || "[]");
  for (var auth of authList) {
    if (auth.type != "2") {
      permissionList.push(auth);
    }
  }
  //console.log("页面权限--Global--",sessionStorage.getItem(SYS_BUTTON_AUTH));
  let allAuthList = JSON.parse(
    sessionStorage.getItem("SYS_BUTTON_AUTH") || "[]"
  );
  for (var gauth of allAuthList) {
    if (gauth.type != "2") {
      allPermissionList.push(gauth);
    }
  }
  //设置全局配置是否有命中
  var invalidFlag = false; //无效命中
  if (
    allPermissionList != null &&
    allPermissionList != "" &&
    allPermissionList != undefined &&
    allPermissionList.length > 0
  ) {
    for (var itemG of allPermissionList) {
      if (binding.value === itemG.action) {
        if (itemG.status == "0") {
          invalidFlag = true;
          break;
        }
      }
    }
  }
  if (invalidFlag) {
    return;
  }
  if (
    permissionList === null ||
    permissionList === "" ||
    permissionList === undefined ||
    permissionList.length <= 0
  ) {
    el.parentNode.removeChild(el);
    return;
  }
  let permissions = [];
  console.log(permissionList, "permissionList");
  for (var item of permissionList) {
    if (item.type != "2") {
      permissions.push(item.action);
    }
  }
  console.log(permissions, "permissions");
  if (!permissions.includes(binding.value)) {
    el.parentNode.removeChild(el);
  }
}

export { hasPermission, focusPermission, dragPermission };
