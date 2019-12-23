import Vue from 'vue';
import io from 'socket.io-client'; //引入socket.io-client

export default new Vue({
  data: {
    hasRealAlarm: false,
    socket: null,
    nInstance: null
  },
  methods: {
    switchRealAlarm(is) {
      this.hasRealAlarm = is;
    },
    initSocket() {
      const _this = this;
      const socket = io('http://192.168.1.242:8360/'); //路径
      this.socket = socket;
      // console.log(‘初始化：socket’, socket);
      this.socket.on('connect', data => {
        console.log('open:', data);
        const userName = {
          userName: this.getuserName() //获取登录缓存的用户
        };
        console.log('userName:', userName);
        if (this.getuserName() !== null) {
          socket.emit('addUser', userName); //推送用户账号给后端socket
        }
      });
      this.socket.on('close', () => {
        console.log('socket连接关闭');
      });

      /* Listeners */
      this.socket.on('alarmToWeb', data => {
        // console.log('后端推送的实时告警信息', data);
        console.log('alarmToWeb：socket', data);
        _this.$emit('newAlarms', data); //触发当前实例上的事件。data传给监听器回调。
        this.newAlarmsArrive(data);
      });

      this.socket.on('AccessResponseToWeb', data => {
        console.log('AccessResponseToWeb：socket', data);
        _this.$emit('AccessResponseToWeb', data);
        this.newDoorArrive(data);
        // this.newAlarmsArrive(data);
        // _this.$on('newAlarms', (data2) => {
        // 	// console.log('alarmToWeb88：socket', data2);
        // 	// console.log('neAlarms告警信息: ', data2);
        // });
        // console.log('实时告警信息到达', data);
      });

      // 试用期使用时长
      this.socket.on('lisenceEndToWeb', data => {
        console.log('试用期数据', data);
        this.$notify({
          title: '提示',
          message: `授权码结束时间为：${data.endDate}，剩余天数：${data.remainingDays}`,
          type: 'warning',
          position: 'bottom-right'
        });
      });

      this.socket.on('freshDataToWeb', data => {
        // console.log('设备收到的新数据', data);
        // alert(data);
      });

      _this.$on('close', () => {
        console.log('socket-close');
        this.socket.close();
      });
      /* Listeners */
    },

    newAlarmsArrive(data) {
      const _this = this;
      console.log('index-发生告警8：', data);
      //  confirmTitle = '提醒'
      let alarmInfo;
      let alarmType;
      if (data.state === '告警') {
        alarmType = 'error';
        alarmInfo = `${data.areaName}的${data.devName}发生了${data.alarmName}，告警级别为：${data.alarmType}`;
      } else {
        alarmType = 'success';
        alarmInfo = `${data.areaName}的${data.devName}的${data.alarmName}，告警已解除`;
      }
      // console.log('接收到告警信息数据：', alarmInfo);
      // Notification.closeAll();
      if (this.nInstance !== null) {
        this.nInstance.close();
      }
      this.nInstance = this.$notify({
        title: '提醒',
        type: alarmType,
        dangerouslyUseHTMLString: true,
        message: `<strong>${alarmInfo}</strong>`,
        position: 'bottom-right',
        duration: 0,
        onClick() {
          _this.$router.push('/alarm');
          console.log('点击进入告警页面');
          this.close();
          _this.nInstance = null;
        },
        onClose() {
          console.log('刷新设备数据');
          _this.nInstance = null;
        }
      });
    },
    newDoorArrive(data) {
      const _this = this;
      // console.log('index-发生告警8：', data);
      //  confirmTitle = '提醒'
      let alarmInfo;
      let alarmType;
      if (data.opCode == 6) {
        if (data.errCode == 0) {
          alarmType = 'success';
          alarmInfo = `设置${data.devName}设备成功`;
        } else if (data.errCode == 1) {
          alarmType = 'error';
          alarmInfo = `设置${data.devName}设备出错，提示：不支持的命令请求`;
        } else if (data.errCode == 2) {
          alarmType = 'error';
          alarmInfo = `设置${data.devName}设备出错，提示：参数错误`;
        } else if (data.errCode == 3) {
          alarmType = 'error';
          alarmInfo = `设置${data.devName}设备出错，提示：重复操作`;
        } else if (data.errCode == 4) {
          alarmType = 'error';
          alarmInfo = `设置${data.devName}设备出错，提示：资源忙或不足`;
        } else if (data.errCode == 5) {
          alarmType = 'error';
          alarmInfo = `设置${data.devName}设备出错，提示：通讯超时`;
        }
      } else if (data.opCode == 8) {
        if (data.errCode == 0) {
          alarmType = 'success';
          alarmInfo = `添加${data.devName}权限成功`;
        } else if (data.errCode == 1) {
          alarmType = 'error';
          alarmInfo = `添加${data.devName}权限出错，提示：不支持的命令请求`;
        } else if (data.errCode == 2) {
          alarmType = 'error';
          alarmInfo = `添加${data.devName}权限出错，提示：参数错误`;
        } else if (data.errCode == 3) {
          alarmType = 'error';
          alarmInfo = `添加${data.devName}权限出错，提示：重复操作`;
        } else if (data.errCode == 4) {
          alarmType = 'error';
          alarmInfo = `添加${data.devName}权限出错，提示：资源忙或不足`;
        } else if (data.errCode == 5) {
          alarmType = 'error';
          alarmInfo = `添加${data.devName}权限出错，提示：通讯超时`;
        }
      } else if (data.opCode == 9) {
        if (data.errCode == 0) {
          alarmType = 'success';
          alarmInfo = `删除${data.devName}权限成功`;
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        } else if (data.errCode == 1) {
          alarmType = 'error';
          alarmInfo = `删除${data.devName}权限出错，提示：不支持的命令请求`;
        } else if (data.errCode == 2) {
          alarmType = 'error';
          alarmInfo = `删除${data.devName}权限出错，提示：参数错误`;
        } else if (data.errCode == 3) {
          alarmType = 'error';
          alarmInfo = `删除${data.devName}权限出错，提示：重复操作`;
        } else if (data.errCode == 4) {
          alarmType = 'error';
          alarmInfo = `删除${data.devName}权限出错，提示：资源忙或不足`;
        } else if (data.errCode == 5) {
          alarmType = 'error';
          alarmInfo = `删除${data.devName}权限出错，提示：通讯超时`;
        }
      }

      // console.log('接收到告警信息数据：', alarmInfo);
      // Notification.closeAll();
      if (this.nInstance !== null) {
        this.nInstance.close();
      }
      this.nInstance = this.$notify({
        title: '提醒',
        type: alarmType,
        dangerouslyUseHTMLString: true,
        message: `<strong>${alarmInfo}</strong>`,
        position: 'bottom-right',
        duration: 0,
        onClose() {
          console.log('刷新设备数据');
          _this.nInstance = null;
        }
      });
    }
  }
});
