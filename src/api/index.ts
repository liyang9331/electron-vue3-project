import request from "@/api/request";

// // 测试api
export function rubbish(data: any) {
    return request({
        url: 'https://api.oioweb.cn/api/ai/rubbish',
        method: 'post',
        data
    })
}

// 卡片识别
export function cardRecognition(data: any) {
    return request({
        url: '/client/device/cardRecognition',
        method: 'post',
        data
    })
}

// 打开串口
export function openSerial(data: any) {
    return request({
        url: '/client/device/openSerial',
        method: 'post',
        data
    })
}


// 圈存操作
export function entrap(data: any){
    return request({
        url: '/client/device/entrap',
        method: 'post',
        data
    })
}

// 查询卡片信息
export function queryCardInfo(data: any){
    return request({
        url: '/client/device/queryCardInfo',
        method: 'post',
        data
    })
}

// 查询充值记录
export function queryUserPayRecord(data: any){
    return request({
        url: '/client/device/queryUserPayRecord',
        method: 'post',
        data
    })
}

// 查询待圈存
export function queryWaitEntrap(data: any){
    return request({
        url: '/client/device/queryWaitEntrap',
        method: 'post',
        data
    })
}

// 测试推送卡片信息
export function testCode(params: any){
    return request({
        url: '/client/device/queryUserPayRecord',
        method: 'get',
        params
    })
}

// 打印
export function printFile(data: any){
    return request({
        url: '/client/device/printFile',
        method: 'post',
        data
    })
}

// 生成支付银行二维码
export function generateQrcode(data: any){
    return request({
        url: '/client/device/generateQrcode',
        method: 'post',
        data
    })
}

// 模拟银行支付推送
export function wsSend(params: any){
    return request({
        url: '/client/device/wsSend',
        method: 'get',
        params
    })
}

// 账单导入
export function billLoad(data: any){
    return request({
        url: '/client/device/bill/load',
        method: 'post',
        data
    })
}

// 字典值
export function dict(code: any){
    return request({
        url: '/client/device/getDictItems/'+code,
        method: 'get',
    })
}