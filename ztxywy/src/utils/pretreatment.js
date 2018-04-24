/**
 * Created by Struggle on 2017/9/11.
 * fetch 预处理
 */
'use strict'
import fetch from '@/utils/fetch'
import qs from 'qs'

// 提交表单预处理函数
export const dataSubmit = ( option ) => {
    let { url, data, params, method } = option
    return new Promise((resolve, reject) => {
        data = qs.stringify(data)
        fetch({ url, data, params, method }).then(response => {
            const data = response.data
            if (data.code !== 200) {
               console.log(data.message)
            }
            resolve(data)
        }).catch(() => {
            reject()
        })
    })
}

export const $get  = (url, param) => {
    return dataSubmit({
        url: url,
        params: param,
        method: 'GET'
    })
}

export const $post  = (url, param) => {
    return dataSubmit({
        url: url,
        data: param,
        method: 'POST'
    })
}


