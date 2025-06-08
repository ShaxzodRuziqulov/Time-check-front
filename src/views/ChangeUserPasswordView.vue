<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
    <div class="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-blue-700 mb-2">
        Foydalanuvchi parolini o'zgartirish
      </h2>
      <form @submit.prevent="submitChange" class="space-y-5">
        <div>
          <label for="oldPassword" class="block text-sm text-gray-700">Eski parol</label>
          <input
              v-model="oldPassword"
              type="password"
              placeholder="Eski parolni kiriting"
              class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="newPassword" class="block text-sm text-gray-700">Yangi parol</label>
          <input
              v-model="newPassword"
              type="password"
              placeholder="Yangi parolni kiriting"
              class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

          />
        </div>

        <div class="flex gap-2">
          <button
              type="button"
              @click="cancelChange"
              class="w-full py-2 px-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Cancel
          </button>

          <button
              type="submit"
              class="w-full py-2 px-4 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios.js'


import {useCustomToast} from "@/composables/useCustomToast";
import {useAuthStore} from "@/stores/authStore";

const router = useRouter()
const authStore = useAuthStore();
const {showToast} = useCustomToast();

const oldPassword = ref('')
const newPassword = ref('')

const user = computed(() => authStore.state.user);
console.log(user.value)
const cancelChange = () => {
  router.push('/dashboard')
}
const submitChange = async () => {
  if (!oldPassword.value || !newPassword.value) {
    showToast('Iltimos, barcha maydonlarni to\'ldiring', "error");
    return;
  }

  try {
    console.log('Sending request with:', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      token: authStore.state.token ? 'Token exists' : 'No token'
    });

    const response = await axios.put(
        `/api/user/update-password/${user.value?.id}`,
        {
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
        },
        {
          headers: {
            'Authorization': `Bearer ${authStore.state.token}`,
            'Content-Type': 'application/json'
          }
        }
    );

    console.log('Response:', response.data);

    if (response.data) {
      showToast('Parol muvaffaqiyatli o\'zgartirildi', 'success');
      router.push('/time-track/user/profile');
    }
  } catch (error: any) {
    console.error('Full error object:', error);
    console.error('Error response:', error.response?.data);

    const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Parolni o\'zgartirishda xatolik yuz berdi';

    showToast(errorMessage, 'error');
  }
}
</script>


<style>
</style>