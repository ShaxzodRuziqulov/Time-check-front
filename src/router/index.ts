import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import {AuthService} from "@/service/AuthService";

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
            {
                path: "/time-track/user/profile",
                name: "UserProfile",
                component: () => import("@/views/UserProfileView.vue"),
                meta: {requiresAuth: true},
            },
            {
                path: '/time-track',
                name: 'TimeTrackPage',
                component: () => import("@/views/TimeTrackPage.vue"),
                meta: {requiresAuth: true},
            },
        ],
    },
    {
        path: "/login",
        name: 'Login',
        component: () => import("@/views/LoginView.vue"),
    },
    {
        path: "/change-password",
        name: 'ChangePassword',
        component: () => import("@/views/ChangeUserPasswordView.vue"),
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


router.beforeEach(async (to, _, next) => {
    const authStore = useAuthStore();
    const token = authStore.state.token;
    const isAuthenticated = !!token;
    const isLoginPage = to.name === 'Login';


    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'Login' });
    }

    if (isAuthenticated && (!authStore.state.roles || authStore.state.roles.length === 0)) {
        try {
            await AuthService.getCurrentUser();
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            return next({ name: 'Login' });
        }
    }

    const roles = authStore.state.roles || [];

    if (isAuthenticated && isLoginPage) {
        if (roles.includes('ROLE_ADMIN')) {
            return next('/dashboard');
        } else if (roles.includes('ROLE_USER')) {
            return next('/time-track');
        }
    }

    if (
        isAuthenticated &&
        to.path.startsWith('/admin') &&
        !roles.includes('ROLE_ADMIN')
    ) {
        return next('/time-track');
    }

    next();
});



export default router
