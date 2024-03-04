<template>
    <div class="page_title">
        <p class="title">{{ title }}</p>
    </div>
    <tips :message="cztips"></tips>
    <div class="center">
        <template v-for="(item, index) in list" :key="index">
            <div class="card" @click="navigation(item)">
                <img :src="item.bgi" style="width: 100%;height: 100%;">
                <div class="card-body">
                    <p class="card-text">{{ item.title }}</p>
                    <img style="margin-top: 16%;" :src="item.icon" :style="{ width: '34%', height: 'auto' }" />
                </div>
            </div>
        </template>
        <!-- <template v-for="(item, index) in list" :key="index">
            <el-col :span="6" class="card" v-if="index < 2" @click="navigation(item)">
                <img :src="item.bgi" style="width: 100%;height: auto;">
                <div class="card-body">
                    <p class="card-text">{{ item.title }}</p>
                    <img style="margin-top: 16%;" :src="item.icon"
                        :style="{ width: index < 2 ? '34%' : '25%', height: 'auto' }" />
                </div>
            </el-col>
        </template>
        <el-col :span="6">
            <template v-for="(item, index) in list" :key="index">
                <div class="card" v-if="index >= 2" @click="navigation(item)">
                    <img :src="item.bgi" style="width: 100%;height: auto;">
                    <div class="card-body">
                        <p class="card-text">{{ item.title }}</p>
                        <img :src="item.icon" :style="{ width: index < 2 ? '34%' : '25%', height: 'auto' }" />
                    </div>
                </div>
            </template>
        </el-col> -->
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
    onMounted, onUpdated, onUnmounted
} from "vue";
import tips from "@/components/tips.vue"
import { useMainStore } from "@/stores/index"
import { useRoute, useRouter } from "vue-router";
import * as API from "@/api/index"
import df from "@/assets/images/df@2x.png"
import bg2 from "@/assets/images/card-bg2@2x.png"
import czjl from "@/assets/images/czjl@2x.png"
import bg3 from "@/assets/images/card-bg3@2x.png"
import qc from "@/assets/images/qc@2x.png"
import bg4 from "@/assets/images/card-bg4@2x.png"
const system = useMainStore()
system.viewName = "自助服务终端"
const route = useRoute();
const router = useRouter();
const title = ref<string>("欢迎使用智能一卡通充值服务系统");
const cztips = "温馨提示：充值前请核对信息"
let list = ref([
    // { title: "水费充值", type: "water", icon: "./src/assets/images/sf@2x.png", bgi: "./src/assets/images/card-bg1@2x.png", w: 154, h: 154, navigation: "recharge" },
    { title: "电费充值", type: "electricity", icon: df, bgi: bg2, w: 154, h: 154, navigation: "recharge" },
    { title: "充值记录", type: "recharge", icon: czjl, bgi: bg3, w: 116, h: 116, navigation: "rechargeRecord" },
    { title: "圈存", type: "coli", icon: qc, bgi: bg4, w: 116, h: 116, navigation: "coilCharging" },
]);
// console.log("00000")
interface Nav {
    key: string;
    path: string;
    displayName: string;
}

function navigation(e: any) {
    // debug
    // 
    if (system.card.insertCard === true) {
        if(e.navigation == "electricity"){
            // 电费充值
            system.queryCardInfo()
        }else{
            router.push({ name: e.navigation, params: { type: e.type } })
        }
        
    } else {
        let tout: any = null;
        system.card.isCardReading = true;
        API.cardRecognition({}).then((res: any) => {
            // console.log(res)
            if (res.code === 500) {
                system.card.isCardReading = false;
                system.setMessage(res.message)
                return
            }
            // const message = JSON.parse(res.message) || null;
            // const result = JSON.parse(res.result) || null;
            function stout() {
                tout = setTimeout(() => {
                    if (system.card.cardNumber !== "" && system.card.insertCard === true) {
                        router.push({ name: e.navigation, params: { type: e.type } })
                    } else {
                        stout()
                    }
                }, 10)
            }
            stout()
        }).catch(res => {
            try {
                const message: string = res.message
                system.setMessage(message)
            } catch (e: any) {

            }
        }).finally(() => {
            // 超时关闭
            setTimeout(() => {
                system.card.isCardReading = false;
                // system.setMessage({ visible: true, message: '超时请重试！'})
                clearTimeout(tout)
            }, 3000)
        })
    }
}
const navs: Nav[] = [
    {
        key: "/elem-tmpl",
        path: "/elem-tmpl",
        displayName: "elem-tmpl"
    },
];
</script>

<style lang="less" scoped>
.page_title {
    width: auto;
    height: auto;
}


.center {
    margin-top: 40px;
    display: flex;
    width: 1430px;
    justify-content: space-between;

    .card {
        width: 335px;
        height: 500px;
        // height: 100px;
        // background-color: yellow;
        position: relative;
        cursor: pointer;

        & .card-body {
            // position: relative;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99;
            width: 100%;
            min-height: 100%;
            flex-direction: column;

            & .card-text {
                text-align: center;
                //             width: 192px;
                // height: 48px;
                font-size: 2rem;
                font-family: Source Han Sans CN-Bold, Source Han Sans CN;
                font-weight: bold;
                color: #FFFFFF;
                line-height: 0px;
                text-shadow: 0px 3px 14px rgba(0, 0, 0, 0.16);
                -webkit-background-clip: text;
                // -webkit-text-fill-color: transparent;
            }

            & .card-icon {
                width: 20px;
                height: 20px;
            }
        }
    }
}

// .tips {
//     margin-left: 245px;
//     width: 1430px;
// }

.title {
    //     width: 780px;
    // height: 52px;
    text-align: center;
    font-size: 52px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #333333;
    // line-height: 0px;
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
}

.cztips {
    //     width: 286px;
    // height: 22px;
    font-size: 22px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    line-height: 0px;
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
}
</style>
  