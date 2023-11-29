<template>
    <div class="eventOneClass">
        <div ref="lineChart" class="lineChartClass" style="width: 1200px; height: 210px;left: 0px;right: 0px;top:45px;bottom:0px;"></div>

        <div class="left" style="position: absolute;top:10px;left: 10px;">
            <img class="icon" src="/image/icon015.png" style="height: 15px;margin-right: 5px;" />
        </div>
        <div class="name" style="position: absolute;top:10px;left: 30px;">AI预警动态数据</div>
         <div class="part" style="position: absolute;top:10px;left: 990px;">
             <el-button  round icon="el-icon-tian" @click="searchByHand('04')" :type="partType"
             style="width: 45px;left:0;padding: 2px;text-align:justify;height: 28px;">
                   <span>聚集</span>
             </el-button>
         </div>
        <div class="super" style="position: absolute;top:10px;left: 1045px;">
             <el-button  round icon="el-icon-tian" @click="searchByHand('02')" :type="superType"
             style="width: 45px;left:0;padding: 2px;text-align:justify;height: 28px;">
                   <span>超限</span>
             </el-button>
         </div>
         <div class="important" style="position: absolute;top:10px;left: 1100px;">
              <el-button  round icon="el-icon-tian" @click="searchByHand('03')" :type="importantType"
              style="width: 45px;left:0;padding: 2px;text-align:justify;height: 28px;">
                    <span>重点</span>
              </el-button>
         </div>
         <div class="fire" style="position: absolute;top:10px;left: 1155px;">
              <el-button  round icon="el-icon-tian" @click="searchByHand('01')" :type="fireType"
              style="width: 45px;left:0;padding: 2px;text-align:justify;height: 28px;">
                    <span>明火</span>
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
            eventType: "04",
            superType:"",
            importantType:"",
            fireType:"",
            partType:"primary",
        };
    },
    mounted() {
        this.getZxtDay("04");
    },
    created() {
    },
    methods: {
        //查询
        searchByHand(type){
            this.getZxtDay(type);
            if('02'===type){
                this.superType="primary";
                this.importantType="";
                this.fireType="";
                this.partType="";
            }else if('03'===type){
                this.superType="";
                this.importantType="primary";
                this.fireType="";
                this.partType="";
            }else if('01'===type){
               this.superType="";
               this.importantType="";
               this.fireType="primary";
               this.partType="";
           }else if('04'===type){
               this.superType="";
               this.importantType="";
               this.fireType="";
               this.partType="primary";
           }
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
                min: (value) => {
                   return value.min
                },
                max: (value) => {
                   return value.max
                },
                //min:0,
                //max:5,
                //interval:1,
                //data: ['0', '1', '2', '3', '4', '5']
            },
            series: [
                {
                    name: '',
                    type: 'line',
                    smooth: true, // 平滑曲线显示
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

</style>