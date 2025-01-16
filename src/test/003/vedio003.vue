<template>
  <div class="upload-box">
  <h3>视频上传：</h3>
    <div class="avatar-uploader-box">
      <!-- 图片预览 -->
      <div :key="index" class="video-preview" v-for="(item, index) in videoList">
        <video v-if="item.videoLink!=''" :src="item.videoLink" @mouseover.stop="item.isShowPopup = true" class="avatar">
          您的浏览器不支持视频播放
        </video>
        <video v-else :src="item.url" @mouseover.stop="item.isShowPopup = true" class="avatar">
          您的浏览器不支持视频播放
        </video>
        <!-- 显示查看和删除的按钮弹窗 -->
        <div
          @mouseleave="item.isShowPopup = false"
          class="avatar-uploader-popup"
          v-show="(item.videoLink || item.url) && item.isShowPopup"
        >
          <i @click="previewVideo(item)" class="el-icon-zoom-in"></i>
          <i @click="deleteVideo(index)" class="el-icon-delete"></i>
        </div>

       <!-- <el-input v-model="videoUrl">视频</el-input>-->

      </div>

      <!-- 方框样式 -->
      <el-upload

        class="avatar-uploader"
        action="http://localhost:7081/api/file/uploadVideo"
        multiple
        :show-file-list="false"
        :on-preview="handlePreview"
        :on-success="handleVideoSuccess"
        :on-progress="uploadVideoProcess"
        :on-change="handleAvatarChange"
        v-show="uploadShow"
      >
        <span
          element-loading-background="rgba(0, 0, 0, 0.8)"
          element-loading-spinner="el-icon-loading"
          element-loading-text="上传中"
          style="display:block;"
          v-loading="loading"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </span>
      </el-upload>

      <!-- 上传提示文字样式 -->
      <div class="upload-tip">
        <slot></slot>
      </div>
    </div>

    <!-- 查看大图 -->
    <el-dialog :visible.sync="dialogVisible" append-to-body center title="视频查看" :before-close="handleClose">
      <video :src="videoSrc" ref="video" controls alt width="100%">您的浏览器不支持视频播放</video>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadVideo',
  components: {},
  props: {
    videos: {
      type: Array,
      default: function() {
        return []
      }
    },
    numLimit: {
      // 最大允许上传个数
      type: Number,
      default: 10
    },
    sizeLimit: {
      // 最大单文件大小
      type: Number,
      default: 500
    },

  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      videoUrl:'',
      videoList: [],
      videoSrc: '',
      actionUrl: ''
    }
  },
  computed: {
    uploadShow() {
      return this.videos.length < this.numLimit
    }
  },
  watch: {
    videos: {
      handler() {
        const isArray = Array.isArray(this.videos)
        if (isArray && this.videos.length > 0) {
          this.videos.map(item => {
            item.isShowPopup = false
          })
          this.videoList = JSON.parse(JSON.stringify(this.videos))
        } else {
          this.videoList = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    // 上传之前
    beforeAvatarUpload(file) {
      return new Promise((resolve, reject) => {
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.raw.type) == -1) {
          return reject('请上传正确的视频格式!')
        }

        if (file.size / 1024 / 1024 > this.sizeLimit) {
          return reject(`视频大小不能超过${this.sizeLimit}M!`)
        }

        if (this.videoList.length === this.numLimit) {
          return reject(`最多上传${this.numLimit}个视频`)
        }

        resolve('符合表单规则')
      })
    },
// 上传改变
    async handleAvatarChange(file, fileList) {
      try {
        await this.beforeAvatarUpload(file)
        this.uploadImgApi(file)
      } catch (e) {
        this.$message.warning(JSON.stringify(e))
      }
    },
    // 预览视频
    previewVideo(data) {
      if (data.videoLink) {
        this.videoSrc = data.videoLink;
      } else {
        this.videoSrc = data.url
      }
      this.dialogVisible = true
    },
    // 删除视频
    deleteVideo(index) {
      this.$emit('delete', index)
    },
    handleClose() {
      const video = document.getElementsByTagName('video')[1]
      if (!video.paused) {
        video.currentTime = 0
        video.pause()
      }
      this.dialogVisible = false
    },

    // 视频上传过程中执行
    uploadVideoProcess (event, file, fileList) {
      this.Plus = false
      this.videoFlag = true
      this.videoUploadPercent = file.percentage.toFixed(0)
    },
    // 视频上传成功是执行
    handleVideoSuccess (res, file) {
      this.Plus = false
      this.videoUploadPercent = 100
      console.log(res)
      // 如果为200代表视频保存成功
      if (res.resCode === 200) {
        // 接收视频传回来的名称和保存地址
        // 至于怎么使用看你啦~
        //this.videoForm.videoId = res.newVidoeName
        this.videoUrl = 'http://zszjmobile.860577.net:8808/super/mm.mp4'
        this.$message.success('视频上传成功！')
      } else {
        this.$message.error('视频上传失败，请重新上传！')
      }

      this.videoList = [{videoLink:'http://zszjmobile.860577.net:8808/super/mm.mp4',url:'',isShowPopup:true}]
    },
    handlePreview(file) {
                    console.log(file);
        },
  }
}
</script>

<style lang="scss">
$width: 90px;
$height: 90px;

.upload-box {
  .avatar-uploader-box {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-bottom: 20px;
    min-width: 350px;
    .avatar-uploader {
      .el-upload {
        width: $width;
        height: $height;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
        .el-loading-spinner {
          width: $width;
          height: $height;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 0;
          top: 0;
          .el-loading-text {
            margin: 0;
          }
        }
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: $width;
        height: $height;
        line-height: $height;
        text-align: center;
      }
    }
    .video-preview {
      position: relative;
      padding-right: 20px;
      .avatar {
        width: $width;
        height: $height;
        display: block;
        border-radius: 6px;
      }
      .avatar-uploader-popup {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: $width;
        height: $height;
        background: rgba($color: #000000, $alpha: 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 20px;
        border-radius: 6px;
        i {
          width: 30%;
          text-align: center;
          padding: 0 5%;
          font-size: 24px;
        }
      }
    }
    .upload-tip {
      position: absolute;
      bottom: 0;
      left: 0;
      font-size: 12px;
      color: #606266;
      max-width: 350px;
      line-height: 20px;
    }
  }
}
</style>
