<template>
  <div>
        <map-chart></map-chart>
        <map-num></map-num>
  </div>
</template>

<script>
import mapNum from "./mapNum.vue";
import mapChart from "./mapChart.vue";
export default {
  data() {
    return {};
  },

  components: {
    mapNum,
    mapChart,
  },

  methods: {}
};
</script>

<style >

/*  #2d3a6b */
.eventChartClass {
  position: absolute;
  left: 0px;
  /* 内部框框距离 */
  top: 0px;
  padding: 10px;
  right: 0px;
  overflow-y: auto;
  bottom: 0px;
  /* background-color: rebeccapurple; */
}

.mapChartClass{
	width: 1360px;
	height: 100px;
	background: #eee;
	border: 1px solid #ccc;
	position: absolute;
	left: 0px;
	top: 0px;
	margin-left: -50px;
	margin-top: -50px;
}


.taskChartClass {
  position: absolute;
  right: 0px;
  /* 内部框框距离 */
  top: 0px;
  padding: 10px;
  right: 0px;
  overflow-y: auto;
  bottom: 0px;
  /* background-color: rebeccapurple; */
}

</style>
