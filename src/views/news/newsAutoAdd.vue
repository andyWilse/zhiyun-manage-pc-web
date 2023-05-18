<template>


  <div>
    <el-dialog title="新闻主体内容" class="dialogClass" :visible="dialogVisibleNewsAutoAdd" :show-close="false" width="70%">
        <div style="position:absolute;right:5%;">
            <el-button @click="handleSubmit()" type="primary">确定</el-button>
            <el-button @click="handleCancel" type="warning">取消</el-button>
        </div>
        <div >
            <news-video  @videoChange="getNewVideo" :videoList="videos"></news-video>
            <news-wb @contentChange="getNewContent"></news-wb>
        </div>


    </el-dialog>
  </div>

</template>

<script>
import newsVideo from "./newsVideo";
import newsWb from "./newsWb";

export default {
  name: "newsAutoAdd",
  props: ['dialogVisibleNewsAutoAdd'],
  components: {
      newsVideo,
      newsWb
  },
  data () {
    return {
      message: '来自子组件的消息',
      videos:[],
      form:{
          videoPath:'',
          contents:''
      }
    }

  },
  created(){
  },
  methods: {

    // $emit应是用来子组件向父组件传参的,但是,这里我只是想改变父组件中isActive为false,
    handleCancel () {
       // 对应事件cActive
       this.$emit('cActive')
    },
    handleSubmit () {
        this.$emit('cAdd',this.form);
    },
    /* 获取子组件传过来的数据 */
    getNewVideo(val){
      console.log('videoChange 事件被触发',val);
      this.form.videoPath=val;
    },

    getNewContent(val){
      console.log('contentChange 事件被触发',val);
      this.form.contents=val;
    },

    childaddClick () {
        var videoList=[];

    },
    handleClose (done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('cActive') // 如果确认,就取消弹窗,
            done()
          })
          .catch(_ => {})
    },


  },

}
</script>

<style scoped>
.dialogClass{
  margin-left: 200px;
  margin-top: 0px;
  height: 800px;
}
</style>
