<template>
  <router-view/>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { AuthService } from "@/service/AuthService";

const authStore = useAuthStore();
const router = useRouter();

const clearUser = async () => {
  if (authStore.state.token) {
    authStore.clearUser();
  }
  await router.push('/login');
}
const init = async ()=>{
  try {
    const user = await AuthService.getCurrentUser();
    if (user) {
      authStore.setUser(user);
    } else {
      await clearUser();
    }
  } catch (error) {
    console.error('Error in Layout mounted:', error);
    await clearUser();
  }
}

init();
</script>