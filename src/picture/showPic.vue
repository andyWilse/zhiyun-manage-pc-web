<template>
<!--  <div class="blog">
    <div class="gain">
&lt;!&ndash;
      <img :src="'data:image/png;base64,'+image" />
&ndash;&gt;
      <img style="width:180px" :src="url" >
      <button @click="gain()"><span>获取图片</span></button>
    </div>
  </div>-->
  <el-form>
  <el-form-item>
    <el-image v-for="(img,index) in ImagesrcList"
              :src="img"
              :key="index"
              :preview-src-list="getImgList(index)"
              @click="handleClickItem">
    </el-image>

  </el-form-item>
  </el-form>

</template>
<script>
export default {
    name:'blog',
  data() {
    return {
      image: '',
      url: '',
      ImagesrcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
    }
  },
  methods: {
    gain() {
      this.$axios.get('/file/image').then((res) => {
        if (200 === res.status) {
          //this.image = res.data.data;
          this.url ='data:image/png;base64,' + res.data.data;
          //this.image = 'data:image/png;base64,' + res.data.data.base64
         // this.$message.success('文件获取成功');
        }
      }).catch((ress) => {
        this.$message.error('文件获取失败');
      })
      /*this.axios.get('/file/image').then((res)=>{
        this.image = res;
        this.$message.success('文件获取成功');
      }).catch((res)=>{
        this.$message.error('文件获取失败');
      })*/
    },

    //循环展示图片
    getImgList(index) {
      let arr = []
      let i = 0
      for (i; i < this.ImagesrcList.length; i++) {
        arr.push(this.ImagesrcList[i + index])
        if (i + index >= this.ImagesrcList.length - 1) {
          index = 0 - (i + 1)
        }
      }
      return arr
    },
    // 关闭el-image遮罩层
    handleClickItem() {
      this.$nextTick(() => {
        // 获取遮罩层dom
        let domImageMask = document.querySelector('.el-image-viewer__mask')
        if (!domImageMask) {
          return
        }
        domImageMask.addEventListener('click', () => {
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector('.el-image-viewer__close').click()
        })
      })
    }
  }
};
</script>
