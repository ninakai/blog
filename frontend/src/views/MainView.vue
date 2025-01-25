<script setup>

import {onMounted, ref} from "vue";
import {formatDistanceToNow} from 'date-fns';
import {LogOut, Plus, MoveLeft, Check, CircleX, Pencil} from "lucide-vue-next";
import {useAuthStore} from "@/stores/AuthStore.js";
import {useRouter} from "vue-router";
import {getUserApi} from "@/api/user.js";
import {createArticle, deleteArticle, getArticle, updateArticle} from "@/api/article.js";
import VLoader from "@/components/VLoader.vue";

const authStore = useAuthStore();
const router = useRouter()

let showModal = ref(false);
let editableArticle = ref();
let showLoader = ref(false);
let articles = ref([]);
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
    } catch (e) {
        console.log(e.response);
    } finally {
        showLoader.value = false;
    }
}

const createArticleItem = async () => {
    try {
        if (titlearea.value.toString().trim() !== '') {
            const article = await createArticle(titlearea.value, picarea.value, textarea.value, user.data.username);
        }
    } catch (e) {
        console.log(e.response);
    } finally {
        titlearea.value = '';
        picarea.value = '';
        textarea.value = '';
        showModal.value = false;
        await getAllArticles();
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
    titlearea.value = article.title;
    picarea.value = article.picture;
    textarea.value = article.text;
    editableArticle.value = article;
}
const saveArticleItem = async () => {
    if (editableArticle.value) {
        editableArticle.value.title = titlearea.value;
        editableArticle.value.picture = picarea.value;
        editableArticle.value.text = textarea.value;
        editArticleItem(editableArticle.value);

        titlearea.value = '';
        picarea.value = '';
        textarea.value = '';

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

const discardArticleItem = async () => {
    if (editableArticle.value) {
        titlearea.value = '';
        picarea.value = '';
        textarea.value = '';
    }
    showModal.value = false;
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
            <div>
                <h1>Blog</h1>
                <button class="button_transparent button__logout" @click="logout">
                    <LogOut color="#FFB308" :size="27"></LogOut>
                </button>
            </div>
            <VLoader class="task-loader" v-if="showLoader"></VLoader>
            <template v-else>
                <div class="blog">
                    <div class="modal">
                        <input type="text" id="title" v-model="titlearea"
                               placeholder="Добавить заголовок..."/>

                        <input type="text" id="image" v-model="picarea"
                               placeholder="Добавить ссылку на изображение..."/>

                        <textarea id="text" v-model="textarea"
                                  placeholder="Добавить текст..."></textarea>

                        <button class="button_primary" @click="saveArticleItem">Создать</button>
                    </div>

                    <h2>Подборка статей</h2>

                    <div v-if="articles.length < 1" class="get-started">
                        <img src="" alt="No articles yet"/>
                        <p>Статей пока нет</p>
                    </div>
                    <template v-else>
                        <div class="article-grid">
                            <div class="article-item" v-for="(article, index) in articles" :key="index">
                                <div class="article-buttons">
                                    <button @click="editBtnHandler(article)" class="article-button article-button-edit">
                                        <Pencil color="#000000" :size="16"/>
                                    </button>
                                    <button @click="deleteArticleItem(article.id)"
                                            class="article-button article-button-delete">
                                        <CircleX color="#000000" :size="16"/>
                                    </button>
                                </div>
                                <img :src="`${article.picture}`" alt="Article Image" class="article-image"
                                     @click="viewArticle(article.id)"/>
                                <div class="article-details"
                                     @click="viewArticle(article.id)">
                                    <p class="article-time">
                                        {{ formatDistanceToNow(new Date(article.created_at), {addSuffix: true}) }}
                                    </p>
                                    <h3 class="article-title">{{ article.title }}</h3>
                                    <p class="article-description">{{ article.text.slice(0, 150) }}</p>
                                </div>
                            </div>
                        </div>
                    </template>
                    <p>© Блог, 2025</p>
                </div>
            </template>
        </main>
        <div class="modal" v-else>
            <div class="modal-header">
                <button class="button_transparent" @click="discardArticleItem">
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
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.23s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.main {
    .task-loader {
        margin-top: 50px;
    }

    .button__logout {
        display: block;
        margin: 0 15px 0 auto;
    }

    .button__create {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        height: 63px;
        width: 63px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border-radius: 50%;
        margin: 0 auto;
    }

    .get-started {
        margin: 100px 0;
        text-align: center;
    }
}

.modal {
    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.modal label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.modal input[type="text"],
.modal textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.modal textarea {
    height: 150px;
}

/* Style for the "Создать" button */
.button_primary {
    background-color: #4CAF50; /* Green */
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.button_primary:hover {
    background-color: #3e8e41;
}

.article-item {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    padding: 15px;
    border-radius: 10px;

    .article-item__group {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    input {
        margin-bottom: 0;
        width: auto;
    }

    .article-item__text {
        font-size: 20px;
        display: block;
        width: 100%;
        line-height: 200%;
    }
}

/* Basic styling for the blog layout */
.blog {
    font-family: Arial, sans-serif;
    margin: 20px;
}

.blog h1 {
    font-size: 2em;
    margin-bottom: 20px;
}

.blog h2 {
    font-size: 1.5em;
    margin-top: 30px;
    margin-bottom: 15px;
}

/* Article grid layout */
.article-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Two columns */
    gap: 20px; /* Space between grid items */
}

.article-item {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.article-item:hover {
    transform: translateY(-5px);
}

.article-image {
    width: 100%;
    height: 200px; /* Fixed height for the image */
    object-fit: cover; /* Cover the area, may crop the image */
}

.article-details {
    padding: 10px;
}

.article-time {
    font-size: 0.8em;
    color: #777;
    margin-bottom: 5px;
}

.article-title {
    font-size: 1.2em;
    margin-bottom: 8px;
}

.article-description {
    font-size: 1em;
    color: #333;
}

@media (max-width: 661px) {
    .article-grid {
        grid-template-columns: 1fr; /* Single column on very small screens */
    }

    .article-item {
        flex-direction: column; /* Stack image and details vertically */
    }
}

/* Existing styles... */

.article-item {
    position: relative; /*  Important: needed for absolute positioning of buttons */
    margin-top: 20px;
    display: flex;
    flex-direction: column; /* Changed to column for button positioning */
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
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
