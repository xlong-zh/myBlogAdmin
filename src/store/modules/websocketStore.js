import Vue from 'vue';

function makeByte(p) {
  var bytesMethod = stringToByte(p.method);

  var bytes = stringToByte(JSON.stringify(p.jsonData));

  var headLenth = 6;
  var bodyLenth = bytes.length + bytesMethod.length + 2 + 2;
  var buffer = new ArrayBuffer(headLenth + bodyLenth);
  var view = new DataView(buffer);

  var count = 0;
  //包头
  view.setInt16(count, p.type); //消息类型2
  count += 2;
  view.setUint32(count, bodyLenth); //包体大小4
  count += 4;
  //包体

  view.setInt16(count, 1); //序列化类型2
  count += 2;
  view.setInt16(count, bytesMethod.length); //方法字符大小2
  count += 2;
  for (var i = 0; i < bytesMethod.length; i++) {
    view.setUint8(count, bytesMethod[i]);
    count++;
  }
  for (var i = 0; i < bytes.length; i++) {
    view.setUint8(count, bytes[i]);
    count++;
  }
  return view;
}

function stringToByte(str) {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
}

function byteToString(arr) {
  if (typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}

const websocketStore = {
  state: {
    websock: null,
    websocketTimer: null,
    eventlist: []
  },
  getters: {
    onEvent(state) {
      return function(method) {
        // let index = state.eventlist
        //   .map(eb => {
        //     return eb.method;
        //   })
        //   .indexOf(method);
        // if (state.eventlist.length > 0 && index >= 0) {
        //   let result = Object.assign({}, state.eventlist[index]);
        //   state.eventlist.splice(index, 1);
        //   return result.data;
        // }
        // return null;
        let arrlist = state.eventlist;
        return arrlist;
      };
    }
  },
  mutations: {
    WEBSOCKET_INIT(state, url) {
      state.websock = new WebSocket(url);
      //开始连接
      state.websock.onopen = function() {
        console.debug('websocket连接成功！');
        //发送心跳包
        state.websocketTimer = setInterval(function() {
          console.debug('ws发送心跳！');
          let heart = {
            type: 5,
            jsonData: '测试'
            // sd: new Date(),
          };
          // state.websock.send(makeByte(heart));
          state.websock.send(JSON.stringify(heart));
        }, 20000);
      };
      //接受消息
      state.websock.onmessage = function(callBack) {
        console.log('ws接收！', callBack);
        var receive = [];
        var type = 0;
        var length = 0;
        // receive = receive.concat(Array.from(new Uint8Array(callBack.data)));
        // if (receive.length < 6) {
        //   console.log('包头大小错误：' + receive.length);
        //   return;
        // }

        // var index = 0;
        // type = new DataView(new Uint8Array(receive).buffer).getUint16(index);
        // index += 2;

        // length = new DataView(new Uint8Array(receive).buffer).getUint32(index);
        // index += 4;
        // if (receive.length < length + 6) {
        //   console.log('包体大小错误：' + receive.length);
        //   return;
        // }

        if (callBack.type == 5) {
          console.log('收到服务器心跳包！');
          return;
        }

        // var bytes = receive.slice(index, length + 6);
        //doSomething(bytes);
        // console.log('包体数据大小：' + bytes.length);

        // var typeS = new DataView(new Uint8Array(receive).buffer).getUint16(index);
        // index += 2;

        // var methodLenth = new DataView(new Uint8Array(receive).buffer).getUint16(index);
        // index += 2;

        // var methodByte = receive.slice(index, index + methodLenth);
        // index += methodLenth;
        // var methodStr = byteToString(methodByte);

        // var dataByte = receive.slice(index, length + 6);
        // var dataStr = byteToString(dataByte);

        // console.log('methodStr:' + methodStr + ' dataStr:' + dataStr);
        // state.eventlist.push({
        //   method: methodStr,
        //   data: JSON.parse(dataStr)
        // });
        state.eventlist.push({
          receive: callBack.data
        });
        console.log(state.eventlist, 'state.eventlist');
      };
      //错误
      state.websock.οnerrοr = function(e) {
        clearInterval(state.websocketTimer);
        console.log('ws错误!');
        console.log(e);
        //失败重连
        state.websock.close();
        store.dispatch('WEBSOCKET_INIT', `ws://127.0.0.1:8888/jeecg-boot/socket/server/${Vue.ls.get(ACCESS_TOKEN)}`);
      };
      //关闭
      state.websock.onclose = function(e) {
        clearInterval(state.websocketTimer);
        console.log('ws关闭！');
        console.log(e);
      };
      // state.websock.binaryType = 'arraybuffer';
    },
    //发送消息
    WEBSOCKET_SEND(state, p) {
      console.debug('ws发送！', p);
      p.sd = new Date();
      state.websock.send(JSON.stringify(p));
      // state.websock.send(makeByte(p));
    }
  },
  actions: {
    WEBSOCKET_INIT({ commit }, url) {
      commit('WEBSOCKET_INIT', url);
    },
    WEBSOCKET_SEND({ commit }, p) {
      p.type = 3;
      commit('WEBSOCKET_SEND', p);
    }
  }
};
export default websocketStore;
