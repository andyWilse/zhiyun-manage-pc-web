<template>
<div>
      <div class="roleclass">
      <span style="font-size: 16px">角色选择:</span>
      <el-select v-model="roleId"  placeholder="----------- 请选择 -----------"
      @change="selecteRole"
      >
        <el-option
            v-for="item in roleslist"
            :key="item.roleId"
            :label="item.roleNm"
            :value="item.roleId"
        />
      </el-select>
      </div>

  <div class="main-container">
      <el-tree
          :data="treeOptions"
          :props="defaultProps"
          show-checkbox
          @check="upper_lowerChange"
          :default-expand-all="true"
          :default-expanded-keys="[1]"
          ref="tree"
          node-key="id"/>
  </div>
  <div style="text-align:center">
    <el-button class="saveClass" @click="saveClick" type="primary">保存</el-button>
  </div>

</div>

</template>

<script>
export default {
  name: 'useLimit',
  allCheack: false,
  components: {},
  data () {
    return {
      // 控制popover弹出框是否展示
      popoverVisible: false,
      roleslist:[],
      roleId:[],
      roleMenu:[],
      menus:'',
      // 需把数据整理成以下结构
      // tree数据(children的id第一位为父级id，用于在select中清除某一点，可找到其父级去掉全选)
      treeOptions: [
        {id:'',name: '全部菜单',children: [
        {
          id: '1001',
          name: '数据填报',
          children: [
            {
              id: '10010001',
              name: '场所信息管理'
            }, {
              id: '10010002',
              name: '职员信息管理'
            }
          ]
        },
        {
          id: '1006',
          name: '系统管理',
          children: [
            {
              id: '10060001',
              name: '人员管理'
            }, {
              id: '10060002',
              name: '权限管理'
            }
          ]
        },
        {id: '1003', name: '监控接入管理'},
        {id: '1004', name: '预警事件管理'},
        {id: '1005', name: '日志信息管理'},
          ]}
      ],
      // select选择框选项
      typeOption: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // select的值
      typeValue: []
    }
  },
  created () {
    this.getRoleslist()
  },
  computed: {},
  watch: {},
  mounted () {},


  methods: {
    // 上下架树加载
    upper_lowerChange(node, checkStatus, childStatus) {
      if (checkStatus) {
        this.currentCheckChannelId = node.id;
      }
    },
    selecteRole(){
      this.clearTag()
      this.showMenu();
    },
    // 清空select
    clearTag () {
      // 清空tree选择
      this.$refs['tree'].setCheckedKeys([])
    },
    // 从select中单个移除时，保持tree选择值同步移除
    removeTag (data) {
      // 获取tree目前选择的值
      var chooseData = this.$refs['tree'].getCheckedKeys()
      var deleteIndex = ''
      // 找到chooseData中与清除的data相同的值
      chooseData.forEach((value, index) => {
        if (value === data) {
          deleteIndex = index
        }
      })
      // 从tree目前选择值中去掉
      chooseData.splice(deleteIndex, 1)
      // 若有全选情况，tree的选择值中有父级id，而select中无父级id，需用children的id找到父级id并去掉
      // 查找其父级id是否在chooseData中（即原来此父级是否全选），若在则去掉
      var findFatherData = chooseData.find(element => element === (data.split('-')[0]))
      if (findFatherData) {
        chooseData.splice(chooseData.indexOf(findFatherData), 1)
      }
      // 将修改后的值再赋给tree
      this.$refs['tree'].setCheckedKeys(chooseData)
    },

    /*角色下拉*/
    async getRoleslist(){
      this.$axios.get('/role/getRoles').then(successResponse => {
        if (successResponse.status === 200) {
          this.roleslist=successResponse.data;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },

    /*权限保存*/
    saveClick () {
      this.$refs['tree'].getCheckedNodes().forEach(value => {
        this.menus+=value.id+","
      })
      this.$axios.post('/menu/save',
          {
              roleId:this.roleId,
              menus:this.menus
            }
    ).then(successResponse => {
        if (successResponse.status === 200) {
          this.$message.info({message: '用户权限保存成功！', type: 'success'});
          // 对应事件cAdd
          // &emit向父组件提交form表单
          this.$emit('cAdd', this.form)
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },
    /*权限反显*/
    showMenu(){
      this.$axios.get('/menu/getByrole/'+this.roleId).then(successResponse => {
        if (successResponse.status === 200) {
          this.roleMenu=successResponse.data.parent
          this.$refs.tree.setCheckedKeys(this.roleMenu);

        }else{
          this.$router.replace({path: '/error'})
        }
      })
    }

  }
}
</script>
<style>
/* 把select的下拉框隐藏 */
.hiddenSel{
  display: none;
}

.roleclass{
  color: black;
  border: 1px solid black;
  top:0px;
  padding: 10px;
  margin-left:0px;
  margin-right: 900px;
  margin-bottom: 10px;

}
.main-container {
  color: black;
  border: 1px solid black;
  margin-left:0px;
  margin-right: 900px;
  padding: 10px;
}
</style>

