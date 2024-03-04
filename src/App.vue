<template>
  <layout-top @clickHandler="clickHandler()"></layout-top>
  <div class="app_page">
    <div class="app_content">
      <router-view></router-view>
    </div>
  </div>
  <elcMessage v-if="system.message.visible"></elcMessage>
  <loading v-if="system.card.isCardReading" title="读卡中..." message="正在读卡中，请勿取出卡片......"></loading>
</template>
<script setup lang="ts">
import layoutTop from "@/components/layout-top.vue";
import { useMainStore } from "@/stores/index";
import { useRouter } from "vue-router";
import WebSocketClient from "@/utils/websocket";
import elcMessage from "@/components/message.vue";
import loading from "@/components/loading.vue";
import * as API from "@/api/index";
const system = useMainStore();
const router = useRouter();

// 创建websocket连接,挂载到 window 对象下
const ws: any = new WebSocketClient({
  heartTime: 60000,
  onmessage: (res: any) => {
    const data = res;
    if (data !== null && typeof (data) === 'string' && data.indexOf('{') !== -1) {
      const ndata = JSON.parse(data)
      // console.log(ndata)
      if (ndata.code != 500 && ndata.code != 200 && ndata.code != 201) {
        // 保存卡号
        system.card.cardNumber = ndata.code;
        system.card.insertCard = true;
        system.card.isCardReading = false;
        system.card.cardType = "E"
        // 卡片类型【水卡：W,电卡：E】
        system.queryCardInfo()
        // 清除支付状态
        system.clearPay();
      } else if (ndata.code == 500) {
        if (system.card.insertCard === true) {
          // 卡被拔出
          // 清空卡片信息
          system.clearCardData();
          // 清楚支付状态
          system.clearPay();
          const message = decodeURIComponent(ndata.message);
          system.setMessage(message)
          clickHandler()
        } else {
          // 未插卡
          system.card.isCardReading = false;
          system.setMessage("请插卡")
        }

      } else if (ndata.code == 201) {
        console.log(ndata)
        // 支付结果回调
        system.pay.amount = ndata.amount
        system.pay.orderCode = ndata.orderCode
        system.pay.payId = ndata.payId
        system.pay.status = true
      } else if (ndata.code == 202) {
        // 支付错误
        system.pay.status = false
        // system.clearPay()
      }
    }
  },
  onopen: (res: any) => {
    system.isWebSocket = true;
    window.electronAPI.log({ type: 'info', message: 'ws连接成功' })
  },
  onclose: (res: any) => {
    console.log("连接断开")
    window.electronAPI.log({ type: 'warn', message: 'ws连接断开' })
    if (system.isWebSocket === true) {
      system.clearCardData()
      router.push({ name: "home" });
      system.setMessage("未识别到卡片信息")
    }
    system.isWebSocket = false;
    ws.connect()
  },
  onerror: (error: any) => {
    system.isWebSocket = false;
    console.log("连接错误")
    // system.clearCardData()
    // 断线重连
  },
  onsend: (res: any) => {
    console.log("send")
  },
  socketUrl: import.meta.env.VITE_SOCKET_URL,
});

function clickHandler() {
  // 返回主页
  router.push({ name: "home" });
}
</script>


<style lang="less" scoped>
.app_page {
  height: calc(100% - 116px);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
}

@font-face {
  font-family: "Source Han Sans CN-Medium";
  src: url("./assets/fonts/SourceHanSansSC-Medium.otf");
}

@font-face {
  font-family: "Source Han Sans CN";
  src: url("./assets/fonts/SourceHanSansSC-Normal.otf");
}

#app {
  width: 100%;
  height: 100%;
  background-image: url("./assets/images/app_bgi@2x.png");
  background-size: cover;
}

body {
  margin: 0;
}

.button_parent {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>
