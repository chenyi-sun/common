/**
 * Created by Struggle on 2017/9/11.
 * 路由设置
 */
'use strict'
import Vue from 'vue'
import Router from 'vue-router'

import Hello from '@/components/Hello'
/*const _import = require('./_import_' + process.env.NODE_ENV)*/

import Home from '@/views/home'

// 社区服务
import Service from '@/views/service/index'
import Property from '@/views/service/service'
import House from '@/views/service/house'
import secondHands from '@/views/service/secondHands'
import coniphone from '@/views/service/coniphone'
import notice from '@/views/service/notify'

Vue.use(Router)


const routes = [
    {
        path: '/',
        component: Home,
        redirect: '/service',
        name: '我的首页'
    },
    {
        path: '/party',
        component: Hello,
        name: '智慧党建'
    },
    {
        path: '/service',
        component: Service,
        name: '社区服务',
    },
    {
        path: '/service/property/:type',
        component: Property,
        name: '家政服务',
    },
    {
        path: '/service/property/:type',
        component: Property,
        name: '物业服务',
    },
    {
        path: '/service/property/:type',
        component: Property,
        name: '快递服务',
    },
    {
        path: '/service/house',
        component: House,
        name: '房屋出租',
    },
    {
        path: '/service/coniphone',
        component: coniphone,
        name: '便民电话',
    },
    {
        path: '/service/secondHands',
        component: secondHands,
        name: '二手物品',
    },
    {
        path: '/service/notice/:notice_id',
        component: notice,
        name: '通知公告',
    }
]

export default new Router({
    routes
})
