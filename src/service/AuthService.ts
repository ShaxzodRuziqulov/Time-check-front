import type { LoginUser } from "@/models/ProjectModels";
import axiosInstance from "@/axios";
import { useAuthStore } from "@/stores/authStore";

export const AuthService = {
    async login(user: LoginUser) {
        const response = await axiosInstance.post("/auth/login", user);
        const data = response.data;


        useAuthStore().setToken(data.token);
        return data;
    },


    async getCurrentUser() {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const response = await axiosInstance.get("/auth/me");
            useAuthStore().setUser(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching current user:", error);
            localStorage.removeItem("token");
            return null;
        }
    }
};
