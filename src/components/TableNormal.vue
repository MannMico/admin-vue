<!--暂不可用-->
<template>
  <el-table>
    <el-table-colum
      v-for="(v, k) in tableData"
      :key="k"
      :prop="v.prop"
      :label="v.label"
      :width="v.width"
    ></el-table-colum>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: 'Object'
    }
  },
  data () {
    return {}
  }
}
</script>
<!--暂不可用-->
