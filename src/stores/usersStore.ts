// usersStore.ts
import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { IUser } from "@/types/interfaces/IUser";
import { ApiService } from "@/service/ApiService";
import axiosInstance from "@/axios";

export const useUsersStore = defineStore('usersStore', () => {
    const state = reactive({
        users: [] as IUser[],
        currentUser: {} as IUser,
        isLoading: false
    });

    const getUsersWithDetails = async () => {
        try {
            state.isLoading = true;
            const response = await ApiService.getAllWithUserDetails();
            state.users = Array.isArray(response?.data) ? response.data : [];
            return state.users;
        } catch (error) {
            console.error('Xatolik yuz berdi:', error);
            state.users = [];
            throw error;
        } finally {
            state.isLoading = false;
        }
    };

    const setCurrentUser = (userData: IUser) => {
        if (!userData) {
            console.error('No user data provided to setCurrentUser');
            return;
        }

        state.currentUser = {
            ...userData,
            token: userData.token
        };

        if (userData.token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
    };

    const clearCurrentUser = () => {
        state.currentUser = {} as IUser;
        delete axiosInstance.defaults.headers.common['Authorization'];
    };

    const getCurrentUser = computed(() => state.currentUser);
    const getToken = computed(() => state.currentUser?.token || '');
    const isAuthenticated = computed(() => !!state.currentUser?.token);

    const loadCurrentUser = async () => {
        try {
            const response = await ApiService.getAllUsers();
            const users = response.data;
            if (state.currentUser?.userId) {
                const currentUserData = users.find((user: IUser) =>
                    user.userId === state.currentUser.userId
                );
                if (currentUserData) {
                    state.currentUser = {
                        ...currentUserData,
                        token: state.currentUser.token
                    };
                }
            }
            return state.currentUser;
        } catch (error) {
            console.error('Xatolik yuz berdi:', error);
            throw error;
        }
    };

    return {
        state,
        getUsersWithDetails,
        setCurrentUser,
        clearCurrentUser,
        getCurrentUser,
        getToken,
        isAuthenticated,
        loadCurrentUser
    };
});