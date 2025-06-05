import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import { useUsersStore } from "@/stores/usersStore";

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
    const usersStore = useUsersStore();
    const isAuthenticated = usersStore.isAuthenticated;
    const isLoginPage = to.name === 'Login';

    // Если пользователь не аутентифицирован и пытается получить доступ к защищенному маршруту
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'Login' });
    }

    if (isAuthenticated && isLoginPage) {
        const user = usersStore.getCurrentUser;

        // Handle both string and string[] cases
        let roles: string[] = [];

        if (user?.roles) {
            roles = Array.isArray(user.roles)
                ? user.roles
                : user.roles.split(',').map(role => role.trim());
        }

        if (roles.includes('ROLE_ADMIN')) {
            return next('/dashboard');
        } else if (roles.includes('ROLE_USER')) {
            return next('/time-track');
        }
    }

    if (isAuthenticated && to.path.startsWith('/admin') && !usersStore.getCurrentUser?.roles?.includes('ROLE_ADMIN')) {
        return next('/');
    }

    next();
});


export default router
