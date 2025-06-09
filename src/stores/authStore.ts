import { defineStore } from "pinia";
import { ref } from "vue";
import { IUser } from "@/types/interfaces/IUser";
import { useLocalStorage } from "@/composables/useLocalStorage";

export const useAuthStore = defineStore("auth", () => {
    const locale = useLocalStorage();
    const state = ref({
        user: null as IUser | null,
        token: locale.getItem('token') || null,
        roles: [] as string[],
    });

    const setUser = (user: IUser) => {
        state.value.user = user;
        if (user.roles) {
            state.value.roles = Array.isArray(user.roles)
                ? user.roles.map(role => typeof role === 'string' ? role : role.name)
                : [user.roles];
        } else {
            state.value.roles = [];
        }
    };

    const setToken = (token: string) => {
        state.value.token = token;
        locale.setItem('token', token);
    };

    const clearUser = () => {
        state.value.user = null;
        state.value.token = null;
        state.value.roles = [];
        locale.removeItem('token');
    };

    return {
        state,
        setUser,
        clearUser,
        setToken,
    };
});