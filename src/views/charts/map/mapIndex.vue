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

</style>
