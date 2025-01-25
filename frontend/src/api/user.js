import {$authHost, $host} from "@/api/index.js";

export const registerApi = async (username, password) => {
    const {user} = await $host.post('api/users/', {
        username, password
    })
    return {user}
}
export const getTokenApi = async (username, password) => {
    const {data} = await $host.post('api/jwt/create/', {
        username, password
    })
    return {data}
}
export const getUserApi = async () => {
    const {data} = await $authHost.get('api/users/me/')
    return {data}
}
export const getNewToken = async (refresh) => {
    const {data} = await $host.post('api/jwt/refresh/',{
        refresh
    })
    return {data}
}

