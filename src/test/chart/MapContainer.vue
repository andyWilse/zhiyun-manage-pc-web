<template>
	<div id="container" style="height: 500px;width: 100px"></div>
</template>

<script>
	import * as Api from "@/utils/place";
	import AMapLoader from "@amap/amap-jsapi-loader";
	import bus from "@/utils/bus";

//eaff27aa124cfae67ff0d2f7493f2bb6
	window._AMapSecurityConfig = {
		securityJsCode: "89ba3121dc887dd8a4ff221f42b32079",
	};

	export default {
		data() {
			return {
				map: null, // 地图
				// autoOptions: {
				// 	input: "",
				// },
				searchPlaceInput: "",
				auto: null,
				placeSearch: null,
				district: null,
				polygons: [],
				showHeatOrNot: false,
				heatmap: null,
				heatmapList: null,
				infoWindow: null,
				markers: [],
				markersPosition: [],
				mask: [],
				// 定义图片
				styleObjectArr: [],
				massMarks: null,
				marker: {},
				mapData: [],
				church: {}, // 宗教信息,
				churchList: [], // 宗教坐标列表信息
			};
		},
		methods: {
			/**
			 * 地图初始化
			 */
			initMap() {
				AMapLoader.load({
						key: "a7ee8ebcc0edfa70e0277c545b6637c9", // 申请好的Web端开发者Key，首次调用 load 时必填 021090ed7f49fe6a940aaef5b0fbedb6
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
							"AMap.MarkerClusterer",
							"AMap.PolygonEditor",
							"AMap.PolylineEditor",
							"AMap.DistrictSearch"
						], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
					})
					.then((AMap) => {
					this.init1();
						this.map = new AMap.Map("container", {
							//设置地图容器id
							viewMode: "3D", //是否为3D地图模式
							zoom: 14, //初始化地图级别
							center: [120.68309, 27.974069], //经度+纬度
						});
						// 显示地图控键工具
						this.map.addControl(new AMap.ToolBar());
						
						// this.auto = new AMap.AutoComplete(this.autoOptions); // 输入提示插件
						// // POI搜索插件
						// this.placeSearch = new AMap.PlaceSearch({ 
						// 	map: this.map,
						// });
						
						// //构造地点查询类
						// this.auto.on("select", this.select);

						//this.getLocation();
						//this.setMarker();


					})
					.catch((e) => {
						console.log(e);
					});
			},
			  init1 () {//区域遮盖
                            var that =this
                            if( that.polygon ) {
                                that.map.remove(that.polygon)
                            }
                            this.map.plugin('AMap.DistrictSearchDistrictSearch', function () {
                                new AMap.DistrictSearch({
                                    extensions: 'all',
                                    subdistrict: 0
                                }).search("浙江", function(status, result) {// 外多边形坐标数组和内多边形坐标数组
                                    var outer = [
                                        new AMap.LngLat(-360, 90, true),
                                        new AMap.LngLat(-360, -90, true),
                                        new AMap.LngLat(360, -90, true),
                                        new AMap.LngLat(360, 90, true)
                                    ]
                                    var holes = result.districtList[0].boundaries
                                    var pathArray = [outer]
                                    pathArray.push.apply(pathArray, holes)
                                    that.polygon = new AMap.Polygon({
                                        pathL: pathArray,
                                        strokeColor: 'red',//城市边界颜色
                                        strokeWeight: 3,
                                        fillColor: '#5149ce', // 遮罩背景色黑色
                                        fillOpacity: 1
                                    })
                                    that.polygon.setPath(pathArray)
                                    that.map.add(that.polygon)
                                })
                            })
                        },
			/**
			 * 获取当前定位
			 */
			getLocation() {
				let that = this;
				this.map.plugin(["AMap.Geolocation"], () => {
					let geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, //是否使用高精度定位，默认:true
						timeout: 10000, //超过10秒后停止定位，默认：无穷大
					});

					// this.map.addControl(geolocation);
					geolocation.getCurrentPosition(function(status, result) {
						if (status == "complete") {
							that.$emit("setPosition", result);
							// that.position = result.position;
						} else {
							// that.$toast("获取当前定位失败！");
						}
					});
				});
			},
			/**
			 * 标记-生成
			 */
			setMarker() {
				console.log('标记-生成1');
				let zoomStyleMapping = {
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0,
					6: 0,
					7: 0,
					8: 0,
					9: 0,
					10: 0,
					11: 0,
					12: 0,
					13: 0,
					14: 0,
					15: 0,
					16: 0,
					17: 0,
					18: 0,
					19: 0,
					20: 0,
				};
				
				this.map.plugin(["AMap.ElasticMarker"], async () => {
					console.log('标记-生成3');
					this.map.remove(this.markers);
					this.markers = [];
					
					// 获取地图场所列表
					let churchList = await this.getMapList();

					churchList.forEach((item) => {
						let position = [item.longitude , item.Latitude];
						let icon = this.$utils.getReligionLog(item.religiousSectCn , 2);
						
						let marker = new AMap.ElasticMarker({
							position: position, // 基点位置
							// position: [item.longitude , item.Latitude], // 基点位置
							// zooms: [14, 20],
							styles: [{
								icon: {
									img: icon,
									size: [30, 36], //可见区域的大小
									anchor: "bottom-center", //锚点
									fitZoom: 14, //最合适的级别
									scaleFactor: 2, //地图放大一级的缩放比例系数
									maxScale: 1.4, //最大放大比例
									minScale: 0.8, //最小放大比例
								},
							}, ],
							extData: {
								id: item.venuesId,
								icon: icon,
								name: item.religiousSectCn,
								position: position,
							},
							zoomStyleMapping: zoomStyleMapping,
						});

						marker.on("click", this.clickMarker);
						this.markers.push(marker);
					});

					console.log("marker", this.markers);
					this.map.add(this.markers);
					
					if(churchList.length == 1){
						this.map.setCenter([churchList[0].longitude , churchList[0].Latitude]); 
					}
				});
			},
			/**
			 * 标记-点击事件
			 * @param {Object} e
			 */
			clickMarker(e) {
				console.log('点击事件' , e.target.getExtData());
				this.$emit("clickMarker", e.target.getExtData());
			},
			/**
			 * 查询关键字
			 * @param {Object} e
			 */
			select(e) {
				console.log('查询关键字1');
				this.placeSearch.setCity(e.poi.adcode);
				this.placeSearch.search(e.poi.name); //关键字查询查询
				this.drawBounds(e.poi.name);
				this.map.setZoom(16, true, 1);
			},
			/**
			 * 行政区区域划分
			 * @param {Object} newValue
			 */
			drawBounds(newValue) {
				//加载行政区划插件
				if (!this.district) {
					//实例化DistrictSearch
					var opts = {
						subdistrict: 1, //获取边界不需要返回下级行政区
						extensions: "all", //返回行政区边界坐标组等具体信息
						level: "district", //查询行政级别为 市
					};

					this.map.plugin(["AMap.DistrictSearch"], () => {
						this.district = new AMap.DistrictSearch(opts);
					});
				}
				//行政区查询
				this.district.search(newValue, (status, result) => {
					if (result != null) {
						// this.feedBack("区域搜索成功", "success");
						if (this.polygons != null) {
							this.map.remove(this.polygons); //清除上次结果
							this.polygons = [];
						}
						this.map.add(this.polygons);
						this.map.setFitView(this.polygons); //视口自适应
					} else {
						// console.log("成功");
					}
				});
			},
			/**
			 * 地点查询
			 */
			showHeatMap() {
				this.map.plugin(["AMap.PlaceSearch"], () => {
					//构造地点查询类
					var placeSearch = new AMap.PlaceSearch({
						pageSize: 50, // 单页显示结果条数
						pageIndex: 1, // 页码
						city: this.searchPlaceInput, // 兴趣点城市
						citylimit: true, //是否强制限制在设置的城市内搜索
					});
					//关键字查询
					placeSearch.search("道教协会", (status, result) => {
						this.getHotChartPos("道教协会", result);
					});
				});
			},
			getHotChartPos(detail, result) {
				let lengthSize = result.poiList.pageSize;
				const count = result.poiList.count;
				// const lengthPage = count / lengthSize
				if (lengthSize > count) {
					lengthSize = count;
				}
				for (var n = 0; n < lengthSize; n++) {
					// this.map.plugin(['AMap.PlaceSearch'], () => {
					//构造地点查询类
					var realSearch = new AMap.PlaceSearch({
						pageSize: 50, // 单页显示结果条数
						pageIndex: n + 1, // 页码
						city: this.searchPlaceInput, // 兴趣点城市
						citylimit: true, //是否强制限制在设置的城市内搜索
					});
					realSearch.search(detail, (status, result) => {
						// console.log(status, result);
					});
				}
			},
			showHatChart(result) {
				var info = [];
				for (let i = 0; i < 50; i++) {
					info.push({
						lng: result.poiList.pois[i].location.lng,
						lat: result.poiList.pois[i].location.lat,
						count: 3 * 50 * Math.round(Math.random() * (10 - 2) + 2),
					});
				}
				this.map.plugin(["AMap.HeatMap"], () => {
					//初始化heatmap对象
					this.heatmap = new AMap.HeatMap(this.map, {
						radius: 56, //给定半径
						opacity: [0, 0.5],
					});
					//设置数据集
					this.heatmap.setDataSet({
						data: info,
						max: 100,
					});
					this.heatmapList.push(this.heatmap);
					this.heatmap.show();
				});
			},
			onSearch(val) {
				console.log("搜索", val);
				// this.autoOptions.input = val.inputId;
				this.searchPlaceInput = val.userInput;
				val.userInput = "";
			},
			/**
			 * 获取地图场所列表
			 */
			getMapList(){
				console.log('地图场所1' , this.church);
				return new Promise((resolve, reject) => {
					let religiousSect = [];
					this.church.forEach(item => {
						religiousSect.push(item.id);
					});
					
					Api.map({
						search: this.searchPlaceInput || '',
						religiousSect: religiousSect.join(',')
					}).then(result => {
						console.log('地图场所2' , result);
						resolve(result.data.result);
					}).catch(error => {
						reject();
					});
				});
			}
		},
		mounted() {
			//DOM初始化完成进行地图初始化
			this.initMap();
			this.init1("浙江");
		},
		// 初始化 input搜索框
		created() {
			bus.$on("shareUserInput", (val) => {
				console.log('点击搜索框的时候' , val);
				// this.autoOptions.input = val.inputId;
				this.searchPlaceInput = val.userInput;
				// val.userInput = "";
			});
			bus.$on("updateSearch", (val) => {
				console.log('失去搜索框焦点的时候' , val);
				// this.autoOptions.input = val.inputId;
				this.searchPlaceInput = val.userInput;
				// val.userInput = "";
			});
			bus.$on("shareHeatMapShow", (val) => {
				this.showHeatOrNot = val;
			});

			bus.$on("selectChurch", (val) => {
				console.log("切换宗教", val);
				this.church = val;
			});
		},
		// 监听 input输入框
		watch: {
			searchPlaceInput(newValue) {
				console.log('搜索内容' , newValue);
				this.setMarker();
				// if (newValue != null) {
					// this.placeSearch.search(newValue);
					// this.drawBounds(newValue);
					// this.map.setZoom(16, true, 1);
				// }
			},
			showHeatOrNot(newValue) {
				if (newValue) {
					this.showHeatMap();
				} else {
					this.heatmap.hide();
				}
			},
			church(newValue, oldValue) {
				console.log('church' , this.map);
				if (this.map) {
					this.setMarker();
				}
			},
		},
	};
</script>

<style scoped lang="less">
	#container {
		height: calc(100vh - 50px);
		// height: 100vh;
		width: 100% !important;
	}
</style>
