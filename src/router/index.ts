import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomeView.vue";
import MainLayout from "../layouts/Layout.vue";
import LoginView from "../views/LoginView.vue";
import NotFound from "../components/NotFound.vue";
import DepartmentView from "../views/DepartmentView.vue";
import EmployeeView from "../views/EmployeeView.vue";

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
                meta: {requiresAuth: true}
            },
            {
                path: "/department",
                name: "DepartmentView",
                component: DepartmentView,
                meta: {requiresAuth: true}
            },{
                path: "/employee",
                name: "EmployeeView",
                component: EmployeeView,
                meta: {requiresAuth: true}
            }

        ]
    },
    {
        path: "/login",
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach((to, _, next) => {
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    if (to.meta.requiresAuth && !isLoggedIn) {
        next("/login");
    } else if ((to.path === "/login" || to.path === "/signup") && isLoggedIn) {
        next("/dashboard");
    } else {
        next();
    }
});

export default router
