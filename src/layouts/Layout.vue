<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div class="w-full h-full bg-[#322d2d] text-white">
      <Header />
    </div>
    <div class="flex w-full pt-16">
      <div class="w-full h-full">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import { onMounted } from "vue";
import { AuthService } from "@/service/AuthService";
import {useAuthStore} from "@/stores/authStore";

onMounted(async () => {
  console.log('Layout mounted, fetching user...')
  try {
    const user = await AuthService.getCurrentUser();
    console.log('User from AuthService:', user)
    console.log('Store after auth:', useAuthStore().state)
  } catch (error) {
    console.error('Error in Layout mounted:', error)
  }
})
</script>

