<template>
  <div id="container"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
        data() {
			return {
                polygons:[],
                mask:[],
                districts:['','','','',''],
			}
		},
        mounted(){
          //DOM初始化完成进行地图初始化
          this.initMap();
        },
		methods:{
          initMap(){
            AMapLoader.load({
              key:"021090ed7f49fe6a940aaef5b0fbedb6",             // 申请好的Web端开发者Key，首次调用 load 时必填
              version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
              plugins:[
                    "AMap.ToolBar",
                    "AMap.Scale",
                    "AMap.HawkEye",
                    "AMap.MapType",
                    "AMap.Geolocation",
                    "AMap.AutoComplete",
                    "AMap.PlaceSearch",
                    "AMap.InfoWindow",
                    "AMap.MarkerClusterer",
                    "AMap.PolygonEditor",
                    "AMap.PolylineEditor",
                    "AMap.DistrictSearch"
                    ],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap)=>{
                var opts = {
                    subdistrict: 1,
                    extensions: 'all',
                    showbiz:true,
                    level: 'district' //city、district、biz_area
                };
                //利用行政区查询获取边界构建mask路径
                //也可以直接通过经纬度构建mask路径
                //var mask = []
                var district = new AMap.DistrictSearch(opts);
                district.search("瓯海区", (status, result)=> {
                    // 绘制区域
                    this.getData(result.districtList[0]);
                    console.log(result.districtList[0]);
                    var bounds = result.districtList[0].boundaries;
                    for(var i =0;i<bounds.length;i+=1){
                        this.mask.push([bounds[i]])
                    }

                    //街道
                    var districtArr=result.districtList[0].districtList
                    for(var j =0;j<districtArr.length;j+=1){
                        var name = districtArr[j].name;
                        this.drawDistrict(name);
                    }
                })

                this.map = new AMap.Map("container",{  //设置地图容器id
                    //mask:this.mask,
                     viewMode:"3D",    //是否为3D地图模式
                     zoom:14,           //初始化地图级别
                     center:[120.68309, 27.974069], //初始化地图中心点位置
                     mapStyle: 'amap://styles/darkblue',
                });

                AMap.plugin("AMap.Geocoder", ()=> {
                  this.geocoder = new AMap.Geocoder({});
                });
            }).catch(e=>{
              console.log(e);
            })
          },

          getData(data){
                var bounds = data.boundaries;
          		if (bounds) {
          			for (var i = 0, l = bounds.length; i < l; i++) {
          				var polygon = new AMap.Polygon({
          					map: this.map,
          					strokeWeight: 1,
          					strokeColor: '#0091ea',
          					fillColor: '#80d8ff',
          					//fillOpacity: 0.2,
          					fillOpacity:0.3,
          					path: bounds[i]
          				});
          				this.polygons.push(polygon);
          			}
          			this.map.setFitView();//地图自适应
          		}
          },

          //行政区
          drawDistrict(name){
            var opts = {
                  subdistrict: 0,
                  extensions: 'all',
                  level: 'biz_area'
            };
             var district = new AMap.DistrictSearch(opts);
             district.search(name, (status, result) => {

                     var bounds = result.districtList[0].boundaries
                     if (bounds) {
                       for (var i = 0, l = bounds.length; i < l; i++) {
                         //生成行政区划polygon
                         var polygon = new AMap.Polygon({
                           strokeWeight: 1,
                           path: bounds[i],
                           fillOpacity: 0.4,
                           fillColor: '#80d8ff',
                           strokeColor: '#0091ea'
                         })
                         this.polygons.push(polygon)
                       }
                     }
                     this.map.add(this.polygons)
                     this.map.setFitView(this.polygons) //视口自适应


            })

          },

        },
}

</script>

<style scoped>
#container{
  padding:0px;
  margin: 0px;
  width: 100%;
  height: 800px;
}
</style>