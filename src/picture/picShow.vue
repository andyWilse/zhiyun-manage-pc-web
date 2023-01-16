<template>
<!--  <div class="gain">
    <img :src="'data:image/png;base64,'+imgurl" alt="">
    <button @click="gain()"><span>获取图片</span></button>
  </div>-->
  <div>
  <el-image
      style="width: 300px; height: 150px"
      :src="imgurl"
      :preview-src-list="srcList">
  </el-image>

    <el-image
        style="width: 100px; height: 50px"
        v-for="item in srcList"
        :src="'data:image/png;base64,' +item.filePath"
        :key="item.fileId"
        :preview-src-list="getImgList(srcList)"
        >

    >
    </el-image>

<!--    <el-upload ref="elupload"
               :src="imgurl"
               action=""
               multiple
               :auto-upload="false"
               :http-request="handleupload"
               list-type="picture-card">
      <i class="el-icon-plus"></i>
    </el-upload>-->
<!--  <button @click="gain()"><span>获取图片</span></button>
    -->
    <button @click="gains()"><span>获取多张图片</span></button>

  </div>
</template>

<script>
export default {
  name: "picShow",
  data () {
    return {
      imgurl:'',
      srcList:[],
    }
  },

  methods: {
    gains() {
      this.$axios.get('/file/show', {
        params: {
          staffPicture: '90000059,90000058',
        }
      }).then(successResponse => {
        if (successResponse.status === 200) {
          this.srcList=successResponse.data;
        }else{
          this.$router.replace({path: '/error'})
        }
      })

    },
//循环展示图片
    getImgList(srcLis) {
      let arr = []
      let i = 0
      for (i; i < srcLis.length; i++) {
        arr.push(srcLis[i].filePath)
      }
      return arr
    },
    gain() {
      this.$axios.get('/file/image').then((res) => {
        if (200 === res.status) {
          this.imgurl='data:image/png;base64,' + res.data.data
/*
          this.imgurl = res.data.data;
*/
        }else{
          this.$message.error('文件获取失败');
        }
      })

      },
  }
}
</script>

<style scoped>

</style>