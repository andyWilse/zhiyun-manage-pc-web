<template>
  <div>
    <el-dialog title="权限菜单" :visible="dialogVisibleUserGrand" :before-close="handleClose" width="40%">
        <div class="main-container">
          <el-tree
              :data="treeOptionsMenu"
              :props="defaultProps"
              show-checkbox
              @check="upper_lowerChange"
              :default-expand-all="true"
              :default-expanded-keys="[1]"
              ref="tree"
              node-key="id"/>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSubmit">确定</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
export default {
  props: ['isactive', 'dialogVisibleUserGrand', 'index_from_parent'],
  data () {
    return {
      message: '来自子组件的消息',
      treeOptionsMenu:[],
      userMenu:[],
      userId:'',
      userNm:'',
      menus:'',
      defaultProps: {
          children: 'children',
          label: 'name'
      },
    }
  },
  created(){
    this.getTreeMenus();
    //this.showMenu();
  },
  methods: {
    getTreeMenus(){
        this.$axios.get('/menu/getTreeMenus')
        .then(successResponse => {
            if (successResponse.data.code === 200) {
             this.treeOptionsMenu=successResponse.data.resultArr;
            }else{
             this.$router.replace({path: '/'})
            }
        })
    },
    // 上下架树加载
    upper_lowerChange(node, checkStatus, childStatus) {
      if (checkStatus) {
        this.currentCheckChannelId = node.id;
      }
    },
    // 清空select
    clearTag () {
        // 清空tree选择
        this.$refs['tree'].setCheckedKeys([])
    },
    /*权限反显*/
    showMenu(data){
      //重新获取
      this.$axios.get('/menu/getByUser/'+data)
      .then(successResponse => {
            if (successResponse.data.code === 200) {
              this.userMenu=successResponse.data.result;
              this.$refs.tree.setCheckedKeys(this.userMenu);
            }else{
              this.$router.replace({path: '/'})
            }
      })
    },
    // $emit应是用来子组件向父组件传参的,但是,这里我只是想改变父组件中isActive为false,
    handleCancel () {
      // 对应事件cActive
      this.$emit('cActive_grand');
      this.clearTag ();
    },
    /*权限保存*/
    handleSubmit () {
      let toMenu='';
      this.$refs['tree'].getCheckedNodes().forEach(value => {
          toMenu=value.id+","+toMenu;
      })
      this.$axios.post('/menu/userGrand',
          {
              userId:this.userId,
              userNm:this.userNm,
              menus:toMenu
            }
    ).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.clearTag ();
          this.$emit('cGrand', '');
          this.$message({message: '用户权限保存成功！',type: 'success'});
        }else{
          this.$router.replace({path: '/'})
        }
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('cActive_grand') // 如果确认,就取消弹窗,
            done()
          })
          .catch(_ => {})
    },
  }
}
</script>

<style scoped>
.main-container {
  color: black;
  border: 1px solid black;
  margin-left:0px;
  margin-right: 0px;
  padding: 10px;
}


</style>
