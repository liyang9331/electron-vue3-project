<template>
  <div class="page">
    <div class="text">请扫码支付</div>
    <!-- 二维码 -->
    <div class="qrcode_parent">
      <div style="
          font-size: 24px;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          color: #000000;
          text-align: center;
        ">
        工行e缴费二维码
      </div>
      <div style="
          margin-top: 5px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          text-align: center;
        ">
        通过工行手机银行或者微信扫一扫二维码进入工行e缴费
      </div>
      <!-- <el-divider></el-divider> -->
      <hr style="border: 0; border-top: 2px dashed #000000;margin-top: 20px;" />
      <div style="
          font-size: 18px;
          margin-bottom: 20px;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          color: #000000;
          text-align: center;
        ">
        黄寺营区电费
      </div>
      <div class="qrcode">
        <img :src="payImagePath" alt="" srcset="" />
      </div>
      <div style="margin-top: 15px; font-size: 12px; text-align: center">
        使用工行指定APP扫码购买，保障您的安全
      </div>
    </div>
  </div>
  <div class="button_parent">
    <ubutton @handler="goback()" :text="'返回'" :model="1"></ubutton>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { useMainStore } from "@/stores/index";
import ubutton from "@/components/button.vue";
import { useRoute, useRouter } from "vue-router";
import { generateQrcode, wsSend, billLoad } from "@/api/index";

const system = useMainStore();
const route = useRoute();
const router = useRouter();
const amount = route.params.amount;
const type = route.params.type;
const payImagePath = ref<string>("");
// console.log('-----------debug start-----------')
// console.log(system.pay)
// console.log('-----------debug end-----------')
// 模拟支付


interface data {
  cardNo?: string;
  cardType?: string;
  orderCode?: string;
  payIds?: string; //圈存支付id,多个逗号隔开,圈存操作必填
}

billLoad({ amount }).then((res: any) => {
  // console.log(res)
  const data = {
    orderCode: res.result.msgId,
    cardNo: system.card.cardNumber,
    cardType: system.card.cardType,
  };
  generateQrcode(data)
    .then((res: any) => {
      // console.log(res);
      if (res.success) {
        payImagePath.value = res.result.baseUrl;
      } else {
        system.setMessage(res.message);
      }
    })
    .catch((res) => { })
    .finally(() => { });
});

// 循环计时器检测圈存结果
const intervalID = setInterval(() => {
  if (system.pay.status === true || system.pay.status === false) {
    clearInterval(intervalID);
    // 返回充值首页
    router.push({
      name: "rechargeTips",
      params: { amount: system.pay.amount },
    });
  }
}, 100);

function goback() {
  clearInterval(intervalID);
  router.go(-1);
}

</script>

<style>
.el-divider--vertical {
  display: inline-block;
  width: 100%;
  height: 1px;
  margin: 0 8px;
  background: 0 0;
  border-left: 2px dashed #e8eaec;
  position: relative;
}
</style>

<style lang="less" scoped>
.page {
  width: 1630px;
  height: 934px;
  background: #ffffff;
  box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.08);
  border-radius: 20px 20px 20px 20px;
  opacity: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .text {
    position: absolute;
    top: 60px;
    left: 50px;
    font-size: 36px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #333333;
    line-height: 0px;
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
  }

  .qrcode_parent {
    // max-width: 263px;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // flex-wrap: wrap;

    .qrcode {
      margin: 0 auto;
      width: 420px;
      height: 420px;
      background: #ffffff;
      border-radius: 0px 0px 0px 0px;
      opacity: 1;
      border: 5px solid #000000;
      border-radius: 5px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .qrcode_text {
      margin-top: 40px;
      font-size: 26px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #666666;
      line-height: 0px;
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
    }
  }
}
</style>
