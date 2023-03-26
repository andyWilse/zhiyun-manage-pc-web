<template>
  <el-table
      :data="tableData"
      class="permissionstable"
      height="267px"
      :show-header="false"
      style="width: 26%; border: 1px solid #dfe6ec; margin: 0 auto; top: 25%"
      :default-expand-all="true"
  >
    <el-table-column type="expand" width="35px">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item>
            <el-checkbox-group
                v-model="props.row.resourceNameList"
                class="resourceCheckClass"
            >
              <el-checkbox
                  v-for="(item, index) in props.row.children"
                  :key="index"
                  :value="item.resourceId"
                  :label="item.resourceId"
                  name="type"
                  @change="resourceCheckItem(props.row, props.row.children)"
                  style="width: 100px"
                  :disabled="props.row.chargingEventsDisabled"
              >{{ item.resourceName }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column width="25">
      <template slot-scope="props">
        <el-checkbox
            :indeterminate="props.row.isIndeterminate"
            v-model="props.row.checkAll"
            @change="handleSelectionChange(props.row, props.row.children)"
            :disabled="props.row.chargingEventsDisabled"
        >全选</el-checkbox
        >
      </template>
    </el-table-column>
    <el-table-column label="resourceName" prop="resourceName" width="80">
    </el-table-column>
<!--    <el-table-column>
      <template slot-scope="props" width="35">
        <div
            :style="{
            display: props.row.chargingEventsDisabled ? 'block' : 'none',
          }"
            style="color: red"
        >
          *此模块无权限
        </div>
      </template>
    </el-table-column>-->
  </el-table>
</template>

<script>
export default {
  name: "limitIndex",
  data() {
    return {
      // 需要展示的数据
      tableData: [],
      // 后台返回的数据
      tableData2: [
        {
          resourceId: "0",
          resourceName: "用户管理",
          isSelected: "0",
          children: [
            {
              resourceId: "00",
              resourceName: "查看",
              isSelected: "0",
            },
            {
              resourceId: "01",
              resourceName: "新增",
              isSelected: "0",
            },

              ]

        }

          ]


    };
    },
  created() {},
  mounted() {
    this.getTableData();
  },
  methods: {
    // 获取表格数据
    getTableData() {
      // 实际开发中，在这里会请求后台数据，得到tableData2这个数组，
      // _.cloneDeep是为了深度克隆tableData2，以免之后的操作影响到原数组
      let tableData = _.cloneDeep(this.tableData2);
      tableData.forEach((item) => {
        if (item.children && item.children.length > 0) {
          // 存放选中的数据
          let selectDataList = [];
          item.children.forEach((evt) => {
            if (Number(evt.isSelected === 1)) {
              selectDataList.push(evt.resourceId);
            }
          });
          // resourceNameList是el-checkbox-group中v-model需要绑定的数据，必须是一个数组，存放选中的数据
          item.resourceNameList = selectDataList;
          // checkAll是判断当前目录是否全选
          item.checkAll = selectDataList.length === item.children.length;
          if (item.checkAll) {
            item.isSelected = "1";
          }
          // isIndeterminate是判断当前目录是否为半选中状态
          item.isIndeterminate =
              selectDataList.length > 0 &&
              selectDataList.length < item.children.length;
          // 如果是收费事件，则禁用复选框
          if (item.resourceName === "收费事件") {
            item.chargingEventsDisabled = true;
          }
        }
      });
      // 将处理好的数据赋给真正需要渲染到页面上的数组
      this.tableData = tableData;
    },
    // 子目录选中事件
    resourceCheckItem(evt, val) {
      let checkedCount = val.length;
      let refResourceNameList = _.cloneDeep(evt.resourceNameList);
      let childrenData = _.cloneDeep(evt.children);
      let deleteIdList = [];
      childrenData.forEach((item) => {
        deleteIdList.push(item.resourceId);
      });
      // 两个数组比较，取出相同的元素，代表当前选中的数据
      let date = refResourceNameList.filter(
          (item) => deleteIdList.indexOf(item) > -1
      );
      // 当前所有数据长度等于选中数据的长度，则表示全选状态
      evt.checkAll = checkedCount === date.length;
      // 当前半选中状态要等于当前选中的数据长度大于0并且当前选中的数据长度小于当前的所有数据长度
      evt.isIndeterminate = date.length > 0 && date.length < checkedCount;
    },
    // 目录全选事件
    handleSelectionChange(evt, val) {
      // 如果checkAll为true表示全选，否则取消全选
      if (evt.checkAll) {
        if (evt.children && evt.children.length > 0) {
          let childrenDataList = _.cloneDeep(evt.children);
          let optionsData = [];
          // 拿到子目录的数据，并将子目录里的isSelected都赋值为1
          childrenDataList.forEach((item) => {
            item.isSelected = "1";
            optionsData.push(item.resourceId);
          });
          // 如果之前已经有选中的，则追加
          let refResourceNameList = _.cloneDeep(evt.resourceNameList);
          let arr = refResourceNameList.concat(optionsData);
          // 去重
          evt.resourceNameList = Array.from(new Set(arr));
          // 将当前目录的isSelected赋值为1
          evt.isSelected = "1";
          // 取消半选中状态
          evt.isIndeterminate = false;
        }
      } else {
        let refResourceNameList = _.cloneDeep(evt.resourceNameList);
        let childrenData = _.cloneDeep(evt.children);
        let deleteIdList = [];
        childrenData.forEach((item) => {
          deleteIdList.push(item.resourceId);
        });
        // 进行这一步操作是因为所有数据都在一个表格里，为了防止取消全选则全部取消全选的问题，这样可以控制只取消当前目录
        // 删除数据相同的元素
        let arr = refResourceNameList.filter(
            (item) => !deleteIdList.some((i) => i == item)
        );
        evt.isSelected = "0";
        evt.resourceNameList = arr;
      }
    },
  },
};
</script>

<style scoped>
.el-form--inline .el-form-item {
  margin-left: 45px;
}
/* 滚动条 */
::-webkit-scrollbar {
  width: 5px;
  height: 6px;
}
::-webkit-scrollbar-button,
::-webkit-scrollbar-button:vertical {
  display: none;
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-track:vertical {
  border-radius: 10px;
  background-color: black;
}
::-webkit-scrollbar-track-piece {
  background-color: #dce7f0;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-thumb:vertical {
  border-radius: 10px;
  background-color: #1890ff;
}
::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:vertical:hover {
  background: #1890ff;
}
</style>