<template>
  <div class="bg">
    <!-- 上传 -->
    <el-upload
        ref="upload"
        list-type="picture-card"
        :action="upload.action"
        :name="upload.fileParamsName"
        :multiple='false'
        :auto-upload='false'
    :file-list="upload.fileList"
    :data="uploadParams"
    :on-change="changeAvatarUpload"
    :http-request="handleUpload"
    :before-upload="beforeAvatarUpload"
    >
    <i
        slot="default"
        class="el-icon-plus"
    ></i>
    //把功能暴露出来
    <div
        slot="file"
        slot-scope="{file}"
    >
      <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
      >
      <span class="el-upload-list__item-actions">
          <!-- 放大 -->
          <span @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
        <!-- 删除 -->
          <span @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
    </div>
    </el-upload>

    <!-- 填写跳转链接弹出框 -->
    <el-dialog
        :visible.sync="ttdialogVisible"
        :close-on-click-modal="false"
        width="30%"
        @close="dialogClosed"
    >
      <el-form
          ref="formRef"
          :model="form"
          label-width="80px"
      >
        <el-form-item prop="reLin">
          <div>跳转地址：</div>
          <el-input
              v-model="form.reLink"
              placeholder="不填，则默认地址为：www.baidu.com"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
          slot="footer"
          class="dialog-footer"
      >
        <el-button
            type="primary"
            @click="getLinkData"
        >上 传 图 片</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/index.css'
import { Select, Option, Upload, Dialog, Form, FormItem, Alert, Button, Input } from 'element-ui'
import draggable from 'vuedraggable' // 拖动插件


export default {
  components: {
    ElSelect: Select,
    ElOption: Option,
    ElUpload: Upload,
    ElDialog: Dialog,
    ElForm: Form,
    ElFormItem: FormItem,
    ElAlert: Alert,
    ElButton: Button,
    ElInput: Input

  },
  data () {
    return {
      upload: {
        action: '#',
        fileList: []
      },
      dialogImageUrl: '',
      dialogVisible: false,

      // 跳转链接
      ttdialogVisible: false,
      form: {
        reLink: ''
      },
    }
  },
  computed: {
    // 上传时附带的额外参数
    uploadParams () {
      return {
        name: '',
        link: this.form.reLink ? this.form.reLink : 'www.baidu.com',
        type: this.select.value,
        order: 2,
        imageFile: ''
      }
    }
  },
  methods: {
    // 显示对应不同类型的图片
   //从后台获取到文件，放在this.upload.fileList里面

// 点击文件列表中已上传的文件时的钩子--用来放大图片
async handlePictureCardPreview (file) {
  this.dialogImageUrl = file.url
  this.dialogVisible = true
},

// 文件列表移除文件时的钩子
async handleRemove (file, fileList) {
  let de = new FormData()
  de.append('idBanner', file.banner)
  await this.$http.post('/delete', de)
  //注意：此处有个知识点，关于数组如何拿到对应值的位置，然后进行操作那个对象
  let data = this.upload.fileList
  // 获取删除元素位置
  let eleIndex = data.findIndex(value => value.banner === file.banner)
  // 删除元素
  data.splice(eleIndex, 1)
},

// 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
changeAvatarUpload (file) {
  //选择图片之后，填写跳转连接的弹框 弹出来
  if (file.status === 'ready') {
    this.ttdialogVisible = true
  }
},

// 上传文件之前的钩子 ---给要携带的参数赋对应值
beforeAvatarUpload (file) {
  this.uploadParams.name = file.name
  this.uploadParams.imageFile = file
  // Order排序
  if (this.upload.fileList.length > 0) {
    let fileListData = this.upload.fileList
    let maxData = fileListData[0].order
    for (let n = 1; n < fileListData.length; n++) {
      if (fileListData[n].order > maxData) {
        maxData = fileListData[n].order
      }
    }
    this.uploadParams.order = maxData + 2
  }
},

// 上传图片
getLinkData () {
  // 让添加图片和按钮 绑定起来
  this.$refs.upload.submit()
  this.ttdialogVisible = false
},

// 监控弹框关闭事件，清除跳转链接表单信息
dialogClosed () {
  this.$refs.formRef.resetFields()
},

// 添加图片
async handleUpload (file) {
  const { name, link, type, order, imageFile } = this.uploadParams
  const fd = new FormData()
  fd.append('name', name)
  fd.append('link', link)
  fd.append('type', type)
  fd.append('order', order)
  fd.append('imageFile', imageFile)
  const addPic = await this.$http.post('/add', fd)
  if (addPic.data.code === 20000) {
    // 把图片真实显示出来（加入到fileList中），其实是做一个刷新，如果不是下拉选择框那种获取的形式，可以直接调用获取api的那个函数进行刷新
    this.upload.fileList.push({
      url: addPic.data.data.adImageName,
      name: addPic.data.data.adName,
      link: addPic.data.data.adLink,
      order: addPic.data.data.adOrder,
      banner: addPic.data.data.idBanner,
      type: addPic.data.data.adType
    })
  } else {
    this.numDialogVisible = true
  }
},
// 编辑图片信息
handleEditload (file) {
  this.editDialogVisible = true
  this.editForm.dialogImageUrl = file.url
  this.editForm.picName = file.name
  this.editForm.picOrder = file.order
  this.editForm.picLink = file.link
  this.editForm.picType = file.type
  this.editForm.editbanner = file.banner
},
}
}

