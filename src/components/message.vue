<template>
    <div class="eldialog">
        <el-dialog align-center center v-model="system.message.visible" :show-close="false" :modal="true" width="40%"
            :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
            <div class="content">
                <!-- <div class="spinner"></div> -->
                <span class="top-text margin_1" style="">{{ system.message.title }}</span>
                <span class="tip-text margin_2" style="">{{ system.message.message }}</span>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useMainStore } from "@/stores/index"
const system = useMainStore()

function handleClose() {

}

setTimeout(()=>{
    system.message.visible = false
},2000)
</script>

<style lang="less" scoped>
.margin_1 {
    margin-top: 100px;
}

.margin_2 {
    margin-top: 20px;
    margin-bottom: 100px;
}

.top-text {
    //     width: 180px;
    // height: 36px;
    font-size: 45px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    // font-weight: bold;
    line-height: 36px;
    color: #333333;
    font-weight: bold;
    // line-height: 0px;
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
}



.eldialog {
    /deep/ .el-dialog--center {
        width: 700px;
        height: 250px;
        background: #FFFFFF;
        border-radius: 20px 20px 20px 20px;
        opacity: 1;

        .el-dialog__header {
            display: none;
        }

        .el-dialog__body {
            padding: 0;
            height: 100%;
        }

        .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            // padding-top: 100px;
        }

        .tip-text {
            font-size: 36px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 500;
            color: #666666;
            line-height: 0px;
            -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
        }
    }
}
</style>