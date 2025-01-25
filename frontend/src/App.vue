<script setup>
import {RouterView, useRouter} from 'vue-router'
import {useAuthStore} from "@/stores/AuthStore.js";
import {useUserStore} from "@/stores/UserStore.js";
import {onMounted} from "vue";

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

onMounted( async () => {
    await userStore.getUser()
    if (!userStore.user) {
        authStore.logout()
    }
})

</script>

<template>
    <RouterView/>
</template>

<style scoped>
</style>
