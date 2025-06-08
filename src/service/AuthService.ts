import type { LoginUser } from "@/models/ProjectModels";
import axiosInstance from "@/axios";
import { useAuthStore } from "@/stores/authStore";

export const AuthService = {
    async login(user: LoginUser) {
        const response = await axiosInstance.post("/auth/login", user);
        return response.data;
    },

    async getCurrentUser() {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const response = await axiosInstance.get("/auth/me");
            const user = response.data;

            const authStore = useAuthStore();
            authStore.setUser(user);

            return user;
        } catch (error) {
            console.error("Ошибка при получении текущего пользователя:", error);
            return null;
        }
    }
};
