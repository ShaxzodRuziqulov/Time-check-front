import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IUser } from '@/types/interfaces/IUser';
import { ApiService } from '@/service/ApiService';
import axiosInstance from '@/axios';

export const useUsersStore = defineStore('usersStore', () => {
    const users = ref<IUser[]>([]);
    const currentUser = ref<IUser | null>(null);
    const isLoading = ref(false);

    const getUsersWithDetails = async () => {
        try {
            isLoading.value = true;
            const response = await ApiService.getAllWithUserDetails();
            users.value = Array.isArray(response?.data) ? response.data : [];
            return users.value;
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
            users.value = [];
            throw error;
        } finally {
            isLoading.value = false;
        }
    };

    const setCurrentUser = (userData: IUser) => {
        if (!userData) {
            console.error('Пустой объект userData в setCurrentUser');
            return;
        }

        currentUser.value = { ...userData };

        if (userData.token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
    };

    const clearCurrentUser = () => {
        currentUser.value = null;
        delete axiosInstance.defaults.headers.common['Authorization'];
    };

    const getCurrentUser = computed(() => currentUser.value);
    const getToken = computed(() => currentUser.value?.token || '');
    const isAuthenticated = computed(() => !!currentUser.value?.token);

    const loadCurrentUser = async () => {
        try {
            const response = await ApiService.getAllWithUserDetails();
            const usersData = response.data;

            if (currentUser.value?.userId) {
                const updatedUser = usersData.find(
                    (user: IUser) => user.userId === currentUser.value!.userId
                );

                if (updatedUser) {
                    currentUser.value = {
                        ...updatedUser,
                        token: currentUser.value.token // сохраняем токен
                    };
                }
            }

            return currentUser.value;
        } catch (error) {
            console.error('Ошибка при обновлении текущего пользователя:', error);
            throw error;
        }
    };

    return {
        users,
        currentUser,
        isLoading,
        getUsersWithDetails,
        setCurrentUser,
        clearCurrentUser,
        getCurrentUser,
        getToken,
        isAuthenticated,
        loadCurrentUser
    };
});
