/**
 * Created by Struggle on 2017/9/11.
 * 浪潮机顶盒类
 */
'use strict'

import GKMap from './GKMap'

class Inspur {
    constructor(){
        this.ptInst = iSTB
        this.player = this.ptInst.player
        this.GKMap = GKMap
        this.KMap = {
            '19':  {key: 19,  name: 'PLAY',         title: '播放'},
            '33':  {key: 33,  name: 'FASTBACKWARD', title: '快退'},
            '34':  {key: 34,  name: 'FASTFORWARD',  title: '快进'},
            '77':  {key: 77,  name: 'MUTE',         title: '静音'},
            '112': {key: 112, name: 'F1',           title: '红键'},
            '113': {key: 113, name: 'F2',           title: '黄键'},
            '114': {key: 114, name: 'F3',           title: '蓝键'},
            '115': {key: 115, name: 'F4',           title: '绿键'},
            '122': {key: 122, name: '*',            title: '*'},
            '123': {key: 123, name: '#',            title: '#'}
        }
    }

    bindKeyDown(event) {
        // document.addEventListener('keydown', event => {
            return this.mappingKey(event)
        // })
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
       return this.ptInst.settings.get( 'sys:ca0:cardnumber' ) || 0
    }

    /**
     * 获取mac地址
     * @returns {string}
     */
    getMacID() {
        return this.ptInst.settings.get( 'sys:ca0:stbid' )
    }

    /**
     * 设置播放器全屏
     */
    setFullPlayer() {
        this.player.set_video_window(0, 0, 1280, 720)
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
        this.player.set_video_window(x, y, width, height)
    }


    /**
     * 获取当前播放器的音量
     * @returns 0-31
     */
    getVolume() {
        return this.player.get_volume()
    }

    /**
     * 设置静音
     * @param type ? true : false
     */
    setMunt( type ) {
        type ? this.player.mute() : this.player.unmute()
        return type
    }
    /**
     * 播发视频
     * @param url
     */
    play(url) {
        if(!url) return
        this.player.play( url )
    }

    /**
     * 停止播放
     */
    stop() {
        this.player.stop()
    }

    /**
     * 关闭播发
     */
    close() {
        this.player.stop()
    }
    /**
     * 暂停播放
     */
    pause() {
        this.player.pause()
    }

    /**
     * 恢复播放
     */
    resume() {
        this.player.resume()
    }

    /**
     * 开启媒体
     */
    open( url ) {
        if(!url) return
        this.play(url)
    }

    eventCallBack() {
        this.ptInst.evt.set_event_callback('eventCallback');
    }
    /**
     * 中间介回调
     * @param opt
     */
    eventCallback(opt) {
        let {type, event_name, event_type, event_value} = opt
        switch ( event_name ) {
            case 'EVENT_NETWORK_STATUS ':
                break
            default:
                break
        }
    }
}
export default Inspur
