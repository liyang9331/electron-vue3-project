<template>
    <div class="dialog">
        <el-dialog v-model="visible" :align-center="true" :show-close="false" :modal="true" width="40%"
    :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
        <div class="content">
            <div class="spinner"></div>
            <span class="top-text margin_1" style="">{{ title }}</span>
            <span class="tip-text margin_2" style="">{{ message }}</span>
        </div>
    </el-dialog>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import {
    defineComponent,
    reactive,
    ref,
    toRefs,
    unref,
    watch,
    watchEffect, defineProps
} from "vue";
const props = defineProps({
    title: String,
    message: String
})
const visible = ref<Boolean>(true)
</script>

<style lang="less" scoped>
.top-text {
    //     width: 180px;
    // height: 36px;
    font-size: 36px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    // font-weight: bold;
    line-height: 36px;
    color: #333333;
    font-weight: bold;
    // line-height: 0px;
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
}
.margin_1 {
    margin-top: 100px;
}

.margin_2 {
    margin-top: 50px;
    margin-bottom: 100px;
}

.dialog{
    & :deep( .el-dialog ) {
    width: 620px;
    height: 640px;
    background: #ffffff;
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
        padding-top: 100px;
    }

    .tip-text {
        font-size: 26px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #666666;
        line-height: 0px;
        -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
    }
}
}



.spinner {
    width: 112px;
    height: 112px;
    display: grid;
    border: 6px solid #0000;
    border-radius: 50%;
    border-color: #318800 #0000;
    animation: spinner-e04l1k 1s infinite linear;
}

.spinner::before,
.spinner::after {
    content: "";
    grid-area: 1/1;
    margin: 4.4px;
    border: inherit;
    border-radius: 50%;
    border-color: #66cd00 #0000;
}

.spinner::before {
    border-color: #ffc107 #0000;
    animation: inherit;
    animation-duration: 0.5s;
    animation-direction: reverse;
}

.spinner::after {
    margin: 17.8px;
}

@keyframes spinner-e04l1k {
    100% {
        transform: rotate(1turn);
    }
}
</style>