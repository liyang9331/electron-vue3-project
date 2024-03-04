import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {

    path: "/",
    redirect: '/home'
  },
  {
    // 首页
    path: "/home",
    name:"home",
    // ---------------开发调试 start--------------
    component: () => import("../views/home/index.vue"),
    // component: () => import("../views/coil-charging/index.vue"),
    // ---------------开发调试 end--------------
  },
  {
    // 支付
    path: "/pay",
    name:"pay",
    component: () => import("../views/pay/index.vue"),
  },
  {
    // 充值
    path: "/recharge",
    name:"recharge",
    component: () => import("../views/recharge/index.vue"),
  },
  {
    // 充值记录
    path: "/rechargeRecord",
    name:"rechargeRecord",
    component: () => import("../views/recharge-record/index.vue"),
  },
  {
    // 圈存
    path: "/coilCharging",
    name: "coilCharging",
    component: () => import("../views/coil-charging/index.vue"),
  },
  {
    // 圈存结果提示
    path: "/coilTips",
    name: "coilTips",
    component: () => import("../views/coli-tips/index.vue"),
  },
  {
    // 充值结果提示
    path: "/rechargeTips",
    name: "rechargeTips",
    component: () => import("../views/recharge-tips/index.vue"),
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
