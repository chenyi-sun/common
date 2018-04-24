/**
 * Created by Struggle on 2017/9/11.
 * 机顶盒菜单接口
 */
'use strict'

import * as action from '@/utils/pretreatment'
export const getMenu = param => {
    return action.$get('login/index', param)
}
