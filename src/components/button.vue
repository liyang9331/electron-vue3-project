<template>
    <div :class="model == 1 ? 'btn' : 'btn-confirm'" @click="clickHandler">
        <span :class="model == 1 ? 'btn-text' : 'btn-confirm-text'" :style="style">{{ text }}</span>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { defineProps, defineEmits, ref } from "vue";
const props = defineProps({
    model: {
        type: Number,
        default: 1,
    },
    text: {
        type: String,
        default: "",
    },
    style: {
        type: Object,
        default: () => { },
    },
});
const emit = defineEmits(["handler"]);
function clickHandler() {
    emit("handler", {});
}
</script>

<style scoped lang="less">
.btn-text {
    font-size: 34px;
    // font-size: 34px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #318800;
    line-height: 0px;
}

.btn-confirm-text {
    font-size: 34px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #ffffff;
    line-height: 0px;
}

.btn-confirm {
    margin-left: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 288px;
    height: 86px;
    background: #318800;
    box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.08);
    border-radius: 20px 20px 20px 20px;
    border: 2px solid #318800;

    &:checked,
    &:active {
        &>span {
            color: #409eff;
        }

        border: 2px solid #c6e2ff;
    }
}

.btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 288px;
    height: 86px;
    background: #ffffff;
    box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.08);
    border-radius: 20px 20px 20px 20px;
    border: 2px solid #318800;

    &:checked,
    &:active {
        &>span {
            color: #409eff;
        }

        border: 2px solid #c6e2ff;
    }
}
</style>
