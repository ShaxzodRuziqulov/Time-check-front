import type {LoginUser} from "../models/ProjectModels.ts";
import axiosInstance from "../axios.ts";

export const AuthService = {
    async login(user: LoginUser) {
        const response = await axiosInstance.post("/auth/login", user);
        return response.data;
    },
}