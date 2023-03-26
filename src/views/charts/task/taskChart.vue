<template>
  <div>
        <task-contrast></task-contrast>
        <task-gather></task-gather>
  </div>
</template>

<script>
import taskContrast from "./taskContrast.vue";
import taskGather from "./taskGather.vue";
export default {
  data() {
    return {};
  },

  components: {
    taskContrast,
    taskGather,
  },

  methods: {}
};
</script>

<style >

.taskCatherClass{
	width: 1200px;
	height: 260px;
	background: #eee;
	border: 1px solid #ccc;
	position: absolute;
	left: 100px;
	right: 100px;
	top: 60px;
	margin-left: -50px;
	margin-top: -50px;
	margin-bottom: 0px;
	/* 内部框框距离 */
      padding: 20px;

      //overflow-y: auto;
      bottom: 0px;
      /* background-color: rebeccapurple; */
}

.taskContrastClass {
    width: 1220px;
  	height: 290px;
  	background: #eee;
  	border: 1px solid #ccc;
  	position: absolute;
  	left: 100px;
  	top: 370px;
  	margin-left: -50px;
  	margin-top: -50px;
  	/* 内部框框距离 */
    padding: 10px;
    right: 0px;
    overflow-y: auto;
    bottom: 0px;
    /* background-color: rebeccapurple; */
}

</style>
