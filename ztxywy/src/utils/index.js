/**
 * Created by Struggle on 2017/9/11.
 * 常用方法
 */
'use strict'

import Inspur from '@/stb/Inspur.Class'
import EVM from '@/stb/EVM.Class'
import iPanel from '@/stb/Ipanel.Class'
import PC from '@/stb/PC.Class'

const ua = navigator.userAgent.toLowerCase()

export const tabList = {
    "nav":"nav", // 菜单
    "leftNav":"leftNav", //左侧菜单
    "pager":"pager", // 分页
    "rightContent":"rightContent", // 内页右侧内容
    "video": "video-play"
}

/**
 * 获取浏览器类型
 * @returns {string}
 */
export function browserType() {
    return /ipanel/.test( ua ) ? 'iPanel' //茁壮网络
            : /enrich/.test( ua ) ? 'EVM' //英立视数码电视集团
            : /wobox/.test( ua ) ? 'Inspur' //浪潮集团
            : /version\/(\S+)/.test(ua) ? 'Safari'
            : /opera/.test( ua ) ? 'Opera'
            : /chrome\/(\S+)/.test( ua ) ? 'Chrome'
            : /mozilla/.test( ua ) && !/msie/.test( ua ) ? 'Mozilla'
            : ''
}

/**
 * 初始化机顶盒中间件
 */
export function instanceSTB() {
    const type = browserType().toLowerCase()
    switch ( type ) {
        case 'ipanel':
            return new iPanel()
            break
        case 'evm':
            return new EVM()
            break
        case 'inspur':
            return new Inspur()
            break
        default:
            return new PC()
            break
    }
}

/**
 * 获取视频类型
 * @param url
 */
export function getMediaType(url) {
    if(!url) return
    const proto = ( url.match(/.*:\/\//) + '' ).replace('://', '').toLowerCase()
    let mt = ''
    switch (proto) {
        case 'ngod':
        case 'rtsp': mt = 'VOD'; break;
        case 'c4cam_live':
        case 'https':
        case 'http': mt = 'HTTP'; break;
        case 'delivery': mt = 'DVB'; break;
        case 'udp': mt = "IP-UDP"; break;
        case 'igmp': mt = 'LiveTV'; break;
        case 'file': mt = 'FILE'; break;
    }
    return
}

/**
 * 格式化时间
 * @param cFormat 返回日期格式
 * {y}->年,{m}->月,{d}->日,{h}->时,{i}->分,{s}->秒,{a}->星期
 * @param time 传入时间戳，没有默认取当前时间
 * @returns {string}
 */
export function parseTime(cFormat, time ) {
    time = time || new Date()
    const format = cFormat || '{y}-{m}-{d} {h}:{i}'
    let date

    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}