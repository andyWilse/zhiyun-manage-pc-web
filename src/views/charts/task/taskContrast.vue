<template>
    <div class="taskContrastClass">
        <div ref="lineChart" class="lineChartClass" style="width: 1210px; height: 220px;left: 0px;right: 0px;top:45px;"></div>

        <div class="left" style="position: absolute;top:10px;left: 10px;">
            <img class="icon" src="/image/icon029.jpg" style="height: 15px;margin-right: 5px;" />
        </div>
        <div class="name" style="position: absolute;top:10px;left: 30px;height: 20px;">任务完成量对比图</div>
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
            this.$axios.get('/task/zxt/getTaskGather')
            .then(successResponse => {
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
          var SDataMe = [];
          var SDataOu = [];

          for (var i = 0; i < result.length; i++) {
              var item = result[i];
              XData.push(item.date);
              SDataMe.push(item.myTotal);//我的
              SDataOu.push(item.ouHai);//瓯海
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
                      data: ['我的', '区均值'],
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
                   return value.min
                },
                max: (value) => {
                   return value.max
                },

                //interval:20,
                //data: ['0', '5', '10', '15', '20']
            },
            series: [
                {
                    name: '我的',
                    type: 'bar',
                    data:SDataMe
                },
                {
                    name: '区均值',
                    type: 'bar',
                    data: SDataOu
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