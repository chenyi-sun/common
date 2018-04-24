/**
 * Created by Struggle on 2017/9/11.
 * PC端 模拟
 */
'use strict'

import GKMap from './GKMap'

class PC {
    constructor() {
        this.ptInst = null
        this.GKMap = GKMap
        this.KMap = {}
    }

    bindKeyDown(event) {
        return this.mappingKey( event )
    }


    mappingKey(event) {
        const key = event.keyCode || event.which;
        let map = [];
        // 先找子类映射表
        if (this.KMap) map = this.KMap;
        // 找不到则尝试找基类映射表
        if (!map[key] && this.GKMap) map = this.GKMap;
        // 找到则返回映射数据
        if (map[key]) return {keyCode: map[key].key, alias: map[key].name, aliasAlt: map[key].title}

        // 找不到则返回默认数据
        return {keyCode: key, alias: String.fromCharCode(key), aliasAlt: '未映射'}
    }

    /**
     * 获取智能卡号
     * @returns {string}
     */
    getCardSN() {
        return '100012000'
    }

    /**
     * 获取mac地址
     * @returns {string}
     */
    getMacID() {

    }

    /**
     * 设置播放器全屏
     */
    setFullPlayer() {

    }

    /**
     * 设置播放器窗口大小，默认全屏
     * @param opt
     * @param opt.x 播放器起始位置x轴坐标
     * @param opt.y 播放器起始位置y轴坐标
     * @param opt.width 播放器宽度
     * @param opt.height 播放器高度
     */
    setPlayerSize(opt) {

    }


    /**
     * 获取当前播放器的音量
     * @returns 0-31
     */
    getVolume() {

    }

    /**
     * 设置静音
     * @param type ? true : false
     */
    setMunt(type) {

    }

    /**
     * 播发视频
     * @param url
     */
    play(url) {

    }

    /**
     * 停止播放
     */
    stop() {

    }

    /**
     * 关闭播发
     */
    close() {

    }

    /**
     * 暂停播放
     */
    pasuse() {

    }

    /**
     * 恢复播放
     */
    resume() {

    }

    /**
     * 开启媒体
     */
    open( url ) {

    }

    eventCallback() {

    }

}
export default PC
