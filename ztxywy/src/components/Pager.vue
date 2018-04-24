<style scoped>

</style>
<template>
    <div class="num-box">
        <a href="javascript:;" class="left-click" :class="isActive === 'prev' ? 'page-active' : ''" @click="prevPage">上一页</a>
        <div class="page"><p class="nowpage">{{ nowPage }}</p>/<p class="totalpage">{{ totalPage }}</p></div>
        <a href="javascript:;" class="right-click" :class="isActive === 'next' ? 'page-active' : ''" @click="nextPage">下一页</a>
    </div>
</template>
<script>
    import { instanceSTB } from '@/utils/'
    const STB = new instanceSTB()
    export default{
        props: {
            nowPage: {
                type: Number,
                default: 0
            },
            total: {
                type: Number,
                default: 0
            },
            pageSize: {
                type: Number,
                default: 3
            }
        },
        data(){
            return {
                isActive: '',
                totalPage: 0
            }
        },
        created() {
            const self = this
            self.totalPage = Math.ceil(~~(self.total)/self.pageSize)
        },
        mounted(){
            const self = this
            self.$watch(function () {
                return self.$store.getters.activeTabObj
            },function (val, oldVal) {
                if(val === 'pager') {
                    // 如果是从左侧菜单进入右侧
                    self.isActive = 'next'
                    document.onkeydown = self.loadKeyDownEvent
                }
            })
        },
        methods: {
            // 上一页
            prevPage() {
                const self = this
                // 当前第一页的话，没有操作
                if(self.nowPage <= 1) return
                self.$emit('prev-page')
            },
            //下一页
            nextPage() {
                const self = this
                // 当前最后一页的话，没有操作
                if(self.nowPage >= self.totalPage) return
                self.$emit('next-page')
            },
            // 加载键盘事件
            loadKeyDownEvent() {
                const self = this
                const event = event || window.event || arguments.callee.caller.arguments[0]
                const keyCodeName = STB.bindKeyDown(event).alias
                switch (keyCodeName) {
                    case 'UP':
                        self.isActive = ''
                        self.$store.commit('SET_ACTIVE_TAB_OBJ', 'rightContent')
                        break;
                    case 'DOWN':
                        break;
                    case 'LEFT':
                        if(self.isActive === 'prev') return false
                        self.isActive = 'prev'
                        break;
                    case 'RIGHT':
                        if(self.isActive === 'next') return false
                        self.isActive = 'next'
                        break;
                    case 'ENTER':
                        if(self.isActive === 'next') {
                            self.nextPage()
                        }else if(self.isActive === 'prev') {
                            self.prevPage()
                        }
                        break;
                }
            }
        },
        watch: {
            total( val ) {
                const self = this
                self.totalPage = Math.ceil(~~(val)/self.pageSize)
            }
        }
    }
</script>
