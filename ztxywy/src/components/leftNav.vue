<!-- 内页左侧菜单栏 -->
<style scoped>
</style>
<template>
    <div class="innerBox">
        <a v-for="(item, index) in menus"
           class="menu"
           href="javascript:;"
           v-show="item.isShow"
           :class="item.isActive ? activeClass : ''">{{ item.name }}</a>
    </div>
</template>
<script>
    //menu_active
    import { instanceSTB } from '@/utils/'
    const STB = new instanceSTB()

    export default{
        name: 'leftNav',
        props: {
            activeClass: String,
            id_name: String,
            activeIndex: {
                type: Number,
                default: 0
            },
            menus: {
                type: Array,
                required: true
            }
        },
        data(){
            return{
                maxActionLength: 0, // 最大选中长度
                isActionIndex: 0, // 键盘选中
                nowActionIndex: 0, // 当前选中
                showNum: 7 // 显示菜单个数
            }
        },
        mounted(){
            const self = this
            self.setMenus()
            // 判断当前光标区域是否在菜单栏
            if( self.$store.getters.activeTabObj === 'leftNav' ) {
                document.onkeydown = self.loadKeyDownEvent
            }
            // 监听光标区域，如果在菜单栏，则触发键盘事件
            self.$watch(function () {
                return self.$store.getters.activeTabObj
            },function (val) {
                if(val === 'leftNav') {
                    document.onkeydown = self.loadKeyDownEvent
                }
            })
        },
        methods: {
            setMenus() {
                const self = this
                // 当菜单列表中有值再进行下一步操作
                if(self.menus.length < 1) return false
                // 给数组添加额外属性
                self.menus.forEach(function (item, i) {
                    self.$set(self.menus[i], 'isActive', false)
                    self.$set(self.menus[i], 'isShow', false)
                })
                //设置最大长度
                self.maxActionLength = ~~self.menus.length - 1
                self.isActionIndex = self.nowActionIndex = self.activeIndex
                // 根据菜单长度显示菜单
                self.showMenus()
                // 设置菜单选中
                self.setActive(self.isActionIndex)
            },
            /**
             * 设置选中
             * @param index 传入被选中菜单下标， 默认取store中的值
             */
            setActive( index ){
                const self = this
                index = index || self.isActionIndex
                self.menus.forEach((item, i)=>{
                    item.isActive = false
                }, this)
                self.menus[index].isActive = true
            },
            // 键盘事件
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
                        break;
                    case 'RIGHT':
                        self.$store.commit('SET_ACTIVE_TAB_OBJ', 'rightContent')
                        break;
                    case 'ENTER':
                        self.nowActionIndex = self.isActionIndex
                        self.chooseMenus(self.menus[self.isActionIndex][self.id_name])
                        break;
                }
            },
            /**
             * 菜单显示
             * @param type up | down 上下选择
             */
            changeUD( type ){
                const self = this
                // 选中光标往上移
                if(type === 'up') {
                    // 当选中的光标已经在第一个菜单时，不做任何操作
                    if(self.isActionIndex <= 0) return
                    self.isActionIndex --
                    // 选中光标往右移
                }else if(type === 'down') {
                    // 当选中的光标不在最后一个菜单上时，光标往后移动一位
                    if(self.isActionIndex >= self.maxActionLength) return
                    self.isActionIndex ++
                }
                self.setActive(self.isActionIndex)
                self.showMenus()

            },
            // 根据当前选中的菜单显示菜单
            showMenus(){
                const self = this
                if(self.menus.length < 1) return false
                self.menus.forEach(function (item, i) {
                    // 当选择区域在0~显示菜单个数之间，只显示当前的菜单
                    if(self.isActionIndex >= 0 && self.isActionIndex < self.showNum) {
                        if(i >= 0 && i < self.showNum) {
                            item.isShow = true
                        }else {
                            item.isShow = false
                        }
                        // 当前选择的位置超过设置的显示菜单个数
                    }else if(self.isActionIndex >= self.showNum && self.isActionIndex < self.maxActionLength){
                        // 显示中间区域的菜单
                        if( i <= self.isActionIndex - self.showNum || i > self.isActionIndex) {
                            item.isShow = false
                        }else {
                            item.isShow = true
                        }
                        // 当前选择在最后一个菜单上
                    }else if(self.isActionIndex === self.maxActionLength) {
                        // 显示最后的设置个数的菜单
                        if(i > self.isActionIndex - self.showNum && i <= self.isActionIndex) {
                            item.isShow = true
                        }else {
                            item.isShow = false
                        }
                    }
                })
            },
            // 选择菜单
            chooseMenus( type_id ) {
                if(!type_id) return
                this.$emit('change-menu', type_id)
            }
        },
        watch: {
            menus(val) {
                const self = this
                if(val.length > 0) {
                    self.setMenus()
                }
            }
        }
    }
</script>
