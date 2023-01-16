<template>
  <div id="app">
    <!-- 路由的出入口，路由的内容将被显示在这里 -->
<!--    <router-view />-->
    <router-view></router-view>
<!--    <bottom v-show="this.$route.meta.show"></bottom>-->
    <router v-show="$route.meta.showFooter"></router>
  </div>
</template>

<script>
export default {
  name: 'App'
}

</script>


<!--
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
-->
