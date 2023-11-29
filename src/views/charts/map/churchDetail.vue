<template>
<div>
  <el-collapse v-model="activeNames"
               style="border:none;margin-left:30px;">
        <el-collapse-item name="1">
          <template slot="title">
            <p class="title">运行信息</p>
          </template>
          <div class="row"
               style="margin-top:18px;">
            <span>开关:{{on}}</span>
            <span style="margin-left:77px">亮度:{{light}}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <p class="title">设备信息</p>
          </template>
          <div class="row"
               style="margin-top:18px;">
            <p class="col_left">设备名称:{{devName}}</p>
            <p class="col_right">产品名称:{{prodName}}</p>
          </div>
          <div class="row"
               style="overflow:hidden">
            <p class="col_left">设备ID:{{devId}}</p>
            <p class="col_right">规格型号:{{modelId}}</p>
          </div>
        </el-collapse-item>
    </el-collapse>

</div>

</template>

<script>
export default {
  props: [''],
  data () {

    return {
      message: '来自子组件的消息',
      data:[],
      newsOperaArr:[{index:'01',itemText:'手动编辑新闻'},{index:'02',itemText:'添加新闻链接地址'}],
      on: "开",
            light: 100,
            devName: '虎牌双色灯',
            prodName: '双色灯',
            devId: 'M000012',
            modelId: '双色灯5045',
            activeNames: ['1']//默认展开几项['1', '2']
    }

  },
  created(){

  },

  methods: {
handleChange(){}
  },

}
</script>

<style scoped>
.church-con{
	    position: relative;
		border-radius: 20px 20px 0 0;
        		//position: fixed;
        		bottom: 0;
        		background-color: #FFFFFF;
        		width: 100vw;
        		//padding: 15px;
        		//padding-bottom: 25px;
	}


.title {
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #303133;
  padding-bottom: 17px;
  padding-top: 17px;
}
::v-deep .el-collapse-item__header.is-active {
  border-bottom: 1px dashed  #c8c8c8;
}
::v-deep .el-collapse-item__wrap {
  border: none;
}
p {
  margin: 0;
  padding: 0;
}
.row {
  overflow: hidden;
  margin-bottom: 22px;
}
.row .col_left {
  float: left;
  width: 420px;
}
.row .col_right {
  float: left;
}


</style>
