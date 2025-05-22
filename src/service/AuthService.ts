import type {LoginUser} from "@/models/ProjectModels";
import axiosInstance from "@/axios";

export const AuthService = {


    async login(user: LoginUser) {
        const response = await axiosInstance.post("/auth/login", user);
        return response.data;
    },


}
