<style >
    @import "../../assets/css/article.css";
</style>
<template>
    <div class="main">
        <div class="property_box">
            <img src="../../assets/img/service/property_icon.png" alt="" class="property_icon">
            <div class="property_explain" v-html="message">
                物业服务包括<ins>设施报修</ins>、<ins>房屋报修</ins>、<ins>管网报修</ins>、<ins>投诉建议</ins>、<ins>物业拜访</ins>等。
            </div>
            <input type="text" class="phone_box"  placeholder="手机号" v-model="phone">
            <p class="property_explain" style="top:320px;letter-spacing: 0">请填写您的手机号，我们将尽快与您取得联系。</p>
            <input type="submit" class="submit" value="确认提交" @click="submit">
        </div>
        <in-footer></in-footer>
    </div>
</template>
<script>
    import inFooter from '@/components/inFooter'
    import { addAppoint } from '@/api/service'
    import { Message } from 'element-ui'
    export default{
        data(){
            return{
                phone: '',
                message: '',
                type: ''
            }
        },
        mounted() {
            const self = this
            self.type = ~~self.$route.params.type
            switch (self.type) {
                case 1:
                    self.message = '家政服务包括<ins>保洁服务</ins>、<ins>洗护服务</ins>、<ins>油烟机清理</ins>、<ins>电器维修</ins>等。'
                    break;
                case 2:
                    self.message = '物业服务包括<ins>设施报修</ins>、<ins>房屋报修</ins>、<ins>管网报修</ins>、<ins>投诉建议</ins>、<ins>物业拜访</ins>等。'
                    break;
                case 3:
                    self.message = '快递服务包括<ins>快递代发</ins>、<ins>快递接收</ins>等。'
                    break;
            }
            self.$nextTick(function () {
               document.querySelector('.phone_box').focus()
            });
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
            },
            submit() {
                const self = this
                if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(self.phone))) {
                    self.$message({
                        message: '请填写正确的手机号！',
                        type: 'error'
                    })
                    return false
                }
                addAppoint({phone:self.phone,type: self.type}).then(() => {
                    self.$message({
                        message: '提交成功！',
                        type: 'success'
                    })
                })
            }
        },
        components: {
            inFooter
        },
    }
</script>
