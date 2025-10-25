<template>
  <div class="chemical-add-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>危化品百科添加</span>
        </div>
      </template>
      <el-form :model="formData" :rules="rules" ref="chemicalFormRef" label-width="150px">
        <el-divider content-position="left">关键信息</el-divider>
        <el-form-item label="化学品中文名称" prop="nameCn">
          <el-input v-model="formData.nameCn" placeholder="请输入化学品中文名称"></el-input>
        </el-form-item>
        <el-form-item label="CAS 号" prop="casNo">
          <el-input v-model="formData.casNo" placeholder="请输入CAS号"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
            ref="uploadRef"
            :auto-upload="false" 
            :limit="1"
            :on-change="handleFileChange"
            :on-exceed="handleFileExceed"
            list-type="picture-card"
          >
             <el-icon><Plus /></el-icon>
          </el-upload>
          </el-form-item>
        <el-form-item label="规格型号" prop="specification">
          <el-input v-model="formData.specification" placeholder="请输入规格型号"></el-input>
        </el-form-item>
        <el-form-item label="形态" prop="formState">
          <el-select v-model="formData.formState" placeholder="请选择形态">
            <el-option label="固体" value="固体"></el-option>
            <el-option label="液体" value="液体"></el-option>
            <el-option label="气体" value="气体"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        
        <el-divider content-position="left">危险性信息</el-divider>
        <el-form-item label="危险类别" prop="hazardClasses">
          <el-checkbox-group v-model="formData.hazardClasses">
            <el-checkbox label="易燃液体" name="hazardClasses"></el-checkbox>
            <el-checkbox label="腐蚀品" name="hazardClasses"></el-checkbox>
            <el-checkbox label="毒性物质" name="hazardClasses"></el-checkbox>
            <el-checkbox label="爆炸品" name="hazardClasses"></el-checkbox>
            <el-checkbox label="氧化剂" name="hazardClasses"></el-checkbox>
            <el-checkbox label="压缩气体" name="hazardClasses"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="等级" prop="signalWord">
          <el-radio-group v-model="formData.signalWord">
            <el-radio label="危险"></el-radio>
            <el-radio label="警告"></el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">立即创建</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const chemicalFormRef = ref(null);
const uploadRef = ref(null);
const router = useRouter();
const formData = reactive({
  nameCn: '',
  casNo: '',
  specification: '',
  formState: '',
  hazardClasses: [],
  signalWord: '',
  image: null,
});

const rules = reactive({
  nameCn: [{ required: true, message: '请输入化学品中文名称', trigger: 'blur' }],
  casNo: [{ required: true, message: '请输入CAS号', trigger: 'blur' }],
  specification: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
  formState: [{ required: true, message: '请选择形态', trigger: 'change' }],
  hazardClasses: [{ type: 'array', required: true, message: '请至少选择一个危险类别', trigger: 'change' }],
  signalWord: [{ required: true, message: '请选择信号词', trigger: 'change' }],
});

const handleFileChange = (uploadFile) => {
  // 存储原始文件对象，而不是 URL
  formData.image = uploadFile.raw; 
};

// --- 处理文件超出限制 ---
const handleFileExceed = (files) => {
  uploadRef.value.clearFiles(); // 清除旧文件
  const file = files[0]; 
  uploadRef.value.handleStart(file); // 添加新文件
  formData.image = file; // 存储新文件
};

const submitForm = async () => {
  chemicalFormRef.value.validate(async (valid) => {
    if (valid) {
      const postData = new FormData();
      postData.append('nameCn', formData.nameCn);
      postData.append('casNo', formData.casNo);
      postData.append('specification', formData.specification);
      postData.append('formState', formData.formState);
      postData.append('signalWord', formData.signalWord);
      // 附加 hazardClasses 列表
      formData.hazardClasses.forEach(item => {
        postData.append('hazardClasses', item);
      });

      // 3. 附加图片文件 (如果存在)
      if (formData.image) {
        postData.append('image', formData.image);
      }
      try {
        await axios.post('http://127.0.0.1:8001/api/chemical/', postData, {
          headers: {
            // (axios 会自动设置 'Content-Type': 'multipart/form-data')
          }
        });
        ElMessage.success("危化品添加成功！");
        resetForm();
        router.push('/chemicals/encyclopedia');
      } catch (error) {
        ElMessage.error('添加危化品失败！');
      }
    } else {
      ElMessage.error('请检查表单填写是否完整和正确。');
      return false;
    }
  });
};

const resetForm = () => {
  uploadRef.value.clearFiles();
  chemicalFormRef.value.resetFields();
};
</script>

<style scoped>
.chemical-add-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.box-card {
  width: 100%;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.el-divider {
  margin-top: 30px;
  margin-bottom: 20px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>