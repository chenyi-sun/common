<template>
  <div id="app" class="box">
    <div class="box-home">
      <ztx-header :title="title"></ztx-header>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { tabList } from './utils/'
  import ztxHeader from './components/Head.vue'
  export default {
      name: 'app',
      data(){
          return {
              title: '智慧社区'
          }
      },
      mounted() {
          const self = this
          self.getMenus()
      },
      methods:{
          getMenus() {
              const self = this

          }
      },
      components: {
          ztxHeader
      },
      watch: {
          activeTabObj(v,a) {
//              console.log(v)
          }
      }
  }
</script>
