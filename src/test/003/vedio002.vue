<template>
 <div class="album albumvideo">
   <div>
     <p class="type_title">
       <span>视频介绍</span>
     </p>
     <div class="pic_img">
       <div class="pic_img_box">
         <el-upload
           class="avatar-uploader"
           action="http://localhost:7081/api/file/uploadVideo"
           v-bind:data="{FoldPath:'上传目录',SecretKey:'安全验证'}"
           v-bind:on-progress="uploadVideoProcess"
           v-bind:on-success="handleVideoSuccess"
           v-bind:before-upload="beforeUploadVideo"
           v-bind:show-file-list="false"
         >
           <video v-if="videoForm.showVideoPath !='' && !videoFlag" v-bind:src="videoForm.showVideoPath" class="avatar video-avatar" controls="controls">您的浏览器不支持视频播放</video>
           <i v-else-if="videoForm.showVideoPath =='' && !videoFlag" class="el-icon-plus avatar-uploader-icon"></i>
           <el-progress v-if="videoFlag == true" type="circle" v-bind:percentage="videoUploadPercent" style="margin-top:1px;"></el-progress>
         </el-upload>
       </div>
     </div>
   </div>
   <p class="Upload_pictures">
     <span></span>
     <span>最多可以上传1个视频，建议大小50M，推荐格式mp4</span>
   </p>
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
      videoFlag: false,
          //是否显示进度条
          videoUploadPercent: '',
          //进度条的进度，
          isShowUploadVideo: false,
          //显示上传按钮
          videoForm: {
            showVideoPath: 'http://zszjmobile.860577.net:8808/super/mm.mp4',
          },
    }
  },
  computed: {

  },
  watch: {

  },
  created() {},
  methods: {
   //上传前回调
      beforeUploadVideo(file) {
        var fileSize = file.size / 1024 / 1024 < 50
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {

          return reject('请上传正确的视频格式!')
        }
        if (!fileSize) {

          return reject('视频大小不能超过50MB!')
        }
        this.isShowUploadVideo = false
      },
      //进度条
      uploadVideoProcess(event, file, fileList) {
        this.videoFlag = true
        this.videoUploadPercent = file.percentage.toFixed(0) * 1
      },
      //上传成功回调
      handleVideoSuccess(res, file) {
        this.isShowUploadVideo = true
        this.videoFlag = false
        this.videoUploadPercent = 0

        //前台上传地址
        //if (file.status == 'success' ) {
        //    this.videoForm.showVideoPath = file.url;
        //} else {
        //     layer.msg("上传失败，请重新上传");
        //}

        //后台上传地址
        if (res.Code == 0) {
          this.videoForm.showVideoPath = res.Data
        } else {
          //layer.msg(res.Message)
        }
      },
    },
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
