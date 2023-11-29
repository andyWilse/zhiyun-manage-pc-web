<template>
    <div class="taskCatherClass">
        <div ref="lineChart" class="lineChartClass" style="width: 1210px; height: 220px;left: 0px;right: 0px;top:45px;"></div>

        <div class="left" style="position: absolute;top:10px;left: 10px;">
            <img class="icon" src="/image/icon028.jpg" style="height: 15px;margin-right: 5px;" />
        </div>
        <div class="name" style="position: absolute;top:10px;left: 30px;height: 20px;"> 我的任务数据汇总</div>
        <div class="day" style="position: absolute;top:10px;left: 1060px;height: 20px;">
             <el-button id="dayTask" round icon="el-icon-tian" @click="searchByHand('day')" :type="dayType"
             style="width: 30px;left:0;padding: 2px;text-align:justify;height: 28px;">
                   <span>日</span>
             </el-button>
         </div>

         <div class="week" style="position: absolute;top:10px;left: 1110px;height: 20px;">
              <el-button id="weekTask" round icon="el-icon-tian" @click="searchByHand('week')" :type="weekType"
              style="width: 30px;left:0;padding: 2px;text-align:justify;height: 28px;">
                    <span>周</span>
              </el-button>
         </div>

          <div class="month" style="position: absolute;top:10px;left: 1160px;height: 20px;">
               <el-button id="monthTask" round icon="el-icon-tian" @click="searchByHand('month')" :type="monthType"
               style="width: 30px;left:0;padding: 2px;text-align:justify;height: 28px;">
                     <span>月</span>
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
            dayType:"primary",
            weekType:"",
            monthType:"",
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
            if('week'===type){
                this.dayType="";
                this.monthType="";
                this.weekType="primary";
            }else if('day'===type){
                this.dayType="primary";
                this.monthType="";
                this.weekType="";
            }else if('month'===type){
               this.dayType="";
               this.monthType="primary";
               this.weekType="";
           }
        },
        getZxtGather(dateType) {
            this.$axios.get('/task/zxt/getTaskZxt',
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
          var SDataHandle = [];
          var SDataLaunch = [];

          for (var i = 0; i < result.length; i++) {
              var item = result[i];
              XData.push(item.date);
              SDataHandle.push(item.handleTotal);//执行
              SDataLaunch.push(item.launchTotal);//发起
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
                      data: ['我执行', '我发起'],
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
                boundaryGap: false,
                data: XData,
                "textStyle": {
                      "fontSize": 3
                }
            },
            yAxis: {
                type: 'value',
                min: (value) => {
                    return (value.min)
                  },
                  max: (value) => {
                    return (value.max)
                  },

                //min:0,
               // max:60,
                //interval:20,
                //data: ['0', '20', '40', '60', '80']
            },
            series: [
                {
                    name: '我执行',
                    type: 'line',
                    data:SDataHandle
                },
                {
                    name: '我发起',
                    type: 'line',
                    data: SDataLaunch
                },
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