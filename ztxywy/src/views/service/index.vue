<style scoped>

</style>
<template>
    <div>
        <ztx-nav></ztx-nav>
        <div class="innnerAll">
            <div class="innnerLeft">
                <div class="innnerLeft_banner">
                    <img src="../../../static/img/banner.png" alt="" style="width: 100%;height: 100%">
                </div>
                <div class="notic">
                    <div class="notic_con">
                        <router-link v-for="(item,key) in notice_list"
                                     :key="item.title"
                                     :to="{name: '通知公告',params: { notice_id: -1 }}"
                                     v-if="key < 3"
                                     :style="key === 1 ? 'top: 55px;height: 53px': key === 2 ? 'top:110px' : ''"
                                     class="tips">
                            <div class="square"
                            :style="key === 1 ? 'background: #e8355f;height: 53px': key === 2 ? 'background: #e49e37' : ''"></div>
                            <p>{{ item.title }}</p>
                        </router-link>
                       <!-- <a href="javascript:;" class="tips line" style="top: 55px;height: 53px">
                            <div class="square" style="background: #e8355f;height: 53px"></div>
                            <p>明日小区管道改造停水一天。</p>
                        </a>
                        <a href="javascript:;" class="tips" style="top:110px">
                            <div class="square" style="background: #e49e37"></div>
                            <p>明日小区管道改造停水一天。</p>
                        </a>-->
                    </div>
                    <div class="notic_more">
                        <router-link :to="{name: '通知公告',params: { notice_id: -1 }}" class="more">
                            查看全部公告
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="innnerRight">
                <router-link :to="item.href"
                             v-for="item in service_menus"
                             class="button_box button-border-2px-focus"
                             :key="item.name"
                            :style="item.style">
                    <img :src="item.img" :alt="item.img" class="button-border-1px-black-focus">
                </router-link>
            </div>
        </div>
        <div class="footer">
            <div class="slider">
                <a>智慧社区机顶盒上线啦！</a>
                <a>智慧社区机顶盒上线啦</a>
                <a>智慧社区机顶盒上线！</a>
                <a>智慧社区机顶盒上线</a>
            </div>
        </div>
    </div>

</template>
<script>
    import '@/assets/css/index.css'
    import { getServiceIndex } from '@/api/service'
    import ztxNav from '@/components/Nav'

    import icon1 from '../../../static/img/service/service_icon1.png'
    import icon2 from '../../../static/img/service/service_icon2.png'
    import icon3 from '../../../static/img/service/service_icon3.png'
    import icon4 from '../../../static/img/service/service_icon4.png'
    import icon5 from '../../../static/img/service/service_icon5.png'
    import icon6 from '../../../static/img/service/service_icon6.png'

    export default{
        data(){
            return{
                notice_list: [],
                service_menus: [
                    {'name': '家政服务', href: { name: '家政服务', params: { type: 1 }} ,'img': icon1,style: ''},
                    {'name': '物业服务', href: { name: '物业服务', params: { type: 2 }} ,'img': icon2,style: 'left: 224px'},
                    {'name': '房屋出租', href: { name: '房屋出租'} ,'img': icon3,style: 'left: 449px'},
                    {'name': '快递服务', href: { name: '快递服务', params: { type: 3 }} ,'img': icon4,style: 'bottom: 0'},
                    {'name': '便民电话', href: { name: '便民电话' },'img': icon5,style: 'left: 224px;bottom: 0'},
                    {'name': '二手物品', href: { name: '二手物品'} ,'img': icon6,style: 'left: 449px;bottom: 0'}
                ]
            }
        },
        mounted() {
            const self = this
            self.getData()
            self.$watch(function () {
                return self.$store.getters.activeTabObj
            },function (v,b) {
                if(v === 'home') {
                    document.onkeydown = self.loadKeyDownEvent
                }
            })
            self.$nextTick(function () {
                document.querySelector('.button-border-2px-focus').focus()
            })
        },
        methods: {
            getData() {
                const self = this
                getServiceIndex().then(data => {
                    self.notice_list = data.data.notifyList
                })
            },
            loadKeyDownEvent() {
                console.log('home.vue')
            }
        },
        components: {
            ztxNav
        },
    }
</script>
