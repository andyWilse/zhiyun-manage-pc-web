<template>
        <el-form ref="form" :model="form" label-width="80px" :rules="formRules">

<el-row>
<el-form-item label="场所名称" prop="venuesName">
 <region-selects
    :town="true"
    v-model="region"
    @change="regionChange"
  />              </el-form-item>

   </el-row>
   </el-form>
</template>

<script>
import { RegionSelects } from 'v-region'

export default {
  components: {
    RegionSelects
  },
  methods: {
    // Responding to data changes
    regionChange (data) {
      console.log(data)
    }
  }
}
</script>