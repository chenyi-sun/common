<style >
    @import "../../assets/css/article.css";
    @import "../../assets/css/notice.css";
</style>
<template>
    <div class="main">
        <div class="notice_box" v-show="!showDetail">
            <a href="javascript:;"
               class="notice_list"
               v-for="item in list"
                :class="{'notice-active': item.isActive}">
                <p class="notice_title">{{ item.title }}</p>
                <p class="notice_timeDate">{{ item.notice_time | parseTime }}</p>
            </a>

            <!--page页-->
            <div class="click_wrap">
               <!-- <a class="left-click before" href="javascript:;">上一页</a>
                <div class="page"><p class="currentNum">1</p>/<p class="total">1</p></div>
                <a class="right-click next" href="javascript:;">下一页</a>-->
                <pager v-show="list.length > 0"
                       :nowPage="page"
                       :total="total"
                       :pageSize="6"
                       @prev-page="changePage('prev')"
                       @next-page="changePage('next')"></pager>
            </div>

        </div>
        <div class="details_box" v-show="showDetail">
            <div class="title">{{ detail.title }}</div>
            <div class="timeDate">{{ detail.update_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
            <div class="text" v-html="detail.content"></div>
        </div>
        <in-footer></in-footer>
    </div>
</template>
<script>
    import inFooter from '@/components/inFooter'
    import Pager from '@/components/Pager'
    import { getNoticeList, getNoticeDetail } from '@/api/service'
    import { instanceSTB } from '@/utils/'
    const STB = new instanceSTB()
    export default{
        data(){
            return{
                list: [],
                total: 0,
                page: 1,
                detail: '',
                showDetail: false,
                maxActionLength: 0, //最大选中长度
                isActionIndex: 0 // 当前选中
            }
        },
        mounted() {
            const self = this
            if(self.$route.params.notice_id > 0) {
                self.getDetail(self.$route.params.notice_id)
            }
            self.getList()
            self.$store.commit('SET_ACTIVE_TAB_OBJ', 'rightContent')
            // 判断当前光标区域是否在菜单栏
            if( self.$store.getters.activeTabObj === 'rightContent' ) {
                document.onkeydown = self.loadKeyDownEvent
            }
            // 监听光标区域，如果在菜单栏，则触发键盘事件
            self.$watch(function () {
                return self.$store.getters.activeTabObj
            },function (val, oldVal) {
                if(val === 'rightContent' && self.$route.name === '通知公告') {
                    if(oldVal === 'pager') {
                        self.setActive(self.maxActionLength)
                    }else {
                        self.setActive(0)
                    }
                    document.onkeydown = self.loadKeyDownEvent
                }
            })
        },
        methods: {
            loadKeyDownEvent() {
                const self = this
                const event = event || window.event || arguments.callee.caller.arguments[0]
                const keyCodeName = STB.bindKeyDown(event).alias
                switch (keyCodeName) {
                    // 退格，返回
                    case 'BACKSPACE':
                        if(self.showDetail) {
                            self.showDetail = false
                            return false
                        }
                        break;
                    case 'UP':
                        self.changeUD('up')
                        break;
                    case 'DOWN':
                        self.changeUD('down')
                        break;
                    case 'LEFT':
                        self.unSetActive()
                        self.$store.commit('SET_ACTIVE_TAB_OBJ', 'leftNav')
                        break;
                    case 'RIGHT':
                        self.unSetActive()
                        self.$store.commit('SET_ACTIVE_TAB_OBJ', 'pager')
                        break;
                    case 'ENTER':
                        const id = self.list[self.isActionIndex].noticeid
                        if(id > 0) {
                            self.getDetail(id)
                        }
                        break;
                }
            },
            getList() {
                const self = this
                getNoticeList({
                    page: self.page
                }).then(data => {
                    self.total = ~~data.data.total
                    const list = data.data.list || []
                    list.forEach(function (item) {
                        item.isActive = false
                    }, this)
                    self.list = list
                    self.setActive(0)
                }).catch(() => {
                    self.list = []
                })
            },
            changePage( type ) {
                const self = this
                type = type || 'next'
                if (type === 'prev') {
                    self.page --
                }else if(type === 'next') {
                    self.page ++
                }
                self.getList()
            },
            /**
             * 上下移动光标
             * type: up, down
             */
            changeUD( type ) {
                const self = this
                // 向上按
                if(type === 'up') {
                    if(self.isActionIndex <= 0) return
                    self.isActionIndex --
                    // 向下按
                }else if(type === 'down') {
                    // 当选择向下超出范围
                    if(self.isActionIndex >= self.maxActionLength) {
                        // 选中切换到分页
                        self.unSetActive()
                        self.$store.commit('SET_ACTIVE_TAB_OBJ', 'pager')
                        return false
                    }
                    self.isActionIndex ++
                }
                self.setActive(self.isActionIndex)
            },
            setActive( index ){
                const self = this
                index = index || 0
                self.list.forEach((item, i)=>{
                    item.isActive = false
                }, this)
                self.isActionIndex = index
                self.list[index].isActive = true
            },
            unSetActive() {
                const self = this
                self.list.forEach((item, i)=>{
                    item.isActive = false
                }, this)
            },
            getDetail(id) {
                const self = this
                getNoticeDetail({id: id}).then(data => {
                    self.detail = data.data
                    self.$store.commit('SET_ACTIVE_TAB_OBJ', 'detail')
                    self.showDetail = true
                })
            }
        },
        components: {
            inFooter,
            Pager
        },
    }
</script>
