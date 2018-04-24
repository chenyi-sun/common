<style scoped>
    header {
        height: 34px;
        line-height: 34px;
    }
    header .head  {
        float: left;
        width: 33.3%;
        color: #f1f1f1;
    }

    header .logo {
        font-weight: 600;
        font-size: 36px;
        letter-spacing: 2px;
    }
    header .time,
    header .weather {
        font-size: 24px;
        font-weight: 500;
    }
    header .time {
        text-align: center;
    }
    header .weather {
        text-align: right;
    }
</style>
<template>
    <header class="clearfix">
        <div class="head logo">{{ title }}</div>
        <div class="head time">{{ time }}</div>
        <div class="head weather">{{ weather }}</div>
    </header>
</template>
<script>
    const title = '智慧社区'
    const weather = '多云  25~30°'
    import { parseTime } from '@/utils/'
    export default{
        props: {
            title: {
                type: String,
                default: title
            },
            weather: {
                type: String,
                default: weather
            }
        },
        data(){
            return{
                time: '0000-00-00 00:00'
            }
        },
        mounted(){
            const self = this
            self.getTime()
        },
        methods: {
            getTime() {
                const self = this
                self.time = parseTime()
                setTimeout(self.getTime,1000)
            }
        }
    }
</script>
