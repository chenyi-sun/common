<style >
    @import "../../assets/css/article.css";
</style>
<template>
    <div class="main">
        <div class="buildings_box">
            <div class="left">
                <left-nav :menus="type"
                          activeClass="menu_active"
                          id_name="type"
                          @change-menu="changeMenu"></left-nav>
               <!-- <div class="innerBox">
                    <a v-for="item in type" class="menu" href="javascript:;"
                       @click="getList(item.type)">{{ item.name }}</a>
                    &lt;!&ndash;<a class="menu buildings_menu menu_active" href="javascript:;">找室友</a>&ndash;&gt;
                </div>-->
            </div>
            <div class="right">
                <div class="right-inner-1 right_inner show">
                    <a v-for="(item,index) in list"
                       href="javascript:;"
                       :class="{'middle_seat': index === 1,'right_seat': index === 2, 'img-list-active': item.isActive}"
                       :style="item.isActive ? index === 1 ? 'left: 348px;': index === 2 ? 'left: 670px;' : '' : ''"
                       class="pic-box" >
                        <img :src="item.photo[0]" alt="" class="img" />
                        <div class="buildings_content">
                            <p class="title">{{ item.title }}</p>
                            <p class="buildings_money"><span class="buildings">{{ item.apartment.room }}室{{ item.apartment.hall }}厅</span><span class="money">{{ item.rent }}元/月</span></p>
                            <p class="contact"><span class="name">{{ item.landlord }}</span><span class="tellNumber">{{ item.mobile }}</span></p>
                        </div>
                    </a>
                </div>
                <!-- page页 -->
                <pager v-show="list.length > 0" :nowPage="page" :total="total" :pageSize="3" @prev-page="changePage('prev')" @next-page="changePage('next')"></pager>
            </div>
        </div>
        <in-footer></in-footer>
    </div>
</template>
<script>
    import inFooter from '@/components/inFooter'
    import Pager from '@/components/Pager'
    import leftNav from '@/components/leftNav'
    import { getRentalHouse } from '@/api/service'
    import { instanceSTB } from '@/utils/'
    const STB = new instanceSTB()
    export default{
        data(){
            return{
                type: [
                    {name: '出租房', type: 1},
                    {name: '找室友', type: 2},
                    {name: '找房源', type: 3}
                ],
                type_id: 1,
                list: [],
                total: 0,
                page: 1,
                maxActionLength: 0, //最大选中长度
                isActionIndex: 0 // 当前选中
            }
        },
        mounted() {
            const self = this
            self.$store.commit('SET_ACTIVE_TAB_OBJ', 'leftNav')
            // 判断当前光标区域是否在菜单栏
            if( self.$store.getters.activeTabObj === 'rightContent' ) {
                document.onkeydown = self.loadKeyDownEvent
            }
            self.$watch(function () {
                return self.$store.getters.activeTabObj
            },function (val, oldVal) {
                if(val === 'rightContent' && self.$route.name === '房屋出租') {
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
            self.getList(self.type[0].type)
        },
        methods: {
            loadKeyDownEvent() {
                const self = this
                const event = event || window.event || arguments.callee.caller.arguments[0]
                const keyCodeName = STB.bindKeyDown(event).alias
                switch (keyCodeName) {
                    case 'UP':
                        self.$store.commit('SET_ACTIVE_TAB_OBJ', 'leftNav')
                        self.unSetActive()
                        break;
                    case 'DOWN':
                        self.unSetActive()
                        self.$store.commit('SET_ACTIVE_TAB_OBJ', 'pager')
                        break;
                    case 'LEFT':
                        self.changeLR('left')
                        break;
                    case 'RIGHT':
                        self.changeLR('right')
                        break;
                    case 'ENTER':
                        break;
                }
            },
            getList(type_id) {
                const self = this
                if(!!type_id) {
                    self.type_id = type_id
                    self.page = 1
                }
                getRentalHouse({
                    type: self.type_id,
                    page: self.page,
                    pageSize: 3
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
             * 左右移动光标
             * type: left, right
             */
            changeLR( type ) {
                const self = this
                // 向左按
                if(type === 'left') {
                    if(self.isActionIndex <= 0) {
                        self.unSetActive()
                        self.$store.commit('SET_ACTIVE_TAB_OBJ', 'leftNav')
                        return false
                    }
                    self.isActionIndex --
                    // 向右按
                }else if(type === 'right') {
                    if(self.isActionIndex >= self.maxActionLength) {
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
