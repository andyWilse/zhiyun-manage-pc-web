<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')"
             :close-on-click-modal="false" :close-on-press-escape="false" width="90%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'" :disabled="dataForm.flag === 1">
      <el-row style="font-weight:bold">
        <el-col><span>资讯信息</span></el-col>
        <el-divider></el-divider>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="资讯标题" prop="xwbt">
            <el-input v-model="dataForm.xwbt" placeholder="请输入资讯标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="副标题" prop="fbt">
            <el-input v-model="dataForm.fbt" placeholder="请输入副标题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="内容" prop="nr" class="form-item-content">
            <quill-editor ref="myQuillEditor" v-model="dataForm.nr" class="editor" :options="editorOption" @focus="quillEditorFocus($event)"/>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!-- 富文本编辑器中的上传图片控件 -->
    <el-upload
        class="avatar-uploader-img"
        :action="uploadUrl"
        :show-file-list="false"
        :on-success="uploadImgSuccess"
        :before-upload="beforeUploadImg"
        :on-error="uploadImgError"
        :data="{'pathName':''}"
    />
    <!-- 富文本编辑器中的上传图片控件 -->

    <template slot="footer">
      <el-button @click="visible = false" size="small" v-show="dataForm.flag === 1">关闭</el-button>
      <el-button @click="visible = false" size="small" v-show="!dataForm.flag || dataForm.flag === 2">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()" size="small" v-show="!dataForm.flag || dataForm.flag === 2">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

// 工具栏配置
const toolbarOptions = [
['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
['blockquote', 'code-block'], // 引用  代码块
[{ header: 1 }, { header: 2 }], // 1、2 级标题
[{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
[{ script: 'sub' }, { script: 'super' }], // 上标/下标
[{ indent: '-1' }, { indent: '+1' }], // 缩进
// [{'direction': 'rtl'}],                         // 文本方向
[{ size: ['small', false, 'large', 'huge'] }], // 字体大小
[{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
[{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
[{ font: [] }], // 字体种类
[{ align: [] }], // 对齐方式
['clean'], // 清除文本格式
// ['link', 'image', 'video'] // 链接、图片
['link', 'image'] // 链接、图片
]

export default {
data () {
return {
visible: false,
//文件上传地址
uploadUrl: `${window.SITE_CONFIG.apiURL}/sys/oss/upload?token=${Cookies.get('token')}`,

editorOption: { // 编辑框操作事件
theme: 'snow', // or 'bubble'
placeholder: '请输入资讯内容...',
modules: {
toolbar: {
container: toolbarOptions,
handlers: {
image: function(value) { // 上传图片
if (value) {
document.querySelector('.avatar-uploader-img input').click() // 触发input框选择文件
} else {
this.quill.format('image', false)
}
},
link: function(value) { // 添加链接
if (value) {
var href = prompt('请输入链接地址：')
this.quill.format('link', href)
} else {
this.quill.format('link', false)
}
}
}
}
}
},
dataForm: {
id: '',
xwbt: '',
fbt: '',
nr: '',
flag: ''
}
}
},
computed: {
dataRule () {
return {
xwbt: [//资讯标题
{ required: true, message: this.$t('validate.required'), trigger: 'blur' },
{ max: 500, message: '字符不能超过300', trigger: 'blur' }
],
fbt: [//副标题
{ required: true, message: this.$t('validate.required'), trigger: 'blur' },
{ max: 500, message: '字符不能超过300', trigger: 'blur' }
],
nr: [//内容
{ required: true, message: this.$t('validate.required'), trigger: 'blur' }
]
}
}
},
methods: {
beforeUploadImg(file) {//富文本图片上传前
const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
if (!isJPG) {
this.$message.error('上传图片只能是 JPG，PNG, GIF 格式!')
} else {
// 显示loading动画
this.quillUpdate = true
}
return isJPG
},
uploadImgSuccess(res, file) {//富文本图片上传成功
// res为图片服务器返回的数据
// 获取富文本组件实例
const quill = this.$refs.myQuillEditor.quill

这里需要注意自己文件上传接口返回内容，我这里code=0表示上传成功，返回的文件地址：res.data.src
if (res.code !== 0) {
this.$message.error(res.msg)
//this.$message.error('图片插入失败!')
} else {
console.info(res)
// 获取光标所在位置
const length = quill.getSelection().index
// 插入图片  res.info为服务器返回的图片地址
quill.insertEmbed(length, 'image', res.data.src)
// 调整光标到最后
quill.setSelection(length + 1)
}
// loading动画消失
this.quillUpdate = false
},
uploadImgError() {//富文本图片上传失败
// loading动画消失
this.quillUpdate = false
this.$message.error('图片插入失败!')
},
quillEditorFocus(event) {//富文本的获得焦点事件
// 在这里可以设置富文本编辑器是否可编辑
//event.enable(false);//不可输入和编辑
//event.enable(true);//可以输入和编辑
}
}
</script>
<style>
/************************************** 富文本编辑器 **************************************/
/** 设置富文本的高度 **/
.editor {
  line-height: normal !important;
  height: 730px;
  margin-bottom: 30px;
}
.ql-container {
  height: 700px !important;
}
/** 设置富文本的高度 **/

/** 设置工具栏中上传图片和上传视频对应的文件上传组件样式 **/
.avatar-uploader-img {
  height: 0;
}
.avatar-uploader-video {
  height: 0;
}
/** 设置工具栏中上传图片和上传视频对应的文件上传组件样式 **/


/deep/ .ql-snow .ql-tooltip[data-mode=link]::before {
  content: '请输入链接地址：';
}
/deep/ .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}
/deep/ .ql-snow .ql-tooltip[data-mode=video]::before {
  content: '请输入视频地址：';
}
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px';
}
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px';
}
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px';
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-label::before,
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: '衬线字体';
}
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
  content: '等宽字体';
}
/************************************** 富文本编辑器 **************************************/
</style>
