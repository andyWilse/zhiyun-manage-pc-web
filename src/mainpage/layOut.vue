<template>
  <div>
    <!-- 这里不使用驼峰，而使用横杠方便观看 -->
    <!-- 注意：AppHeader可以改写成 app-header,但是Appheader不能改写成 app-header-->
    <app-header></app-header>
    <app-navber></app-navber>
    <app-main></app-main>

  </div>
</template>

<script>
import AppHeader from "./AppHeader";
import AppNavber from "./AppNavber";
import AppMain from "./AppMain";
export default {
  data() {
    return {};
  },

  components: {
    AppHeader,
    AppNavber,
    AppMain
  },

  methods: {}
};
</script>

<style >
.header {
  position: absolute;
  line-height: 50px;
  background-color: #2d3a6b;
  top: 0px;
  left: 0px;
  right: 0px;
}
.navber {
  position: absolute;
  background-color: #545c64;
  top: 50px;
  left: 0px;
  bottom: 0px;
  width: 200px;
  /* 滚动条自动 */
  overflow-y: auto;
}
.main {
  position: absolute;
  left: 200px;
  /* 内部框框距离 */
  top: 50px;
  padding: 10px;
  right: 0px;
  overflow-y: auto;
  bottom: 0px;
  /* background-color: rebeccapurple; */
}
</style>
