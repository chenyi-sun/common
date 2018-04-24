<style >
    @import "../../assets/css/article.css";
</style>
<template>
    <div class="main">
        <div class="content_box">
            <div class="left">
                <left-nav :menus="type"
                          activeClass="menu_active"
                          id_name="type"
                          @change-menu="changeMenu"></left-nav>
            </div>
            <div class="right">
                <div class="right-inner-2 right-inner no-height">
                    <div v-for="(item, index) in list" href="javascript:;"
                       class="list"
                       :class="{'list-active': item.isActive}">
                        <p class="text">{{ item.name }}</p>
                        <p class="timeDate">{{ item.number }}</p>
                    </div>
                </div>
                <!-- page页 -->
                <pager v-show="list.length > 0" :nowPage="page" :total="total" :pageSize="pageSize" @prev-page="changePage('prev')" @next-page="changePage('next')"></pager>
            </div>
        </div>
        <in-footer></in-footer>
    </div>
</template>
<script>
    import inFooter from '@/components/inFooter'
    import Pager from '@/components/Pager'
    import leftNav from '@/components/leftNav'
    import { getConiphoneType, getNumberList } from '@/api/service'
    import { instanceSTB } from '@/utils/'
    const STB = new instanceSTB()
    export default{
        data(){
            return{
                type: [],
                list: [],
                total: 0,
                page: 1,
                pageSize: 6,
                maxActionLength: 0, //最大选中长度
                isActionIndex: 0 // 当前选中
            }
        },
        mounted() {
            const self = this
            self.getTypeList()
            self.$store.commit('SET_ACTIVE_TAB_OBJ', 'leftNav')
            // 判断当前光标区域是否在菜单栏
            if( self.$store.getters.activeTabObj === 'rightContent' ) {
                document.onkeydown = self.loadKeyDownEvent
            }
            // 监听光标区域，如果在菜单栏，则触发键盘事件
            self.$watch(function () {
                return self.$store.getters.activeTabObj
            },function (val, oldVal) {
                if(val === 'rightContent' && self.$route.name === '便民电话') {
                    // 如果是从左侧菜单进入右侧
                    if(oldVal === 'leftNav') {
                        // 判断当前展示模版类型
                        self.setActive(0)
                        // 如果从分页回到右侧
                    }else if(oldVal === 'pager') {
                        self.setActive(self.maxActionLength)
                    }
                    document.onkeydown = self.loadKeyDownEvent
                }
            })
//            self.getList(self.type[0].type)
        },
        methods: {
            loadKeyDownEvent() {
                const self = this
                const event = event || window.event || arguments.callee.caller.arguments[0]
                const keyCodeName = STB.bindKeyDown(event).alias
                switch (keyCodeName) {
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
                        break;
                }
            },
            getTypeList() {
                const self = this
                getConiphoneType().then(data => {
                    const list = data.data || []
                    if(list.length > 0) {
                        self.type = []
                        list.forEach(function (item, i) {
                            self.type.push(
                                {name: item.name, type: item.id}
                            )
                        },this)
                        self.getList(list[0].id)
                    }
                }).catch(() => {
                    self.list = []
                })
            },
            getList(type_id) {
                const self = this
                // 如果接收到参数type_id
                if(!!type_id) {
                    self.type_id = type_id
                    self.page = 1
                }
                getNumberList({
                    id: self.type_id,
                    page: self.page,
                    pageSize: self.pageSize
                }).then(data => {
                    self.total = ~~data.data.total
                    const list = data.data.list || []
                    list.forEach(function (item) {
                        item.isActive = false
                        item.photo = item.photo || []
                    }, this)
                    self.list = list
                    self.maxActionLength = ~~list.length - 1
                }).catch(() => {
                    self.list = []
                })
            },
            changeMenu( type_id ) {
                const self = this
                if(!type_id) return
                self.getList(type_id)
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
            }
        },
        components: {
            inFooter,
            Pager,
            leftNav
        },
    }
</script>
