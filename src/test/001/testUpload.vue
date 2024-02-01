
  <template slot-scope="scope">
  		<el-upload ref="ref1"
                   action=""
                   :file-list="fileList"
                   list-type="picture-card"
                   accept="image/*"
                   :auto-upload="false"
                   :multiple="false"
>
          <i class="el-icon-plus"></i>
        </el-upload>
  		</template>


<script>

  import store from '@/store'
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        dataForm: {
          id: 0,
          noticeId: '',
          attachName: '',
          attachUrl: '',
        },
        dataList: [],
        fileList:[{name: '2023013122461811.png', url: 'blob:F:\\3filestore\\20230131\\2023013122461811.png'}],


        fileData: [],
        headers: {
          'Authorization': 'Bearer ' + store.getters.access_token,
        },
      }
    },
    methods: {
handleRemove(file) {
			    return this.$confirm(`确定移除 ${ file.name }？`);
				console.log(file);
			},
handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
handleDownload(file) {
				console.log(file);
			}
    }
  }
</script>

