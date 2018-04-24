<style scoped>
    nav {
        width: 100%;
        margin-top: 18px;
        height: 60px;
        line-height: 60px;
        border-top: 1px solid #4d97de;
        border-bottom: 1px solid #4d97de;
        background: url("../assets/img/nav.png") no-repeat center center;
        overflow: hidden;
    }
    nav ul {
        width: 2000px;
    }
    nav .top-nav-item {
        width: 145px;
        text-align: center;
        margin-right: 23px;
        float: left;
    }
    nav .top-nav-item a {
        font-size: 28px;
        font-weight: 500;
        color: rgba(154, 194, 225, 0.7);
    }
    nav .top-nav-item:focus,
    nav .top-nav-item.active {
        background: url("../assets/img/nav_active.png") no-repeat bottom center;
        background-size: cover;
    }
    nav .top-nav-item:focus a,
    nav .top-nav-item.active a{
        color: #f0f0f0;
    }
</style>
<template>
    <nav class="nav">
        <ul class="top-nav clearfix">
            <li class="top-nav-item" v-for="item in menus">
                <a :href="item.href">{{ item.title }}</a>
            </li>
        </ul>
    </nav>
</template>
<script>
    const menus = [
        {
            title: '我的首页',
            href: 'javascript:;'
        },
        {
            title: '智慧党建',
            href: 'javascript:;'
        },
        {
            title: '政务公开',
            href: 'javascript:;'
        },
        {
            title: '社区服务',
            href: 'javascript:;'
        },
        {
            title: '居家养老',
            href: 'javascript:;'
        },
        {
            title: '少儿教育',
            href: 'javascript:;'
        },
        {
            title: '三农服务',
            href: 'javascript:;'
        },
        {
            title: '交',
            href: 'javascript:;'
        }
    ]
    export default{
        props: {
            menus: {
                type: Array,
                default(){
                    return menus
                }
            }
        },
        data(){
            return{
                time: '0000-00-00 00:00'
            }
        },
        mounted(){
            const self = this
        },
        methods: {

        }
    }
</script>
