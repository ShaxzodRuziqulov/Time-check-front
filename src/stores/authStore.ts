import {defineStore} from "pinia";
import {computed, ComputedRef, ref} from "vue";
import {IUser} from "@/types/interfaces/IUser";
import {useLocalStorage} from "@/composables/useLocalStorage";

export const useAuthStore = defineStore("auth", () => {
    const locale = useLocalStorage();
    const state = ref({
        user: null as IUser | null,
        token: locale.getItem('token') || null,
        roles: [] as string[],
    })

    console.log('AuthStore initialized, token:', state.value.token)
    console.log('Initial user:', state.value.user)

    const setUser = (user: IUser) => {
        console.log('Setting user in store:', user)
        state.value.user = user
        if (user.roles) {
            state.value.roles = Array.isArray(user.roles)
                ? user.roles.map(role => role.name || role)
                : [user.roles]
            console.log('Roles set:', state.value.roles)
        }
    }
    const clearUser = () => {
        state.value.user = null
        state.value.token = null
        locale.removeItem('token')
    }

    return {
        state,
        setUser,
        clearUser,
    }
})
