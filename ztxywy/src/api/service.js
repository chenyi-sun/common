/**
 * 机顶盒服务模块接口
 */
'use strict'

import * as action from '@/utils/pretreatment'

/**
 * 服务板块首页数据
 * @returns {*}
 */
export const getServiceIndex = () => {
    return action.$post('Service/index')
}

/**
 * 获取社区公告列表
 * @param param
 * param.page 分页
 * @returns {*}
 */
export const getNoticeList = param => {
    return action.$post('notify/index')
}
/**
 * 获取社区公告详情
 * @param param
 * param.id 公告id
 * @returns {*}
 */
export const getNoticeDetail = param => {
    return action.$get('notify/detail', param)
}

/**
 * 物业服务提交
 * @param param
 * param.phone 手机号
 * @returns {*}
 */
export const addAppoint = param => {
    return action.$post('Property/addAppoint', param)
}
/**
 * 获取房屋信息列表
 * @param param
 * param.type  1->出租房,2->找室友,3->找房源
 * param.page
 * @returns {*}
 */
export const getRentalHouse = param => {
    return action.$post('Rentalhouse/index', param)
}
/**
 * 二手物品列表
 * @param param
 *  * param.type  1->物品出售,2->物品求购
 * param.page 分页页码
 * param.pageSize 显示条数
 * @returns {*}
 */
export const getSecondHands = param => {
    return action.$post('Secondhands/index', param)
}

export const getConiphoneType = () => {
    return action.$post('Coniphone/index')
}

/**
 * 便民电话列表
 * @param param
 *  * param.type  1->物品出售,2->物品求购
 * param.id 分类id
 * param.page 分页页码
 * param.pageSize 显示条数
 * @returns {*}
 */
export const getNumberList = param => {
    return action.$post('Coniphone/numberlist', param)
}