<template>
<div class="stepComponent" >
    <div class="stepsTitle">
      <div style="float:left;width:2px;height:20px; background:#219AFF;"></div>
        审批流程及意见
    </div>
    <div class="approvalProcess" >
        <el-steps :active="active" finish-status="success" direction="vertical" >
           <el-step :title="item.label"  v-for="item in approvalProcessProject" :id="item.id">
            <template slot="description" >
             <div class="step-row" v-for="item in approvalProcessProject">
               <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
                     <tr>
                        <td style="color:#98A6BE">
                            <div class="processing_content_detail" style="float:left;width:70%"><span >申请人&nbsp;&nbsp;<span style="color:#219AFF">圆领{{}}</span>&nbsp;&nbsp;提交了割接方案</span></div>
                          <div class="processing_content_detail" style="float:right;"><span ><i class="el-icon-time"></i>&nbsp;&nbsp;昨天12:24</span> </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                            <div class="processing_content_detail" style="float:left;width:70%">
                            <div style="float:left;width: 2px;height: 20px; background:#C7D4E9;margin-left:10px;margin-right:10px"></div>
                            <span style="color:#919FB8">同意，建议通过</span></div>
                        </td>
                      </tr>
                </table>
           </div>
         </template>

           </el-step>
        </el-steps>
         <el-button style="margin-top: 12px;" @click="next">下一步</el-button>

  </div>

</div>
</template>
<script>

export default {
   components: {
  },
  props: ['data', 'defaultActive'],
  data() {
    return {
       active: 0,
       approvalProcessProject:[
           {id:'0',label: "方案制定"},
           { id:'1',label: "割接方案会审"},
           { id:'2',label: "割接审批"},
           { id:'3',label: "审批成功"},
       ],
    };
  },
   watch: {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
     next() {
        if (this.active++ > 2) this.active = 0;
      },
  }
};
</script>
<style scoped>
  .stepComponent{
      background-color:#DFEBFF;
      width: 100%-20px;
      padding: 10px 10px 10px 10px;
      margin: 10px 10px 10px 10px;
  }
  .stepsTitle{
      margin: 10px 0px  10px  10px ;
  }
  .approvalProcess{
      color: #9EADC4;
      font-size: 14px;
      /* width: 100%; */
      background:#DFEBFF;
      margin-left:20px;
      margin-right:0px;
      margin-top:10px;
  }
  .processing_content{
    background-color: #D9E5F9;
  }
  .processing_content_detail{
     margin-left: 10px;
     margin-top: 3.5px;
     margin-bottom: 3.5px;
	   width:150px;
     display:inline-block;
  }
  .step-row{
     min-width:500px;
     margin-bottom:12px;
     margin-top:12px;
  }
</style>