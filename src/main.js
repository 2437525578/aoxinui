import { createApp } from 'vue'
import { createPinia } from 'pinia' // <-- 导入 Pinia
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// 添加 Axios 拦截器 (在 app 创建后)
configureAxiosInterceptors();

// 应用加载时验证 Token (在 app mount 之后或之前都可以)
// const authStore = useAuthStore();
// authStore.verifyTokenOnLoad();

// 配置 Axios 拦截器的函数
function configureAxiosInterceptors() {
    axios.interceptors.response.use(
        response => response, // 成功响应直接返回
        error => {
            if (error.response && error.response.status === 401) {
                // 如果收到 401 错误
                const authStoreInstance = useAuthStore();
                console.warn("API request returned 401, clearing auth info and redirecting to login.");
                authStoreInstance.clearAuthInfo(); // 清除状态和存储
                router.push('/login'); // 跳转到登录页
            }
            // 返回 Prmoise.reject 以便 .catch 可以继续处理
            return Promise.reject(error);
        }
    );
}

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 确保认证状态加载完成
  if (authStore.isLoading) {
    // 等待认证加载完成
    await new Promise(resolve => {
      const unwatch = authStore.$watch('isLoading', (newVal) => {
        if (!newVal) {
          unwatch(); // 停止监听
          resolve();
        }
      });
    });
  }

  // 检查是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    // 如果需要认证但用户未认证，则重定向到登录页
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    // 如果用户已认证，但尝试访问登录或注册页，则重定向到首页
    next('/');
  } else {
    next(); // 继续导航
  }
});