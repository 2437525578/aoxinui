<template>
  <el-card>
    <el-table :data="chemicals" style="width: 100%">
      <el-table-column prop="nameCn" label="化学品中文名称" />
      <el-table-column label="图片" width="100">
        <template #default="scope">
          <el-image
            v-if="scope.row.image"
            :src="scope.row.image" 
            :preview-src-list="[scope.row.image]"
            style="width: 50px; height: 50px; object-fit: cover;"
            fit="cover"
            lazy
          />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="casNo" label="CAS 号" />
      <el-table-column prop="specification" label="规格型号" />
      <el-table-column prop="formState" label="形态" />
      <el-table-column label="危险类别">
        <template #default="scope">
          {{ Array.isArray(scope.row.hazardClasses) ? scope.row.hazardClasses.join(', ') : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="signalWord" label="等级" />

      <el-table-column label="操作" width="180"> <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          
          <el-popconfirm
            title="您确定要删除吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button type="danger" size="small">
                删除
              </el-button>
            </template>
          </el-popconfirm>
          </template>
      </el-table-column>
      </el-table>
  </el-card>

  <el-dialog v-model="editDialogVisible" title="编辑危化品" width="60%">
    <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="150px">
      <el-divider content-position="left">关键信息</el-divider>
      <el-form-item label="化学品中文名称" prop="nameCn">
        <el-input v-model="editForm.nameCn"></el-input>
      </el-form-item>
      <el-form-item label="CAS 号" prop="casNo">
        <el-input v-model="editForm.casNo"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="image">
        <el-image
          v-if="currentEditImage"
          :src="currentEditImage"
          style="width: 148px; height: 148px; margin-bottom: 10px; border-radius: 6px;"
          fit="cover"
        />
        <el-upload
          ref="editUploadRef"
          :auto-upload="false" 
          :limit="1"
          :on-change="handleEditFileChange"
          :on-exceed="handleEditFileExceed"
          list-type="picture-card"
        >
          <el-icon><Plus /></el-icon>
          <template #tip>
            <div class="el-upload__tip">
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="规格型号" prop="specification">
        <el-input v-model="editForm.specification"></el-input>
      </el-form-item>
      <el-form-item label="形态" prop="formState">
        <el-select v-model="editForm.formState" placeholder="请选择形态">
          <el-option label="固体" value="固体"></el-option>
          <el-option label="液体" value="液体"></el-option>
          <el-option label="气体" value="气体"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-divider content-position="left">危险性信息</el-divider>
      <el-form-item label="危险类别" prop="hazardClasses">
        <el-checkbox-group v-model="editForm.hazardClasses">
          <el-checkbox label="易燃液体" name="hazardClasses"></el-checkbox>
          <el-checkbox label="腐蚀品" name="hazardClasses"></el-checkbox>
          <el-checkbox label="毒性物质" name="hazardClasses"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="等级" prop="signalWord">
        <el-radio-group v-model="editForm.signalWord">
          <el-radio label="危险"></el-radio>
          <el-radio label="警告"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import axios from 'axios'
import { ref, reactive, onMounted } from 'vue'
import { ElImage, ElMessage, ElIcon, ElPopconfirm } from 'element-plus'

import { Plus } from '@element-plus/icons-vue'

const chemicals = ref([])
const backendUrl = 'http://127.0.0.1:8001';

// --- 编辑弹窗状态 ---
const editDialogVisible = ref(false)
const editFormRef = ref(null)
const editUploadRef = ref(null)
const currentEditImage = ref('') 
const newImageFile = ref(null)    
const editForm = reactive({
  id: null,
  nameCn: '',
  casNo: '',
  specification: '',
  formState: '',
  hazardClasses: [],
  signalWord: '',
  image: null,
})
const rules = reactive({
  nameCn: [{ required: true, message: '请输入化学品中文名称', trigger: 'blur' }],
  casNo: [{ required: true, message: '请输入CAS号', trigger: 'blur' }],
})

const fetchChemicals = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/chemical/`)
    chemicals.value = res.data.map(item => {
      if (item.image && !item.image.startsWith('http')) {
        item.image = `${backendUrl}${item.image}`;
      }
      if (typeof item.hazardClasses === 'string') {
        item.hazardClasses = item.hazardClasses.split(',').filter(Boolean);
      } else if (!Array.isArray(item.hazardClasses)) {
        item.hazardClasses = [];
      }
      return item;
    });
  } catch (error) {
    console.error("加载化学品列表失败:", error)
    ElMessage.error("加载化学品列表失败")
  }
}
onMounted(fetchChemicals)


const handleEdit = (row) => {
  Object.assign(editForm, row);
  currentEditImage.value = row.image || ''; 
  newImageFile.value = null;              
  editUploadRef.value?.clearFiles();
  editDialogVisible.value = true;
};
const handleEditFileChange = (uploadFile) => {
  newImageFile.value = uploadFile.raw; 
  currentEditImage.value = URL.createObjectURL(uploadFile.raw); 
};
const handleEditFileExceed = (files) => {
  editUploadRef.value?.clearFiles();
  const file = files[0];
  editUploadRef.value?.handleStart(file);
  newImageFile.value = file;
  currentEditImage.value = URL.createObjectURL(file);
};
const submitEditForm = async () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      const postData = new FormData();
      postData.append('nameCn', editForm.nameCn);
      postData.append('casNo', editForm.casNo);
      postData.append('specification', editForm.specification);
      postData.append('formState', editForm.formState);
      postData.append('signalWord', editForm.signalWord);
      
      if (Array.isArray(editForm.hazardClasses)) {
        editForm.hazardClasses.forEach(item => {
          postData.append('hazardClasses', item);
        });
      }
      if (newImageFile.value) {
        postData.append('image', newImageFile.value);
      }

      try {
        await axios.put(`${backendUrl}/api/chemical/${editForm.id}/`, postData);
        ElMessage.success('修改成功！');
        editDialogVisible.value = false; 
        fetchChemicals(); 
      } catch (error) {
        console.error("修改失败:", error.response?.data);
        ElMessage.error(error.response?.data?.message || '修改失败！');
      }
    } else {
      ElMessage.error('请检查表单填写是否完整和正确。');
      return false;
    }
  });
};

const handleDelete = async (row) => {
  try {
    // 向 /api/chemical/{id}/ 发送 DELETE 请求
    await axios.delete(`${backendUrl}/api/chemical/${row.id}/`);
    ElMessage.success('删除成功！');
    fetchChemicals();
  } catch (error) {
    console.error("删除失败:", error);
    ElMessage.error(error.response?.data?.message || '删除失败！');
  }
};


</script>

<style scoped>
</style>