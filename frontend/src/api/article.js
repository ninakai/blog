import {$authHost} from "@/api/index.js";

export const getArticle = async () => {
    const articles = await $authHost.get('articles')
    return articles.data
}

export const createArticle = async (title, picture, text, author) => {
    const {article} = await $authHost.post('articles', {
        title, picture, text, author
    })
    return {article}
}

export const updateArticle = async ({id, title, picture, text}) => {
    const {data} = await $authHost.put(`articles/${id}`, {
        title, picture, text
    })
    return {data}
}

export const getOneArticle = async (id) => {
    const {data} = await $authHost.get(`articles/${id}`)
    return {data}
}

export const deleteArticle = async (id) => {
    return await $authHost.delete(`articles/${id}`)
}

