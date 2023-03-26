<template>
  <div>
        <event-chart></event-chart>
        <task-chart></task-chart>
        <!-- <map-chart></map-chart> -->
  </div>
</template>

<script>
import eventChart from "./eventChart";
import taskChart from "./taskChart";
//import mapChart from "./mapChart";

export default {
  data() {
    return {};
  },

  components: {
    eventChart,
    taskChart,
    //mapChart,
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

.div1{
	width: 100px;
	height: 100px;
	background: #eee;
	border: 1px solid #ccc;
	position: absolute;
	left: 50%;top: 50%;
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
