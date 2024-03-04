<template>
  <div class="top" style="">
    <div class="top-left">
      <div>
        <p class="left-text">
          <span>姓名:</span><span>{{ system.card.cardInfo?.fullName }}</span>
        </p>
        <p class="left-text">
          <span>卡号:</span><span>{{ system.card.cardInfo?.cardNo }}</span>
        </p>
        <p class="left-text">
          <span>卡中电量:</span
          ><span>{{ system.card.cardInfo?.available }}度</span>
        </p>
      </div>
    </div>
    <div class="fingerboard" style="">
      <div class="fingerboard-top">
        <span class="top-text">充值度数:</span>
        <!-- <el-input disabled class="input" v-model="inputValue"></el-input> -->
        <span class="top-text">{{ inputValue }}</span>
      </div>

      <div class="fingerboard-input">
        <span class="tips-text">请选择固定充值度数</span>
        <div
          v-for="item in list"
          :style="clickValue == item.value ? { borderColor: '#318800' } : {}"
          @click="fingerboardHandle(item)"
          :class="inputValue == item.value ? 'select' : ''"
        >
          <span v-if="item.type != 'del'">{{ item.text }}</span>
          <img v-else class="icon-del" src="../../assets/images/del.png" />
        </div>
      </div>
    </div>
  </div>
  <div class="button_parent">
    <ubutton @handler="goback()" :text="'返回'" :model="1"></ubutton>
    <ubutton @handler="confirm()" :text="'去充值'" :model="2"></ubutton>
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
} from "vue";
import { useMainStore } from "@/stores/index";
import ubutton from "@/components/button.vue";
import { useRoute, useRouter, RouteLocationRaw } from "vue-router";
import * as api from "@/api/index";
const route = useRoute();
const router = useRouter();
const type = route.params.type;
const system = useMainStore();
console.log("更新卡中数据");
system.queryCardInfo();
if (type == "water") {
  system.viewName = "水费充值";
} else if (type == "electricity") {
  system.viewName = "电费充值";
}

// let userName = ref<String>("李四")
// let cardNumber = ref<String>("1000001")
// let waterSurplus = ref<Number>(52)
const clickValue = ref<any>(null);
const list = ref<any>([]);
api.dict("DF_PAY_AMOUNT").then((res: any) => {
  list.value = res.result;
  // console.log(list.value)
});

const inputValue = ref<any>(null);
function goback() {
  // router.go(-1)
  const routeLocation: RouteLocationRaw = {
    path: "/home",
    query: {},
  };
  router.push(routeLocation);
}
// 确认充值，跳转到支付页面
function confirm() {
  if (inputValue.value !== null) {
    // 卡中度数大于0，禁止充值
    const available = system.card.cardInfo?.available;
    if (available != undefined && Number(available) > 0) {
      system.setMessage("卡中有电，不能进行充值");
    } else {
      const state: any = true;
      router.push({
        name: "pay",
        params: { type: type, state: state, amount: inputValue.value },
      });
    }
  } else {
    system.setMessage("请输入充值度数");
  }
}

function fingerboardHandle(event: any) {
  inputValue.value = event.value;
}
</script>
<style>
.el-input.is-disabled .el-input__inner {
  color: none !important;
}

.el-input.is-disabled .el-input__wrapper {
  background-color: none !important;
}
</style>

<style lang="less" scoped>
.top {
  // margin-top: 200px;
  // margin-left: 150px;
  display: flex;
  justify-content: center;

  & .top-left {
    width: 540px;
    height: 734px;
    background: linear-gradient(180deg, #ffffff 0%, #14be3c 100%);
    // box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.08);
    // border-radius: 20px 20px 20px 20px;
    opacity: 1;
    position: relative;
    background-size: cover;
    background-image: url(../../assets/images/sf-czbgi@2x.png);

    // & img{
    //     width: 100%;
    //     height: auto;
    // }
    & > div {
      margin-left: 60px;
      margin-top: 67px;
    }
  }
}

.fingerboard {
  margin-left: 40px;
  position: relative;
  width: 850px;
  height: 734px;
  background: #ffffff;
  box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.08);
  border-radius: 20px 20px 20px 20px;
  opacity: 1;

  & .fingerboard-top {
    display: flex;
    align-items: center;
    // margin-top: 60px;
    padding-top: 90px;
    margin-left: 60px;

    // border: 1px solid #ccc;
    .input {
      width: 540px;
      height: 90px;
      display: inline-block;
      background: #ffffff;
      border-radius: 10px 10px 10px 10px;
      opacity: 1;
      border: 1px solid #c7c7c7;
      color: #333333;
      font-size: 32px;
    }

    .top-text {
      // width: 160px;
      // height: 32px;
      display: inline-block;
      margin-right: 30px;
      font-size: 32px;
      font-family: Source Han Sans CN-Bold, Source Han Sans CN;
      font-weight: bold;
      color: #333333;
      line-height: 0px;
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
    }
  }
}

.fingerboard-input {
  margin-left: 90px;
  margin-top: 60px;
  padding-top: 30px;
  display: flex;
  flex-wrap: wrap;
  position: relative;

  .tips-text {
    position: absolute;
    left: 0;
    top: 0;
    //         width: 198px;
    // height: 22px;
    font-size: 22px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #ff7700;
    line-height: 0px;
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
  }

  & > div {
    cursor: pointer;
    margin-bottom: 20px;
    margin-right: 20px;
    text-align: center;
    font-size: 40px;
    line-height: 100px;
    width: 325px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    height: 40px;
    height: 100px;
    background: #ffffff;
    border-radius: 10px 10px 10px 10px;
    opacity: 1;
    border: 2px solid #c7c7c7;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-del {
      width: 80px;
      height: auto;
    }
  }

  .select {
    //         width: 325px;
    // height: 100px;
    background: #ffffff;
    box-shadow: 0px 3px 6px 1px rgba(49, 136, 0, 0.47);
    border-radius: 10px 10px 10px 10px;
    opacity: 1;
    border: 1px solid #318800;
  }
}

.left-text {
  //     width: 292px;
  // height: 154px;
  font-size: 34px;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
  font-weight: bold;
  color: #333333;
  // line-height: 60px;
  // -webkit-background-clip: text;

  // -webkit-text-fill-color: transparent;
  & span:nth-child(1) {
    text-align: right;
    display: inline-block;
    width: 150px;
    margin-right: 10px;
  }
}

.text {
  text-align: right;
  // line-height: 100%;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
  font-weight: bold;
  color: #333333;
  line-height: 0px;
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
}
</style>
