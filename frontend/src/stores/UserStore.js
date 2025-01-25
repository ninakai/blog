import {ref} from 'vue'
import {defineStore} from 'pinia'
import {getUserApi} from "@/api/user.js";
import {useAuthStore} from "@/stores/AuthStore.js";

export const useUserStore = defineStore('user', () => {
    const user = ref();
    const getUser = async () => {
        try {
            user.value = await getUserApi();
        } catch (e) {
            if (e.status == 401) {
                useAuthStore().logout();
            }
            if (e.status == 500) {
                useAuthStore().logout();
            }
        }
    };
    return {
        user,
        getUser,
    };
})
