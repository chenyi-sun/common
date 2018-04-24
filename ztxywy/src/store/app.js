/**
 * Created by Struggle on 2017/9/11.
 * 项目中值的操作
 * 作为区分，以后可以扩展user或其他的单独文件
 * 此处放项目公共管理的数据
 */
'use strict'
import { tabList } from '@/utils/'

const app = {
    state: {
        activeTabObj: tabList.nav,
        topNavActive: 0
    },
    mutations: {
        // 设置页面光标选中
        SET_ACTIVE_TAB_OBJ: (state, val) => {
            state.activeTabObj = val
        },
        // 设置顶部菜单选中
        SET_TOP_NAV_ACTIVE: (state, val) => {
            state.topNavActive = val
        }

    },
    actions: {
        setActiveTabObj({ commit }) {
            commit('SET_ACTIVE_TAB_OBJ')
        },
        setTopNavActive({ commit }) {
            commit('SET_TOP_NAV_ACTIVE')
        }
    }
}

export default app
