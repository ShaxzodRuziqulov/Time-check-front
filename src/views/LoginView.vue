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
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Kirish
        </button>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import type {LoginUser} from "../models/ProjectModels.ts";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {AuthService} from "../service/AuthService.ts";

const form = ref<LoginUser>({
  username: '',
  password: '',
});
const router = useRouter();

const handleSubmit = async () => {
  try {
    const response = await AuthService.login(form.value);

    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('role', response.role);

    await router.push({name: 'DashboardView'});
    console.log(response);
  } catch (err) {
    alert('Tizimga kirishda xatolik: Login yoki parolda hatolik bor');
  }
};
</script>