import axios from "axios";
import router from "@/router";

const axiosInstance = axios.create({
    // baseURL: 'http://192.168.100.68:8022',
    baseURL: 'http://localhost:8080',
    headers: {
        "Content-Type": "application/json"
    }
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
            localStorage.removeItem("user");

            router.push({name: "Login"}).then(r => r);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
