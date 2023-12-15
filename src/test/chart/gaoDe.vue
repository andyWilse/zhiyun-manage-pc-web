<template>

 <div class="aMap-wrapper">
             <el-amap class="amap-box" :zoom="zoom" :center="center" :mapStyle="mapStyle">
                 <el-amap-marker
                         v-for="marker in markers"
                         :position="marker.position"
                         :key="marker.id"
                         :events="marker.events"
                         :icon="marker.icon"
                 ></el-amap-marker>
                 <el-amap-info-window
                         v-if="window"
                         :position="window.position"
                         :visible="window.visible"
                         :content="window.content"
                         :offset="window.offset"
                 ></el-amap-info-window>
             </el-amap>
         </div>
</template>

<script>
import location from '../assets/region/daoJiao.png'

export default {
    data(){
        return{
   center: [121.126757,31.140653],
                  zoom:12,
                  mapStyle: "amap://styles/blue", //修改地图的背景颜色
                  markers: [],
                  windows:[],
                  window:'',
        }
    },
methods:{
            point(){
                //自定义map点坐标图标
                let icon = new AMap.Icon({
                    image: location,
                    size: new AMap.Size(2, 2),
                    imageSize: new AMap.Size(2, 2)
                });

                let markers = [];
                let windows=[];
                let that=this;
                let pointMarker=[
                    {
                        lng:120.978008,
                        lat:31.083667,
                        stationName: "青浦水文站1",
                        buildTime:'2011-12-08',//建站时间
                        stationAddress:'上海市牛头山路东100m',//站址
                        temperature:'25.5℃',//温度
                        rainfall:'5mm',//雨量
                        windDirection:'西北',//风向
                        windSpend:'2.05m/s',//风速
                        waterLevel:'2.65m',//水位
                        waterVelocity:'1.2m/s',//流速
                        waterTraffic:'2.8m³/s',//流量
                    },{
                        lng:121.037746,
                        lat:31.105422,
                        stationName: "青浦水文站2",
                        buildTime:'2011-12-08',//建站时间
                        stationAddress:'上海市牛头山路东100m',//站址
                        temperature:'25.5℃',//温度
                        rainfall:'5mm',//雨量
                        windDirection:'西北',//风向
                        windSpend:'2.05m/s',//风速
                        waterLevel:'2.65m',//水位
                        waterVelocity:'1.2m/s',//流速
                        waterTraffic:'2.8m³/s',//流量
                    }
                    ]
                pointMarker.forEach((item,index)=>{
                    markers.push({
                        position: [item.lng,item.lat],
                        icon:location, //不设置默认蓝色水滴
                        events: {
                            click() {
                                that.windows.forEach(window => {
                                    window.visible = false; //关闭窗体
                                });
                                that.window = that.windows[index];
                                that.$nextTick(() => {
                                    that.window.visible = true;//点击点坐标，出现信息窗体
                                });
                            }
                        }
                    })
                    windows.push({
                        position: [item.lng,item.lat],
                        content:"" +
                            "<div>"+"站点名称："+item.stationName+"</div>" +
                            "<div>"+"建站时间："+item.buildTime+"</div>" +
                            "<div>"+"地 址："+item.stationAddress+"</div>" +
                            "<div>"+"温度："+"<span style='color: #66A0FF'>"+item.temperature+"</span>"+"</div>"+
                            "<div>"+"雨量："+"<span style='color: #66A0FF'>"+item.rainfall+"</span>"+"</div>"+
                            "<div>"+"风向："+"<span style='color: #66A0FF'>"+item.windDirection+"</span>"+"</div>"+
                            "<div>"+"风速："+"<span style='color: #66A0FF'>"+item.windSpend+"</span>"+"</div>"+
                            "<div>"+"水位："+"<span style='color: #66A0FF'>"+item.waterLevel+"</span>"+"</div>"+
                            "<div>"+"流速："+"<span style='color: #66A0FF'>"+item.waterVelocity+"</span>"+"</div>"+
                            "<div>"+"流量："+"<span style='color: #66A0FF'>"+item.waterTraffic+"</span>"+"</div>"
                        ,
                        offset:[5,-15],//窗体偏移
                        visible: false//初始是否显示
                    })
                })
                //添加点标注
                this.markers = markers;
                //生成弹窗
                this.windows=windows
            },
        },


}




</script>

<style scoped lang="less">
.map_address{
  height:100vh;
}
.address-wrapper{
  display:flex;
  flex-direction:column;
}
.search-box{
  width:100vw;
  height:40px;
}
.amap-demo{
    flex:1;
    height:100vh;
}
</style>
