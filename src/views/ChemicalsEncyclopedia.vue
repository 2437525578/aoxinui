<template>
  <el-card>
    <el-table :data="chemicals" style="width: 100%">
      <el-table-column prop="nameCn" label="化学品中文名称" />
      <el-table-column prop="nameEn" label="化学品英文名称" />
      <el-table-column prop="casNo" label="CAS 号" />
      <el-table-column prop="molecularFormula" label="分子式" />
      <el-table-column prop="molecularWeight" label="分子量" />
      <el-table-column prop="aliases" label="别名" />
      <el-table-column label="图片">
        <template #default="scope">
          <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" style="width: 50px; height: 50px; object-fit: cover;" />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="specification" label="规格型号" />
      <el-table-column prop="formState" label="形态" />
      <el-table-column label="危险类别">
        <template #default="scope">
          {{ scope.row.hazardClasses.join(', ') }}
        </template>
      </el-table-column>
      <el-table-column prop="signalWord" label="等级" />
      <el-table-column prop="hazardDescription" label="危险性描述" />
      <el-table-column prop="hazardStatements" label="危险说明" />
      <el-table-column prop="precautionaryStatements" label="防范说明" />
    </el-table>
  </el-card>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const chemicals = ref([])

onMounted(async () => {
  const res = await axios.get('http://127.0.0.1:5000/api/chemical/list')
  chemicals.value = res.data
})
</script>

<style scoped>
/* Styles for ChemicalsEncyclopedia.vue */
</style>