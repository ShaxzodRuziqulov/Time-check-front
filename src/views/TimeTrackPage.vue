<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="p-10 w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {ApiService} from "../service/ApiService.ts";


const userId = Number(localStorage.getItem("userId"));

const delayReason = ref("");
const isLate = ref(false);
const isLoading = ref(false);

const startWork = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const response = await ApiService.createTimeTrack({
      userId: Number(localStorage.getItem("userId")),
      delayReason: isLate.value ? delayReason.value : undefined,
    });

    alert("Ish boshlandi!");
    console.log("Yuborildi:", response);
    delayReason.value = "";
    isLate.value = false;
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
    console.log("Yakunlandi:", response);
  } catch (error: any) {
    alert(error?.response?.data?.message || "Xatolik yuz berdi");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>
