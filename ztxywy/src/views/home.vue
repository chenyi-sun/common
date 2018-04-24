<style scoped>
    .index {
       position: relative;
        height: 432px;
    }
    .index-item {
        display: inline-block;
    }
    .left {
        width: 430px;
        height: 100%;
        background: #f00;
    }
    .middle {
        width: 380px;
        margin: 0 5px;
        height: 100%;
        background: #ff0;
        /*border: 1px solid #f00;*/
    }
    .right {
        width: 382px;
        height: 100%;
        background: #0f0;
        /*border: 1px solid #f00;*/
    }
</style>
<template>
    <div class="index">
        <ztx-nav></ztx-nav>
        <div class="left index-item">
            <div class="">111</div>
        </div>
        <div class="middle index-item">22</div>
        <div class="right index-item">33</div>
    </div>
</template>
<script>
    import ztxNav from '@/components/Nav'
    export default{
        data(){
            return{
                msg:'hello vue'
            }
        },
        mounted() {
            const self = this
            self.$watch(function () {
                return self.$store.getters.activeTabObj
            },function (v,b) {
                if(v === 'home') {
                    document.onkeydown = self.loadKeyDownEvent
                }
            })
        },
        methods: {
            loadKeyDownEvent() {
                console.log('home.vue')
            }
        },
        components: {
            ztxNav
        },
    }
</script>
