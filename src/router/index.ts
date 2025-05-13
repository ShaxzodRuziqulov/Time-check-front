import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomeView.vue";
import MainLayout from "../layouts/Layout.vue";
import LoginView from "../views/LoginView.vue";
import NotFound from "../components/NotFound.vue";
import DepartmentView from "../views/DepartmentView.vue";
import JobView from "../views/JobView.vue";
import UsersView from "../views/UsersView.vue";
import TimeTrackPage from "../views/TimeTrackPage.vue";
import TimeTrackAdmin from "../views/TimeTrackAdmin.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: "Main",
        redirect: '/dashboard',
        component: MainLayout,
        meta: {requiresAuth: true},
        children: [
            {
                path: "/dashboard",
                name: "DashboardView",
                component: HomeView,
                meta: {requiresAuth: true},
            },
            {
                path: "/department",
                name: "DepartmentView",
                component: DepartmentView,
                meta: {requiresAuth: true},
            }, {
                path: "/job",
                name: "JobView",
                component: JobView,
                meta: {requiresAuth: true},
            }, {
                path: "/user",
                name: "UsersView",
                component: UsersView,
                meta: {requiresAuth: true},
            },
            {
                path: "/admin/time-track",
                name: "AdminTimeTrackPage",
                component: TimeTrackAdmin,
                meta: {requiresAuth: true},
            }

        ]
    },
    {
        path: '/time-track',
        name: 'TimeTrackPage',
        component: TimeTrackPage,
        meta: {requiresAuth: true},
    }
    ,
    {
        path: "/login",
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: {requiresAuth: true},
    }

];


const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach((to, _, next) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isLoggedIn = !!token;

    const allowedRoles = to.meta.roles as string[] | undefined;
    if (to.meta.requiresAuth && !isLoggedIn) {
        next("/login");
    } else if (allowedRoles && !allowedRoles.includes(role || "")) {
        next("/dashboard"); // yoki 403 sahifaga
    } else if ((to.path === "/login" || to.path === "/signup") && isLoggedIn) {
        next("/dashboard");
    } else {
        next();
    }
});


export default router
