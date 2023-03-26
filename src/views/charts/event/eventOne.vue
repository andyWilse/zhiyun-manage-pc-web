<template>
    <div class="eventOneClass">
        <div ref="lineChart" class="lineChartClass" style="width: 1200px; height: 210px;left: 0px;right: 0px;top:45px;bottom:0px;"></div>

        <div class="left" style="position: absolute;top:10px;left: 10px;">
            <img class="icon" src="/image/icon015.png" style="height: 15px;margin-right: 5px;" />
        </div>
        <div class="name" style="position: absolute;top:10px;left: 30px;">AI预警动态数据</div>
        <div class="day" style="position: absolute;top:10px;left: 1045px;">
             <el-button  round icon="el-icon-tian" @click="searchByHand('02')"
             style="width: 45px;left:0;padding: 2px;text-align:justify;height: 28px;">
                   <span>人脸</span>
             </el-button>
         </div>
         <div class="month" style="position: absolute;top:10px;left: 1100px;">
              <el-button  round icon="el-icon-tian" @click="searchByHand('04')"
              style="width: 45px;left:0;padding: 2px;text-align:justify;height: 28px;">
                    <span>人流</span>
              </el-button>
         </div>
         <div class="week" style="position: absolute;top:10px;left: 1155px;">
              <el-button  round icon="el-icon-tian" @click="searchByHand('01')"
              style="width: 45px;left:0;padding: 2px;text-align:justify;height: 28px;">
                    <span>火灾</span>
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
            eventType: "01",
        };
    },
    mounted() {
        this.getZxtDay("01");
    },
    created() {
    },
    methods: {
        //查询
        searchByHand(type){
            this.getZxtDay(type);
        },
        //获取
        getZxtDay(eventType) {
            this.$axios.get('/event/zxt/day',
                {params: {eventType:eventType,}
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
          var SData = [];
          for (var i = 0; i < result.length; i++) {
              var item = result[i];
              XData.push(item.date);
              SData.push(item.count);
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
                      data: [''],
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
                    name: '',
                    type: 'line',
                    // smooth: true, // 平滑曲线显示
                    data:SData,
                    areaStyle: {
                        //显示区域颜色---渐变效果
                        color:{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgb(255,200,213)' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#ffffff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    },
                    itemStyle: {
                        color: 'rgb(255,96,64)', //改变折线点的颜色
                        lineStyle: {
                            color: 'rgb(255,96,64)' //改变折线颜色
                        }
                    }
                }
            ]
        });

      },
    },

  }
</script>

<style>
.lineChartsClass{
    width: 500px;
    height: 190px;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 10px;
    z-index:99;
    position:absolute;
}
.faceClass{
    width: 45px;
    left:0;
    padding: 2px;
    text-align:justify;
    height: 28px;
}

.fireClass{
    width: 45px;
    left:0;
    padding: 2px;
    text-align:justify;
    height: 28px;
}

.personClass{
    width: 45px;
    left:0;
    padding: 2px;
    text-align:justify;
    height: 28px;
}
.el-button {
  background-color:#ffffff;
  color: black;

}
</style>