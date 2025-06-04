import { defineStore } from "pinia";
import { reactive } from "vue";
import { IUser } from "@/types/interfaces/IUser";

interface IUsersStoreState {
    users: IUser[];
    currentUser: null | IUser;
}

export const useUsersStore = defineStore('usersStore', () => {
    const state: IUsersStoreState = reactive({
        users: [],
        currentUser: null,
    })
    return {
        state
    }
});
