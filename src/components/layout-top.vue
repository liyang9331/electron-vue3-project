
<template>
  <div class="content">
    <div class="layout">
    <span class="title">{{ system.viewName }}</span>
    <div class="right">
      <div>
        <p class="date">{{ week }}</p>
        <p class="date">{{ date }}</p>
      </div>
      <span class="time">{{ time }}</span>
      <img v-if="isShow" style="cursor: pointer;" @click="click()" src="../assets/images/home.png">
    </div>
  </div>
  <div class="lines"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount,getCurrentInstance,watch} from 'vue'
import {useRoute} from 'vue-router';
import dayjs from 'dayjs';
import { useMainStore } from '@/stores/index'

const route = useRoute();
// 监听路由变化
watch(
  ()=>route.name,
  (newVal:any,oldVal:any)=>{
    if(newVal!='home' && newVal!=undefined){
      isShow.value=true;
    }else{
      isShow.value=false;
    }
  }
)

const {emit}:any = getCurrentInstance();
const system = useMainStore()
const isShow = ref<boolean>(false)
// window.stores = {system}
// let viewName = ref<string>(system.viewName)
// 订阅state[组件被卸载后，订阅将被自动删除]
// system.$subscribe((mutation, state) => {
//   viewName.value = state.viewName
// })
// 订阅state【组件被卸载后，订阅依旧保留】
// system.$subscribe(()=>{},{detached:true})

let date = ref<string>(dayjs().format('YYYY-MM-DD'))
const list = [{ key: 0, val: "星期天" }, { key: 1, val: "星期一" }, { key: 2, val: "星期二" }, { key: 3, val: "星期三" }, { key: 4, val: "星期四" }, { key: 5, val: "星期五" }, { key: 6, val: "星期六" },]
const week = ref<any>("")
const time = ref<string>("")
let setval = ref<any>(null)
const publicMsg = ref<string>("未识别到IC/射频卡信息")

function init() {
  getDateTime()
  setval.value = setInterval(() => {
    getDateTime()
  }, 50000)
}

function getDateTime() {
  date.value = dayjs().format('YYYY-MM-DD')
  week.value = list.find(item => item.key == dayjs().day())?.val
  time.value = dayjs().format('HH:mm')
}

function click() {
  emit('clickHandler',{})
}
init()

onBeforeUnmount(() => {
  clearInterval(setval.value)
})
</script>

<style scoped lang="less">
img {
  width: 60px;
  height: 60px;
}
.content{
  height: 116px;
}
.layout {
  // padding: 30px;
  height: 110px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
}

.right {
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-items: center;
  margin-right: 30px;
  &>div {
    margin-right: 18px;
  }
}

.date {
  font-size: 20px;
  margin: 0;
  text-align: right;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  color: #333333;
  // line-height: 30px;
  -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
}

.title {
  margin-left: 30px;
  font-size: 42px;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
  font-weight: bold;
  color: #333333;
  // line-height: 0px;
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
}

.time {
  margin-right: 41px;
  font-size: 50px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  color: #333333;
  // line-height: 87px;
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
}

.lines {
  width: 100%;
  height: 6px;
  background: #318800;
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
}

</style>
