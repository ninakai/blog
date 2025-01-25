import {ref} from 'vue'
import {defineStore} from 'pinia'
import {getTokenApi, registerApi,} from "@/api/user.js";

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(localStorage.getItem('access')?.toString())
    const refreshToken = ref(localStorage.getItem('refresh')?.toString())
    const password = ref('');
    const username = ref('');
    const authError = ref('');
    const loading = ref(!!accessToken.value);
    const login = async () => {
        try {
            loading.value = true;
            const result = await getTokenApi(username.value, password.value);
            accessToken.value = result.data.access;
            refreshToken.value = result.data.refresh;
            localStorage.setItem('access', result.data.access)
            localStorage.setItem('refresh', result.data.refresh)
        } catch (e) {
            authError.value = e.response.data || 'Произошла ошибка';
        } finally {
            loading.value = false;
        }
    };
    const register = async () => {
        try {
            loading.value = true;
            await registerApi(username.value, password.value);
        } catch (e) {
            authError.value = e.response.data || 'Произошла ошибка';
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        accessToken.value = null;
        refreshToken.value = null;
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        password.value = '';
        username.value = '';
        loading.value = false;
    };

    return {
        login,
        register,
        logout,
        username,
        password,
        loading,
        authError,
        accessToken,
        refreshToken,
    };
})
