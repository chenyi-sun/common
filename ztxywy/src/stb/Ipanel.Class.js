/**
 * Created by Struggle on 2017/9/11.
 * 茁壮机顶盒类
 */
'use strict'

import GKMap from './GKMap'
import { getMediaType } from '@/utils/'

class iPanel {
    constructor(){
        this.ptInst = iPanel
        this.player = media.AV
        this.video = media.video
        this.GKMap = GKMap
        this.KMap = {}
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
        return
    }

    /**
     * 设置播放器全屏
     */
    setFullPlayer() {
        this.video.fullScreen()
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
        this.video.setPosition(x, y, width, height)
    }


    /**
     * 获取当前播放器的音量
     * @returns 0-31
     */
    getVolume() {
        // return this.player.get_volume()
    }

    /**
     * 设置静音
     * @param type ? true : false
     */
    setMunt( type ) {
        // type ? this.player.mute() : this.player.unmute()
        // return type
    }
    /**
     * 播发视频
     * @param url
     */
    play(url) {
        this.player.play()
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
        this.player.close()
        DVB.stopAV()
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
        const mt = getMediaType(url)
        this.changePlayMode(url)
        this.player.open(url, mt)
        document.onsystemevent = this.grabEvent
    }
    changePlayMode(url) {
        let vod_mode = ''
        if (typeof(url)!="undefined"){
            if(url.indexOf("isIpqam=")!= -1){
                if( url.indexOf("isIpqam=1")!= -1){
                    vod_mode = "DVB";
                }else{
                    vod_mode = "IP";
                }
            }else{
                if( url.indexOf(".ts")!= -1){
                    vod_mode = "DVB";
                }else{
                    vod_mode = "IP";
                }
            }
        }
        try{
            if(this.ptInst) {
                if (typeof iPanel.eventFrame.service_mode_change == "function") {
                    iPanel.eventFrame.service_mode_change(vod_mode);
                } else {
                    if (vod_mode == "DVB") {
                        VOD.changeServer("isma_v2", "dvb");
                    } else {
                        VOD.changeServer("sihua_3rd", "ip");
                    }
                }
            }
        }catch(e){console.log(e);}
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
    grabEvent(event){
    var eventCode = event.which;
    switch(eventCode){
        // 准备播放媒体成功
        case 5202:
            document.querySelector('#msg').innerHTML = '播放成功'
            media.AV.play();
            document.querySelector('#msg').innerHTML = typeof iPanel.eventFrame.service_mode_change
//                return 0;
            break;
        default:
            return 1;
    }
}

}

export default iPanel
