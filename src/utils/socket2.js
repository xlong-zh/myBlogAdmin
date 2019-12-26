import Vue from 'vue';
import Vuex from 'vuex';
import WebSocketConfig from '../config/websocketConfig';
import VueNativeSock from 'vue-native-websocket';

import user from './module/user';
import app from './module/app';
import { getToken } from '../libs/util';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    //
    socket: {
      isConnected: false,
      currentSendParam: [],
      socketConnector: new Vue()
    },
    connectSocket() {
      if (this.socket.isConnected) return;
      this.socket.socketConnector.$connect();
    },
    disconnectSocket() {
      this.socket.socketConnector.$disconnect();
    },
    sendSocket(par) {
      // console.log(par)
      let params = JSON.parse(par);
      if (!params.lt) {
        params.lt = getToken();
      }
      par = JSON.stringify(params);
      if (this.socket.currentSendParam == null) {
        this.socket.currentSendParam = [];
      }
      if (!this.socket.isConnected) {
        this.socket.currentSendParam.push(par);
      } else {
        try {
          Vue.prototype.$socket.send(par);
          this.socket.currentSendParam = [];
        } catch (e) {
          this.socket.currentSendParam.push(par);
        }
      }
    },
    resendSocket() {
      console.log(this.socket.currentSendParam);
      if (this.socket.currentSendParam.length > 0) {
        this.socket.currentSendParam.forEach(function(value, index) {
          // console.log(value);
          Vue.prototype.$socket.send(value);
        });
        this.socket.currentSendParam = [];
      }
    },

    backTesting: {
      backTraceShow: false, //回测按钮是否展示。
      code: '',
      strategyName: '',
      strategyInstantId: '',
      backTraceStatus: 1 //回测状态：1-未提交，2-已提交回测中，3-回测结束
    },
    algoTrading: {
      orderType: '',
      tradingMarket: '',
      transactionAccount: '',
      exchangeSubEnum: '',
      transactionContract: '',
      triggerMarket: '',
      triggerExchangeSubEnum: '',
      handsNumber: '',
      price: '',
      orderSide: '', //交易方向
      stopWinFlag: '',
      equilibriumStrategy: '',
      slipTick: '',
      timer: '',
      triggerInstrument: '',
      triggerPrice: '',
      stopWinPrice: '',
      stopLossFlag: '',
      stopLossPrice: '',
      stopWorseTick: '',
      resendTime: '',
      visibleAmount: '',
      floatAmount: '',
      twapTime: '',
      percent: '',
      openOrFlat: '',
      speculativeHedging: ''
    },
    fileBaseUrl: null //上传文件和图片的ip
  },
  mutations: {
    //变更状态必须调用里面的方法 this.$store.commit('SOCKET_ONOPEN',event)
    SOCKET_ONOPEN(state, event) {
      console.log('socket_onopen');
      Vue.prototype.$socket = event.currentTarget;
      state.socket.isConnected = true;
      state.resendSocket();
    },
    SOCKET_ONCLOSE(state, event) {
      console.log('socket onClose');
      state.socket.isConnected = false;
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event);
    },
    SOCKET_ONMESSAGE(state, message) {
      // console.log("socket_onMessage")
      state.message = message;
    },
    SOCKET_RECONNECT(state, count) {
      // console.log("socket reconnect")
      console.info(state, count);
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },

    //
    setUserRoleId(roleId) {
      console.log(roleId);
    },
    setUserRoleName(roleName) {
      console.log(roleName);
    },
    setFileBaseUrl(state, url) {
      state.fileBaseUrl = url.startsWith('http') ? url : 'http://' + url;
    }
  },
  actions: {
    sendSocket(context, par) {
      let params = JSON.parse(par);
      if (!params.lt) {
        params.lt = getToken();
      }
      par = JSON.stringify(params);
      if (context.state.socket.currentSendParam == null) {
        context.state.socket.currentSendParam = [];
      }
      if (!context.state.socket.isConnected) {
        context.state.socket.currentSendParam.push(par);
      } else {
        try {
          Vue.prototype.$socket.send(par);
          context.state.socket.currentSendParam = [];
        } catch (e) {
          context.state.socket.currentSendParam.push(par);
        }
      }
    },
    queryFileBaseUrl(context) {
      EventBus.$on('722', json => {
        context.commit('setFileBaseUrl', json.host_post);
        EventBus.$off('722');
      });
      console.debug('queryFileBaseUrl');
      let params = { mt: 721, sd: new Date(), lt: getToken() };
      store.dispatch('sendSocket', JSON.stringify(params));
      console.debug(params);
    }
  },
  getters: {},
  modules: {
    user,
    app
  }
});
Vue.use(VueNativeSock, WebSocketConfig.host, {
  store: store,
  format: 'json',
  reconnection: WebSocketConfig.isReconnect, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: WebSocketConfig.reconnectionAttempts, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: WebSocketConfig.reconnectionDelay, // (Number) how long to initially wait before attempting a new (1000)
  connectManually: true //手动管理连接
});

export default store;

// let params = {"mt":715,"lt":getToken(),"name":this.$store.state.backTesting.strategyName,"money":this.beginMoney, "start_date":startDateParam, "end_date":endDateParam};
// console.log(params);
// this.$store.state.sendSocket(JSON.stringify(params));
