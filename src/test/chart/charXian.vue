<template>
    <div>
        <div ref="lineChart" style="width: 400px; height: 200px; background-color: #ffffff; padding: 20px; border-radius: 20px;"></div>
        <div ref="lineMChart" style="width: 400px; height: 200px; background-color: #ffffff; padding: 20px; border-radius: 20px;"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
    mounted() {
        this.lineChart = echarts.init(this.$refs.lineChart);
        this.lineMChart = echarts.init(this.$refs.lineMChart);
        this.lineChart.setOption({
            title: {
                text: 'AI预警动态数据'
            },
            // 提示框
            tooltip: {
                trigger: 'axis'
            },
            // 图例
            legend: [{
                    icon: 'circle',
                    left: 'right',
                    top: 0,
                    data:['日','月','周']
              },
              {
                    icon: '',
                      left: 'right',
                      top: 23,
                      data: ['人脸', '人流', '火灾'],
                      "textStyle": {
                          "fontSize": 8
                    }
              }],
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                containLabel: true
            },
            // 工具栏
            toolbox: {
                feature: {
                    saveAsImage: {
                        type: 'png'
                    },
                    magicType: {
                        type: ['line', 'bar', 'stack']
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

                //axisLabel: { //  如果这个字段不设置，echarts会根据屏宽及横坐标数据自动给出间隔
                    //interval: 0, // 间隔长度，可自定义（如果是时间格式，echarts会自动处理）
                   // rotate: 40 // 横坐标上label的倾斜度
                  //},
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
                                                    name: '日',
                                                    type: 'line',
                                                    data:[]
                                                },
                {
                    name: '人脸',
                    type: 'line',
                    // smooth: true, // 平滑曲线显示
                    data: [10, 22, 11, 25, 12, 23, 21, 21, 23, 29, 23, 21]
                },
                {
                    name: '人流',
                    type: 'line',
                    // smooth: true,
                    data: [10, 32, 51, 54, 40, 26, 11, 51, 14, 9, 13, 11]
                },
                {
                    name: '火灾',
                    type: 'line',
                    stack: '总量',
                    // smooth: true,
                    data: [10, 22, 21, 14, 19, 13, 20, 11, 34, 29, 20, 10]
                }
            ]
        });


                this.lineMChart.setOption({
                    title: {
                        text: 'AI预警动态数据'
                    },
                    // 提示框
                    tooltip: {
                        trigger: 'axis'
                    },
                    // 图例
                    legend: {
                        icon: 'circle',
                        left: 'center',
                        top: 0,
                        data: ['人脸', '人流', '火灾']
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '3%',
                        containLabel: true
                    },
                    // 工具栏
                    toolbox: {
                        feature: {
                            saveAsImage: {
                                type: 'png'
                            },
                            magicType: {
                                type: ['line', 'bar', 'stack']
                            }
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

                        //axisLabel: { //  如果这个字段不设置，echarts会根据屏宽及横坐标数据自动给出间隔
                            //interval: 0, // 间隔长度，可自定义（如果是时间格式，echarts会自动处理）
                           // rotate: 40 // 横坐标上label的倾斜度
                          //},
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
                            data: [10, 22, 11, 25, 12, 23, 21, 21, 23, 29, 23, 21]
                        },
                        {
                            name: '人流',
                            type: 'line',
                            // smooth: true,
                            data: [10, 32, 51, 54, 40, 26, 11, 51, 14, 9, 13, 11]
                        },
                        {
                            name: '火灾',
                            type: 'line',
                            stack: '总量',
                            // smooth: true,
                            data: [10, 22, 21, 14, 19, 13, 20, 11, 34, 29, 20, 10]
                        }
                    ]
                });
    }
}
</script>