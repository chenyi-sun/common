/**
 * Created by Struggle on 2017/9/11.
 * 设置store
 */
'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import app from './app'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app
    },
    getters
})