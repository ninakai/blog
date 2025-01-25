import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import MainView from "@/views/MainView.vue";
import ArticleView from "@/views/ArticleView.vue";
import {useAuthStore} from "@/stores/AuthStore.js";
import {createRouter, createWebHistory} from "vue-router";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            // anybody can
            meta: {requiresAuth: false},
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            // anybody can
            meta: {requiresAuth: false},
        },
        {
            path: '/',
            name: 'main',
            component: MainView,
            // only authenticated users can create
            meta: {requiresAuth: true},
        },
        {
            path: '/article/:articleId', //Add the new route for individual articles
            name: 'article',
            component: ArticleView,
            props: true, // This passes the route params as props to ArticleView
            meta: {requiresAuth: true},
        },
    ]
})

router.beforeEach((to, from) => {
    const authStore = useAuthStore();
    // instead of having to check every route record with
    // to.matched.some(record => record.meta.requiresAuth)
    if (to.meta.requiresAuth && !authStore.accessToken) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        return {
            path: '/login',
            // save the location we were at to come back later
            query: {redirect: to.fullPath},
        }
    }
})

export default router
