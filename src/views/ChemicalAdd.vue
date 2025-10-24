<template>
  <div class="chemical-add-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>危化品百科添加</span>
        </div>
      </template>
      <el-form :model="formData" :rules="rules" ref="chemicalFormRef" label-width="150px">
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="化学品中文名称" prop="nameCn">
          <el-input v-model="formData.nameCn" placeholder="请输入化学品中文名称"></el-input>
        </el-form-item>
        <el-form-item label="CAS 号" prop="casNo">
          <el-input v-model="formData.casNo" placeholder="请输入CAS号"></el-input>
        </el-form-item>
        <el-form-item label="化学品英文名称" prop="nameEn">
          <el-input v-model="formData.nameEn" placeholder="请输入化学品英文名称"></el-input>
        </el-form-item>
        <el-form-item label="分子式" prop="molecularFormula">
          <el-input v-model="formData.molecularFormula" placeholder="请输入分子式"></el-input>
        </el-form-item>
        <el-form-item label="分子量" prop="molecularWeight">
          <el-input v-model="formData.molecularWeight" placeholder="请输入分子量"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="aliases">
          <el-input v-model="formData.aliases" placeholder="请输入别名，多个用逗号分隔"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="规格型号" prop="specification">
          <el-input v-model="formData.specification" placeholder="请输入规格型号"></el-input>
        </el-form-item>
        <el-form-item label="形态" prop="formState">
          <el-select v-model="formData.formState" placeholder="请选择形态">
            <el-option label="固体" value="solid"></el-option>
            <el-option label="液体" value="liquid"></el-option>
            <el-option label="气体" value="gas"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>

        <!-- 危险性信息 -->
        <el-divider content-position="left">危险性信息</el-divider>
        <el-form-item label="危险类别" prop="hazardClasses">
          <el-checkbox-group v-model="formData.hazardClasses">
            <el-checkbox label="易燃液体" name="hazardClasses"></el-checkbox>
            <el-checkbox label="腐蚀品" name="hazardClasses"></el-checkbox>
            <el-checkbox label="毒性物质" name="hazardClasses"></el-checkbox>
            <el-checkbox label="爆炸品" name="hazardClasses"></el-checkbox>
            <el-checkbox label="氧化剂" name="hazardClasses"></el-checkbox>
            <el-checkbox label="压缩气体" name="hazardClasses"></el-checkbox>
            <el-checkbox label="遇水放出易燃气体" name="hazardClasses"></el-checkbox>
            <el-checkbox label="自反应物质" name="hazardClasses"></el-checkbox>
            <el-checkbox label="有机过氧化物" name="hazardClasses"></el-checkbox>
            <el-checkbox label="其他" name="hazardClasses"></el-checkbox>
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

const chemicalFormRef = ref(null);

const formData = reactive({
  nameCn: '',
  nameEn: '',
  casNo: '',
  molecularFormula: '',
  molecularWeight: '',
  aliases: '',
  imageUrl: '',
  specification: '',
  formState: '',
  hazardClasses: [],
  hazardDescription: '',
  signalWord: '',
  hazardStatements: '',
  precautionaryStatements: '',
});

const rules = reactive({
  nameCn: [{ required: true, message: '请输入化学品中文名称', trigger: 'blur' }],
  casNo: [{ required: true, message: '请输入CAS号', trigger: 'blur' }],
  specification: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
  formState: [{ required: true, message: '请选择形态', trigger: 'change' }],
  hazardClasses: [{ type: 'array', required: true, message: '请至少选择一个危险类别', trigger: 'change' }],
  hazardDescription: [{ required: true, message: '请输入危险性描述', trigger: 'blur' }],
  signalWord: [{ required: true, message: '请选择信号词', trigger: 'change' }],
});

const handleImageSuccess = (response, uploadFile) => {
  formData.imageUrl = URL.createObjectURL(uploadFile.raw);
  ElMessage.success('图片上传成功！');
};

const beforeImageUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('图片必须是 JPG/PNG 格式!');
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  return true;
};

const submitForm = async () => {
  chemicalFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/chemical/add', formData);
        ElMessage.success(response.data.message);
        resetForm();
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '添加危化品失败！');
      }
    } else {
      ElMessage.error('请检查表单填写是否完整和正确。');
      return false;
    }
  });
};

const resetForm = () => {
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