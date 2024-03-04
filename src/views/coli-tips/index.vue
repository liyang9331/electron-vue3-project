<template>
  <div class="page">
    <div class="body" v-if="state == 'true'">
      <img src="../../assets/images/coil-sucess@2x.png" alt="" srcset="" />
      <div>
        <p class="text">
          <span>卡号:</span><span>{{ system.card.cardNumber }}</span>
        </p>
        <p class="text">
          <span>圈存度数:</span><span>{{ amount }}度</span>
        </p>
      </div>
      <span class="margin_1" style="">剩余{{ second }}s关闭页面......</span>
    </div>
    <div class="body" v-else>
      <img src="../../assets/images/coil-fail@2x.png" alt="" srcset="" />
      <span class="margin_2" style=""
        >圈存失败，请联系管理员处理，电话{{ adminPhone }}</span
      >
      <span class="margin_3" style="">剩余{{ second }}s关闭页面......</span>
    </div>
    <div class="button_parent">
      <ubutton @handler="goback()" :text="'返回'" :model="1"></ubutton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  unref,
  watch,
  watchEffect,
  onUnmounted,
} from "vue";
import { useMainStore } from "@/stores/index";
import ubutton from "@/components/button.vue";
import { useRoute, useRouter, RouteLocationRaw } from "vue-router";

const route = useRoute();
const router = useRouter();
const state = ref<any>(route.query.state);
const amount = ref<any>(route.query.amount);

const system = useMainStore();
system.viewName = "圈存提示";
const second = ref<number>(125);
const adminPhone = ref<string>("010-66350243");
let outtime: any = null;
onUnmounted(() => {
  // second.value = 0
  clearTimeout(outtime);
});
timeout();
function timeout() {
  // console.log("计时器执行")
  outtime = setTimeout(() => {
    second.value = second.value - 1;
    if (second.value <= 0) {
      goback();
      second.value = 0;
    } else {
      timeout();
    }
  }, 1000);
}

function goback() {
  // router.go(-2)
  const routeLocation: RouteLocationRaw = {
    path: "/recharge",
    query: {
      type: "electricity",
      refresh:'true',
    },
  };
  router.push(routeLocation);
}
</script>

<style lang="less" scoped>
.page {
  width: 1430px;
  // margin-left: 245px;
}

.margin_1 {
  margin-top: 30px;
}

.margin_2 {
  margin-top: 26px;
}

.margin_3 {
  margin-top: 144px;
}

.body {
  width: 100%;
  height: 734px;
  background: #ffffff;
  border-radius: 20px 20px 20px 20px;
  opacity: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 50px;
}

img {
  width: 380px;
  height: 380px;
}

.top {
  margin-top: 40px;
  width: 1430px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text {
  //     width: 180px;
  // height: 36px;
  font-size: 34px;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
  // font-weight: bold;
  // line-height: 36px;
  color: #333333;
  font-weight: bold;
  // line-height: 0px;
  -webkit-background-clip: text;

  & > span:nth-child(1) {
    text-align: right;
    margin-right: 10px;
    display: inline-block;
    width: 180px;
  }
}

.top-left {
  position: relative;
}
</style>
