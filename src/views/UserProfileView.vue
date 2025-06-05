<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
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

    <div  class="flex justify-end gap-3 mt-6">
      <button
          @click="cancelEdit"
          class="bg-gray-300 cursor-pointer hover:bg-gray-400 text-black font-medium py-2 px-4 rounded"
      >
        Bekor qilish
      </button>
      <button
          @click="saveChanges"
          class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          :disabled="!hasChanges"
          :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': !hasChanges }"
      >
        Yangilash
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomToast } from '@/composables/useCustomToast';
import axiosInstance from '@/axios';
import { useUsersStore } from "@/stores/usersStore";

const router = useRouter();
const { showToast } = useCustomToast();
const usersStore = useUsersStore();

interface IFormData {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
}

const form = reactive<IFormData>({
  id: 0,
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: ''
});

const originalData = ref<IFormData>({ ...form });
const isLoading = ref(true);
const userId = computed(() => Number(usersStore.state.currentUser.userId));

// Watch for userId changes
watch(userId, (newVal) => {
  if (newVal) {
    loadUserData();
  }
}, { immediate: true });

// Watch for users array changes
watch(() => usersStore.state.users, (users) => {
  if (users?.length > 0 && userId.value) {
    updateFormFromStore();
  }
});

function updateFormFromStore() {
  const user = usersStore.state.users.find(u => u.userId === userId.value);
  if (user) {
    Object.assign(form, {
      id: user.id || 0,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      middleName: user.middleName || '',
      birthDate: user.birthDate || ''
    });
    Object.assign(originalData.value, form);
  }
}

async function loadUserData() {
  if (!userId.value) {
    showToast('Foydalanuvchi ID si topilmadi', 'error');
    isLoading.value = false;
    return;
  }

  try {
    // First try to get from store
    if (usersStore.state.users.length === 0) {
      await usersStore.getUsersWithDetails();
    } else {
      updateFormFromStore();
    }

    // If still no user data, try direct API call
    if (!form.id && userId.value) {
      const response = await axiosInstance.get(`/api/user/${userId.value}`);
      if (response.data) {
        usersStore.state.users.push(response.data);
        updateFormFromStore();
      }
    }

    if (!form.id) {
      showToast('Foydalanuvchi ma\'lumotlari topilmadi', 'error');
    }
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
    showToast("Ma'lumotlarni yuklashda xatolik yuz berdi", 'error');
  } finally {
    isLoading.value = false;
  }
}

async function saveChanges() {
  if (!form.id) return;

  try {
    const response = await axiosInstance.put(`/api/user/update-profile/${form.id}`, form);
    if (response.data) {
      showToast("Ma'lumotlar yangilandi ✅", 'success');
      // Update user in store
      const userIndex = usersStore.state.users.findIndex(u => u.userId === userId.value);
      if (userIndex !== -1) {
        usersStore.state.users[userIndex] = {
          ...usersStore.state.users[userIndex],
          ...form
        };
      }
      Object.assign(originalData.value, form);
    }
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
    showToast("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.", 'error');
  }
}
const hasChanges = computed(() => {
  return Object.keys(form).some(key =>
      form[key as keyof IFormData] !== originalData.value[key as keyof IFormData]
  );
});
function cancelEdit() {
  router.go(-1);
}
</script>
