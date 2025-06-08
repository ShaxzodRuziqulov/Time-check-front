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
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router"; // Add this import

const authStore = useAuthStore();
const router = useRouter(); // Initialize the router

onMounted(async () => {
  console.log('Layout mounted, fetching user...');
  try {
    const user = await AuthService.getCurrentUser();
    if (user) {
      authStore.setUser(user);
    } else {
      // If no user but there's a token, clear it as it's invalid
      if (authStore.state.token) {
        authStore.clearUser();
      }
      router.push('/login');
    }
  } catch (error) {
    console.error('Error in Layout mounted:', error);
    if (authStore.state.token) {
      authStore.clearUser();
    }
    router.push('/login');
  }
});
</script>