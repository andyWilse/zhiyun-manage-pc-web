<template>
      <div class="mapChartClass">
            <div class="search-box">
                 <el-select
                               v-model="searchContent"
                               clearable
                               filterable
                               placeholder="请输入关键词"
                               class="tipOption"
                               @blur="productSelect"
                               allow-create
                            >
                               <el-option
                                   v-for="item in venuesList"
                                   :key="item.venuesId"
                                   :label="item.venuesName"
                                   :value="item.venuesName"
                               />
                            </el-select>
                <el-button class="btnMapClass" icon="el-icon-search" type="primary" @click="handleSearch()"">查询</el-button>
            </div>

            <div id="container" ></div>

            <div id="app">
              <my-dialog
                title=""
                ref="MyDialog"
                message=""
                :showDialog="isShowDialog"
                @closeDialog="isShowDialog=false"></my-dialog>
            </div>
      </div>

</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import bus from "@/utils/bus";
import MyDialog from "./mdialog.vue"

    window._AMapSecurityConfig = {
        securityJsCode: "eaff27aa124cfae67ff0d2f7493f2bb6",
    };
    export default {
            components:{
                MyDialog
            },
            data(){
                  return{
                    //此处不声明 map 对象，可以直接使用 this.map赋值或者采用非响应式的普通对象来存储。
                    //map:null,
                    churchList:[],
                    searchList:[],
                    venuesList:[],
                    searchContent:'',
                    religiousSect:'',
                    type:'',
                    isShowDialog: false,
                 }
             },
     	    // 初始化 input搜索框
     		created() {
     			bus.$on("shareUserInput", (val) => {
     				this.searchPlaceInput = val.userInput;
     			});
     			bus.$on("updateSearch", (val) => {
     				//this.churchList = this.searchList;
     				//this.setMarker();
     			});
     			bus.$on("shareHeatMapShow", (val) => {
     				this.showHeatOrNot = val;
     			});
     			// 切换宗教
     			bus.$on("selectChurch", (val) => {
     				console.log('切换宗教-selectChurch' , val);
     				let arr=val.list;
     				let religiousSect='';

     				for (var i = 0; i < arr.length; i++) {
                        var item = arr[i].id;
                        religiousSect=religiousSect+item+',';

                    }
     				this.religiousSect = religiousSect;
     				this.type = val.type;
     				this.getChurchList();
     			});
     			this.getVenuesList('');
     		},
     		// 监听 input输入框
     		watch: {
     			searchPlaceInput(newValue) {
     				this.setMarker();
     			},
     			showHeatOrNot(newValue) {
     				if (newValue) {
     					this.showHeatMap();
     				} else {
     					this.heatmap.hide();
     				}
     			},
     			church(newValue, oldValue) {
     				if (this.map) {
     					this.setMarker();
     				}
     			},
     		},
    mounted(){
        //DOM初始化完成进行地图初始化
        //this.initMap();
        this.getChurchList();
    },
    methods:{

     initMap(){
         AMapLoader.load({
             key:"021090ed7f49fe6a940aaef5b0fbedb6",             // 申请好的Web端开发者Key，首次调用 load 时必填
             version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
             plugins:["AMap.ToolBar",   // 需要使用的的插件列表，如比例尺'AMap.Scale'等
                        "AMap.Scale",
                        "AMap.HawkEye",
                        "AMap.MapType",
                        "AMap.Geolocation",
                        "AMap.AutoComplete",
                        "AMap.PlaceSearch",
                        "AMap.InfoWindow",
                        "AMap.MarkerClusterer",],
         }).then((AMap)=>{
             this.map = new AMap.Map("container",{  //设置地图容器id
                 viewMode:"3D",    //是否为3D地图模式
                 zoom:14,           //初始化地图级别
                 center:[120.68309, 27.974069], //初始化地图中心点位置
             });
             // 显示地图控键工具
             this.map.addControl(new AMap.ToolBar());
             this.getLocation();
             this.setMarker();
         }).catch(e=>{
             console.log(e);
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
					geolocation.getCurrentPosition(function(status, result) {
						if (status == "complete") {
							that.$emit("setPosition", result);
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
					//this.map.remove(this.markers);
					this.markers = [];

					// 获取地图场所列表
					let churchList = this.churchList;

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
									size: [28, 30], //可见区域的大小
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

					this.map.add(this.markers);

					if(churchList.length == 1){
						this.map.setCenter([churchList[0].longitude , churchList[0].Latitude]);
					}
				});
			},

		getChurchList(){
            this.$axios.get('/venues/map/getVenues',{
               params: {
                 search: this.search,
                 religiousSect: this.religiousSect,
                 type:this.type,
               }
            }).then(successResponse => {
                if (successResponse.data.code === 200) {
                  this.churchList=successResponse.data.result;
                  this.initMap();
                }else{

                }
            })
        },

        setPosition(){},

        clickMarker(e) {
            let data=e.target.getExtData();
            this.$refs.MyDialog.getVenuesDetail(data.id);
            this.isShowDialog = true;
            //console.log('标记-点击事件' , e.target.getExtData());
        },

        //查询
        productSelect(e) {
             let value = e.target.value;
              if(value) {
                  this.searchContent = value
              }
              this.getVenuesList(this.searchContent);
          },
           //获取场所
          getVenuesList(query) {
              this.$axios.get('/venues/getStaffVenues', {
                  params: {
                      search: query
                  }
                }).then(successResponse => {
                  if (successResponse.data.code === 200) {
                    this.venuesList=successResponse.data.result;
                  }else{
                      let message=successResponse.data.message;
                      this.$message({message: message,type: 'warning'});
                }
              });
          },
          handleSearch(){
                this.search=this.searchContent;
                this.getChurchList();
                this.setMarker();
          },
    }
 }
</script>

<style lang="scss" scoped>
    #container{
        padding:0px;
        margin: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
    };

    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      //text-align: center;
      color: #2c3e50;
      margin-top: 60px;
      width: 100%;
    };

    ::v-deep .amap-logo {
        display: none;
        opacity: 0 !important;
    }
    ::v-deep .amap-copyright {
        opacity: 0;
    }

    .search-box{
        width: 100%;
        position: absolute;
        z-index: 10;
        //display: flex;
        //height: 100px;
    }


    .tipOption{
        width: 30%;
    	//height: 10px;
    	border: 1px solid #000000;
    	left:30%;
    	top:10px;
    }

    .btnMapClass{
        position: absolute;
        top:10px;
        left:60%;
        background-color:#156AA8;
    }

</style>