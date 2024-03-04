<template>
    <div class="tips">
        <img src="../assets/images/voice@2x.png" style="width: 34px;height: 34px;margin-right: 13px;">
        <span class="cztips">{{ message }}</span>
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
    message: String
})
</script>

<style scoped lang="less">
.tips {
    width: 1430px;
    height: 60px;
    display: flex;
    align-items: center;
    background: #FFFFFF;
    border-radius: 20px 20px 20px 20px;
    opacity: 1;
    img{
        margin-left: 30px;
    }
}
</style>