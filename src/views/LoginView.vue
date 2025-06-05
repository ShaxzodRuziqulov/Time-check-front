<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
    <div class="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-blue-700 mb-2">Xush kelibsiz!</h2>
      <p class="text-sm text-center text-gray-600 mb-6">Hisobingizga kiring</p>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label for="username" class="block text-sm font-semibold text-gray-700">Foydalanuvchi nomi</label>
          <input
              id="username"
              type="text"
              v-model="form.username"
              placeholder="Foydalanuvchi nomi"
              required
              class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700">Parol</label>
          <input
              id="password"
              type="password"
              v-model="form.password"
              placeholder="••••••••"
              required
              class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
            type="submit"
            class="w-full py-2 px-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Kirish
        </button>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import type {LoginUser} from "@/models/ProjectModels";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {AuthService} from "@/service/AuthService";
import {useCustomToast} from "@/composables/useCustomToast";
import {useUsersStore} from "@/stores/usersStore";

const { showToast } = useCustomToast();
const usersStore = useUsersStore();
const form = ref<LoginUser>({
  username: '',
  password: '',
});
const router = useRouter();

// LoginView.vue
const handleSubmit = async () => {
  try {
    console.log('Login form data:', form.value);
    const userData = await AuthService.login(form.value);
    console.log('Login response:', userData);

    if (!userData) {
      throw new Error('No user data received');
    }

    console.log('User data:', userData);
    usersStore.setCurrentUser(userData);
    showToast("Tizimga muvaffaqiyatli kirdingiz", "success");

    // Get roles from the JWT token or user data
    let roles: string[] = [];

    // Check if roles is an array
    if (Array.isArray(userData.roles)) {
      roles = userData.roles;
    }
    // Or if it's a string that needs to be split
    else if (typeof userData.roles === 'string') {
      roles = userData.roles.split(",");
    }
    // Or try to get roles from the JWT token
    else if (userData.token) {
      try {
        const payload = JSON.parse(atob(userData.token.split('.')[1]));
        if (payload.roles) {
          roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
        }
      } catch (e) {
        console.error('Error parsing JWT token:', e);
      }
    }

    console.log('User roles:', roles);

    // Redirect based on role
    if (roles.includes('ROLE_ADMIN')) {
      await router.push({ name: 'DashboardView' });
    } else if (roles.includes('ROLE_USER')) {
      await router.push({ name: 'TimeTrackPage' });
    } else {
      console.warn('No valid roles found for user');
      // Redirect to a default route if no valid roles
      await router.push({ name: 'TimeTrackPage' });
    }
  } catch (error) {
    console.error('Login error details:', {
      error: error,
      response: error.response?.data || 'No response data'
    });
    showToast("Login yoki parolda xatolik bor. Iltimos, qaytadan urinib ko'ring.", "error");
  }
};

</script>
