import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: "Main",
        redirect: '/dashboard',
        component: () => import("@/layouts/Layout.vue"),
        meta: {requiresAuth: true},
        children: [
            {
                path: "/dashboard",
                name: "DashboardView",
                component: () => import("@/views/HomeView.vue"),
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: "/department",
                name: "DepartmentView",
                component: () => import("@/views/DepartmentView.vue"),
                meta: {
                    requiresAuth: true,
                },
            }, {
                path: "/job",
                name: "JobView",
                component: () => import("@/views/JobView.vue"),
                meta: {requiresAuth: true},
            }, {
                path: "/user",
                name: "UsersView",
                component: () => import("@/views/UsersView.vue"),
                meta: {requiresAuth: true},
            },
            {
                path: "/admin/time-track",
                name: "AdminTimeTrackPage",
                component: () => import("@/views/TimeTrackAdmin.vue"),
                meta: {requiresAuth: true},
            },
        ]
    }, {
        path: '/time-track',
        name: 'TimeTrackPage',
        component: () => import("@/views/TimeTrackPage.vue"),
        meta: {requiresAuth: true},
    },
    {
        path: "/login",
        name: 'Login',
        component: () => import("@/views/LoginView.vue"),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import("@/components/NotFound.vue"),
        meta: {requiresAuth: true}
    }

];


const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, _, next) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token && to.meta.requiresAuth) {
        return next({name: 'Login'});
    }
    if (token && to.name === 'Login') {
        if (role === 'ROLE_ADMIN') return next({path: '/dashboard'});
        if (role === 'ROLE_USER') return next({path: '/time-track'});
    }

    if (token && role === 'ROLE_USER') {
        if (to.path !== '/time-track') {
            return next({path: '/time-track'});
        }
    }

    return next();
});


export default router
