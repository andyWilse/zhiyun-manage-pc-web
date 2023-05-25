<template>
<div class="map" >
    <div
      class="map-container"
      id="container"
      tabindex="0"
    ></div>
</div>

</template>
<script>
//import AMap from "AMap";
export default {

	data() {
    	return {
	      map: null
    	};
  	},
  	create(){
    		this.initMap()
    	},

	methods:{
		initMap() {
	     var opts = {
		        subdistrict: 0,
		        extensions: 'all',
		        level: 'city'
	    	};
		    //利用行政区查询获取边界构建mask路径
		    //也可以直接通过经纬度构建mask路径
		    var district = new AMap.DistrictSearch(opts);
		    district.search('西安市', (status, result)=> {
		        var bounds = result.districtList[0].boundaries;
		        var mask = []
		        for(var i =0;i<bounds.length;i+=1){
		            mask.push([bounds[i]])
		        }
		        this.map = new AMap.Map('container', {
		            mask:mask,
		            center:[108.948024, 34.263161],//西安市的定位点、其他城市换成对应的经纬度 或者用api获取城市经纬度也行
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
		        //AMap.plugin("AMap.Geocoder", ()=> {
		          //this.geocoder = new AMap.Geocoder({});
		        //});
		       this.initOther()
	       });
	    },


	    initOther(){
	       	  AMapUI.load(["ui/geo/DistrictExplorer", "lib/$"], (DistrictExplorer, $) => {
		      let districtExplorer = new DistrictExplorer({
		        map: this.map, //关联的地图实例
		        eventSupport: true,
		      });
		      let adcode = 610100; //全国的区划编码
		      districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
		        if (error) {
		          console.error(error);
		          return;
		        }
		        //绘制载入的区划节点
		        this.renderAreaNode(districtExplorer, areaNode);
		      });
		      var $tipMarkerContent = $('<div class="tipMarker top"></div>');

		      var tipMarker = new AMap.Marker({
		        content: $tipMarkerContent.get(0),
		        offset: new AMap.Pixel(0, 0),
		        bubble: true,
		      });
		      districtExplorer.on("featureMousemove", function (e, feature) {
		        //更新提示位置
		        tipMarker.setPosition(e.originalEvent.lnglat);
		      });
		      districtExplorer.on("featureMouseout featureMouseover", (e, feature) => {
		        this.toggleHoverFeature(
		          districtExplorer,
		          $tipMarkerContent,
		          tipMarker,
		          feature,
		          e.type === "featureMouseover",
		          e.originalEvent ? e.originalEvent.lnglat : null,
		        );
		      });
		    });
	    },



	    renderAreaNode(districtExplorer, areaNode) {
	      //清除已有的绘制内容
	      districtExplorer.clearFeaturePolygons();
	      //just some colors
	      let colors = [
	        "#000",
	        "#000",
	        "#000",
	        "#000",
	        "#000",
	        "#000",
	        "#000",
	        "#000",
	      ];
	      let colors2 = [
	        "#fff",
	        "#fff",
	        "#fff",
	        "#fff",
	        "#fff",
	        "#fff",
	        "#fff",
	        "#fff",
	      ];
	      //绘制子级区划
	      districtExplorer.renderSubFeatures(areaNode, function (feature, i) {
	        let fillColor = colors2[i % colors2.length];
	        let strokeColor = colors[colors.length - 1 - (i % colors.length)];
	        return {
	          cursor: "default",
	          bubble: true,
	          strokeColor: strokeColor, //线颜色
	          strokeOpacity: 1, //线透明度
	          strokeWeight: 0.5, //线宽
	          fillColor: '#fff', //填充色
	          fillOpacity: 0.5, //填充透明度
	        };
	      });

	      //绘制父级区划，仅用黑色描边
	      districtExplorer.renderParentFeature(areaNode, {
	        cursor: "default",
	        bubble: true,
	        strokeColor: "#0691FF", //线颜色
	        fillColor: null,
	        strokeWeight: 3, //线宽
	      });
	      //更新地图视野以适合区划面
	      this.map.setFitView(districtExplorer.getAllFeaturePolygons());
	    },



	    toggleHoverFeature(
	      districtExplorer,
	      $tipMarkerContent,
	      tipMarker,
	      feature,
	      isHover,
	      position,
	    ) {
	      tipMarker.setMap(isHover ? this.map : null);
	      if (!feature) {
	        return;
	      }
	      let props = feature.properties;
	      if (isHover) {
	        //更新提示内容
	        $tipMarkerContent.html(props.adcode + ": " + props.name);
	        //更新位置
	        tipMarker.setPosition(position || props.center);
	      }
	      // $("#area-tree")
	      //   .find('h2[data-adcode="' + props.adcode + '"]')
	      //   .toggleClass("hover", isHover);
	      //更新相关多边形的样式
	      let polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
	      for (let i = 0, len = polys.length; i < len; i++) {
	        polys[i].setOptions({
	          fillOpacity: isHover ?0.5 : 0.5,
	          fillColor: isHover ? '#0691FF' : '#fff',
	        });
	      }
	    },
	  },

}


</script>

<style  scoped>
 .map-container {
     background: rgba(0, 0, 0, 0) !important;
 }


</style>