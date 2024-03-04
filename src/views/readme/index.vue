<script setup lang="ts">
import {Ref,ref,reactive} from "vue"
import HelloWorld from '@/components/layout-top.vue.js'
import { useRouter } from "vue-router";
import {rubbish} from "@/api/index"
const router = useRouter()

// 设置基本数据类型时，使用 ref
const filePath=ref<string>("")
function navgiteto(key:string){
  router.push(key)
}
// 在新窗口打开网页
function openWeb(){
    window.electronAPI.openWeb("https://www.baidu.com")
}
// 选择文件，获取文件路径
async function openFile(){
  filePath.value = await window.electronAPI.openFile()
}

rubbish({name:"香蕉"}).then((res:any)=>{
  console.log(res)
})
</script>



<template>
  <div>
    <a href="https://www.electronjs.org/" target="_blank">
      <img src="@/assets/electron.svg" class="logo electron" alt="Electron logo" />
    </a>
    <a href="https://vitejs.dev/" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <a href="https://element-plus.gitee.io/zh-CN/component/button.html" target="_blank">
      <img src="@/assets/element-plus-logo.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Electron + Vite + Vue + Element-Plus" />
  <!--  -->
  <el-button @click="navgiteto('/home')">page-home</el-button>
  <el-button @click="openWeb">在新窗口中打开百度</el-button>
  <el-button @click="openFile">打开文件</el-button>
  文件路径：{{ filePath }}
  <div class="flex-center">
    Place static files into the <code>/public</code> folder
    <img style="width:5em;" src="/node.svg" alt="Node logo">
  </div>
</template>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9FEAF9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
