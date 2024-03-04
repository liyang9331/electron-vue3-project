<template>
    <div class="page">
        <tips :message="cztips"></tips>
        <div class="body" v-if="state === true">
            <div class="top_title">
                <span>充值度数：{{ amount }}度</span>
                <div class="triangle"></div>
            </div>
            <img class="success_img" src="../../assets/images/recharge-success@2x.png" alt="" srcset="">
            <div>
                <p class="text">确认是否打印小票（{{ second }}S）？</p>
                <p class="yesorno">
                    <span @click="print(true)" :style="{ color: isrReceipt ? '#318800' : '#666666' }">是</span>
                    <span>|</span>
                    <span @click="print(false)" :style="{ color: !isrReceipt ? '#318800' : '#666666' }">否</span>
                </p>
            </div>
            <!-- <span class="margin_1" style="">剩余{{ second }}s关闭页面......</span> -->
        </div>
        <div class="body" v-else>
            <img class="img" src="../../assets/images/recharge-fail@2x.png" alt="" srcset="">
            <span class="margin_2" style="">{{ message }}</span>
        </div>
        <div class="button_parent">
            <ubutton @handler="goback()" :text="'返回'" :model="1"></ubutton>
            <ubutton v-if="state === true" @handler="confirm()" :text="'下一步，圈存'" :model="2"></ubutton>
        </div>
    </div>

    <loading v-if="dialogVisible" title="圈存中..." message="正在圈存中，请勿移动卡片......"></loading>
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
    onUnmounted
} from "vue";
import tips from "@/components/tips.vue"
import { useMainStore } from "@/stores/index"
import ubutton from "@/components/button.vue";
import { useRoute, useRouter, RouteLocationRaw } from "vue-router";
import loading from "@/components/loading.vue";
import * as API from "@/api/index";


const route = useRoute();
const router = useRouter();
const system = useMainStore()
console.log("充值结果：",system.pay);
const state: boolean = system.pay.status;
const amount = system.pay.amount;
const message = ref<string>("")
const cztips = ref<string>("")
const isrReceipt = ref<boolean>(false)
const dialogVisible = ref<Boolean>(false);
if ( state === true) {
    message.value = "确认是否打印小票"
    cztips.value = "温馨提示：请勿移动卡片，去圈存！！！！"
} else {
    message.value = "充值失败，失败原因：卡内余额不足！！"
    cztips.value = "温馨提示：充值前请核对信息"
}

interface user {
    cardNumber: string;
    money: string;
}
const second = ref<number>(125)
const adminPhone = ref<string>("010-66350243")
let setval:any = null

// 倒计时 - 125s
timeout()
function timeout() {
    setval = setInterval(() => {
        second.value = second.value - 1
        if (second.value < 0) {
            goback()
            second.value = 0
        }
    }, 1000);
}

// 组件实例被销毁钩子函数
onUnmounted(()=>{
    console.log('onUnmounted')
    // 清除延迟计时器
    clearInterval(setval);
    // 支付结果重置
    system.clearPay();
})

function print(flag:boolean){
    if(isrReceipt.value === false && flag === true){
        isrReceipt.value = true;
        // 打印
        interface data{
            cardNo:string;
            cardType:string;
            orderCode:string;
            payIds?:string;//圈存支付id,多个逗号隔开,圈存操作必填
        }
        const data:data = {
            cardNo:system.card.cardNumber||"",
            cardType:system.card.cardType||"",
            orderCode:system.pay.orderCode || "",
        }
        console.log("卡片数据："+system.card)
        console.log("打印参数："+data)
        API.printFile(data).then((res:any)=>{
            if(res.code === 200){

            }else{
                system.setMessage("打印失败")
                isrReceipt.value = false
            }
        }).catch(res=>{

        }).finally(()=>{
        })
    }
}

function goback() {
    // 支付结果重置
    system.clearPay();
    router.go(-1)
}

//圈存
function confirm() {
    // router.replace({ name: "coilCharging", params: { type: "coli" } })
    dialogVisible.value = true;
    setTimeout(() => {
        dialogVisible.value = false;
    }, 1000);
    // console.log(system.pay.payId,'--------')
    let payIds:string = system.pay.payId+"";
    API.entrap({
        cardNo: system.card.cardNumber,
        cardType: system.card.cardType,
        payIds: payIds,
        orderCode:system.pay.orderCode
    })
        .then((res: any) => {
            if (res.code === 200 && res.success === true) {
                // 圈存成功
                const routeLocation: RouteLocationRaw = {
                    path: "/coilTips",
                    query: {
                        state: "true",
                        amount
                    },
                };
                router.push(routeLocation);
            } else {
                // 圈存失败
                // system.setMessage(res.message)
                const routeLocation: RouteLocationRaw = {
                    path: "/coilTips",
                    query: {
                        state: "false",
                        amount
                    },
                };
                router.push(routeLocation);
            }
            system.clearPay()
        })
        .catch((res) => {
            system.setMessage(res.message);
        })
        .finally(() => {
            // dialogVisible.value = false;
        });
}

function handleClose() { }
</script>

<style lang="less" scoped>
.page {
    // margin-top: 40px;
    width: 1430px;
    // margin-left: 245px;
}

.yesorno {
    text-align: center;
    margin-top: 40px;

    span {
        cursor: pointer;
        font-size: 34px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        line-height: 0px;
        -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
    }

    span:nth-child(1) {
        color: #318800;
        margin-right: 20px;
    }

    span:nth-child(3) {
        color: #666666;
        margin-left: 20px;
    }
}

.success_img {
    margin-top: 43px;
}

.top_title {
    position: absolute;
    left: 0px;
    width: 366px;
    height: 100px;
    background: #318800;
    // border: 1px solid red;
    opacity: 1;
    border-bottom-right-radius: 13px;
    border-top-left-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
        //     width: 311px;
        // height: 40px;
        font-size: 40px;
        font-family: Source Han Sans CN-Bold, Source Han Sans CN;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 0px;
        -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
    }
}

.triangle {
    position: absolute;
    right: -90px;
    top: 0;
    width: 100px;
    height: 100px;
}

.triangle::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border-top: 50px solid #318800;
    /* 顶部为透明 */
    border-right: 50px solid transparent;
    /* 右边为红色 */
    border-bottom: 50px solid transparent;
    /* 底部为透明 */
    border-left: 50px solid #318800;
    /* 左边为透明 */
}

.img {
    margin-top: 40px;
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
    position: relative;
    margin-top: 34px;
    width: 100%;
    height: 640px;
    background: #FFFFFF;
    border-radius: 20px 20px 20px 20px;
    opacity: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
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
    margin-top: 40px;
    font-size: 28px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #666666;
    line-height: 0px;
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;

    &>span:nth-child(1) {
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