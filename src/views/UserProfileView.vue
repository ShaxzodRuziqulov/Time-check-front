<template>
  <form @submit.prevent="saveChanges()" class="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
    <h2 class="text-2xl font-semibold mb-6">Foydalanuvchi profili</h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Ism</label>
        <input
            v-model="form.firstName"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Ismingizni kiriting"
        />
      </div>
      <div>
        <label class="block text-sm font-medium">Familiya</label>
        <input
            v-model="form.lastName"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Familiyangizni kiriting"
        />
      </div>
      <div>
        <label class="block text-sm font-medium">Sharif</label>
        <input
            v-model="form.middleName"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Sharifingizni kiriting"
        />
      </div>
      <div>
        <label class="block text-sm font-medium">Tug'ilgan sana</label>
        <input
            v-model="form.birthDate"
            type="date"
            class="w-full border rounded px-3 py-2"
            placeholder="Tug'ilgan sana kiriting"
        />
      </div>
    </div>
    <div>
      <router-link to="/change-password" class="text-blue-600 hover:text-blue-300">
        Parolni o'zgartirish
      </router-link>
    </div>

    <div  class="flex justify-end gap-3 mt-6">
      <button
          @click="cancelEdit()"
          class="bg-gray-300 cursor-pointer hover:bg-gray-400 text-black font-medium py-2 px-4 rounded"
      >
        Bekor qilish
      </button>
      <button
          type="submit"
          class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          :disabled="!hasChanges"
          :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': !hasChanges }"
      >
        Yangilash
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, watch, reactive} from 'vue';
import { useRouter } from 'vue-router';
import { useCustomToast } from '@/composables/useCustomToast';
import axiosInstance from '@/axios';
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const { showToast } = useCustomToast();
const authStore = useAuthStore();
const user = computed(() => authStore.state.user);
console.log(user.value);

let form = reactive({
  id: 0,
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: ''
});



let originalData = JSON.parse(JSON.stringify(form));

const hasChanges = computed(() =>
    form.firstName !== originalData.firstName ||
    form.lastName !== originalData.lastName ||
    form.middleName !== originalData.middleName ||
    form.birthDate !== originalData.birthDate
);
console.log(user.value)
console.log(form);
const saveChanges = async () => {
  if (!user.value?.id) return;

  try {

    const trimmedForm = {
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      middleName: form.middleName.trim()
    };
    
    const { data } = await axiosInstance.put(`/api/user/update-profile/${user.value.id}`, trimmedForm);
    authStore.setUser({ ...user.value, ...data });
    originalData = JSON.parse(JSON.stringify(form));
    form = JSON.parse(JSON.stringify(originalData));
    console.log(originalData)
    showToast("Ma'lumotlar yangilandi ✅", 'success');
  } catch (error) {
    console.error('Xatolik:', error);
    showToast("Xatolik yuz berdi", 'error');
  }
};

const cancelEdit = () => {
  if (authStore.state.roles?.includes('ROLE_ADMIN')) {
    router.push('/dashboard');
  } else {
    router.push('/time-track');
  }
}
// Watch for user data to be available
watch(() => user.value, (newUser) => {
  console.log(newUser);
  if (newUser) {
    Object.assign(form, {
      id: newUser.id,
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
      middleName: newUser.middleName || '',
      birthDate: newUser.birthDate || ''
    });
  }
}, { immediate: true });
</script>
