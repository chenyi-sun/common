/**
 * Created by Struggle on 2017/9/11.
 * store中存入值
 */
'use strict'
const getters = {
    // 当前光标选择区域
    activeTabObj: state => state.app.activeTabObj,
    // 顶部菜单选中
    topNavActive: state => state.app.topNavActive
}
export default getters
