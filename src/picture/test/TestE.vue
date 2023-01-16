<!-- vue + element 树形选择框（多选框）实现 -->
<!-- 思路：隐藏el-select的下拉框，改用el-popover弹出框和el-tree控件组合-->
<template>
  <div class="main-container">
    <span style="font-size: 16px">类型:</span>
    <el-popover
        v-model="popoverVisible"
        placement="bottom"
        width="200"
        trigger="click"> <!-- click:点击select时弹出框显示 -->
      <!-- popover+tree用于选择，树形控件放在弹出框中 -->
      <el-tree
          :data="treeOptions"
          :props="defaultProps"
          show-checkbox
          @check="checkChange"
          ref="tree"
          node-key="id"/>
      <!-- select展示选择结果，储存选择值typeValue -->
      <el-select
          slot="reference"
          multiple
          collapse-tags
          v-model="typeValue"
          placeholder="请选择"
          popper-class="hiddenSel"
          clearable
          @clear="clearTag"
          @remove-tag="removeTag">
        <el-option
            v-for="item in typeOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
      </el-select>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'userLimit',
  components: {},
  data () {
    return {
      // 控制popover弹出框是否展示
      popoverVisible: false,
      // 需把数据整理成以下结构
      // tree数据(children的id第一位为父级id，用于在select中清除某一点，可找到其父级去掉全选)
      treeOptions: [
        {
          id: '1',
          name: '父级1',
          children: [
            {
              id: '1-1',
              name: '类型1'
            }, {
              id: '1-2',
              name: '类型2'
            }, {
              id: '1-3',
              name: '类型3'
            }, {
              id: '1-4',
              name: '类型4'
            }, {
              id: '1-5',
              name: '类型5'
            }
          ]
        }, {
          id: '2',
          name: '父级2',
          children: [
            {
              id: '2-1',
              name: '类型6'
            }, {
              id: '2-2',
              name: '类型7'
            }
          ]
        }
      ],
      // select选择框选项
      typeOption: [
        {
          id: '1',
          name: '父级1'
        },
        {
          id: '1-1',
          name: '类型1'
        }, {
          id: '1-2',
          name: '类型2'
        }, {
          id: '1-3',
          name: '类型3'
        }, {
          id: '1-4',
          name: '类型4'
        }, {
          id: '1-5',
          name: '类型5'
        }, {
          id: '2',
          name: '父级2'
        }, {
          id: '2-1',
          name: '类型6'
        }, {
          id: '2-2',
          name: '类型7'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // select的值
      typeValue: []
    }
  },
  created () {


  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    // tree选择值修改时
    checkChange () {
      this.typeValue = []
      // 将tree选择的id赋值给select
      this.$refs['tree'].getCheckedNodes().forEach(value => {
        // 父级在select中不展示
        if (value.id.indexOf('-') > 0) {
          this.typeValue.push(value.id)
        }
      })
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

    async getMenuList() {
      this.$axios.get('/menu/find', {
      }).then(successResponse => {
        if (successResponse.status === 200) {
          this.treeOptions=successResponse.data;//这里resp里面返回的数据是个对象，真正的数据在resp的data里；
        }else{
          this.$fire({
            text: "后台错误，请联系管理员！",
            timer: 3000
          })
        }
      })
    },
  }
}
</script>
<style>
/* 把select的下拉框隐藏 */
.hiddenSel{
  display: none;
}
</style>

