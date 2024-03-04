<template>
  <div class="page">
    <div class="top">
      <div>
        <span class="top-text">充值记录</span>
        <span class="top-text fz_1"
          >({{ system.card.cardInfo?.fullName }}
          {{ system.card.cardNumber }})</span
        >
      </div>
      <div style="display: flex; align-items: center">
        <span class="top-text">时间</span>
        <el-select
          v-model="year"
          @change="selectionChange"
          class="selcet"
          size="large"
        >
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="month"
          @change="selectionChange"
          class="selcet"
          size="large"
        >
          <el-option
            v-for="item in monthList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="table_parent">
      <el-table
        class-name="table_content"
        ref="multipleTableRef"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55">
            </el-table-column> -->
        <el-table-column label="日期" class-name="tc_1">
          <template #default="scope">
            <div class="table-text">{{ scope.row.payTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="缴费订单" class-name="tc_2">
          <template #default="scope">
            <div class="table-text">{{ scope.row.orderCode }}</div>
          </template>
        </el-table-column>
        <el-table-column label="项目" class-name="tc_3">
          <template #default="scope">
            <div class="table-text">{{ scope.row.chargeItem }}</div>
          </template>
        </el-table-column>
        <el-table-column label="支付来源" class-name="tc_4">
          <template #default="scope">
            <div class="table-text">
              {{ scope.row.paySource === 1 ? "app" : "终端机" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" class-name="tc_5">
          <template #default="scope">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <!-- <div class="round"></div> -->
              <div
                class="table-text"
                style="color: #ff7700"
                v-if="scope.row.payStatus === 2"
              >
                充值失败
              </div>
              <div class="table-text" style="color: #318800" v-else>
                充值成功
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否圈存" class-name="tc_6">
          <template #default="scope">
            <div class="table-text">
              {{ scope.row.entrapStatus === 1 ? "是" : "否" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="圈存时间" class-name="tc_7">
          <template #default="scope">
            <div class="table-text">{{ scope.row.entrapTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="金额" class-name="tc_8">
          <template #default="scope">
            <div class="table-text">{{ scope.row.amount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="tc_9">
          <template #default="scope">
            <el-button type="primary" size="large" @click="print(scope.row)"
              >打印</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="arrow">
        <div class="arrow-previous">
          <div v-if="current > 1" @click="previous()">
            <el-icon :size="35">
              <Back />
            </el-icon>
            <span>上一页</span>
          </div>
        </div>
        <div class="arrow-next">
          <div v-if="current < total" @click="next()">
            <span>下一页</span>
            <el-icon :size="35">
              <Right />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="button_parent">
      <ubutton @handler="goback()" :text="'返回'" :model="1"></ubutton>
    </div>
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
} from "vue";
import ubutton from "@/components/button.vue";
import { ElTable } from "element-plus";
import dayjs from "dayjs";
import { Router, useRouter } from "vue-router";
import { useMainStore } from "@/stores/index";
import * as API from "@/api/index";

const router: Router = useRouter();
const system = useMainStore();
system.viewName = "充值记录";

interface table {
  amount: number;
  entrapStatus: number;
  entrapTime: any;
  orderCode: string;
  paySource: string;
  payStatus: any;
  payTime: string;
  chargeItem: string;
}
const current = ref<number>(1); //当前页码
const pageSize = ref<number>(5); //每页展示条数
const total = ref<number>(1); //总页码数
const tableData = ref<Array<table>>([]);

const multipleSelection = ref<table[]>([]);
const yearList = ref<any>(generateYear());
const monthList = ref<any>(generateMonth());
const year = ref<string>(yearList.value[0].value);
const month = ref<any>(dayjs().month() + 1);
interface data {
  cardNo?: string; //卡号
  cardType?: string; //卡片类型【水卡：W,电卡：E】
  current?: number; // 当前页数【默认1】
  pageSize?: number; // 每页显示的条数【默认5】
  payIds?: string; // 圈存支付id,多个逗号隔开,圈存操作必填
  time?: string; //时间
}

query();

function query() {
  const data: data = {
    cardNo: system.card.cardNumber,
    cardType: system.card.cardType,
    current: current.value,
    pageSize: pageSize.value,
    time: dayjs(`${year.value}-${month.value}`).format("YYYY-MM"),
  };
  API.queryUserPayRecord(data)
    .then((res: any) => {
      tableData.value = res.result.records;
      if (total.value == 1) {
        total.value = res.result.pages;
      }
    })
    .catch((err) => {});
}
function selectionChange() {
  query();
}
function print(row: any) {
  // 打印
  interface data {
    cardNo: string;
    cardType: string;
    orderCode: string;
    payIds?: string; //圈存支付id,多个逗号隔开,圈存操作必填
  }
  const data: data = {
    cardNo: system.card.cardNumber || "",
    cardType: system.card.cardType || "",
    orderCode: row.orderCode,
  };
  API.printFile(data)
    .then((res: any) => {
      if (res.code === 200) {
      } else {
        system.setMessage("打印失败");
      }
    })
    .catch((res) => {})
    .finally(() => {});
}
function generateYear() {
  let list: any = [];
  for (let i = Number(dayjs().year()) - 30; i <= Number(dayjs().year()); i++) {
    list.push({ label: i, value: i });
  }
  // 倒序
  list.reverse();
  return list;
}
function generateMonth() {
  let list: any = [];
  for (let i = 1; i <= 12; i++) {
    list.push({ label: i + "月", value: i });
  }
  return list;
}
function handleSelectionChange(val: table[]) {
  multipleSelection.value = val;
}

function goback() {
  router.go(-1);
}

function previous() {
  if (current.value > 1) {
    current.value = current.value - 1;
  }
  query();
}
function next() {
  if (current.value < total.value) {
    current.value = current.value + 1;
    console.log(current.value)
  }
  query();
}
</script>

<style>
.el-popper .el-select-dropdown__item span {
  font-size: 28px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  color: #333333;
  line-height: 0px;
  -webkit-background-clip: text;
}
</style>

<style lang="less" scoped>
.table_parent {
  position: relative;
}

/deep/ .selcet {
  .el-input__wrapper {
    background: none;
    box-shadow: none;
  }

  .el-input__inner {
    width: 80px;
    font-size: 28px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #333333;
    line-height: 0px;
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
  }

  .el-icon {
    width: 24.92px;
    height: 12px !important;
  }
}

.arrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 40px;
  width: calc(100% - 40px);
  padding: 0 20px;

  .arrow-previous,
  .arrow-next {
    &:active,
    &:checked {
      & span,
      .el-icon {
        color: #318800 !important;
      }
    }

    div {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    span {
      font-size: 26px;
      font-family: Source Han Sans CN-Bold, Source Han Sans CN;
      font-weight: bold;
      color: #666666;
      line-height: 0px;
      -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
    }
  }
}

.fz_1 {
  font-size: 30px !important;
  margin-left: 5px;
}

.margin_1 {
  margin-top: 100px;
}

.margin_2 {
  margin-top: 50px;
  margin-bottom: 100px;
}

.page {
  width: 1530px;
  // margin-left: 245px;
}

.top {
  margin-top: 40px;
  width: 1430px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/deep/ .table_content {
  margin-top: 40px;
  width: 1530px;
  height: 668px;
  background: #ffffff;
  border-radius: 20px 20px 20px 20px;
  opacity: 1;
  overflow: hidden;

  .tc_1 {
    // display: block;
    width: 227px;
    // background-color: #318800;
  }

  .tc_2 {
    width: 173px;
  }

  .tc_3 {
    width: 48px;
  }

  .tc_4 {
    width: 96px;
  }

  .tc_5 {
    width: 96px;
  }

  .tc_6 {
    width: 96px;
  }

  .tc_7 {
    width: 227px;
  }

  .tc_8 {
    width: 73px;
  }
  .tc_9 {
    width: 100px;
  }

  // background-color: red;
  .round {
    width: 10px;
    height: 10px;
    background: #ff7700;
    opacity: 1;
    border-radius: 50%;
    margin-right: 15px;
  }

  .table-text {
    font-size: 24px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    // line-height: 24px;
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
  }

  .el-table__cell {
    padding: 25px 0;
    text-align: center;
  }

  thead {
    .el-table__cell {
      font-size: 24px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      // font-weight: 500;
      color: #333333;
      // line-height: 0px;
      -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
    }
  }

  // 修改表格所有多选框的样式 start
  .el-table-column--selection {
    .cell {
      height: 34px;
    }
  }

  .el-checkbox__inner {
    width: 34px;
    height: 34px;

    &::after {
      border: 2px solid #fff;
      border-left: 0;
      border-top: 0;
      left: 10px;
      top: 10px;
    }
  }

  .el-checkbox__input.is-checked {
    .el-checkbox__inner {
      border-color: #318800;
      background-color: #318800;
    }

    .el-checkbox__inner::after {
      transform: rotate(50deg) scaleY(1.3);
    }
  }

  // 修改表格所有多选框的样式 end
}

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
