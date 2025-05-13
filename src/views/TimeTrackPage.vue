<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="p-10 w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl">
      <h2 class="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Ish vaqtini boshqarish</h2>

      <form @submit.prevent="startWork">
        <div class="flex flex-col space-y-4 items-center w-full">

          <div class="flex space-x-4">
            <button
                type="submit"
                :disabled="isLoading"
                class="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? "Yuklanmoqda..." : "Boshlash" }}
            </button>

            <button
                type="button"
                :disabled="isLoading"
                @click="completeWork"
                class="bg-red-500 hover:bg-red-600 transition-colors duration-300 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Yakunlash
            </button>
          </div>

        </div>
      </form>

      <div v-if="timeTracks.length" class="mt-6 overflow-x-auto">
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Ishni boshlaganlar ro'yxati</h3>
        <table class="w-full text-sm bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead class="bg-gray-100 text-gray-700 font-medium text-xs uppercase">
          <tr>
            <th class="px-4 py-3 text-left">#</th>
            <th class="px-4 py-3 text-left">Kechikish sababi</th>
            <th class="px-4 py-3 text-left">Tugatish sababi</th>
            <th class="px-4 py-3 text-left">Ism</th>
            <th class="px-4 py-3 text-left">Familiya</th>
            <th class="px-4 py-3 text-left">Ota ismi</th>
            <th class="px-4 py-3 text-left">Boshlagan vaqt</th>
            <th class="px-4 py-3 text-left">Tugatgan vaqt</th>
            <th class="px-4 py-3 text-left">Qachon</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(track,index) in filteredTimeTracks" :key="track.id" class="hover:bg-gray-50 border-t">
            <td class="px-4 py-3">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ track.delayReason }}</td>
            <td class="px-4 py-3">{{ track.endReason }}</td>
            <td class="px-4 py-3">{{ getUserName(track.userId) }}</td>
            <td class="px-4 py-3">{{ getLastName(track.userId) }}</td>
            <td class="px-4 py-3">{{ getMiddleName(track.userId) }}</td>
            <td class="px-4 py-3">{{ track.startTime }}</td>
            <td class="px-4 py-3">{{ track.endTime }}</td>
            <td class="px-4 py-3">{{ track.createdAt }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {ApiService} from "../service/ApiService.ts";
import type {TimeTrack, User} from "../models/ProjectModels.ts";

const timeTracks = ref<TimeTrack[]>([])
const userId = Number(localStorage.getItem("userId"));
const users = ref<User[]>([])
const isLoading = ref(false);

const startWork = async () => {
  if (isLoading.value) return;

  const rawUserId = localStorage.getItem("userId");
  const userId = rawUserId ? Number(rawUserId) : null;

  if (!userId) {
    alert("Foydalanuvchi aniqlanmadi. Iltimos, qayta tizimga kiring.");
    return;
  }

  isLoading.value = true;

  try {
    const response = await ApiService.createTimeTrack({userId});

    alert("Ish boshlandi!");
    console.log("Yuborildi:", response);
    await loadTimeTrack()
  } catch (error: any) {
    alert(error?.response?.data?.message || "Xatolik yuz berdi");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const completeWork = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const response = await ApiService.completeTimeTrack(userId);
    alert("Ish vaqti yakunlandi!");
    await loadTimeTrack()
    console.log("Yakunlandi:", response);
  } catch (error: any) {
    alert(error?.response?.data?.message || "Xatolik yuz berdi");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const getUserName = (id: number) => {
  const user = users.value.find(user => user.id === id)
  return user ? user.firstName : "Nomalum"
}

const getLastName = (id: number) => {
  const user = users.value.find(user => user.id === id)
  return user ? user.lastName : "Nomalum"
}

const getMiddleName = (id: number) => {
  const user = users.value.find(user => user.id === id)
  return user ? user.middleName : "Nomalum"
}

const loadUser = async () => {
  try {
    const response = await ApiService.getAllUsers();
    users.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

const loadTimeTrack = async () => {
  try {
    const response = await ApiService.findAllTimeTracks();
    timeTracks.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

const filteredTimeTracks = computed(() => {
  return timeTracks.value.filter(track => track.userId === userId);
});

onMounted(() => {
  loadUser();
  loadTimeTrack()
})

</script>
