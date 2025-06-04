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

// Role-based access control configuration
const roleBasedRoutes = {
    'ROLE_ADMIN': '/dashboard',
    'ROLE_USER': '/time-track'
};

router.beforeEach((to, _, next) => {
    const token = localStorage.getItem("token");
    const roles: string[] = localStorage.getItem("roles")?.split(",").filter(Boolean) || [];
    const isAuthenticated = !!token;
    const isLoginPage = to.name === 'Login';

    // If route requires auth and user is not authenticated, redirect to login
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'Login' });
    }

    // If user is authenticated and tries to access login page, redirect based on role
    if (isAuthenticated && isLoginPage) {
        // Check for admin first, then user
        if (roles.includes('ROLE_ADMIN')) {
            return next(roleBasedRoutes['ROLE_ADMIN']);
        }
        if (roles.includes('ROLE_USER')) {
            return next(roleBasedRoutes['ROLE_USER']);
        }
    }

    // If user is authenticated but tries to access admin routes without admin role
    if (isAuthenticated && to.path.startsWith('/admin/') && !roles.includes('ROLE_ADMIN')) {
        return next(roles.includes('ROLE_USER') ? roleBasedRoutes['ROLE_USER'] : '/');
    }

    // If user is a regular user, restrict access to non-allowed routes
    if (isAuthenticated && roles.includes('ROLE_USER') && !roles.includes('ROLE_ADMIN')) {
        const allowedPaths = ['/time-track', '/time-track/user/profile'];
        if (!allowedPaths.some(path => to.path.startsWith(path))) {
            return next(roleBasedRoutes['ROLE_USER']);
        }
    }

    return next();
});


export default router
