/**
 * Created by Struggle on 2017/9/11.
 * 英立视机顶盒类
 */
'use strict'

import GKMap from './GKMap'

class EVM {
    constructor(){
        this.ptInst = new EnReach()
        this.GKMap = GKMap
        this.KMap = {
            '83':  {key: 83,  name: '*',  title: '*'},
            '832': {key: 112, name: 'F1', title: '红键'},
            '833': {key: 113, name: 'F2', title: '黄键'},
            '834': {key: 114, name: 'F3', title: '蓝键'},
            '835': {key: 115, name: 'F4', title: '绿键'},
            '193': {key: 123, name: '#',  title: '#'}
        }
    }

    /**
     * 绑定键盘事件
     * @param event
     * @returns {{keyCode, alias, aliasAlt}|*}
     */
    bindKeyDown(event) {
        return this.mappingKey(event)
    }

    /**
     * 键盘映射
     * @param event
     * @returns {*}
     */
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
       return this.ptInst.GetSTBID() || 0
    }

    /**
     * 获取mac地址
     * @returns {string}
     */
    getMacID() {
        return this.ptInst.GetMACAddress()
    }

    /**
     * 设置播放器全屏
     */
    setFullPlayer() {
        this.ptInst.set_video_window(0, 0, 1280, 720)
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
        let {x, y, width, height} = opt
        this.ptInst.set_video_window(x, y, width, height)
    }


    /**
     * 获取当前播放器的音量
     * @returns 0-31
     */
    getVolume() {
        return this.ptInst.getVolume()
    }

    /**
     * 设置静音
     * @param type ? true : false
     */
    setMunt( type ) {
        type ? this.player.audioMute() : this.player.audioUnmute()
        return type
    }
    /**
     * 播发视频
     * @param url
     */
    play() {
        this.ptInst.play()
    }

    /**
     * 停止播放
     */
    stop() {
        this.ptInst.stop()
    }

    /**
     * 关闭播发
     */
    close() {
        this.ptInst.releasePlayerInstance()
    }
    /**
     * 暂停播放
     * type: 1:显示最后一帧，2:黑屏
     */
    pause( type ) {
        this.ptInst.pause( type == 1 ? 1 : 0 )
    }

    /**
     * 恢复播放
     */
    resume() {
        // this.player.resume()
    }

    /**
     * 开启媒体
     */
    open( url ) {
        this.ptInst.source = url
    }

    eventCallBack() {

    }
}
export default EVM
