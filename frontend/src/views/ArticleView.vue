<script setup>

import {onMounted, ref} from "vue";
import {formatDistanceToNow} from 'date-fns';
import {LogOut, Plus, MoveLeft, Check, CircleX, Pencil} from "lucide-vue-next";
import {useAuthStore} from "@/stores/AuthStore.js";
import {useRouter, useRoute} from "vue-router";
import {getUserApi} from "@/api/user.js";
import {getOneArticle, deleteArticle, getArticle, updateArticle} from "@/api/article.js";
import VLoader from "@/components/VLoader.vue";

const authStore = useAuthStore();

const route = useRoute()
const router = useRouter()

let showModal = ref(false);
let editableArticle = ref();
let showLoader = ref(false);
let articles = ref([]);
let article = ref();
let user = ref();
let titlearea = ref('');
let picarea = ref('');
let textarea = ref('');
const logout = () => {
    authStore.logout()
    router.push('/login')
}
const getAllArticles = async () => {
    try {
        user = await getUserApi();
        showLoader.value = true;
        articles.value = await getArticle();
        article = await getOneArticle(route.params.articleId);
    } catch (e) {
        console.log(e.response);
    } finally {
        showLoader.value = false;
    }
}

const deleteArticleItem = async (id) => {
    try {
        const data = await deleteArticle(id);
        console.log(data)
    } catch (e) {
        console.log(e.response);
    } finally {
        await getAllArticles();
    }
}
const editBtnHandler = (article) => {
    showModal.value = true;
    titlearea.value = article.data.title;
    picarea.value = article.data.picture;
    textarea.value = article.data.text;
    editableArticle.value = article;
}
const saveArticleItem = async () => {
    if (editableArticle.value) {
        editableArticle.value.title = titlearea.value;
        editableArticle.value.picture = picarea.value;
        editableArticle.value.text = textarea.value;
        editArticleItem(editableArticle.value);
        showModal.value = false;
    } else {
        createArticleItem();
    }
    showModal.value = false;
}
const editArticleItem = async (article) => {
    console.log(article)
    try {
        const data = await updateArticle(article);
        console.log(data)
    } catch (e) {
        console.log(e.response);
    } finally {
        await getAllArticles();

    }
}

onMounted(async () => {
    await getAllArticles();
    if (authStore.authError) {
        logout()
    }
})

const viewArticle = (articleId) => {
    router.push(`/article/${articleId}`); // Navigate to the article view page
}
</script>

<template>
    <transition name="fade" mode="out-in">
        <main class="main" v-if="!showModal">
            <button class="button_transparent" @click="router.back();">
                <MoveLeft color="#FFB308"
                          :size="37"></MoveLeft>
            </button>
            <button class="button_transparent button__logout" @click="logout">
                <LogOut color="#FFB308" :size="27"></LogOut>
            </button>
            <VLoader class="task-loader" v-if="showLoader"></VLoader>
            <template v-else>
                <div class="blog">
                    <template v-if="article && article.data">
                        <div class="article-buttons">
                            <button @click="editBtnHandler(article)" class="article-button article-button-edit">
                                <Pencil color="#000000" :size="16"/>
                            </button>
                            <button @click="deleteArticleItem(article.id)"
                                    class="article-button article-button-delete">
                                <CircleX color="#000000" :size="16"/>
                            </button>
                        </div>
                        <div class="article-header">
                            <h1>{{ article.data.title }}</h1>
                        </div>
                        <div class="article-image-container">
                            <img :src="article.data.picture" alt="Article Image" class="article-image"/>
                        </div>
                        <div class="article-meta">
                            <p class="author">Автор: {{ article.data.author }}</p>
                            <p class="article-time">
                                {{ formatDistanceToNow(new Date(article.data.created_at), {addSuffix: true}) }}
                            </p>
                        </div>
                        <div class="article-content">
                            <p v-html="article.data.text"></p>
                        </div>
                    </template>
                    <p v-else>Loading article...</p>
                    <p>© Блог, 2025</p>
                </div>
            </template>
        </main>
        <div class="modal" v-else>
            <div class="modal-header">
                <button class="button_transparent" @click="showModal = false">
                    <MoveLeft color="#FFB308"
                              :size="37"></MoveLeft>
                </button>
                <button class="button_transparent" @click="saveArticleItem">
                    <Check color="#FFB308"
                           :size="37"></Check>
                </button>
            </div>
            <textarea v-model="titlearea" id="story"
                      name="story_title" rows="1" placeholder="Добавить заголовок..."
                      autofocus></textarea>
            <textarea v-model="picarea" id="story"
                      name="story_pic" rows="1" placeholder="Добавить картинку..."></textarea>
            <textarea v-model="textarea" id="story"
                      name="story_text" rows="15" placeholder="Добавить текст..."></textarea>
        </div>
    </transition>
</template>

<style scoped>
/* Existing styles... */
.article-header {
    margin-bottom: 20px;
}

.article-image-container {
    max-height: 400px; /* Adjust as needed */
    overflow: hidden;
}

.article-image {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
}

.article-content {
    line-height: 1.6; /* Adjust as needed */
    font-size: 1em;
}

.author {
    font-style: italic;
    font-size: 0.9em;
}

.article-time {
    font-size: 0.8em;
    color: #777;
}

/* Style for the edit/delete buttons */
.article-buttons {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
    z-index: 10; /* Ensure buttons are above other content */
}

.article-button {
    background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white */
    border: none;
    border-radius: 50%; /* Circular buttons */
    width: 28px; /* Adjust size as needed */
    height: 28px; /* Adjust size as needed */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    padding: 0;
}

.article-button:hover {
    background-color: rgba(255, 255, 255, 1); /* Slightly darker on hover */
}

.article-button-edit {
    /* Add specific styles for the edit button if needed */
}

.article-button-delete {
    /* Add specific styles for the delete button if needed */
}


/* Basic styling for the blog layout */
.blog {
    font-family: Arial, sans-serif;
    margin: 20px;
}

/* ...rest of your styles */

</style>
