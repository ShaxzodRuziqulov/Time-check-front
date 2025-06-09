<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="max-w-7xl w-full mx-auto">
      <div class="bg-white ml-auto px-4 py-2 rounded-xl gap-4 flex items-center justify-end">
        <DropDown @logout="logout" @profile="profile" :userName="userName"/>
      </div>
    </div>

    <div class="p-8 w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl">

      <h2 class="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Ish vaqtini boshqarish</h2>

      <form @submit.prevent="startWork">
        <div class="flex flex-col space-y-4 items-center w-full">

          <div class="flex space-x-4">
            <button
                type="submit"
                :disabled="isDisabled"
                class="bg-green-600 hover:bg-green-700 disabled:hover:bg-green-600 cursor-pointer transition-colors duration-300 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? "Yuklanmoqda..." : "Boshlash" }}
            </button>
            <button
                type="button"
                :disabled="!isDisabled || !!filteredTimeTracks[0]?.endTime"
                @click="completeWork"
                class="bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500 cursor-pointer transition-colors duration-300 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Yakunlash
            </button>
          </div>

        </div>
      </form>
      <div v-if="timeTracks.length" class="mt-6 overflow-x-auto">
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Ishni boshlaganlar ro'yxati</h3>
        <table class="w-full table-fixed text-sm bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead class="bg-gray-100 w-full text-gray-700 font-medium text-xs uppercase">
          <tr class="w-full">
            <th class="px-4 py-3 text-left w-5">#</th>
            <th class="px-4 py-3 text-left w-[300px] max-w-[300px]">Kechikish sababi</th>
            <th class="px-4 py-3 text-left">Tugatish sababi</th>
            <th class="px-4 py-3 text-left">F.I.O</th>
            <th class="px-4 py-3 text-left">Boshlagan vaqt</th>
            <th class="px-4 py-3 text-left">Tugatgan vaqt</th>
            <th class="px-4 py-3 text-left">Qachon</th>
          </tr>
          </thead>
          <tbody class="w-full">
          <tr v-for="(track,index) in filteredTimeTracks" :key="track.id" class="hover:bg-gray-50 w-full border-t">
            <td class="px-4 py-3 w-5">{{ index + 1 }}</td>
            <td class="px-4 py-3 w-[300px] max-w-[300px] whitespace-normal">{{ track.delayReason }}</td>
            <td class="px-4 py-3">{{ track.endReason }}</td>
            <td class="px-4 py-3">{{ fullName(track) }}</td>
            <td class="px-4 py-3">{{ formatTimeOnly(track.startTime) }}</td>
            <td class="px-4 py-3">{{ formatTimeOnly(track.endTime) }}</td>
            <td class="px-4 py-3">{{ track.date }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ApiService } from "@/service/ApiService";
import type { TimeTrackUser } from "@/models/ProjectModels";
import router from "../router";
import DropDown from "@/components/DropDown.vue";
import { useAuthStore } from "@/stores/authStore";
import {useCustomToast} from "@/composables/useCustomToast";

const timeTracks = ref<TimeTrackUser[]>([]);
const isLoading = ref(false);
const userName = ref("Foydalanuvchi");
const authStore = useAuthStore();
const {showToast} = useCustomToast();

const userId = computed(() => authStore.state.user?.id);

const fullName = (track: TimeTrackUser) =>
    `${track.firstName} ${track.lastName} ${track.middleName}`.trim();

const startWork = async () => {
  if (isLoading.value || !userId.value) return;

  isLoading.value = true;
  try {
    await ApiService.createTimeTrack({ userId: userId.value });
    showToast("Ish boshlandi!", "success");
    await loadTimeTrack();
  } catch (error: any) {
    showToast("Xatolik yuz berdi", "error");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const completeWork = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    await ApiService.completeTimeTrack();
    showToast("Ish vaqti yakunlandi!", "success");
    await loadTimeTrack();
  } catch (error: any) {
    showToast("Xatolik yuz berdi", "error");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const loadTimeTrack = async () => {
  try {
    const response = await ApiService.getAllWithUserDetails();
    timeTracks.value = response.data;
  } catch (error) {
    console.error("Ish vaqtini yuklashda xatolik:", error);
  }
};

const filteredTimeTracks = computed(() => {
  if (!userId.value) return [];
  const today = new Date().toISOString().split('T')[0];
  return timeTracks.value
      .filter(track => track.userId === userId.value && track.date === today)
      .sort((a, b) => b.id - a.id)
      .slice(0, 1);
});

const profile = () => {
  router.push('/time-track/user/profile');
};

const logout = () => {
  authStore.clearUser();
  router.push("/login");
};

const today = new Date().toISOString().split('T')[0];

const isDisabled = computed(() => {
  return filteredTimeTracks.value[0]?.date === today &&
      !!filteredTimeTracks.value[0]?.startTime;
});

function formatTimeOnly(time?: string): string {
  return time ? time.split(':').slice(0, 2).join(':') : "";
}

onMounted(() => {
  const user = authStore.state.user;
  if (user) {
    userName.value = `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Foydalanuvchi";
  }
  loadTimeTrack();
});
</script>
