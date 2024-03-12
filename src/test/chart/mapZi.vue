<template>
<div id="container"></div>

</template>

<script>
import * as Api from "@/utils/place";
	import AMapLoader from "@amap/amap-jsapi-loader";
	import bus from "@/utils/bus";
export default {
mounted() {
        this.$nextTick(()=>{
            this.initMap();

        });
  },
  	methods:{
 			initMap() {
 				AMapLoader.load({
 						key: "2b04286f12dfda2abea7b6d1015874b6", // 申请好的Web端开发者Key，首次调用 load 时必填 021090ed7f49fe6a940aaef5b0fbedb6
 						version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
 						plugins: [
 							"AMap.ToolBar",
 							"AMap.Scale",
 							"AMap.HawkEye",
 							"AMap.MapType",
 							"AMap.Geolocation",
 							"AMap.AutoComplete",
 							"AMap.PlaceSearch",
 							"AMap.InfoWindow",
 							"AMap.DistrictSearch",
 							"AMap.MarkerClusterer",
 						], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
 					})
 					.then((AMap) => {
 					var mask = [];
this.map.plugin('AMap.DistrictSearch',function(){//回调函数

                        var opts = {
                           //subdistrict: 1,   //返回下一级行政区
                           //level: 'city',//查询的范围
                           //showbiz:false  //查询行政级别为 市
                           subdistrict: 0,
                           		        extensions: 'all',
                           		        level: 'city'
                       };
                       //实例化DistrictSearch
                       var districtSearch = new AMap.DistrictSearch(opts);
                       //TODO: 使用districtSearch对象调用行政区查询的功能
                       districtSearch.search(city,function(status, result){
                           //TODO : 按照自己需求处理查询结果
                           var bounds = result.districtList[0].boundaries;
                           for(var i =0;i<bounds.length;i+=1){
                           		            mask.push([bounds[i]])
                           		        }
                           console.log(result);
                       })
                    })

 						this.map = new AMap.Map("container", {
 							//设置地图容器id
 							mask:mask,
 							center:[108.948024, 34.263161], //经度+纬度
 							disableSocket:true,
                            		            viewMode:'2D',
                            		            showLabel:false,
                            		            labelzIndex:130,
                            		            pitch:20,
                            		            zoom:9,
                            		            resizeEnable: true,
                            		            showIndoorMap: false,
                            		            //mapStyle: "", 地图样式
                            		            features: ["point", "road", "bg"],
                            		            zoomEnable: true,
 						});
 						// 显示地图控键工具
 						//this.map.addControl(new AMap.ToolBar());

 						// this.auto = new AMap.AutoComplete(this.autoOptions); // 输入提示插件
 						// // POI搜索插件
 						// this.placeSearch = new AMap.PlaceSearch({
 						// 	map: this.map,
 						// });

 						// //构造地点查询类
 						// this.auto.on("select", this.select);

 						//this.getLocation();
 						//this.setMarker();

 						this.init1("新疆");
 					})
 					.catch((e) => {
 						console.log(e);
 					});
 			},
  init1 (city) {//区域遮盖
                var that =this
                if( that.polygon ) {
                    that.map.remove(that.polygon)
                }
               this.map.plugin('AMap.DistrictSearch',function(){//回调函数

                        var opts = {
                           //subdistrict: 1,   //返回下一级行政区
                           //level: 'city',//查询的范围
                           //showbiz:false  //查询行政级别为 市
                           subdistrict: 0,
                           		        extensions: 'all',
                           		        level: 'city'
                       };
                       //实例化DistrictSearch
                       var districtSearch = new AMap.DistrictSearch(opts);
                       //TODO: 使用districtSearch对象调用行政区查询的功能
                       districtSearch.search(city,function(status, result){
                           //TODO : 按照自己需求处理查询结果
                           var bounds = result.districtList[0].boundaries;
                           console.log(result);
                       })
                    })

            },
            }
            }
</script>

<style  scoped>
</style>