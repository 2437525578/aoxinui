<template>
  <el-container class="common-layout">
    <el-aside width="200px" class="common-aside">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#28333D"
        text-color="#ffffff"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/dashboard">
          <i class="el-icon-menu"></i>
          <span slot="title">后台首页</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <i class="el-icon-location"></i>
            <span>系统用户</span>
          </template>
          <el-menu-item index="/users/admin">管理员</el-menu-item>
          <el-menu-item index="/users/teacher">负责教师</el-menu-item>
          <el-menu-item index="/users/student">学生用户</el-menu-item>
          <el-menu-item index="/user-management">用户管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="chemicals-encyclopedia">
          <template #title>
            <i class="el-icon-document"></i>
            <span slot="title">危化品百科管理</span>
          </template>
          <el-menu-item index="/chemicals/encyclopedia">危化品百科列表</el-menu-item>
          <el-menu-item index="/chemicals/encyclopedia/add">危化品百科添加</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/chemicals/warehouse">
          <i class="el-icon-setting"></i>
          <span slot="title">实验仓库管理</span>
        </el-menu-item>
        <el-menu-item index="/chemicals/classification">
          <i class="el-icon-setting"></i>
          <span slot="title">危化品分类管理</span>
        </el-menu-item>
        <el-menu-item index="/chemicals/production-classification">
          <i class="el-icon-setting"></i>
          <span slot="title">制作分类管理</span>
        </el-menu-item>
        <el-menu-item index="/purchase/application">
          <i class="el-icon-setting"></i>
          <span slot="title">采购申请管理</span>
        </el-menu-item>
        <el-menu-item index="/purchase/inbound">
          <i class="el-icon-setting"></i>
          <span slot="title">采购入库管理</span>
        </el-menu-item>
        <el-menu-item index="/borrow/application">
          <i class="el-icon-setting"></i>
          <span slot="title">领用申请管理</span>
        </el-menu-item>
        <el-menu-item index="/borrow/outbound">
          <i class="el-icon-setting"></i>
          <span slot="title">领用出库管理</span>
        </el-menu-item>
        <el-menu-item index="/scrap/application">
          <i class="el-icon-setting"></i>
          <span slot="title">报废申请管理</span>
        </el-menu-item>
        <el-menu-item index="/scrap/outbound">
          <i class="el-icon-setting"></i>
          <span slot="title">报废出库管理</span>
        </el-menu-item>
        <el-menu-item index="/allocation/application">
          <i class="el-icon-setting"></i>
          <span slot="title">调配申请管理</span>
        </el-menu-item>
        <el-menu-item index="/allocation/inbound">
          <i class="el-icon-setting"></i>
          <span slot="title">调配入库管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="common-header">
        <el-row type="flex" justify="space-between" align="middle" style="height: 100%;">
          <el-col :span="12">
            <div style="display: flex; align-items: center;">
              <img src="/favicon.ico" alt="Logo" class="header-logo" />
              <span class="header-title">欢迎使用高校实验室危化品管理系统</span>
            </div>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <i class="el-icon-user" style="margin-right: 10px;"></i>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ username }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="personalCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="common-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ElContainer, ElAside, ElHeader, ElMain, ElMenu, ElSubMenu, ElMenuItem, ElRow, ElCol, ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessage } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const username = ref('');

onMounted(() => {
  username.value = localStorage.getItem('username') || '用户';
});

const handleCommand = (command) => {
  if (command === 'logout') {
    localStorage.removeItem('username');
    localStorage.removeItem('rememberedUsername');
    localStorage.removeItem('rememberedPassword');
    localStorage.removeItem('autoLoginEnabled');
    localStorage.removeItem('autoLoginExpiration');
    sessionStorage.clear(); // Clear all sessionStorage
    ElMessage.success('退出登录成功！');
    router.push('/login');
  } else if (command === 'changePassword') {
    router.push('/change-password');
  } else {
    ElMessage.info(`点击了 ${command}`);
  }
};
</script>

<style scoped>
.common-layout {
  height: 100vh;
}

.common-aside {
  background-color: #28333D;
}

.common-header {
  background-color: #344050;
  color: #ffffff;
  line-height: 60px;
  display: flex;
  align-items: center;
  padding: 0 0 0 20px; /* 移除右侧内边距 */
}

.header-logo {
  height: 32px;
  margin-right: 10px;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.common-main {
  padding: 20px;
  background-color: #F5F7FA;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
}
</style>