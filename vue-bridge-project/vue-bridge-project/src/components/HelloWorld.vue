<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <a href="javascript:;" v-on:click="getNetworkType()">获取网络类型</a>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },

  mounted() {
    const self = this;
    self.msg = 'xxx';
   /* this.$bridge.callhandler('Objc Echo',{'key':'value'},(data) => {
      self.msg = 'xxx';
      console.log("JS received response:",data);
    })*/
  },

  methods:{
    getNetworkType:function () {
      this.$bridge.callhandler('getNetworkType',{},function (responseCallback) {
        alert(responseCallback)
      })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
