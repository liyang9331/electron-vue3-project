// main.ts

// 引入 vue 实例化函数
import { createApp } from "vue";
// 引入 App 根组件
import App from "./App.vue";
// 引入路由
import router from "./router";
// 引入 ElementPlus
import ElementPlus from 'element-plus'
// 引入 ElementPlus 样式表
import 'element-plus/dist/index.css'
// 引入 pinia状态管理器 实例化函数
import { createPinia } from 'pinia'

// 实例化vue，并挂载根组件
const app = createApp(App);

// ------ 引入 ElementPlus 图标，并挂载 start ------
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// ------ 引入 ElementPlus 图标，并挂载 end ------

app
  .use(router)//挂载路由
  .use(createPinia())//挂载存储库
  .use(ElementPlus)//挂载ElementPlus
  .mount("#app")//将 Vue 实例挂载到 DOM（文档对象模型） 中指定的 HTML 元素上。
  .$nextTick(() => {
    // 在下次 DOM 更新循环结束后执行回调函数。
    // todo ....
    // postMessage({ payload: 'removeLoading' }, '*')
  })