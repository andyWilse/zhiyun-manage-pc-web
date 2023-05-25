<template>
  <div id="container"></div>
</template>

<script>
import bus from "@/utils/bus";
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
  data() {
    return {
      map: null,
      //接收Search组件传输input的idy
      autoOptions: {
        input: ''
      },
      auto: null,
      placeSearch: null,
      //接收Search组件传输input输入框的值
      searchPlaceInput: '',
      district: null,
      polygons: []
    }
  },

  created() {
    //Search组件传输input的id
    //bus.$on('share_id', val => {
    //  this.autoOptions.input = val
   // }),
      //Search组件传输input输入框的值
     // bus.$on('share', val => {
      //  this.searchPlaceInput = val
      //})
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: '2c1c4affeb410923990fec54c5af721a', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.DistrictSearch', 'AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye', 'AMap.MapType', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.AutoComplete'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then(AMap => {
          this.map = new AMap.Map('container', {
            resizeEnable: true,
            //设置地图容器id
            viewMode: '3D', //是否为3D地图模式
            zoom: 14, //初始化地图级别
            center: [121.473667, 31.230525] //初始化地图中心点位置
          })
          this.map.addControl(new AMap.Scale())
          this.map.addControl(new AMap.ToolBar())
          this.map.addControl(new AMap.HawkEye())
          this.map.addControl(new AMap.MapType())
          this.map.addControl(new AMap.Geolocation())
          this.auto = new AMap.AutoComplete(this.autoOptions)
          // 绑定搜索地图
          this.placeSearch = new AMap.PlaceSearch({
            map: this.map
          }) //构造地点查询类
          this.auto.on('select', this.select)
        })
        .catch(e => {
          console.log(e)
        })
    },
    //poi搜索
    select(e) {
      this.placeSearch.setCity(e.poi.adcode)
      this.placeSearch.search(e.poi.name) //关键字查询查询
      this.map.setCenter([e.poi.location.lng, e.poi.location.lat])
      this.map.setZoom(16, true, 1)
      this.drawBounds(e.poi.name)
    },

    // 行政区区域划分
    drawBounds(newValue) {
      //加载行政区划插件
      if (!this.district) {
        //实例化DistrictSearch
        var opts = {
          subdistrict: 0, //获取边界不需要返回下级行政区
          extensions: 'all', //返回行政区边界坐标组等具体信息
          level: 'district' //查询行政级别为 市
        }

        this.map.plugin(['AMap.DistrictSearch'], () => {
          this.district = new AMap.DistrictSearch(opts)
        })
        // this.district = new AMap.DistrictSearch(opts)
      }
      //行政区查询
      this.district.search(newValue, (status, result) => {
        if (this.polygons != null) {
          this.map.remove(this.polygons) //清除上次结果
          this.polygons = []
        }
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
    }
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap()
    // this.drawBounds()
  },
  watch: {
    // 点击搜索按钮后传值的poi搜索
    searchPlaceInput(newValue) {
      if (newValue != null) {
        this.placeSearch.search(newValue)
        this.map.setZoom(16, true, 1)
        this.drawBounds(newValue)
      }
    }
  }
}
</script>
