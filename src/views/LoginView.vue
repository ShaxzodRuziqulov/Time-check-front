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
import {useAuthStore} from "@/stores/authStore";
import {useLocalStorage} from "@/composables/useLocalStorage";

const { showToast } = useCustomToast();
const authStore = useAuthStore();
const form = ref<LoginUser>({
  username: '',
  password: '',
});
const router = useRouter();
const local = useLocalStorage();

// LoginView.vue
const handleSubmit = async () => {
  try{
    const user = await AuthService.login(form.value);
    authStore.setUser(user);
    authStore.state.token = user.token;
    local.removeItem('token')
    local.setItem('token', user.token);
    showToast('Muvaffaqiyatli kirish', 'success');
    router.push('/dashboard');
  }
  catch (error) {
    showToast('Kirishda xatolik yuz berdi', 'error');
    console.error(error);
  }
};

</script>
