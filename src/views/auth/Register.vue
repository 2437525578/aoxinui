<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <span>用户注册</span>
        </div>
      </template>
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="auto"
        class="register-form"
        status-icon
        @keyup.enter="handleRegister"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-input v-model="registerForm.captcha" placeholder="请输入验证码" style="width: 60%"></el-input>
          <el-button type="primary" @click="getCaptcha" :disabled="captchaLoading" style="margin-left: 10px;">
            {{ captchaLoading ? `${captchaTimer}s` : '获取验证码' }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleRegister"
            class="register-button"
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="primary" @click="goToLogin">已有账号？去登录</el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
const router = useRouter()

const registerFormRef = ref(null)
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  captcha: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
    {
      validator: async (rule, value, callback) => {
        if (!value) {
          callback();
          return;
        }
        try {
          const res = await axios.post('http://127.0.0.1:8001/api/user/check-username/', { username: value });
          if (res.data.code === 409) {
            callback(new Error(res.data.message));
          } else {
            callback();
          }
        } catch (error) {
          callback(new Error('用户已存在'));
        }
      },
      trigger: 'blur'
    }
  ],
  password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 8, max: 20, message: '密码长度需在8-20位之间', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
          if (!reg.test(value)) {
            callback(new Error('密码需包含大小写字母和数字'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] },
    {
      validator: async (rule, value, callback) => {
        if (!value) {
          callback();
          return;
        }
        try {
          const res = await axios.post('http://127.0.0.1:8001/api/user/check-email/', { email: value });
          if (res.data.code === 409) {
            callback(new Error(res.data.message));
          } else {
            callback();
          }
        } catch (error) {
          callback(new Error('邮箱已存在'));
        }
      },
      trigger: 'blur'
    }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为 6 位', trigger: 'blur' }
  ]
})

const loading = ref(false)
const captchaLoading = ref(false)
const captchaTimer = ref(60)
let timer = null

const getCaptcha = async () => {
  if (!registerForm.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }

  // 验证邮箱格式
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(registerForm.email)) {
    ElMessage.error('请输入正确的邮箱格式');
    return;
  }

  captchaLoading.value = true
  captchaTimer.value = 60
  timer = setInterval(() => {
    if (captchaTimer.value > 0) {
      captchaTimer.value--
    } else {
      clearInterval(timer)
      captchaLoading.value = false
    }
  }, 1000)

  try {
    // 假设后端发送验证码的接口是 /api/user/send-verification-code/
    const res = await axios.post('http://127.0.0.1:8001/api/user/send-verification-code/', { email: registerForm.email });

    if (res.data.code === 200) {
      ElMessage.success('验证码已发送至您的邮箱');
    } else {
      ElMessage.error(res.data.message || '发送验证码失败');
      clearInterval(timer);
      captchaLoading.value = false;
    }
  } catch (error) {
    console.error('发送验证码请求失败:', error);
    const errorMsg = error.response?.data?.message || '发送验证码请求失败，请稍后再试';
    ElMessage.error(errorMsg);
    clearInterval(timer);
    captchaLoading.value = false;
  }
}

const handleRegister = async () => {
  const isValid = await registerFormRef.value.validate()
  if (!isValid) return

  loading.value = true
  try {
    const res = await axios.post('http://127.0.0.1:8001/api/user/register/', {
      username: registerForm.username,
      password: registerForm.password,
      email: registerForm.email,
      captcha: registerForm.captcha // 添加验证码字段
    });

    if (res.data.code === 201) { 
      ElMessage.success('注册成功！');
      router.push('/login');
    } else {
      console.log('后端返回错误信息:', res.data);
      ElMessage.error(res.data.message || '注册失败');
    }
  } catch (error) {
    console.error('注册请求失败:', error);
    const errorMsg = error.response?.data?.message || '注册请求失败，请稍后再试';
    ElMessage.error(errorMsg);
  } finally {
    loading.value = false;
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.register-card {
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.register-form .el-form-item {
  margin-bottom: 20px;
}

.register-button {
  width: 100%;
}

</style>