<template>
    <div class="eventTwoClass">
        <div ref="lineChart" class="lineChartClass" style="width: 1210px; height: 220px;left: 0px;right: 0px;top:45px;"></div>

        <div class="left" style="position: absolute;top:10px;left: 10px;">
            <img class="icon" src="/image/icon014.png" style="height: 15px;margin-right: 5px;" />
        </div>
        <div class="name" style="position: absolute;top:10px;left: 30px;height: 20px;">预警事件趋势图</div>
        <div class="day" style="position: absolute;top:10px;left: 1060px;height: 20px;">
             <el-button  round icon="el-icon-tian" @click="searchByHand('day')" style="width: 30px;left:0;padding: 2px;text-align:justify;height: 28px;">
                   <span>日</span>
             </el-button>
         </div>
         <div class="month" style="position: absolute;top:10px;left: 1110px;height: 20px;">
              <el-button  round icon="el-icon-tian" @click="searchByHand('month')" style="width: 30px;left:0;padding: 2px;text-align:justify;height: 28px;">
                    <span>月</span>
              </el-button>
         </div>
         <div class="week" style="position: absolute;top:10px;left: 1160px;height: 20px;">
              <el-button  round icon="el-icon-tian" @click="searchByHand('week')" style="width: 30px;left:0;padding: 2px;text-align:justify;height: 28px;">
                    <span>周</span>
              </el-button>
         </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'

  export default {
    data() {
        return {
            searchName: "",
            dateType: "day",
        };
    },
    mounted() {
        this.getZxtGather("day");
    },
    created() {
    },
    methods: {
        searchByHand(type){
            this.getZxtGather(type);
        },
        getZxtGather(dateType) {
            this.$axios.get('/event/zxt/eventGather',
                {params: {dateType:dateType,}
             }).then(successResponse => {
                   if (successResponse.data.code === 200) {
                        let result=successResponse.data.result;
                        this.initChart(result);
                   }else{
                         let message=successResponse.data.message;
                         this.$message({message: message,type: 'error'});
                   }
         })
      },
      //图表
      initChart(result){
          var XData = [];
          var SDataFire = [];
          var SDataFace = [];
          var SDataCrowd = [];
          for (var i = 0; i < result.length; i++) {
              var item = result[i];
              XData.push(item.date);
              SDataFire.push(item.fire);//01-火灾预警
              SDataFace.push(item.face);//02-人脸识别
              SDataCrowd.push(item.crowd);//04-人流聚集
          }
        this.lineChart = echarts.init(this.$refs.lineChart);
        this.lineChart.setOption({
            title: {
                text: '',
                "textStyle": {
                    "fontSize": 13
                }
            },
            // 提示框
            tooltip: {
                triggerOn: 'click',
                enterable: true
            },
            // 图例
            legend: {
                    icon: '',
                      left: 'right',
                      top: 0,
                      data: ['人脸', '人流', '火灾'],
                      "textStyle": {
                          "fontSize": 8
                },
            },
            grid: {
                left: '3%',
                right: '5%',
                bottom: '3%',
                containLabel: true
            },
            // 工具栏
            toolbox: {
            },
            xAxis: {
                type: 'category',
                //type: 'time',
                boundaryGap: false,
                data: XData,
                "textStyle": {
                      "fontSize": 3
                }
            },
            yAxis: {
                type: 'value',
                min:0,
                max:60,
                interval:20,
                data: ['0', '20', '40', '60', '80']
            },
            series: [
                {
                    name: '人脸',
                    type: 'line',
                    // smooth: true, // 平滑曲线显示
                    data:SDataFace
                },
                {
                    name: '人流',
                    type: 'line',
                    // smooth: true,
                    data: SDataCrowd
                },
                {
                    name: '火灾',
                    type: 'line',
                    stack: '总量',
                    // smooth: true,
                    data: SDataFire
                }
            ]
        });

      },
    },

  }
</script>

<style>
.lineChartClass{
    width: 500px;
    height: 190px;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 10px;
    z-index:99;
    position:absolute;
}


</style>