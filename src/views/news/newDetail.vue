<template>
  <div class="news-box">
        <div class="in_box">
			<div class="title_class"> {{title}} </div>
            <div class="time_class"> 发布时间：{{createTime}} </div>
			<div class="news_content">
				 <div class="wrapper" v-html=" newsContent"></div>
			</div>
		</div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      title: "",
      newsContent : "",
      createTime: "",
        videos:[],
    };
  },
  created() {
this.getNewsContent();
  },
  methods: {
   getNewsContent(){
        let newsId=this.$route.query.aid;
        this.$axios.get('/news/getNewsContent',
         {
           params: {
             newsId: newsId,
           }
         }
        ).then(successResponse => {
          let message=successResponse.data.message;
          if (successResponse.data.code === 200) {
            //this.$message({message: message, type: 'success'});
            let newsArr=successResponse.data.result;
            if(newsArr.length==0){
                this.$message({message: '新闻内容丢失，请联系管理员', type: 'error'});
            }
            this.title=newsArr[0].newsTitle;
            this.newsContent=newsArr[0].newsContent;
            this.createTime=newsArr[0].createTime;
            this.videos=newsArr[0].videoList;
          }else{
            this.$message({message: message, type: 'error'});
            //this.$alert('新增新闻信息失败,请联系管理员！');
          }
        })
      },
  },

};
</script>

<style scoped>
	.news_box{
		width: 100%;
		height: 120px;
		display: flex;
		justify-content: space-around;
		margin-left: 100px 0;
		border-bottom: 1px solid lightgray;
	}
	.in_box{
	    //border:1px solid #000;/*虚线：dashed*/
	    //padding: 100px;
        margin-top: 0px;
        margin-right: 80px;
        margin-left: 80px;
	}

	.title_class{
    	//font-weight:bold;/*加粗*/
    	text-align:center;/* 水平居中 */
        font-size:calc(100vw * 30 / 1920);
    }
    .time_class{
        text-align:center;
        font-size:calc(100vw * 5 / 1920);
    }

    .wrapper{
      white-space: pre-wrap;
    }

</style>
