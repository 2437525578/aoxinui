// src/stores/auth.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';

const backendUrl = 'http://127.0.0.1:8001'; // 您的后端地址

export const useAuthStore = defineStore('auth', () => {
  // 状态：尝试从 localStorage 或 sessionStorage 初始化
  const token = ref(localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null);
  const user = ref(JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo') || '{}'));
  const isAuthenticated = ref(false); // 初始为 false，需要验证
  const isLoading = ref(true); // 新增：认证状态加载中

  // 获取认证头 (辅助函数)
  function getAuthHeaders() {
      const currentToken = token.value; // 从 ref 获取当前 token
      if (currentToken) {
          return { Authorization: `Bearer ${currentToken}` };
      }
      return null;
  }

  // Action: 设置 Token 和用户信息
  function setAuthInfo(newToken, userInfo, rememberMe) {
    token.value = newToken;
    user.value = userInfo;
    isAuthenticated.value = true;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', newToken);
    storage.setItem('userInfo', JSON.stringify(userInfo)); // 将用户信息也存起来
    if (rememberMe) {
        localStorage.setItem('rememberedUsername', userInfo?.username || '');
    } else {
         localStorage.removeItem('rememberedUsername');
    }
  }

  // Action: 清除认证信息 (登出或 Token 失效)
  function clearAuthInfo() {
    token.value = null;
    user.value = {};
    isAuthenticated.value = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userInfo');
    // rememberedUsername 可以不清，用于下次填充
  }

  // Action: 应用加载时验证 Token (关键!)
  async function verifyTokenOnLoad() {
    console.log("verifyTokenOnLoad: 开始验证，isLoading = true");
    isLoading.value = true; // 开始加载
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!storedToken) {
      console.log("verifyTokenOnLoad: 没有找到 token，isAuthenticated = false");
      isAuthenticated.value = false;
      isLoading.value = false; // 没有 token，直接结束加载
      return; // 没有 token，直接返回
    }

    // 1. 前端先检查是否过期
    try {
        console.log("verifyTokenOnLoad: 前端检查 token 是否过期");
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        if (!decodedToken.exp || decodedToken.exp <= currentTime) {
            console.warn("Token expired (frontend check), clearing storage.");
            clearAuthInfo();
            isLoading.value = false; // token 过期，结束加载
            return;
        }
    } catch (error) {
        console.error("Invalid token (frontend check), clearing storage:", error);
        clearAuthInfo();
        isLoading.value = false; // token 无效，结束加载
        return;
    }

    // 2. 前端未过期，再向后端验证 (需要后端支持 /api/user/profile/ 或类似接口)
    try {
        console.log("verifyTokenOnLoad: 前端 token 未过期，向后端验证");
        // 假设有一个 /api/user/profile/ 接口，它需要有效 token 并返回用户信息
        const response = await axios.get(`${backendUrl}/api/user/profile/`, {
             headers: { Authorization: `Bearer ${storedToken}` }
        });

        // 后端验证成功
        token.value = storedToken; // 确认 token
        user.value = response.data; // 更新用户信息
        isAuthenticated.value = true;
        console.log("verifyTokenOnLoad: 后端验证成功，isAuthenticated = true");

        // 更新一下存储，确保一致性 (特别是 userInfo)
        const storageType = localStorage.getItem('authToken') ? localStorage : sessionStorage;
        storageType.setItem('userInfo', JSON.stringify(response.data));


    } catch (error) {
        // 后端验证失败 (401 或网络错误)
        console.error("Token verification failed (backend check):", error);
        clearAuthInfo(); // 清除认证信息
    } finally {
        console.log("verifyTokenOnLoad: 验证结束，isLoading = false");
        isLoading.value = false; // 结束加载
    }
  }

  return { token, user, isAuthenticated, setAuthInfo, clearAuthInfo, verifyTokenOnLoad, getAuthHeaders, isLoading }
})