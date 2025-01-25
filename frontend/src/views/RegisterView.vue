
<script setup>
import {RouterLink, useRouter} from 'vue-router'
import {useAuthStore} from "@/stores/AuthStore.js";
import VLoader from "@/components/VLoader.vue";

const authStore = useAuthStore();
const router = useRouter()
const register = async () => {
    await authStore.register()
    if (!authStore.authError) {
        console.log('no error register')
        await authStore.login()
        await router.push('/')
    } else {
        console.log('error register', authStore.authError)
    }
}
</script>
<template>
    <div class="page-container">
        <header class="header">
                <h1>Blog</h1>
        </header>
        <main>
        <div class="auth">
            <h3>Регистрация</h3>
            <form @keydown.enter.prevent="register" @submit.prevent="register">
                <label>
                    <small v-if="authStore.authError">
                        {{ authStore.authError.username?.toString() || authStore.authError.detail }}
                    </small>
                    <input type="text" placeholder="Логин" v-model="authStore.username">
                </label>
                <label>
                    <small v-if="authStore.authError">
                        {{ authStore.authError.password?.toString() || authStore.authError.detail }}
                    </small>
                    <input type="password" placeholder="Пароль" v-model="authStore.password">
                </label>
                <button type="submit" v-if="!authStore.loading">Зарегистрироваться</button>
                <VLoader class="auth-loader" v-else></VLoader>
            </form>
            <p>Уже есть аккаунт?
                <RouterLink to="/login">Войти</RouterLink>
            </p>
        </div>
        </main>
        <footer class="footer">
                <p>&copy; Blog, 2024</p>
        </footer>
    </div>
</template>

<style scoped>
.page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.auth {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    max-width: 400px;
    margin: auto;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.footer {
    background-color: #f1f1f1;
    color: #333;
    padding: 1rem;
    text-align: center;
    border-top: 1px solid #ddd;
    margin-top: 2rem;
}
h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
}

form {
    width: 100%;
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 1rem;
}

.auth-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
}
</style>
